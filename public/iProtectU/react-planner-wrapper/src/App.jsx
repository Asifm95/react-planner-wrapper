import React, { useState, useEffect } from 'react';
import './App.css';
import MyCatalog from './catalog/mycatalog';
import ContainerDimensions from 'react-container-dimensions';
import { csrf_name, csrf_value } from './utils/csrf-credential';
import { Map } from 'immutable';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { generatePlan } from './utils/generate-plan';
import { hot } from 'react-hot-loader/root';
import ReactTooltip from 'react-tooltip';
import {
  Models as PlannerModels,
  reducer as PlannerReducer,
  ReactPlannerActions as action,
  ReactPlanner,
  Plugins as PlannerPlugins,
} from 'react-planner';

const { projectActions, viewer3DActions } = action;
const floorPlan = {
  plan: '',
  '2Dpicture': '',
  '3Dpicture': '',
};
//define state
let AppState = Map({
  'react-planner': new PlannerModels.State(),
});

//define reducer
let reducer = (state, action) => {
  state = state || AppState;
  state = state.update('react-planner', (plannerState) =>
    PlannerReducer(plannerState, action)
  );
  return state;
};

let store = createStore(
  reducer,
  null,
  window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : (f) => f
);

let plugins = [
  PlannerPlugins.Keyboard(),
  // PlannerPlugins.Autosave('react-planner_v0'),
  PlannerPlugins.ConsoleDebugger(),
];

const setFloorPlan = async (planData, params) => {
  let data = {
    csrf_name,
    csrf_value,
    guid: params.guid,
    floor: params.floor || 'ground',
    section: params.section || 0,
    plan: planData.plan,
    '2Dpicture': planData['2Dpicture'],
    '3Dpicture': planData['3Dpicture'],
  };

  const origin = window.location.origin.replace(/:[\d]+/, '');
  console.log('final data:::', data, origin);
  const req = await fetch(`${origin}/asbestos/floorplan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  req
    .json()
    .then((result) => {
      window.alert('Floor plan exported sucessfully');
      console.log(result);
    })
    .catch((error) => console.log('error', error));
};

const getFloorPlan = () => {};

function App() {
  const [modState, setModState] = useState('SAVE');
  const [disableBtn, setDisableBtn] = useState(false);
  const { report, ...params } = window.asbestosReport;
  const saveHandler = async () => {
    const state = store.getState('react-planner').toJS();
    const {
      mode,
      scene,
      sceneHistory: { list },
    } = state['react-planner'];

    switch (modState) {
      case 'SAVE':
        if (list && list.length) {
          store.dispatch(projectActions.setMode('MODE_IDLE'));
          floorPlan.plan = scene;
          setModState('NEXT');
        } else {
          window.alert('No Floor plan found');
        }
        break;

      case 'NEXT':
        const plan2D = await generatePlan(mode);
        floorPlan['2Dpicture'] = plan2D;
        setDisableBtn(true);
        store.dispatch(viewer3DActions.selectTool3DView());
        setTimeout(() => {
          setDisableBtn(false);
        }, 600);
        setModState('DONE');
        break;

      case 'DONE':
        const plan3D = await generatePlan(mode);
        floorPlan['3Dpicture'] = plan3D;
        setFloorPlan(floorPlan, params);
        store.dispatch(projectActions.setMode('MODE_IDLE'));
        setModState('SAVE');
        break;

      default:
        setModState('SAVE');
        break;
    }
  };

  const resetHandler = () => {
    floorPlan.plan = '';
    floorPlan['2Dpicture'] = '';
    floorPlan['3Dpicture'] = '';
    store.dispatch(projectActions.setMode('MODE_IDLE'));
    setModState('SAVE');
    // store.dispatch(projectActions.newProject());
  };

  const setToolTipText = () => {
    if (modState === 'SAVE') return 'Export the floorplan with 2D & 3D view';
    if (modState === 'NEXT') return 'Adjust the 2D view for export';
    if (modState === 'DONE')
      return 'Adjust the 3D view & click DONE to complete the export';
  };

  const handleUserKeyPress = (event) => {
    const { key, keyCode } = event;
    if (key === 'ESCAPE' || keyCode === 27) resetHandler();
  };

  useEffect(() => {
    const { report, floor, section } = window.asbestosReport;
    if (report && typeof report === 'object') {
      const scene = report?.model.floors[floor][+section];
      store.dispatch(projectActions.loadProject(scene.plan));
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keyup', handleUserKeyPress);
    return () => {
      window.removeEventListener('keyup', handleUserKeyPress);
    };
  }, [handleUserKeyPress]);

  return (
    <Provider store={store}>
      <ContainerDimensions>
        {({ width, height }) => {
          return (
            <>
              <ReactPlanner
                catalog={MyCatalog}
                width={width ?? window.innerWidth}
                height={height !== 0 ? height : window.innerHeight}
                plugins={plugins}
                stateExtractor={(state) => state.get('react-planner')}
              />
              <div className="action-btn">
                {modState !== 'SAVE' && (
                  <button onClick={resetHandler}>CANCEL</button>
                )}
                <button
                  data-for="buttonTip"
                  onClick={saveHandler}
                  data-tip
                  disabled={disableBtn}
                >
                  {modState}
                </button>
                <ReactTooltip
                  id="buttonTip"
                  place="top"
                  getContent={setToolTipText}
                />
              </div>
            </>
          );
        }}
      </ContainerDimensions>
    </Provider>
  );
}

export default hot(App);

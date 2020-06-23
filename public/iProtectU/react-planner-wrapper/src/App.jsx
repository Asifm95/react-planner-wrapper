import React, { useState } from 'react';
import './App.css';
import MyCatalog from './catalog/mycatalog';
import ContainerDimensions from 'react-container-dimensions';
import { Map } from 'immutable';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { FormSubmitButton } from './style/submit-button';
import { generatePlan } from './utils/generate-plan';
import { hot } from 'react-hot-loader/root';

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

function App() {
  const [modState, setModState] = useState('EXPORT');

  const saveHandler = async () => {
    const state = store.getState('react-planner').toJS();
    const {
      mode,
      sceneHistory: { list },
    } = state['react-planner'];

    switch (modState) {
      case 'EXPORT':
        if (list && list.length) {
          store.dispatch(projectActions.setMode('MODE_IDLE'));
          const planData = JSON.parse(localStorage.getItem('react-planner_v0'));
          floorPlan.plan = planData;
          setModState('NEXT');
        } else {
          window.alert('No Floor plan found');
        }
        break;

      case 'NEXT':
        const plan2D = await generatePlan(mode);
        floorPlan['2Dpicture'] = plan2D;
        store.dispatch(viewer3DActions.selectTool3DView());
        setModState('DONE');
        break;

      case 'DONE':
        const plan3D = await generatePlan(mode);
        floorPlan['3Dpicture'] = plan3D;
        console.log('final data:::', floorPlan);
        store.dispatch(projectActions.setMode('MODE_IDLE'));
        setModState('EXPORT');
        break;

      default:
        setModState('EXPORT');
        break;
    }
  };

  const resetHandler = () => {
    floorPlan.plan = '';
    floorPlan['2Dpicture'] = '';
    floorPlan['3Dpicture'] = '';
    store.dispatch(projectActions.setMode('MODE_IDLE'));
    setModState('EXPORT');
    // store.dispatch(projectActions.newProject());
  };

  return (
    <Provider store={store}>
      <ContainerDimensions>
        {({ width, height }) => {
          console.log(width, height, window.innerHeight);
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
                {modState !== 'EXPORT' && (
                  <button onClick={resetHandler}>CANCEL</button>
                )}
                <button onClick={saveHandler}>{modState}</button>
              </div>
            </>
          );
        }}
      </ContainerDimensions>
    </Provider>
  );
}

export default hot(App);

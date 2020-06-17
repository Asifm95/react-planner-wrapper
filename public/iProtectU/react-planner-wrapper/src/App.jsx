import React from 'react';
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

const { projectActions } = action;
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
  const saveHandler = async () => {
    const state = store.getState('react-planner').toJS();
    const { mode, scene } = state['react-planner'];
    const planData = JSON.parse(localStorage.getItem('react-planner_v0'));
    const planImg = await generatePlan(mode);
    const data = { picture: planImg, plan: planData };
    console.log('data:::', data);
  };

  const resetHandler = () => {
    store.dispatch(projectActions.newProject());
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
                <button onClick={resetHandler}>reset</button>
                <button onClick={saveHandler}>done</button>
              </div>
            </>
          );
        }}
      </ContainerDimensions>
    </Provider>
  );
}

export default hot(App);

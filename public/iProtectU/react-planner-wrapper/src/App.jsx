import React from 'react';
import MyCatalog from './catalog/mycatalog';
import ContainerDimensions from 'react-container-dimensions';
import { Map } from 'immutable';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { hot } from 'react-hot-loader/root';

import {
  Models as PlannerModels,
  reducer as PlannerReducer,
  ReactPlanner,
  Plugins as PlannerPlugins,
} from 'react-planner';

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
  PlannerPlugins.Autosave('react-planner_v0'),
  PlannerPlugins.ConsoleDebugger(),
];

function App() {
  return (
    <Provider store={store}>
      <ContainerDimensions>
        {({ width, height }) => {
          console.log(width, height, window.innerHeight);
          return (
            <ReactPlanner
              catalog={MyCatalog}
              width={width ?? window.innerWidth}
              height={height !== 0 ? height : window.innerHeight}
              plugins={plugins}
              stateExtractor={(state) => state.get('react-planner')}
            />
          );
        }}
      </ContainerDimensions>
    </Provider>
  );
}

export default hot(App);

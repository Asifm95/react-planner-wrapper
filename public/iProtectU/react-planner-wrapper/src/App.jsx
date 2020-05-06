import React from 'react';
import MyCatalog from './catalog/mycatalog';
import './App.css';
import { Map } from 'immutable';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

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
  window.devToolsExtension ? window.devToolsExtension() : (f) => f
);

let plugins = [
  PlannerPlugins.Keyboard(),
  PlannerPlugins.Autosave('react-planner_v0'),
  PlannerPlugins.ConsoleDebugger(),
];

function App() {
  return (
    <Provider store={store}>
      <ReactPlanner
        catalog={MyCatalog}
        width={window.innerWidth}
        height={window.innerHeight}
        plugins={plugins}
        stateExtractor={(state) => state.get('react-planner')}
      />
    </Provider>
  );
}

export default App;

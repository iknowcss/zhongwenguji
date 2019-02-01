import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';
import getConfig from './getConfig';
import getInitContext from './getInitContext';
import { loadSamples } from './characterTest/characterTestActions';
import { fetchContext as fetchSkritterContext } from './skritter/skritterActions';

const { enableReduxDevTools } = getConfig();
const composeEnhancers = enableReduxDevTools && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  : compose;
const enhancers = composeEnhancers(applyMiddleware(thunk));
const { skritterCode, initialState } = getInitContext(document.location.search);

let store;
if (initialState) {
  store = createStore(reducer, initialState, enhancers);
} else {
  store = createStore(reducer, enhancers);
  store.dispatch(loadSamples());
}

if (skritterCode) {
  store.dispatch(fetchSkritterContext(skritterCode));
}

export { store };

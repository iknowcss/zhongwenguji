import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';
import getConfig from './getConfig';
import getInitContext from './getInitContext';
import { loadSamples } from './characterTest/characterTestActions';

const { enableReduxDevTools } = getConfig();
const composeEnhancers = enableReduxDevTools && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  : compose;
const enhancers = composeEnhancers(applyMiddleware(thunk));
const { initialState } = getInitContext(document.location.search);

let store;
if (initialState) {
  store = createStore(reducer, initialState, enhancers);
} else {
  store = createStore(reducer, enhancers);
  store.dispatch(loadSamples());
}

export { store };

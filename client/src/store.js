import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';
import getConfig from './getConfig';
import getInitContext from './getInitContext';
import { loadSamples } from './characterTest/characterTestActions';
import { receiveContext as receiveSkritterContext } from './skritter/skritterActions';

const { enableReduxDevTools } = getConfig();
const composeEnhancers = enableReduxDevTools && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  : compose;
const enhancers = composeEnhancers(applyMiddleware(thunk));
const { initialState, skritterContext } = getInitContext(document.location.search);

let store;
if (skritterContext) {
  if (initialState) {
    store = createStore(reducer, initialState, enhancers);
  } else {
    store = createStore(reducer, enhancers);
  }
  store.dispatch(receiveSkritterContext(skritterContext));
} else {
  store = createStore(reducer, enhancers);
  store.dispatch(loadSamples());
}

export { store };

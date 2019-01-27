import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';
import getConfig from './getConfig';

const { enableReduxDevTools } = getConfig();
const composeEnhancers = enableReduxDevTools && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  : compose;

export const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

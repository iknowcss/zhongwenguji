import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';
import getConfig from './getConfig';
import getInitContext from './getInitContext';

const { enableReduxDevTools } = getConfig();
const composeEnhancers = enableReduxDevTools && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  : compose;

const { initialState, skritterContext } = getInitContext(document.location.search);

export const store = createStore(reducer, initialState, composeEnhancers(applyMiddleware(thunk)));

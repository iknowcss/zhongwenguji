import getConfig from '../getConfig';
import { isLoggedIn } from './skritterReducer';

export const actionTypes = {
  CONTEXT_RECEIVE: '@zwgj//skritterActions/context/receive',
  ADD_START: '@zwgj//skritterActions/add/start',
};

export const addToSkritter = () => (dispatch, getState) => {
  if (!isLoggedIn(getState())) {
    const reduxState = JSON.stringify(getState());
    localStorage.setItem('reduxState', reduxState);
    window.location.assign(getConfig().skritterCallbackUrl);
  } else {
    dispatch({ type: actionTypes.ADD_START });
  }
};

export const receiveContext = context => ({
  type: actionTypes.CONTEXT_RECEIVE,
  context
});


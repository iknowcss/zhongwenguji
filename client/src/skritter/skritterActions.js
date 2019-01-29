import getConfig from '../getConfig';

export const actionTypes = {
  CONTEXT_RECEIVE: '@zwgj//skritterActions/context/receive'
};

export const addToSkritter = () => (dispatch, getState) => {
  const reduxState = JSON.stringify(getState());
  localStorage.setItem('reduxState', reduxState);
  window.location.assign(getConfig().skritterCallbackUrl);
};

export const receiveContext = context => ({
  type: actionTypes.CONTEXT_RECEIVE,
  context
});


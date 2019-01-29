import getConfig from '../getConfig';

export const addToSkritter = () => (dispatch, getState) => {
  const reduxState = JSON.stringify(getState());
  localStorage.setItem('reduxState', reduxState);
  window.location.assign(getConfig().skritterCallbackUrl);
};

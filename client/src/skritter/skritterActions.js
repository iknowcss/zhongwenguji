import getConfig from '../getConfig';
import { isLoggedIn } from './skritterReducer';

export const actionTypes = {
  CONTEXT_FETCH_START: '@zwgj//skritterActions/context/fetch/start',
  CONTEXT_FETCH_FAIL: '@zwgj//skritterActions/context/fetch/fail',
  CONTEXT_FETCH_SUCCESS: '@zwgj//skritterActions/context/fetch/success',
  ADD_START: '@zwgj//skritterActions/add/start',
  LOGIN_START: '@zwgj//skritterActions/login/start'
};

export const addToSkritter = () => (dispatch, getState) => {
  if (!isLoggedIn(getState())) {
    dispatch({ type: actionTypes.LOGIN_START });
    const reduxState = JSON.stringify(getState());
    localStorage.setItem('reduxState', reduxState);
    window.location.assign(getConfig().skritterCallbackUrl);
  } else {
    dispatch({ type: actionTypes.ADD_START });
  }
};

export const fetchContext = code => (dispatch) => {
  dispatch({ type: actionTypes.CONTEXT_FETCH_START });

  return fetch(getConfig().skritterContextUrl, {
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'omit',
    redirect: 'follow',
    headers: { Authorization: `Code ${code}` }
  })
    .then((resp) => {
      const { status, statusText } = resp;
      if (status !== 200) {
        return Promise.reject(new Error(`Unexpected HTTP response: ${status} ${statusText}`));
      }
      return resp.json();
    })
    .then((context) => {
      dispatch({
        type: actionTypes.CONTEXT_FETCH_SUCCESS,
        context
      });
    })
    .catch((error) => {
      console.error('Failed to fetch skritter context', error);
      dispatch({ type: actionTypes.CONTEXT_FETCH_FAIL });
    });
};


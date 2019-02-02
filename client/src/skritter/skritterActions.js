import getConfig from '../getConfig';
import { isLoggedIn, isLoginPending, isMatchingFetchId } from './skritterReducer';

export const actionTypes = {
  CONTEXT_FETCH_START: '@zwgj//skritterActions/context/fetch/start',
  CONTEXT_FETCH_FAIL: '@zwgj//skritterActions/context/fetch/fail',
  CONTEXT_FETCH_SUCCESS: '@zwgj//skritterActions/context/fetch/success',
  CONTEXT_FETCH_CANCEL: '@zwgj//skritterActions/context/fetch/cancel',
  ADD_START: '@zwgj//skritterActions/add/start',
  ADD_CANCEL: '@zwgj//skritterActions/add/cancel',
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

export const cancelAddToSkritter = () => (dispatch, getState) => {
  dispatch({ type: actionTypes.ADD_CANCEL });
  if (isLoginPending(getState())) {
    dispatch({ type: actionTypes.CONTEXT_FETCH_CANCEL });
  }
};

let lastFetchId = 1000;
export const fetchContext = code => (dispatch, getState) => {
  const fetchId = ++lastFetchId;
  dispatch({ type: actionTypes.CONTEXT_FETCH_START, fetchId });

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
      return {
        type: actionTypes.CONTEXT_FETCH_SUCCESS,
        context
      };
    })
    .catch((error) => {
      console.error('Failed to fetch skritter context', error);
      return { type: actionTypes.CONTEXT_FETCH_FAIL };
    })
    .then((action) => {
      if (isMatchingFetchId(getState(), fetchId)) {
        dispatch(action);
      }
    });
};


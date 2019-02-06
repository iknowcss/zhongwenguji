import getConfig from '../getConfig';
import { isLoggedIn, isLoginPending, isMatchingFetchId } from './skritterReducer';

export const actionTypes = {
  CONTEXT_FETCH_START: '@zwgj//skritterActions/context/fetch/start',
  CONTEXT_FETCH_FAIL: '@zwgj//skritterActions/context/fetch/fail',
  CONTEXT_FETCH_SUCCESS: '@zwgj//skritterActions/context/fetch/success',
  CONTEXT_FETCH_CANCEL: '@zwgj//skritterActions/context/fetch/cancel',
  ADD_START: '@zwgj//skritterActions/add/start',
  ADD_SUBMIT_START: '@zwgj//skritterActions/add/submit/start',
  ADD_SUBMIT_SUCCESS: '@zwgj//skritterActions/add/submit/success',
  ADD_SUBMIT_FAIL: '@zwgj//skritterActions/add/submit/fail',
  ADD_FINISH: '@zwgj//skritterActions/add/cancel',
  LOGIN_START: '@zwgj//skritterActions/login/start'
};

export const addToSkritter = () => (dispatch, getState) => {
  dispatch({ type: actionTypes.ADD_START });
  if (!isLoggedIn(getState())) {
    dispatch({ type: actionTypes.LOGIN_START });
    const reduxState = JSON.stringify(getState());
    localStorage.setItem('reduxState', reduxState);
    window.location.assign(getConfig().skritterCallbackUrl);
  }
};

export const submitToSkritter = (characters, characterSet, auth, successCloseTimeoutMs = 1000) => (dispatch) => {
  dispatch({ type: actionTypes.ADD_SUBMIT_START });
  return fetch(getConfig().skritterCharactersUrl, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'omit',
    redirect: 'follow',
    headers: {
      'content-type': 'application/json',
      'x-session': auth
    },
    body: JSON.stringify({ characterSet, characters })
  })
    .then((resp) => {
      const { status, statusText } = resp;
      if (!(status >= 200 && status <= 299)) {
        return Promise.reject(new Error(`Unexpected HTTP response: ${status} ${statusText}`));
      }

      dispatch({ type: actionTypes.ADD_SUBMIT_SUCCESS });
      return new Promise((res) => setTimeout(res, successCloseTimeoutMs));
    })
    .then(() => { dispatch({ type: actionTypes.ADD_FINISH }); })
    .catch((error) => {
      console.error('Failed to add characters to skritter vocab list', error);
      dispatch({ type: actionTypes.ADD_SUBMIT_FAIL });
    })
};

export const cancelAddToSkritter = () => (dispatch, getState) => {
  dispatch({ type: actionTypes.ADD_FINISH });
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


import { actionTypes } from './skritterActions';

export const loginStateEnum = {
  LOGGED_OUT: 'LOGGED_OUT',
  LOGGED_IN: 'LOGGED_IN',
  LOGIN_PENDING: 'LOGIN_PENDING',
  LOGIN_FAILED: 'LOGIN_FAILED'
};

export const addingStateEnum = {
  CLOSED: 'CLOSED',
  SUBMIT_READY: 'SUBMIT_READY',
  SUBMIT_PENDING: 'SUBMIT_PENDING',
  SUBMIT_SUCCESS: 'SUBMIT_SUCCESS',
  SUBMIT_ERROR: 'SUBMIT_ERROR'
};

const DEFAULT_STATE = {
  loginState: loginStateEnum.LOGGED_OUT,
  fetchId: -1,
  userName: null,
  auth: null,
  adding: false
};

export default (state = DEFAULT_STATE, action = {}) => {
  switch (action.type) {
    case actionTypes.ADD_START:
      return { ...state, adding: true };
    case actionTypes.ADD_CANCEL:
      return { ...state, adding: false };
    case actionTypes.LOGIN_START:
      return { ...state, loginState: loginStateEnum.LOGIN_PENDING, adding: true };
    case actionTypes.CONTEXT_FETCH_START:
      return {
        ...state,
        fetchId: action.fetchId,
        loginState: loginStateEnum.LOGIN_PENDING,
        userName: null,
        auth: null
      };
    case actionTypes.CONTEXT_FETCH_SUCCESS:
      const { auth, user = {} } = action.context || {};
      return {
        ...state,
        loginState: loginStateEnum.LOGGED_IN,
        userName: user.name,
        auth
      };
    case actionTypes.CONTEXT_FETCH_FAIL:
      return {
        ...state,
        loginState: loginStateEnum.LOGIN_FAILED,
        userName: null,
        auth: null
      };
    case actionTypes.CONTEXT_FETCH_CANCEL:
      return {
        ...state,
        loginState: loginStateEnum.LOGGED_OUT,
        userName: null,
        auth: null,
        fetchId: -1
      };
    default:
      return state;
  }
};

export const loginState = ({ skritter }) => skritter.loginState;

export const isLoggedIn = ({ skritter }) => skritter.loginState === loginStateEnum.LOGGED_IN;

export const isLoginPending = ({ skritter }) => skritter.loginState === loginStateEnum.LOGIN_PENDING;

export const isLoginFailed = ({ skritter }) => skritter.loginState === loginStateEnum.LOGIN_FAILED;

export const userName = ({ skritter }) => skritter.userName;

export const auth = ({ skritter }) => skritter.auth;

export const isAdding = ({ skritter }) => skritter.adding;

export const isMatchingFetchId = ({ skritter }, fetchId) => skritter.fetchId === fetchId;

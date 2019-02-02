import { actionTypes } from './skritterActions';

export const stateEnum = {
  LOGGED_OUT: 'LOGGED_OUT',
  LOGGED_IN: 'LOGGED_IN',
  LOGIN_PENDING: 'LOGIN_PENDING',
  LOGIN_FAILED: 'LOGIN_FAILED'
};

const DEFAULT_STATE = {
  loginState: stateEnum.LOGGED_OUT,
  fetchId: -1,
  userName: null,
  auth: null,
  adding: false
};

export default (state = DEFAULT_STATE, action = {}) => {
  switch (action.type) {
    case actionTypes.ADD_START:
      return { ...state, adding: true };
    case actionTypes.LOGIN_START:
      return { ...state, loginState: stateEnum.LOGIN_PENDING, adding: true };
    case actionTypes.CONTEXT_FETCH_START:
      return {
        ...state,
        fetchId: action.fetchId,
        loginState: stateEnum.LOGIN_PENDING,
        userName: null,
        auth: null
      };
    case actionTypes.CONTEXT_FETCH_SUCCESS:
      const { auth, user = {} } = action.context || {};
      return {
        ...state,
        loginState: stateEnum.LOGGED_IN,
        userName: user.name,
        auth
      };
    case actionTypes.CONTEXT_FETCH_FAIL:
      return {
        ...state,
        loginState: stateEnum.LOGIN_FAILED,
        userName: null,
        auth: null
      };
    case actionTypes.CONTEXT_FETCH_CANCEL:
      return {
        ...state,
        loginState: stateEnum.LOGGED_OUT,
        userName: null,
        auth: null,
        fetchId: -1
      };
    default:
      return state;
  }
};

export const loginState = ({ skritter }) => skritter.loginState;

export const isLoggedIn = ({ skritter }) => skritter.loginState === stateEnum.LOGGED_IN;

export const isLoginPending = ({ skritter }) => skritter.loginState === stateEnum.LOGIN_PENDING;

export const isLoginFailed = ({ skritter }) => skritter.loginState === stateEnum.LOGIN_FAILED;

export const userName = ({ skritter }) => skritter.userName;

export const auth = ({ skritter }) => skritter.auth;

export const isAdding = ({ skritter }) => skritter.adding;

export const isMatchingFetchId = ({ skritter }, fetchId) => skritter.fetchId === fetchId;

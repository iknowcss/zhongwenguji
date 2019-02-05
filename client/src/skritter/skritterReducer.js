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
  addingState: addingStateEnum.CLOSED,
  loginState: loginStateEnum.LOGGED_OUT,
  fetchId: -1,
  userName: null,
  auth: null
};

export default (state = DEFAULT_STATE, action = {}) => {
  switch (action.type) {

    /// - Add State ---------------------------------------

    case actionTypes.ADD_START:
      return { ...state, addingState: addingStateEnum.SUBMIT_READY };
    case actionTypes.ADD_SUBMIT_START:
      return { ...state, addingState: addingStateEnum.SUBMIT_PENDING };
    case actionTypes.ADD_SUBMIT_SUCCESS:
      return { ...state, addingState: addingStateEnum.SUBMIT_SUCCESS };
    case actionTypes.ADD_SUBMIT_FAIL:
      return { ...state, addingState: addingStateEnum.SUBMIT_ERROR };
    case actionTypes.ADD_FINISH:
      return { ...state, addingState: addingStateEnum.CLOSED };

    /// - Login State -------------------------------------

    case actionTypes.LOGIN_START:
      return {
        ...state,
        loginState: loginStateEnum.LOGIN_PENDING
      };
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

    /// - Default -----------------------------------------

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

export const isAdding = ({ skritter }) => skritter.addingState !== addingStateEnum.CLOSED;

export const addingState = ({ skritter }) => skritter.addingState;

export const isMatchingFetchId = ({ skritter }, fetchId) => skritter.fetchId === fetchId;

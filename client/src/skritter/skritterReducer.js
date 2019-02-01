import { actionTypes } from './skritterActions';

const DEFAULT_STATE = {
  loginPending: false,
  loggedIn: false,
  userName: null,
  auth: null,
  adding: false
};

export default (state = DEFAULT_STATE, action = {}) => {
  switch (action.type) {
    case actionTypes.ADD_START:
      return { ...state, adding: true };
    case actionTypes.LOGIN_START:
      return { ...state, loginPending: true, adding: true };
    case actionTypes.CONTEXT_FETCH_START:
      return {
        ...state,
        loginPending: true,
        loggedIn: false,
        userName: null,
        auth: null
      };
    case actionTypes.CONTEXT_FETCH_SUCCESS:
      const { auth, user = {} } = action.context || {};
      return {
        ...state,
        loginPending: false,
        loggedIn: true,
        userName: user.name,
        auth,
        adding: true
      };
    case actionTypes.CONTEXT_FETCH_FAIL:
      return {
        ...state,
        loginPending: false,
        loggedIn: false,
        userName: null,
        auth: null,
        adding: true
      };
    default:
      return state;
  }
};

export const isLoggedIn = ({ skritter }) => skritter.loggedIn;

export const userName = ({ skritter }) => skritter.userName;

export const auth = ({ skritter }) => skritter.auth;

export const isAdding = ({ skritter }) => skritter.adding;

export const isLoginPending = ({ skritter }) => skritter.loginPending;

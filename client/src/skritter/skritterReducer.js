import { actionTypes } from './skritterActions';

const DEFAULT_STATE = {
  loggedIn: false,
  userName: null,
  auth: null,
  adding: false
};

export default (state = DEFAULT_STATE, action = {}) => {
  switch (action.type) {
    case actionTypes.CONTEXT_FETCH_SUCCESS:
      const { auth, user = {} } = action.context || {};
      return {
        ...state,
        loggedIn: true,
        userName: user.name,
        auth,
        adding: true
      };
    case actionTypes.ADD_START:
      return { ...state, adding: true };
    default:
      return state;
  }
};

export const isLoggedIn = ({ skritter }) => skritter.loggedIn;

export const userName = ({ skritter }) => skritter.userName;

export const auth = ({ skritter }) => skritter.auth;

export const isAdding = ({ skritter }) => skritter.adding;

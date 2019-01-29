import { actionTypes } from './skritterActions';

const DEFAULT_STATE = {
  loggedIn: false,
  userName: null,
  auth: null
};

export default (state = DEFAULT_STATE, action = {}) => {
  switch (action.type) {
    case actionTypes.CONTEXT_RECEIVE:
      const { auth, user = {} } = action.context || {};
      return {
        ...state,
        loggedIn: true,
        userName: user.name,
        auth
      };
    default:
      return state;
  }
};

export const isLoggedIn = ({ skritter }) => skritter.loggedIn;

export const userName = ({ skritter }) => skritter.userName;

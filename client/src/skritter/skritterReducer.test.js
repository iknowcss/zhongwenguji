import { actionTypes } from './skritterActions';
import skritterReducer, {
  isLoggedIn,
  userName,
  isAdding,
  isLoginPending
} from './skritterReducer';

describe('skritterReducer', () => {
  it('has a default state', () => {
    expect(skritterReducer()).toEqual({
      loginPending: false,
      loggedIn: false,
      userName: null,
      auth: null,
      adding: false
    });
  });

  it('receives context', () => {
    expect(skritterReducer({
      loginPending: true
    }, {
      type: actionTypes.CONTEXT_FETCH_SUCCESS,
      context: { user: { name: 'iknowcss' }, auth: 'b2hhaQ==' }
    })).toEqual({
      loginPending: false,
      loggedIn: true,
      userName: 'iknowcss',
      auth: 'b2hhaQ==',
      adding: true
    });
  });

  it('fails to receive context', () => {
    expect(skritterReducer({
      loginPending: true
    }, {
      type: actionTypes.CONTEXT_FETCH_FAIL
    })).toEqual({
      loginPending: false,
      loggedIn: false,
      userName: null,
      auth: null,
      adding: true
    });
  });

  it('starts adding to skritter', () => {
    expect(skritterReducer({
      adding: false
    }, {
      type: actionTypes.ADD_START
    })).toEqual({
      adding: true
    });
  });

  it('starts the login process', () => {
    expect(skritterReducer({
      loginPending: false,
      adding: false
    }, {
      type: actionTypes.LOGIN_START
    })).toEqual({
      loginPending: true,
      adding: true
    });
  });

  it('starts the context fetch process', () => {
    expect(skritterReducer({
      loginPending: false
    }, {
      type: actionTypes.CONTEXT_FETCH_START
    })).toEqual({
      loginPending: true,
      loggedIn: false,
      userName: null,
      auth: null
    });
  });

  describe('selectors', () => {
    it('isLoggedIn', () => {
      expect(isLoggedIn({ skritter: { loggedIn: true } })).toEqual(true);
    });

    it('userName', () => {
      expect(userName({ skritter: { userName: 'iknowcss' } })).toEqual('iknowcss');
    });

    it('isAdding', () => {
      expect(isAdding({ skritter: { adding: true } })).toEqual(true);
    });

    it('isLoginPending', () => {
      expect(isLoginPending({ skritter: { loginPending: true } })).toEqual(true);
    });
  });
});


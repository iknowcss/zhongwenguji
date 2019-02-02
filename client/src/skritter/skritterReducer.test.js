import { actionTypes } from './skritterActions';
import skritterReducer, {
  stateEnum,
  userName,
  isAdding,
  loginState,
  isLoggedIn,
  isLoginPending,
  isLoginFailed,
  fetchId, isMatchingFetchId
} from './skritterReducer';

describe('skritterReducer', () => {
  it('has a default state', () => {
    expect(skritterReducer()).toEqual({
      loginState: stateEnum.LOGGED_OUT,
      fetchId: -1,
      userName: null,
      auth: null,
      adding: false
    });
  });

  it('receives context', () => {
    expect(skritterReducer({
      loginState: stateEnum.LOGIN_PENDING,
    }, {
      type: actionTypes.CONTEXT_FETCH_SUCCESS,
      context: { user: { name: 'iknowcss' }, auth: 'b2hhaQ==' }
    })).toEqual({
      loginState: stateEnum.LOGGED_IN,
      userName: 'iknowcss',
      auth: 'b2hhaQ=='
    });
  });

  it('fails to receive context', () => {
    expect(skritterReducer({
      loginState: stateEnum.LOGIN_PENDING
    }, {
      type: actionTypes.CONTEXT_FETCH_FAIL
    })).toEqual({
      loginState: stateEnum.LOGIN_FAILED,
      userName: null,
      auth: null
    });
  });

  it('cancels receive context', () => {
    expect(skritterReducer({
      loginState: stateEnum.LOGIN_PENDING,
      fetchId: 9999
    }, {
      type: actionTypes.CONTEXT_FETCH_CANCEL
    })).toEqual({
      loginState: stateEnum.LOGGED_OUT,
      fetchId: -1,
      userName: null,
      auth: null
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
      loginState: stateEnum.LOGGED_OUT,
      adding: false
    }, {
      type: actionTypes.LOGIN_START
    })).toEqual({
      loginState: stateEnum.LOGIN_PENDING,
      adding: true
    });
  });

  it('starts the context fetch process', () => {
    expect(skritterReducer({
      loginState: stateEnum.LOGGED_OUT,
    }, {
      type: actionTypes.CONTEXT_FETCH_START,
      fetchId: 9999
    })).toEqual({
      loginState: stateEnum.LOGIN_PENDING,
      userName: null,
      auth: null,
      fetchId: 9999
    });
  });

  describe('selectors', () => {
    it('loginState', () => {
      expect(loginState({ skritter: { loginState: stateEnum.LOGGED_IN } })).toEqual(stateEnum.LOGGED_IN);
    });

    it('isLoggedIn', () => {
      expect(isLoggedIn({ skritter: { loginState: stateEnum.LOGGED_IN } })).toEqual(true);
    });

    it('isLoginPending', () => {
      expect(isLoginPending({ skritter: { loginState: stateEnum.LOGIN_PENDING } })).toEqual(true);
    });

    it('isLoginFailed', () => {
      expect(isLoginFailed({ skritter: { loginState: stateEnum.LOGIN_FAILED } })).toEqual(true);
    });

    it('userName', () => {
      expect(userName({ skritter: { userName: 'iknowcss' } })).toEqual('iknowcss');
    });

    it('isAdding', () => {
      expect(isAdding({ skritter: { adding: true } })).toEqual(true);
    });

    it('fetchId', () => {
      expect(isMatchingFetchId({ skritter: { fetchId: 9999 } }, 9999)).toEqual(true);
    });
  });
});


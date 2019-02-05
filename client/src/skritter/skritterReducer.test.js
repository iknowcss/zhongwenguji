import { actionTypes } from './skritterActions';
import skritterReducer, {
  loginStateEnum,
  addingStateEnum,
  userName,
  isAdding,
  loginState,
  isLoggedIn,
  isLoginPending,
  isLoginFailed,
  isMatchingFetchId,
  addingState
} from './skritterReducer';

describe('skritterReducer', () => {
  it('has a default state', () => {
    expect(skritterReducer()).toEqual({
      loginState: loginStateEnum.LOGGED_OUT,
      addingState: addingStateEnum.CLOSED,
      fetchId: -1,
      userName: null,
      auth: null
    });
  });

  it('receives context', () => {
    expect(skritterReducer({
      loginState: loginStateEnum.LOGIN_PENDING,
    }, {
      type: actionTypes.CONTEXT_FETCH_SUCCESS,
      context: { user: { name: 'iknowcss' }, auth: 'b2hhaQ==' }
    })).toEqual({
      loginState: loginStateEnum.LOGGED_IN,
      userName: 'iknowcss',
      auth: 'b2hhaQ=='
    });
  });

  it('fails to receive context', () => {
    expect(skritterReducer({
      loginState: loginStateEnum.LOGIN_PENDING
    }, {
      type: actionTypes.CONTEXT_FETCH_FAIL
    })).toEqual({
      loginState: loginStateEnum.LOGIN_FAILED,
      userName: null,
      auth: null
    });
  });

  it('cancels receive context', () => {
    expect(skritterReducer({
      loginState: loginStateEnum.LOGIN_PENDING,
      fetchId: 9999
    }, {
      type: actionTypes.CONTEXT_FETCH_CANCEL
    })).toEqual({
      loginState: loginStateEnum.LOGGED_OUT,
      fetchId: -1,
      userName: null,
      auth: null
    });
  });

  it('starts adding to skritter', () => {
    expect(skritterReducer({
      addingState: addingStateEnum.CLOSED
    }, {
      type: actionTypes.ADD_START
    })).toEqual({
      addingState: addingStateEnum.SUBMIT_READY
    });
  });

  it('starts submitting to skritter', () => {
    expect(skritterReducer({
      addingState: addingStateEnum.SUBMIT_READY
    }, {
      type: actionTypes.ADD_SUBMIT_START
    })).toEqual({
      addingState: addingStateEnum.SUBMIT_PENDING
    });
  });

  it('handles skritter submit success', () => {
    expect(skritterReducer({
      addingState: addingStateEnum.SUBMIT_PENDING
    }, {
      type: actionTypes.ADD_SUBMIT_SUCCESS
    })).toEqual({
      addingState: addingStateEnum.SUBMIT_SUCCESS
    });
  });

  it('handles skritter submit success', () => {
    expect(skritterReducer({
      addingState: addingStateEnum.SUBMIT_PENDING
    }, {
      type: actionTypes.ADD_SUBMIT_FAIL
    })).toEqual({
      addingState: addingStateEnum.SUBMIT_ERROR
    });
  });

  it('cancel adding to skritter', () => {
    expect(skritterReducer({
      addingState: addingStateEnum.SUBMIT_READY
    }, {
      type: actionTypes.ADD_FINISH
    })).toEqual({
      addingState: addingStateEnum.CLOSED
    });
  });

  it('starts the login process', () => {
    expect(skritterReducer({
      loginState: loginStateEnum.LOGGED_OUT
    }, {
      type: actionTypes.LOGIN_START
    })).toEqual({
      loginState: loginStateEnum.LOGIN_PENDING,
    });
  });

  it('starts the context fetch process', () => {
    expect(skritterReducer({
      loginState: loginStateEnum.LOGGED_OUT,
    }, {
      type: actionTypes.CONTEXT_FETCH_START,
      fetchId: 9999
    })).toEqual({
      loginState: loginStateEnum.LOGIN_PENDING,
      userName: null,
      auth: null,
      fetchId: 9999
    });
  });

  describe('selectors', () => {
    it('loginState', () => {
      expect(loginState({ skritter: { loginState: loginStateEnum.LOGGED_IN } })).toEqual(loginStateEnum.LOGGED_IN);
    });

    it('isLoggedIn', () => {
      expect(isLoggedIn({ skritter: { loginState: loginStateEnum.LOGGED_IN } })).toEqual(true);
    });

    it('isLoginPending', () => {
      expect(isLoginPending({ skritter: { loginState: loginStateEnum.LOGIN_PENDING } })).toEqual(true);
    });

    it('isLoginFailed', () => {
      expect(isLoginFailed({ skritter: { loginState: loginStateEnum.LOGIN_FAILED } })).toEqual(true);
    });

    it('userName', () => {
      expect(userName({ skritter: { userName: 'iknowcss' } })).toEqual('iknowcss');
    });

    it('isAdding', () => {
      expect(isAdding({ skritter: { addingState: addingStateEnum.CLOSED } })).toEqual(false);
      expect(isAdding({ skritter: { addingState: addingStateEnum.SUBMIT_READY } })).toEqual(true);
    });

    it('isSubmitting', () => {
      expect(addingState({ skritter: { addingState: addingStateEnum.SUBMIT_PENDING } })).toEqual(addingStateEnum.SUBMIT_PENDING);
    });

    it('fetchId', () => {
      expect(isMatchingFetchId({ skritter: { fetchId: 9999 } }, 9999)).toEqual(true);
    });
  });
});


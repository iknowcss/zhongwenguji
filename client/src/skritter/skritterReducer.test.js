import { actionTypes } from './skritterActions';
import skritterReducer, { isLoggedIn, userName } from './skritterReducer';

describe('skritterReducer', () => {
  it('has a default state', () => {
    expect(skritterReducer()).toEqual({
      loggedIn: false,
      userName: null,
      auth: null
    });
  });

  it('receives context', () => {
    expect(skritterReducer(null, {
      type: actionTypes.CONTEXT_RECEIVE,
      context: { user: { name: 'iknowcss' }, auth: 'b2hhaQ==' }
    })).toEqual({
      loggedIn: true,
      userName: 'iknowcss',
      auth: 'b2hhaQ=='
    });
  });

  describe('selectors', () => {
    it('isLoggedIn', () => {
      expect(isLoggedIn({ skritter: { loggedIn: true } })).toEqual(true);
    });

    it('userName', () => {
      expect(userName({ skritter: { userName: 'iknowcss' } })).toEqual('iknowcss');
    });
  });
});


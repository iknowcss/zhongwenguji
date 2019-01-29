import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import rootReducer from '../reducer';
import { actionTypes, addToSkritter, receiveContext } from './skritterActions';

jest.mock('../getConfig', () => () => ({
  skritterCallbackUrl: 'http://example.com/authorize'
}));

describe('skritterActionCreator', () => {
  const buildMockStore = configureMockStore([thunk]);

  describe('addToSkritter', () => {
    let initialState;
    let store;

    beforeAll(() => {
      window.location.assign = jest.fn();
      initialState = rootReducer();
      store = buildMockStore(initialState);
      store.dispatch(addToSkritter());
    });

    it('stores the current redux state to the session storage', () => {
      expect(JSON.parse(localStorage.__STORE__['reduxState']))
        .toEqual(initialState);
    });

    it('redirects to the skritter OAuth2 endpoint', () => {
      expect(window.location.assign)
        .toHaveBeenCalledWith('http://example.com/authorize');
    });
  });

  it('handles receiveContext', () => {
    expect(receiveContext({ foo: 'bar' })).toEqual({
      type: actionTypes.CONTEXT_RECEIVE,
      context: { foo: 'bar' }
    });
  });
});

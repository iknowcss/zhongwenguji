import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import mockConsole from 'jest-mock-console';
import rootReducer from '../reducer';
import { actionTypes, addToSkritter, fetchContext } from './skritterActions';

jest.mock('../getConfig', () => () => ({
  skritterCallbackUrl: 'http://example.com/authorize',
  skritterContextUrl: 'http://example.com/skritter/context'
}));

describe('skritterActionCreator', () => {
  const buildMockStore = configureMockStore([thunk]);
  let store;

  describe('addToSkritter', () => {
    let initialState;

    describe('not logged in', () => {
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
        expect(store.getActions()[0]).toEqual({
          type: actionTypes.LOGIN_START
        });
        expect(window.location.assign)
          .toHaveBeenCalledWith('http://example.com/authorize');
      });
    });

    describe('logged in', () => {
      beforeAll(() => {
        window.location.assign = jest.fn();
        initialState = rootReducer(rootReducer(), {
          type: actionTypes.CONTEXT_FETCH_SUCCESS,
          context: {
            auth: 'b2hhaQ==',
            user: { name: 'iknowcss' }
          }
        });
        store = buildMockStore(initialState);
        store.dispatch(addToSkritter());
      });

      it('starts adding', () => {
        expect(store.getActions()).toEqual([{ type: actionTypes.ADD_START }]);
      });
    });
  });

  describe('fetchContext', () => {
    let restoreConsole;

    beforeEach(() => {
      fetch.resetMocks();
      store = buildMockStore();
      restoreConsole = mockConsole();
    });

    afterEach(() => {
      restoreConsole();
    });

    it('fetches the skritter from the server', async () => {
      fetch.mockResponseOnce(JSON.stringify({ foo: 'bar' }));

      await expect(store.dispatch(fetchContext('secretcode')))
        .resolves.toBeUndefined();

      expect(fetch.mock.calls).toHaveLength(1);
      expect(fetch.mock.calls[0]).toMatchSnapshot();

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: actionTypes.CONTEXT_FETCH_START });
      expect(actions[1]).toEqual({
        type: actionTypes.CONTEXT_FETCH_SUCCESS,
        context: { foo: 'bar' }
      });
    });

    it('handles unexpected response codes', async () => {
      fetch.mockResponseOnce('', { status: 401, statusText: 'Not authorized' });

      await expect(store.dispatch(fetchContext('secretcode')))
        .resolves.toBeUndefined();

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: actionTypes.CONTEXT_FETCH_START });
      expect(actions[1]).toEqual({ type: actionTypes.CONTEXT_FETCH_FAIL });

      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error.mock.calls[0]).toEqual([
        'Failed to fetch skritter context',
        expect.objectContaining({
          message: 'Unexpected HTTP response: 401 Not authorized'
        })
      ]);
    });

    it('handles network errors', async () => {
      fetch.mockRejectOnce(new Error('Failed to connect'));

      await expect(store.dispatch(fetchContext('secretcode')))
        .resolves.toBeUndefined();

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: actionTypes.CONTEXT_FETCH_START });
      expect(actions[1]).toEqual({ type: actionTypes.CONTEXT_FETCH_FAIL });

      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error.mock.calls[0]).toEqual([
        'Failed to fetch skritter context',
        expect.objectContaining({
          message: 'Failed to connect'
        })
      ]);
    });
  });
});

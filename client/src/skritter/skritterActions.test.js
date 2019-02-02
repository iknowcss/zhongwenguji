import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import mockConsole from 'jest-mock-console';
import rootReducer from '../reducer';
import * as skritterReducer from './skritterReducer';
import { actionTypes, addToSkritter, cancelAddToSkritter, fetchContext } from './skritterActions';

jest.mock('../getConfig', () => () => ({
  skritterCallbackUrl: 'http://example.com/authorize',
  skritterContextUrl: 'http://example.com/skritter/context'
}));

describe('skritterActionCreator', () => {
  const buildMockStore = configureMockStore([thunk]);
  let store;
  let restoreConsole;

  beforeEach(() => {
    restoreConsole = mockConsole();
    fetch.resetMocks();
  });

  afterEach(() => {
    restoreConsole();
  });

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

  describe('cancelAddToSkritter', () => {
    it('cancels the add', () => {
      store = buildMockStore(rootReducer());
      store.dispatch(cancelAddToSkritter());
      const actions = store.getActions();
      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual({
        type: actionTypes.ADD_CANCEL
      });
    });

    // NOTE: Async cancel tested in "fetchContext" section
  });

  describe('fetchContext', () => {
    beforeEach(() => {
      store = buildMockStore(rootReducer(rootReducer()));
    });

    describe('success', () => {
      beforeEach(() => {
        fetch.mockResponseOnce(() => new Promise((resolve) => {
          setTimeout(() => {
            resolve({ body: JSON.stringify({ foo: 'bar' }) });
          }, 10);
        }));
      });

      it('fetches the skritter context from the server', async () => {
        jest
          .spyOn(skritterReducer, 'isMatchingFetchId')
          .mockImplementation(() => true);

        await expect(store.dispatch(fetchContext('secretcode')))
          .resolves.toBeUndefined();

        expect(fetch.mock.calls).toHaveLength(1);
        expect(fetch.mock.calls[0]).toMatchSnapshot();

        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0]).toEqual({
          type: actionTypes.CONTEXT_FETCH_START,
          fetchId: expect.any(Number)
        });
        expect(actions[1]).toEqual({
          type: actionTypes.CONTEXT_FETCH_SUCCESS,
          context: { foo: 'bar' }
        });
      });

      it('cancels fetching the skritter context', async () => {
        jest
          .spyOn(skritterReducer, 'isMatchingFetchId')
          .mockImplementation(() => false);

        await expect(store.dispatch(fetchContext('secretcode')))
          .resolves.toBeUndefined();

        const actions = store.getActions();
        expect(actions).toHaveLength(1);
        expect(actions[0]).toEqual({
          type: actionTypes.CONTEXT_FETCH_START,
          fetchId: expect.any(Number)
        });
      });
    });

    describe('fail', () => {
      beforeEach(() => {
        fetch.mockRejectOnce(() => new Promise((resolve) => {
          setTimeout(() => { resolve({ status: 401, statusText: 'Not authorized' }); }, 10);
        }));
      });

      it('handles unexpected response codes', async () => {
        jest
          .spyOn(skritterReducer, 'isMatchingFetchId')
          .mockImplementation(() => true);

        await expect(store.dispatch(fetchContext('secretcode')))
          .resolves.toBeUndefined();

        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0]).toEqual({
          type: actionTypes.CONTEXT_FETCH_START,
          fetchId: expect.any(Number)
        });
        expect(actions[1]).toEqual({ type: actionTypes.CONTEXT_FETCH_FAIL });

        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error.mock.calls[0]).toEqual([
          'Failed to fetch skritter context',
          expect.objectContaining({
            message: 'Unexpected HTTP response: 401 Not authorized'
          })
        ]);
      });

      it('cancels fetching the skritter context', async () => {
        jest
          .spyOn(skritterReducer, 'isMatchingFetchId')
          .mockImplementation(() => false);

        await expect(store.dispatch(fetchContext('secretcode')))
          .resolves.toBeUndefined();

        const actions = store.getActions();
        expect(actions).toHaveLength(1);
        expect(actions[0]).toEqual({
          type: actionTypes.CONTEXT_FETCH_START,
          fetchId: expect.any(Number)
        });
      });
    });

    it('handles network errors', async () => {
      jest
        .spyOn(skritterReducer, 'isMatchingFetchId')
        .mockImplementation(() => true);
      fetch.mockRejectOnce(new Error('Failed to connect'));

      await expect(store.dispatch(fetchContext('secretcode')))
        .resolves.toBeUndefined();

      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: actionTypes.CONTEXT_FETCH_START,
        fetchId: expect.any(Number)
      });
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

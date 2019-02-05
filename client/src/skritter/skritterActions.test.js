import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import mockConsole from 'jest-mock-console';
import rootReducer from '../reducer';
import * as skritterReducer from './skritterReducer';
import {
  actionTypes,
  addToSkritter,
  submitToSkritter,
  cancelAddToSkritter,
  fetchContext
} from './skritterActions';

jest.mock('../getConfig', () => () => ({
  skritterCallbackUrl: 'http://example.com/authorize',
  skritterContextUrl: 'http://example.com/skritter/context',
  skritterCharactersUrl: 'http://example.com/skritter/characters'
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
        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0]).toEqual({
          type: actionTypes.ADD_START
        });
        expect(actions[1]).toEqual({
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

  describe('submitToSkritter', () => {
    beforeEach(() => {
      store = buildMockStore(rootReducer(rootReducer()));
    });

    describe('success', () => {
      beforeEach(() => {
        fetch.mockResponseOnce(() => new Promise((resolve) => {
          setTimeout(() => {
            resolve({ body: '' });
          }, 10);
        }));
      });

      it('submits the vocab list', async () => {
        await expect(store.dispatch(submitToSkritter(
          ['一', '二', '三'],
          'mock-session',
          10
        )))
          .resolves.toBeUndefined();

        expect(fetch.mock.calls).toHaveLength(1);
        const [url, { body, ...options }] = fetch.mock.calls[0];
        expect(url).toEqual('http://example.com/skritter/characters');
        expect(JSON.parse(body)).toEqual({ characters: ['一', '二', '三'] });
        expect(options.method).toEqual('POST');
        expect(options.headers['x-session']).toEqual('mock-session');
        expect(options).toMatchSnapshot();

        const actions = store.getActions();
        expect(actions).toHaveLength(3);
        expect(actions[0]).toEqual({
          type: actionTypes.ADD_SUBMIT_START
        });
        expect(actions[1]).toEqual({
          type: actionTypes.ADD_SUBMIT_SUCCESS
        });
        expect(actions[2]).toEqual({
          type: actionTypes.ADD_FINISH
        });
      });
    });

    describe('fail', () => {
      it('handles unexpected status codes', async () => {
        fetch.mockResponseOnce(() => new Promise((resolve, reject) => {
          setTimeout(() => {
            reject({ body: '', status: 401 });
          }, 10);
        }));

        await expect(store.dispatch(submitToSkritter(
          ['一', '二', '三'],
          'mock-session'
        )))
          .resolves.toBeUndefined();

        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0]).toEqual({
          type: actionTypes.ADD_SUBMIT_START
        });
        expect(actions[1]).toEqual({
          type: actionTypes.ADD_SUBMIT_FAIL
        });
      });

      it('handles network errors', async () => {
        fetch.mockResponseOnce(() => new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error('What happen'));
          }, 10);
        }));

        await expect(store.dispatch(submitToSkritter(
          ['一', '二', '三'],
          'mock-session'
        )))
          .resolves.toBeUndefined();

        const actions = store.getActions();
        expect(actions).toHaveLength(2);
        expect(actions[0]).toEqual({
          type: actionTypes.ADD_SUBMIT_START
        });
        expect(actions[1]).toEqual({
          type: actionTypes.ADD_SUBMIT_FAIL
        });
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
        type: actionTypes.ADD_FINISH
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

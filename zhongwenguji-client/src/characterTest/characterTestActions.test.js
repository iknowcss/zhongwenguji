import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock';
import { loadSamples, actionTypes } from './characterTestActions';

const mockStore = configureMockStore([thunk]);

describe('characterTestActions', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it('loads character samples', () => {
    fetchMock.getOnce('http://example.com/characters/sample', {
      body: { mockData: true },
      headers: { 'Content-type': 'application/json' }
    });

    const store = mockStore({});
    return store.dispatch(loadSamples('http://example.com/characters/sample'))
      .then(() => {
        expect(store.getActions()).toEqual([
          { type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_START },
          {
            type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_SUCCESS,
            mockData: true
          }
        ]);
      });
  });

  it('handles character sample load failure', () => {
    fetchMock.getOnce('http://example.com/characters/sample', 500);

    const store = mockStore({});
    return store.dispatch(loadSamples('http://example.com/characters/sample'))
      .then(() => {
        expect(store.getActions()).toEqual([
          { type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_START },
          {
            type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_FAIL,
            error: new Error('Response was not OK')
          }
        ]);
      });
  });
});

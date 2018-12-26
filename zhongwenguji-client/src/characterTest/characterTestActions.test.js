import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock';
import prepareBins from './prepareBins.testutil';
import {
  actionTypes,
  loadSamples,
  markCurrentUnknown,
  markCurrentKnown,
  undoDiscard
} from './characterTestActions';

const mockStore = configureMockStore([thunk]);

describe('characterTestActions', () => {
  const oldConsole = {};
  let store;

  function setup(characterTestStateOverrides) {
    store = mockStore({
      characterTestReducer: {
        bins: prepareBins([1, 0, NaN, NaN]),
        state: 'TESTING',
        currentSectionIndex: 0,
        currentCardIndex: 2,
        ...characterTestStateOverrides
      }
    });
  }

  beforeEach(() => {
    setup();
    oldConsole.error = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    fetchMock.restore();
    console.error = oldConsole.error;
  });

  it('loads character samples', () => {
    fetchMock.getOnce('http://example.com/characters/sample', {
      body: { mockData: true },
      headers: { 'Content-type': 'application/json' }
    });

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

    return store.dispatch(loadSamples('http://example.com/characters/sample'))
      .then(() => {
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith(
          'Could not fetch samples',
          new Error('Response was not OK')
        );
        expect(store.getActions()).toEqual([
          { type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_START },
          {
            type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_FAIL,
            error: new Error('Response was not OK')
          }
        ]);
      });
  });

  describe('marking', () => {
    it('marks the current character unknown', () => {
      store.dispatch(markCurrentUnknown());
      expect(store.getActions()).toEqual([
        { type: actionTypes.TEST_CARD_MARK_UNKNOWN },
        { type: actionTypes.TEST_CARD_DISCARD }
      ]);
    });

    it('marks the current character known', () => {
      store.dispatch(markCurrentKnown());
      expect(store.getActions()).toEqual([
        { type: actionTypes.TEST_CARD_MARK_KNOWN },
        { type: actionTypes.TEST_CARD_DISCARD }
      ]);
    });

    it('un-does the previous marking', () => {
      store.dispatch(undoDiscard());
      expect(store.getActions()).toEqual([
        { type: actionTypes.TEST_CARD_MARK_CLEAR },
        { type: actionTypes.TEST_CARD_DISCARD_UNDO }
      ]);
    });
  });

  describe('submitting', () => {
    beforeEach(() => {
      setup({
        state: 'COMPLETE',
        bins: prepareBins([1, 0, 1, 1, 0]),
        currentSectionIndex: 0,
        currentCardIndex: 0
      });
    });

    function shallowEqual(a, b) {
      const aKeys = Object.keys(a).sort();
      const bKeys = Object.keys(b).sort();
      if (aKeys.toString() !== bKeys.toString()) {
        return false;
      }
      return aKeys.find(key => a[key] !== b[key]) === undefined;
    }

    function matchTestSubmit(expectedUrl, expectedTestData) {
      return (url, { body }) => {
        if (url !== expectedUrl) {
          return false;
        }
        const { testData } = JSON.parse(body);
        if (!Array.isArray(testData) || testData.length !== expectedTestData.length) {
          return false;
        }
        return !testData.find((element, i) => !shallowEqual(element, expectedTestData[i]));
      };
    }

    it('sends the data to the server', () => {
      fetchMock.postOnce('http://localhost:3001/submitTest', {
        body: {
          curveParams: {
            amplitude: 100,
            decayStartX: 600,
            decayPeriod: 250,
          }
        },
        headers: { 'Content-type': 'application/json' }
      });

      return store.dispatch(markCurrentKnown())
        .then(() => {
          expect(fetchMock.calls()).toHaveLength(1);
          const [, { body: bodyJson, headers }] = fetchMock.lastCall();
          const body = JSON.parse(bodyJson);

          expect(headers).toBeDefined();
          expect(headers).toMatchObject({ 'Content-type': 'application/json' });
          expect(body).toEqual({
            testData: [
              { isTested: true, knownPercent: 60, range: [0, 5] }
            ]
          });

          expect(store.getActions()).toEqual([
            { type: actionTypes.TEST_CARD_MARK_KNOWN },
            { type: actionTypes.TEST_CARD_DISCARD },
            { type: actionTypes.TEST_RESULTS_SUBMIT_START },
            {
              type: actionTypes.TEST_RESULTS_SUBMIT_SUCCESS,
              curveParams: {
                amplitude: 100,
                decayStartX: 600,
                decayPeriod: 250
              }
            }
          ]);
        });
    });

    it('handles a server error', () => {
      fetchMock.postOnce('http://localhost:3001/submitTest', 500);

      return store.dispatch(markCurrentKnown())
        .then(() => {
          expect(store.getActions()).toEqual([
            { type: actionTypes.TEST_CARD_MARK_KNOWN },
            { type: actionTypes.TEST_CARD_DISCARD },
            { type: actionTypes.TEST_RESULTS_SUBMIT_START },
            {
              type: actionTypes.TEST_RESULTS_SUBMIT_FAIL,
              error: new Error('Response was not OK')
            }
          ]);
        });
    });
  });
});

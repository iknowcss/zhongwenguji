import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock';
import prepareBins from './prepareBins.testutil';
import { characterSetEnum } from './characterTestReducer';
import * as analytics from '../analytics/analyticsAction';
import {
  actionTypes,
  loadSamples,
  markCurrentUnknown,
  markCurrentKnown,
  undoDiscard,
  showTestResults,
  reviewMissed
} from './characterTestActions';
import getConfig from '../getConfig';

const mockStore = configureMockStore([thunk]);

jest.mock('../analytics/analyticsAction');

describe('characterTestActions', () => {
  const { getCharacterSampleUrl, submitTestUrl } = getConfig();
  const oldConsole = {};
  let store;
  let dateNowMock;

  function setup(characterTestStateOverrides) {
    store = mockStore({
      characterTestReducer: {
        bins: prepareBins([1, 0, NaN, NaN]),
        state: 'TESTING',
        currentSectionIndex: 0,
        currentCardIndex: 2,
        characterSet: characterSetEnum.SIMPLIFIED,
        ...characterTestStateOverrides
      }
    });
  }

  beforeEach(() => {
    setup();
    oldConsole.error = console.error;
    console.error = jest.fn();
    dateNowMock = jest.spyOn(Date, 'now').mockImplementation(() => 0);
  });

  afterEach(() => {
    fetchMock.restore();
    console.error = oldConsole.error;
    dateNowMock.mockRestore();
  });

  it('loads character samples', async () => {
    fetchMock.getOnce(getCharacterSampleUrl, {
      body: { mockData: true },
      headers: { 'Content-type': 'application/json' }
    });

    await store.dispatch(loadSamples(getCharacterSampleUrl));
    expect(store.getActions()).toEqual([
      { type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_START },
      {
        type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_SUCCESS,
        sampleData: { mockData: true }
      }
    ]);
  });

  it('handles character sample load failure', () => {
    fetchMock.getOnce(getCharacterSampleUrl, 500);

    return store.dispatch(loadSamples(getCharacterSampleUrl))
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
    beforeEach(async () => {
      fetchMock.getOnce(getCharacterSampleUrl, {
        body: { mockData: true },
        headers: { 'Content-type': 'application/json' }
      });

      await store.dispatch(loadSamples(getCharacterSampleUrl));
      store.clearActions();
    });

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

    it('fires an analytics event for the first swipe', () => {
      analytics.firstSwipe.mockClear();
      store.dispatch(markCurrentKnown());
      store.dispatch(markCurrentKnown());
      expect(analytics.firstSwipe).toHaveBeenCalledTimes(1);
      expect(analytics.firstSwipe.mock.calls[0][0]).toEqual(characterSetEnum.SIMPLIFIED);
    });
  });

  describe('submitting', () => {
    beforeEach(async () => {
      setup({
        state: 'COMPLETE',
        bins: prepareBins([1, 0, 1, 1, 0]),
        currentSectionIndex: 0,
        currentCardIndex: 0
      });

      fetchMock.getOnce(getCharacterSampleUrl, {
        body: { mockData: true },
        headers: { 'Content-type': 'application/json' }
      });

      await store.dispatch(loadSamples(getCharacterSampleUrl));
      store.clearActions();
      fetchMock.reset();
    });

    it('sends the data to the server', () => {
      const resultData = {
        samplePoints: [[125, 0]],
        curvePoints: [[0, 0], [250, 0]],
        knownEstimate: 720,
        knownEstimateUncertainty: 120
      };

      dateNowMock.mockImplementation(() => 42000);

      fetchMock.postOnce(submitTestUrl, {
        body: resultData,
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
            { type: actionTypes.TEST_RESULTS_SUBMIT_SUCCESS, resultData }
          ]);

          expect(analytics.completeTestAfterDuration).toHaveBeenCalledTimes(1);
          expect(analytics.completeTestAfterDuration.mock.calls[0][0]).toEqual(42);
          expect(analytics.receiveKnownEstimate).toHaveBeenCalledTimes(1);
          expect(analytics.receiveKnownEstimate.mock.calls[0][0]).toEqual(720);
        });
    });

    it('handles a server error', () => {
      fetchMock.postOnce(submitTestUrl, 500);

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

  describe('simple actions', () => {
    it('showTestResults', () => {
      expect(showTestResults()).toEqual({
        type: actionTypes.TEST_RESULTS_SHOW
      });
    });
  });

  describe('reviewMissed', () => {
    it('starts reviewing the missed characters', () => {
      store.dispatch(reviewMissed());
      expect(store.getActions()).toEqual([
        { type: actionTypes.REVIEW_MISSED_START }
      ]);
      expect(analytics.reviewMissed).toHaveBeenCalledTimes(1);
    });
  });
});

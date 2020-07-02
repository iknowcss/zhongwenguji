import {
  isShowDefinition,
  status as characterTestStatus,
  markedEntries,
  characterTestSeed,
  characterSet,
  binCount,
  subsetSize,
} from './characterTestReducer';
import * as analytics from '../analytics/analyticsAction';
import * as testService from './testService';

/**
 * @readonly
 * @enum
 */
export const actionTypes = {
  CHARACTER_SAMPLES_LOAD_SAMPLES_START: '@zwgj//characterSamples/loadSamples/start',
  CHARACTER_SAMPLES_LOAD_SAMPLES_SUCCESS: '@zwgj//characterSamples/loadSamples/success',
  CHARACTER_SAMPLES_LOAD_SAMPLES_FAIL: '@zwgj//characterSamples/loadSamples/fail',
  CHARACTER_SAMPLES_DEFINITION_SHOW: '@zwgj//characterSamples/definition/show',
  CHARACTER_SAMPLES_DEFINITION_HIDE: '@zwgj//characterSamples/definition/hide',
  TEST_CARD_MARK_KNOWN: '@zwgj//testCard/markKnown',
  TEST_CARD_MARK_UNKNOWN: '@zwgj//testCard/markUnknown',
  TEST_CARD_DISCARD_UNDO: '@zwgj//testCard/discardUndo',
  TEST_RESULTS_SUBMIT_START: '@zwgj//testResults/submit/start',
  TEST_RESULTS_SUBMIT_SUCCESS: '@zwgj//testResults/submit/success',
  TEST_RESULTS_SUBMIT_FAIL: '@zwgj//testResults/submit/fail',
  TEST_RESULTS_SHOW: '@zwgj//testResults/show',
  TEST_RESET: '@zwgj//test/reset',
  TEST_SET_CHARACTER_SET_SIMPLIFIED: '@zwgj//test/characterSet/setSimplified',
  TEST_SET_CHARACTER_SET_TRADITIONAL: '@zwgj//test/characterSet/setTraditional',
  REVIEW_MISSED_START: '@zwgj//reviewMissed/start'
};

let hasMarkedFirst = false;
let testStartTime;
function resetTestAnalytics() {
  hasMarkedFirst = false;
  testStartTime = Date.now();
}

function getTestDuration() {
  return Math.floor((Date.now() - testStartTime) / 1000);
}

export const loadSamples = () => (dispatch, getState) => {
  dispatch({ type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_START });
  const state = getState();
  return testService.getBinSamples({
    subsetSize: subsetSize(state),
    binCount: binCount(state),
  })
    .then((response) => {
      resetTestAnalytics();
      dispatch({
        type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_SUCCESS,
        response,
      });
    })
    .catch((error) => {
      console.error('Could not fetch samples', error);
      dispatch({
        type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_FAIL,
        error,
      });
    });
};

export const toggleDefinition = () => (dispatch, getState) => {
  if (isShowDefinition(getState())) {
    dispatch({ type: actionTypes.CHARACTER_SAMPLES_DEFINITION_HIDE });
  } else {
    dispatch({ type: actionTypes.CHARACTER_SAMPLES_DEFINITION_SHOW });
  }
};

const testSubmit = () => (dispatch, getState) => {
  const state = getState();
  analytics.completeTestAfterDuration(getTestDuration());
  const binSampleParameters = {
    seed: characterTestSeed(state),
    subsetSize: subsetSize(state),
    binCount: binCount(state),
  };

  dispatch({ type: actionTypes.TEST_RESULTS_SUBMIT_START });
  return testService.submitTest(markedEntries(state), binSampleParameters, characterSet(state))
    .then((resultData) => {
      analytics.receiveKnownEstimate(resultData.knownEstimate);
      dispatch({ type: actionTypes.TEST_RESULTS_SUBMIT_SUCCESS, resultData });
    })
    .catch((error) => {
      dispatch({ type: actionTypes.TEST_RESULTS_SUBMIT_FAIL, error });
    });
};

const discardCurrent = () => (dispatch, getState) => {
  if (characterTestStatus(getState()) === 'COMPLETE') {
    return dispatch(testSubmit());
  }
  if (!hasMarkedFirst) {
    analytics.firstSwipe(characterSet(getState()));
    hasMarkedFirst = true;
  }
  return Promise.resolve();
};

export const markCurrentUnknown = () => (dispatch) => {
  dispatch({ type: actionTypes.TEST_CARD_MARK_UNKNOWN });
  dispatch(discardCurrent());
};

export const markCurrentKnown = () => (dispatch) => {
  dispatch({ type: actionTypes.TEST_CARD_MARK_KNOWN });
  return dispatch(discardCurrent());
};

export const undoDiscard = () => (dispatch) => {
  dispatch({ type: actionTypes.TEST_CARD_DISCARD_UNDO });
};

export const resetTest = () => ({ type: actionTypes.TEST_RESET });

export const setCharacterSetSimplified = () => ({ type: actionTypes.TEST_SET_CHARACTER_SET_SIMPLIFIED });

export const setCharacterSetTraditional = () => ({ type: actionTypes.TEST_SET_CHARACTER_SET_TRADITIONAL });

export const reviewMissed = () => (dispatch) => {
  dispatch({ type: actionTypes.REVIEW_MISSED_START });
  analytics.reviewMissed();
};

export const showTestResults = () => ({ type: actionTypes.TEST_RESULTS_SHOW });

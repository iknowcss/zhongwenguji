import {
  isShowDefinition,
  status as characterTestStatus,
  scoreStatistics
} from './characterTestReducer';

const DEFAULT_CHARACTER_SAMPLE_URL = 'http://localhost:3001/';
const DEFAULT_TEST_SUBMIT_URL = 'http://localhost:3001/testSubmit';

export const actionTypes = {
  CHARACTER_SAMPLES_LOAD_SAMPLES_START: '@zwgj//characterSamples/loadSamples/start',
  CHARACTER_SAMPLES_LOAD_SAMPLES_SUCCESS: '@zwgj//characterSamples/loadSamples/success',
  CHARACTER_SAMPLES_LOAD_SAMPLES_FAIL: '@zwgj//characterSamples/loadSamples/fail',
  CHARACTER_SAMPLES_DEFINITION_SHOW: '@zwgj//characterSamples/definition/show',
  CHARACTER_SAMPLES_DEFINITION_HIDE: '@zwgj//characterSamples/definition/hide',
  TEST_CARD_MARK_KNOWN: '@zwgj//testCard/markKnown',
  TEST_CARD_MARK_UNKNOWN: '@zwgj//testCard/markUnknown',
  TEST_CARD_MARK_CLEAR: '@zwgj//testCard/markClear',
  TEST_CARD_DISCARD_UNDO: '@zwgj//testCard/discardUndo',
  TEST_CARD_DISCARD: '@zwgj//testCard/discard',
  TEST_RESULTS_SUBMIT_START: '@zwgj//testResults/submit/start',
  TEST_RESULTS_SUBMIT_SUCCESS: '@zwgj//testResults/submit/success',
  TEST_RESULTS_SUBMIT_FAIL: '@zwgj//testResults/submit/fail'
};

function extractJson(response) {
  if (!response.ok) {
    return Promise.reject(new Error('Response was not OK'));
  }
  return response.json();
}

export const loadSamples = (url = DEFAULT_CHARACTER_SAMPLE_URL) => (dispatch) => {
  dispatch({ type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_START });
  return fetch(url)
    .then(extractJson)
    .then((data) => {
      dispatch({
        type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_SUCCESS,
        ...data
      });
    })
    .catch((error) => {
      console.error('Could not fetch samples', error);
      dispatch({
        type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_FAIL,
        error
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

const testSubmit = (url = DEFAULT_TEST_SUBMIT_URL) => (dispatch, getState) => {
  dispatch({ type: actionTypes.TEST_RESULTS_SUBMIT_START });

  const body = {
    testData: scoreStatistics(getState()).sectionStats
  };

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-type': 'application/json' }
  })
    .then(extractJson)
    .then((data) => {
      dispatch({ type: actionTypes.TEST_RESULTS_SUBMIT_SUCCESS, data });
    })
    .catch((error) => {
      dispatch({ type: actionTypes.TEST_RESULTS_SUBMIT_FAIL, error });
    });
};

const discardCurrent = () => (dispatch, getState) => {
  dispatch({ type: actionTypes.TEST_CARD_DISCARD });
  if (characterTestStatus(getState()) === 'COMPLETE') {
    return dispatch(testSubmit());
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
  dispatch({ type: actionTypes.TEST_CARD_MARK_CLEAR });
  dispatch({ type: actionTypes.TEST_CARD_DISCARD_UNDO });
};

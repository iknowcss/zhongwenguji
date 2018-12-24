import { isShowDefinition } from './characterTestReducer';

const DEFAULT_CHARACTER_SAMPLE_URL = 'http://localhost:3001/';

export const actionTypes = {
  CHARACTER_SAMPLES_LOAD_SAMPLES_START: '@zwgj//characterSamples/loadSamples/start',
  CHARACTER_SAMPLES_LOAD_SAMPLES_SUCCESS: '@zwgj//characterSamples/loadSamples/success',
  CHARACTER_SAMPLES_LOAD_SAMPLES_FAIL: '@zwgj//characterSamples/loadSamples/fail',
  CHARACTER_SAMPLES_DEFINITION_SHOW: '@zwgj//characterSamples/definition/show',
  CHARACTER_SAMPLES_DEFINITION_HIDE: '@zwgj//characterSamples/definition/hide',
  TEST_CARD_MARK_KNOWN: '@zwgj//testCard/markKnown',
  TEST_CARD_MARK_UNKNOWN: '@zwgj//testCard/markUnknown',
  TEST_CARD_MARK_UNDO: '@zwgj//testCard/markUndo'
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
      // console.error('Could not fetch samples', error);
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

export const markCurrentKnown = () => ({
  type: actionTypes.TEST_CARD_MARK_KNOWN
});

export const markCurrentUnknown = () => ({
  type: actionTypes.TEST_CARD_MARK_UNKNOWN
});

export const undoLastMark = () => ({
  type: actionTypes.TEST_CARD_MARK_UNDO
});

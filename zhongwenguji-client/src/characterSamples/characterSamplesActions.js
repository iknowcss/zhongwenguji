export const actionTypes = {
  CHARACTER_SAMPLES_LOAD_SAMPLES_START: '@zwgj//characterSamples/loadSamples/start',
  CHARACTER_SAMPLES_LOAD_SAMPLES_SUCCESS: '@zwgj//characterSamples/loadSamples/success',
  CHARACTER_SAMPLES_LOAD_SAMPLES_FAIL: '@zwgj//characterSamples/loadSamples/fail'
};

function extractJson(response) {
  if (!response.ok) {
    return new Promise.reject(new Error('Response was not OK'));
  }
  return response.json();
}

export const loadSamples = () => (dispatch) => {
  dispatch({ type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_START });
  return fetch('http://localhost:3001/')
    .then(extractJson)
    .then((data) => {
      dispatch({
        type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_SUCCESS,
        ...data
      });
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_FAIL,
        error
      });
    });
};

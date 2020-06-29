import getConfig from '../getConfig';

function parseSuccessfulJsonResponse(response) {
  if (!response.ok) {
    return Promise.reject(new Error('Response was not OK'));
  }
  return response.json();
}

/**
 * @typedef {BinSampleParameters} ExtendedBinSampleParameters
 * @property {number[]} [selectionBins] - the list of bin indices to select samples from. Defaults to return from all
 *    bins.
 * @property {number} [subsetSkip] - the number subsets of entries to skip over before starting
 *    selection; this allows the client to get the next lot of character entries from the bin which have not already
 *    been sampled. Defaults to 0.
 */

/**
 *
 * @param {ExtendedBinSampleParameters} binSampleParameters
 */
export function getBinSamples(binSampleParameters) {
  const url = getConfig().getCharacterSampleUrl;
  const queryString = Object.keys(binSampleParameters)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(binSampleParameters[key])}`)
    .join('&');
  return fetch(`${url}?${queryString}`, {
    method: 'GET',
    headers: { 'Content-type': 'application/json' }
  })
    .then(parseSuccessfulJsonResponse);
}

/**
 * Takes the marked entries from the user's test and the random seed from the original response
 * and submits them to the server for analysis.
 *
 * @param {MarkedFrequencyEntry[]} markedEntries - Marked entry data.
 * @param {BinSampleParameters} binSampleParameters -
 * @returns {Promise<TestResult>}
 * @throws {Error} - Throws a generic error if there was an issue submitting or processing the test results.
 */
export function submitTest(markedEntries, binSampleParameters) {
  /**
   * @type {SubmitTestHandlerRequestBody}
   */
  const body = {
    binSampleParameters,
    markedEntries,
  };
  return fetch(getConfig().submitTestUrl, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-type': 'application/json' }
  })
    .then(parseSuccessfulJsonResponse);
}

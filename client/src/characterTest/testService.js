import getConfig from '../getConfig';

/**
 * Takes the marked entries from the user's test and the random seed from the original response
 * and submits them to the server for analysis.
 *
 * @param {MarkedFrequencyEntry[]} markedEntries - Marked entry data.
 * @param {number} seed - The random from the original response seed.
 * @returns {Promise<TestResult>}
 * @throws {Error} - Throws a generic error if there was an issue submitting or processing the test results.
 */
export function submitTest(markedEntries, seed) {
  /**
   * @type {SubmitTestHandlerRequestBody}
   */
  const body = {
    binSampleParameters: { binCount: 40, subsetSize: 5, seed },
    markedEntries,
  };
  return fetch(getConfig().submitTestUrl, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-type': 'application/json' }
  })
    .then((response) => {
      if (!response.ok) {
        return Promise.reject(new Error('Response was not OK'));
      }
      return response.json();
    });
}

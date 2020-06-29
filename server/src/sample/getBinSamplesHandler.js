const allCharacters = require('../../all-characters.json').characters;
const getBinSamples = require('./getBinSamples');

const DEFAULT_BIN_COUNT = 40;
const DEFAULT_SUBSET_SIZE = 5;
const totalCharacterCount = allCharacters[allCharacters.length - 1].i;

/**
 * Parses a positive integer out of the provided string. Returns {undefined} if the integer is negative, if it is
 * larger than {Number.MAX_SAFE_INTEGER}, or if there is a parse error.
 *
 * @param {string|number} value - The string to parse the integer from
 * @returns {undefined|number}
 */
function extractPositiveInt(value) {
  try {
    const parsed = parseInt(value, 10);
    if (parsed >= 0 && parsed <= Number.MAX_SAFE_INTEGER) {
      return parsed;
    }
  } catch (err) { }
  return undefined;
}

/**
 * Parses a list of positive integers from a comma-separated string of integers. If there is an error parsing any of the
 * elements in the list, that element is not included in the array.
 *
 * @param {string} value - the comma-separated list of integers
 * @returns {number[]}
 */
function extractPositiveIntList(value) {
  return (value || '')
    .split(',')
    .map(extractPositiveInt)
    .filter(n => n <= Number.MAX_SAFE_INTEGER);
}

/**
 * @typedef {BinSampleParameters} URLBinSampleParameters
 * @property {string} [selectionBins] - the comma-separated list of bin indices to select samples from.
 *    Defaults to return from all bins.
 * @property {string} [subsetSkip] - the number subsets of entries to skip over before starting
 *    selection; this allows the client to get the next lot of character entries from the bin which have not already
 *    been sampled. Defaults to "0".
 */

/**
 * Sends the client a random sample of Chinese character entries separated into frequency bins. The client specifies
 * parameters for the selection process in the HTTP query.
 *
 * @param {ExpressServerRequest} req - the Express request object.
 * @param {URLBinSampleParameters} req.query - a key-value map of the parsed HTTP query string.
 * @param {ExpressServerResponse} res - the Express response object.
 */
module.exports = (req, res) => {
  const { query } = req;
  const binCount = extractPositiveInt(query.binCount) || DEFAULT_BIN_COUNT;
  const subsetSize = extractPositiveInt(query.subsetSize) || DEFAULT_SUBSET_SIZE;
  let selectionBins = extractPositiveIntList(query.selectionBins);
  if (selectionBins.length === 0) {
    selectionBins = Array.from({ length: binCount }, (n, i) => i);
  }
  const subsetSkip = extractPositiveInt(query.subsetSkip) || 0;
  const seed = extractPositiveInt(query.seed) || Math.floor(Math.random() * 99999) + 1;
  const binSampleParameters = { binCount, subsetSize, seed };

  /**
   * @type {GetBinSamplesResponse}
   */
  const response = {
    binCount,
    subsetSize,
    seed,
    totalCharacterCount,
    binSamples: getBinSamples(
      allCharacters,
      binSampleParameters,
      selectionBins,
      subsetSkip,
    ),
  };
  res.json(response);
};

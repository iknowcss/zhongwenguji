const allCharacters = require('../all-characters.json').characters;
const getBinSamples = require('./getBinSamples');

const DEFAULT_BIN_COUNT = 40;
const DEFAULT_SUBSET_SIZE = 5;

/**
 * Parses a positive integer out of the provided string. Returns {undefined} if the integer is negative, if it is
 * larger than {Number.MAX_SAFE_INTEGER}, or if there is a parse error.
 *
 * @param {string} value - The string to parse the integer from
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
 * Sends the client a random sample of Chinese character entries separated into frequency bins. The client specifies
 * parameters for the selection process in the HTTP query.
 *
 * @param {ExpressServerRequest} req - the Express request object.
 * @param {string} req.query - a key-value map of the parsed HTTP query string.
 * @param {string} [req.query.binCount] - the number of frequency bins to slice the full character set into.
 *    Defaults to "40".
 * @param {string} [req.query.subsetSize] - the number of character entries to sample from each bin. Defaults to "5".
 * @param {string} [req.query.selectionBins] - the comma-separated list of bin indices to select samples from.
 *    Defaults to return from all bins.
 * @param {string} [req.query.subsetSkip] - the number subsets of entries to skip over before starting selection;
 *    this allows the client to get the next lot of character entries from the bin which have not already been sampled.
 *    Defaults to "0".
 * @param {string} [req.query.seed] - the randomization seed used for selecting the entries to go into the sample; this
 *    should be specified by the client on the 2nd request onward so that the client may get the the next lot of
 *    character entries from the bin which have not already been sampled. Defaults to a random number
 *    between 0 and 100,000
 * @param {ExpressServerResponse} res - the Express response object.
 */
module.exports = (req, res) => {
  const { query } = req;
  const binCount = extractPositiveInt(query.binCount) || DEFAULT_BIN_COUNT;
  const subsetSize = extractPositiveInt(query.subsetSize) || DEFAULT_SUBSET_SIZE;
  let selectionBins = extractPositiveIntList(query.selectionBins);
  if (selectionBins.length === 0) {
    selectionBins = Array.from({
      length: Math.ceil(allCharacters.length / binCount),
    }, (n, i) => i);
  }
  const subsetSkip = extractPositiveInt(query.subsetSkip) || 0;
  const seed = extractPositiveInt(query.seed) || Math.floor(Math.random() * 99999) + 1;

  res.json({
    binCount,
    subsetSize,
    seed,
    characters: getBinSamples(
      allCharacters,
      binCount,
      subsetSize,
      selectionBins,
      subsetSkip,
      seed,
    ),
  });
};

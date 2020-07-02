const fitModelToData = require('./fitModelToData');

module.exports.fitModelToMarkings = fitModelToMarkings;

/**
 * @typedef GraphData
 * @property {{x: number, y: number}[]} samplePoints
 * @property {{x: number, y: number}[]} modelFitPoints
 *
 */

/**
 * @typedef ModelFitResult
 * @property {number} knownEstimate
 * @property {number} knownEstimateError
 * @property {GraphData} graphData
 */

/**
 * Takes the character markings for the provided set of bins, logs them to the database and returns an estimate, error,
 * and graph data. The error precision is limited to one and rounded where necessary. The estimation precision is
 * rounded to the order of magnitude of the error.
 *
 * @param {FrequencyEntry[]} entries - The set of {CharacterEntry}s to sample from sorted ascending by Character
 *    identifier.
 * @param {BinSampleParameters} binSampleParameters - See {@link BinSampleParameters}.
 * @param {MarkedFrequencyEntry[]} markedEntries
 * @returns {ModelFitResult}
 */
function fitModelToMarkings(entries, binSampleParameters, markedEntries) {
  // Iterate over the marked entries and collect the results into the same bins the entries were sampled from.
  const { binCount } = binSampleParameters;
  const totalCharacterCount = entries[entries.length - 1].i;
  const binSize = Math.ceil(totalCharacterCount / binCount);
  const binResults = {};
  markedEntries.forEach((entry) => {
    const binIndex = Math.floor((entry.i - 1) / binSize);
    binResults[binIndex] = binResults[binIndex] || [];
    binResults[binIndex].push(entry.known ? 1 : 0);
  });

  const binIndexMidpoint = buildBinEntryMidpointCalculator(binSize);
  // Each x-value is the midpoint of the entry frequencies for the first hypothetical entry in the bin and the last
  // hypothetical entry in the bin. For example, when the binSize is 4, the 0th bin would have hypothetical entries
  // [1, 2, 3, 4]. The of this bin would be 2.5.
  const sampleXValues = Object.keys(binResults).map(binIndexMidpoint);

  // Each y-value is the ratio of entries marked correct.
  const sampleYValues = Object.keys(binResults).map(binIndex => {
    const binEntryScore = binResults[binIndex];
    return binEntryScore.reduce(sum) / binEntryScore.length;
  });

  // Fit a cosine decay function to the sample data.
  const curveParameters = fitModelToData(parameterizedCosineDecay, [1, 1, 1000], sampleXValues, sampleYValues);
  const modelFunction = buildCosineDecay(curveParameters);
  const modelXValues = Array.from({ length: binCount + 1 }, (n, binIndex) => binIndex * binSize);
  const modelYValues = modelXValues.map(modelFunction);

  // Zip x and y arrays for sample and cosine decay curve points to coordinate pairs for graphing.
  const graphData = {
    samplePoints: sampleXValues.map((x, i) => ({ x, y: 100 * sampleYValues[i] })),
    modelFitPoints: modelXValues.map((x, i) => ({ x, y: 100 * modelYValues[i] })),
  };

  // Calculate the area under the curve.
  const dx = binSize / 100;
  const curveArea = Array
    .from(
      { length: Math.floor(totalCharacterCount / dx) },
      (_, infIndex) => modelFunction(dx * infIndex) * dx,
    )
    .reduce(sum);
  const curveAreaError = calculateUncertainty(modelFunction, totalCharacterCount, sampleXValues, sampleYValues);

  // Significant digits
  const minUncertainty = toPrecision(1, curveArea * 0.05);
  const knownEstimateError = Math.max(minUncertainty, Number.parseFloat((curveAreaError).toPrecision(1)));
  const significantDigits = Math.floor(log10(curveArea)) - Math.floor(log10(knownEstimateError)) + 1;
  const knownEstimate = toPrecision(significantDigits, curveArea);

  return { knownEstimate, knownEstimateError, graphData };
}

/**
 * Calculates the total uncertainty of the the estimate of all known characters derived from the model function.
 *
 * @private
 * @param {function(number): number} modelFunction - The fitted model function.given by the
 * @param {number} totalEntryCount - Number of entries available to sample for running the test.
 * @param {number[]} sampleXValues - The independent variable values used for the model fit.
 * @param {number[]} sampleYValues - The dependent variable values used for the model fit.
 */
function calculateUncertainty(modelFunction, totalEntryCount, sampleXValues, sampleYValues) {
  const normalizedErrors = sampleXValues.map((sampleXValue, i) => Math.abs(sampleYValues[i] - modelFunction(sampleXValue)));
  const normalizedErrorMean = normalizedErrors.reduce(sum) / normalizedErrors.length;

  // Calculate error area
  const dx = 10;
  return Array
    .from(
      { length: Math.floor(totalEntryCount / dx) },
      (_, infIndex) => {
        const modelXValue = dx * infIndex;
        const minBound = modelFunction(modelXValue) - normalizedErrorMean;
        return (minBound < 0 ? normalizedErrorMean + minBound : normalizedErrorMean) * dx;
      },
    )
    .reduce(sum);
}

/**
 * Returns a function which assumes the specified bin size. That function calculates the hypothetical entry id of the
 * entry at the middle of the bin with the given index. If the bin size is odd, the hypothetical entry id will end in
 * {.5}.
 *
 * @private
 * @param binSize - The bin size to
 * @returns {function(number|string): number}
 */
const buildBinEntryMidpointCalculator = binSize => (binIndex) => {
  const bi = parseInt(binIndex, 10);
  const firstEntryIndex = binSize * bi + 1;
  const lastEntryIndex = binSize * bi + binSize;
  return (firstEntryIndex + lastEntryIndex) / 2;
};

/**
 * Cosine decay function with adjustable parameters for {amplitude}, {decayStart}, and {decayPeriod}. For inputs from
 * {-Infinity} to {decayStart}, the output is equal to {amplitude} (constant). From {decayStart} to
 * {decayStart + decayPeriod}, the output decays from {amplitude} to {0} following a cosine from {0} to {π}. For inputs
 * greater than {decayStart + decayPeriod}, the output is {0}. 
 *
 * @private
 * @param {number[]} modelParams - A tuple of parameters for the function.
 * @param {number} modelParams[0] - {amplitude}: the maximum output of the function.
 * @param {number} modelParams[1] - {decayStart}: The input value after which the decay starts.
 * @param {number} modelParams[2] - {decayPeriod}: The width of the domain after {decayStart} over which the output 
 *    decays to {0}.
 * @param {number} input - The function input.
 * @returns {number}
 */
function parameterizedCosineDecay(modelParams, input) {
  const [amplitude, decayStartX, decayPeriod] = modelParams;
  if (input < decayStartX) {
    return amplitude;
  } else if (input >= decayStartX + decayPeriod) {
    return 0;
  }
  return amplitude / 2 * (1 + Math.cos((input - decayStartX) * Math.PI / decayPeriod));
}

/**
 * Creates a cosine decay function with fixed parameters. (see {@link parameterizedCosineDecay}).
 * 
 * @private
 * @param {number[]} modelParams
 * @returns {function(number): number}
 */
const buildCosineDecay = (modelParams) => parameterizedCosineDecay.bind(null, modelParams);

/**
 * Sum two numbers together. If a number is {undefined}, treat it as {0}. Useful while `reduce()`ing lists.
 *
 * @private
 * @param {number|undefined} a
 * @param {number|undefined} b
 * @returns {number}
 */
const sum = (a, b) => (a || 0) + (b || 0);

/**
 * Convenience function for base-10 log.
 *
 * @private
 * @param {number} x
 * @returns {number}
 */
const log10 = x => Math.log(x) / Math.log(10);

/**
 * Reduces the precision of a {number} to the specified number of digits.
 *
 * @private
 * @param {number} precision - The number to adjust the precision of.
 * @param {number} n - The number of digits to limit the precision to.
 * @returns {number}
 */
const toPrecision = (precision, n) => Number.parseFloat(n.toPrecision(precision));

const fitModelToData = require('./fitModelToData');

/**
 * @typedef GraphData
 * @property {{x: number, y: number}[]} samplePoints
 * @property {{x: number, y: number}[]} modelFitPoints - Terminated after 2 instances of y = 0.
 *
 */

/**
 * @typedef ModelFitResult
 * @property {number} knownEstimate
 * @property {number} knownEstimateError
 * @property {GraphData} graphData
 */

/**
 * Takes the character markings for the provided set of bins, logs them to the database and
 * returns an estimate, error, and graph data
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

  const binIndexMidpoint = binIndexMidpointCalculator(binSize);
  // Each x-value is the midpoint of the entry frequencies for the first hypothetical entry in the bin and the last
  // hypothetical entry in the bin. For example, when the binSize is 4, the 0th bin would have hypothetical entries
  // [1, 2, 3, 4]. The of this bin would be 2.5.
  const sampleXValues = Object.keys(binResults).map(binIndexMidpoint);

  // Each y-value is the ratio of entries marked correct.
  const sampleYValues = Object.keys(binResults).map(binIndex => {
    const binEntryScore = binResults[binIndex];
    return binEntryScore.reduce(sum) / binEntryScore.length;
  });

  // Fit the model to the sample data.
  const curveParameters = fitModelToData(model, [1, 1, 1000], sampleXValues, sampleYValues);
  const modelFunction = buildModelFunction(curveParameters);
  const modelXValues = Array.from({ length: binCount + 1 }, (n, binIndex) => binIndex * binSize);
  const modelYValues = modelXValues.map(modelFunction);

  // Zip x and y arrays for sample and model curve points to coordinate pairs for graphing.
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
  const curveAreaError = calculateUncertainty(modelFunction, binSize, totalCharacterCount, sampleXValues, sampleYValues);

  // Significant digits
  const minUncertanty = toPrecision(1, curveArea * 0.05);
  const knownEstimateError = Math.max(minUncertanty, Number.parseFloat((curveAreaError).toPrecision(1)));
  const significantDigits = Math.floor(log10(curveArea)) - Math.floor(log10(knownEstimateError)) + 1;
  const knownEstimate = toPrecision(significantDigits, curveArea);

  return { knownEstimate, knownEstimateError, graphData };
}

/**
 * @param {function(number): number} modelFunction
 * @param {number} binSize
 * @param {number} totalCharacterCount
 * @param {number[]} sampleXValues
 * @param {number[]} sampleYValues
 */
function calculateUncertainty(modelFunction, binSize, totalCharacterCount, sampleXValues, sampleYValues) {
  const normalizedErrors = sampleXValues.map((sampleXValue, i) => Math.abs(sampleYValues[i] - modelFunction(sampleXValue)));
  const normalizedErrorMean = normalizedErrors.reduce(sum) / normalizedErrors.length;

  // Calculate error area
  const dx = binSize / 100;
  return Array
    .from(
      { length: Math.floor(totalCharacterCount / dx) },
      (_, infIndex) => {
        const modelXValue = dx * infIndex;
        const minBound = modelFunction(modelXValue) - normalizedErrorMean;
        return (minBound < 0 ? normalizedErrorMean + minBound : normalizedErrorMean) * dx;
      },
    )
    .reduce(sum);
}

const binIndexMidpointCalculator = binSize => (binIndex) => {
  const bi = parseInt(binIndex, 10);
  const firstEntryIndex = binSize * bi + 1;
  const lastEntryIndex = binSize * bi + binSize;
  return (firstEntryIndex + lastEntryIndex) / 2;
};

/**
 * @param {number|undefined} a
 * @param {number|undefined} b
 * @returns {number}
 */
const sum = (a, b) => (a || 0) + (b || 0);

const log10 = x => Math.log(x) / Math.log(10);

const toPrecision = (precision, n) => Number.parseFloat(n.toPrecision(precision));

module.exports.fitModelToMarkings = fitModelToMarkings;

/// - Old Stuff --------------------------------------------------------------------------------------------------------

function model([amplitude, decayStartX, decayPeriod], xi) {
  if (xi < decayStartX) {
    return amplitude;
  } else if (xi >= decayStartX + decayPeriod) {
    return 0;
  }
  return amplitude / 2 * (1 + Math.cos((xi - decayStartX) * Math.PI / decayPeriod));
}

const buildModelFunction = ([amplitude, decayStartX, decayPeriod]) => (xi) => {
  if (xi < decayStartX) {
    return amplitude;
  } else if (xi >= decayStartX + decayPeriod) {
    return 0;
  }
  return amplitude / 2 * (1 + Math.cos((xi - decayStartX) * Math.PI / decayPeriod));
};


function rangeMidpoint([a, b]) {
  return (a + b) / 2;
}

function getCurveParameters(testData) {
  const xValues = [];
  const yValues = [];
  testData.filter(({ isTested }) => isTested).forEach((section) => {
    try {
      xValues.push(rangeMidpoint(section.range));
      yValues.push(section.knownPercent || 0);
    } catch (error) {
      console.warn('Failed to calculate coordinates from section', { section, error });
    }
  });

  const [amplitude, decayStartX, decayPeriod] = fitModelToData(model, [100, 1, 1000], xValues, yValues);
  return { amplitude, decayStartX, decayPeriod };
}

module.exports.rangeMidpoint = rangeMidpoint;
module.exports.getCurveParameters = getCurveParameters;
module.exports.buildCurve = buildModelFunction;

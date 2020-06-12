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
  const xValues = Object.keys(binResults).map(binIndexMidpoint);

  // Each y-value is the percentage of entries marked correct. Ranges from 0 to 100.
  const yValues = Object.keys(binResults).map((binIndex) => {
    const scores = binResults[binIndex];
    return Math.round(100 * scores.reduce(sum) / scores.length);
  });

  // Fit the model to the data.
  const curveParameters = fitModelToData(model, [100, 1, 1000], xValues, yValues);
  const curve = buildCurve(curveParameters);
  const modelXValues = Array.from({ length: binCount }, (n, binIndex) => binIndexMidpoint(binIndex));
  const modelYValues = modelXValues.map(curve);

  // Map the x,y values to coordinates to graph
  let modelZeroCount = 0;
  const graphData = {
    samplePoints: xValues.map((x, i) => ({ x, y: yValues[i] })),
    modelFitPoints: modelXValues.map((x, i) => ({ x, y: modelYValues[i] })).filter(({ y }) => {
      if (modelZeroCount >= 2) return false;
      if (y <= 0) modelZeroCount++;
      return true;
    }),
  };

  // Calculate the area under the curve.
  const curveArea = modelYValues.map(percentKnown => binSize * percentKnown / 100).reduce(sum);

  return {
    knownEstimate: Math.round(curveArea),
    knownEstimateError: 0,
    graphData,
  };
}

const binIndexMidpointCalculator = binSize => (binIndex) => {
  const bi = parseInt(binIndex, 10);
  const firstEntryIndex = binSize * bi + 1;
  const lastEntryIndex = binSize * bi + binSize;
  return (firstEntryIndex + lastEntryIndex) / 2;
};

const sum = (a, b) => (a || 0) + (b || 0);

function model([amplitude, decayStartX, decayPeriod], xi) {
  if (xi < decayStartX) {
    return amplitude;
  } else if (xi >= decayStartX + decayPeriod) {
    return 0;
  }
  return amplitude / 2 * (1 + Math.cos((xi - decayStartX) * Math.PI / decayPeriod));
}

const buildCurve = ([amplitude, decayStartX, decayPeriod]) => (xi) => {
  if (xi < decayStartX) {
    return amplitude;
  } else if (xi >= decayStartX + decayPeriod) {
    return 0;
  }
  return amplitude / 2 * (1 + Math.cos((xi - decayStartX) * Math.PI / decayPeriod));
};

module.exports.fitModelToMarkings = fitModelToMarkings;



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
module.exports.buildCurve = buildCurve;

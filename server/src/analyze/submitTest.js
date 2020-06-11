const fitModelToData = require('./fitModelToData');

/**
 * @typedef GraphData
 * @property {{x: number, y: number}[]} samplePoints
 * @property {{x: number, y: number}[]} modelFitPoints - Terminated when y = 0
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
 * @param {CharacterEntry[]} entries - The set of {CharacterEntry}s to sample from sorted ascending by Character
 *    identifier.
 * @param {BinSampleParameters} binSampleParameters - See {@link BinSampleParameters}.
 * @param {CharacterMarking[]} characterMarkings
 * @returns {ModelFitResult}
 */
function newThing(entries, binSampleParameters, characterMarkings) {
  const totalCharacterCount = entries[entries.length - 1].i;
  // Loop over each marking and:
  //
  //   1. Determine the bin it belongs in
  //   2. Update the score for that bin (based on known or unknown)
  //   3.
}

function model([amplitude, decayStartX, decayPeriod], xi) {
  if (xi < decayStartX) {
    return amplitude;
  } else if (xi >= decayStartX + decayPeriod) {
    return 0;
  }
  return amplitude / 2 * (1 + Math.cos((xi - decayStartX) * Math.PI / decayPeriod));
}

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

function buildCurve({ amplitude, decayStartX, decayPeriod }) {
  return function (xi) {
    if (xi < decayStartX) {
      return amplitude;
    } else if (xi >= decayStartX + decayPeriod) {
      return 0;
    }
    return amplitude / 2 * (1 + Math.cos((xi - decayStartX) * Math.PI / decayPeriod));
  };
}

module.exports.rangeMidpoint = rangeMidpoint;
module.exports.getCurveParameters = getCurveParameters;
module.exports.buildCurve = buildCurve;

const fitModelToData = require('./fitModelToData');

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

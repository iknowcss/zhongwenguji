const { Router } = require('express');
const bodyParser = require('body-parser');
const fminsearch = require('./analyze/fminsearch');

function model([amplitude, decayStartX, decayPeriod], xi) {
  if (xi < decayStartX) {
    return amplitude;
  } else if (xi >= decayStartX + decayPeriod) {
    return 0;
  }
  return amplitude / 2 * (1 + Math.cos((xi - decayStartX) * Math.PI / decayPeriod));
}

const fun = (x, P) => x.map(model.bind(null, P));

function rangeMidpoint([a, b]) {
  return (a + b) / 2;
}

function getCurveParameters(testData) {
  const x = [];
  const y = [];

  testData.forEach((section) => {
    if (!section.isTested) {
      return;
    }
    try {
      const xi = rangeMidpoint(section.range);
      const yi = section.knownPercent || 0;
      x.push(xi);
      y.push(yi);
    } catch (error) {
      console.warn('Failed to calculate coordinates from section', { section, error });
    }
  });

  const [amplitude, decayStartX, decayPeriod] = fminsearch(fun, [100, 1, 1000], x, y);
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

module.exports = () => {
  const router = Router();
  router.use(bodyParser.json());
  router.use('/', (req, res) => {
    const { testData } = req.body;
    try {
      // Extract
      const samplePoints = testData
        .filter(({ isTested }) => isTested)
        .map(({ range, knownPercent }) => [rangeMidpoint(range), knownPercent]);

      // Analyze
      const curveParams = getCurveParameters(testData);
      const curve = buildCurve(curveParams);

      // Estimate and measure error
      let curveArea = 0;
      let errors = [];
      testData.forEach(({ range, isTested, knownPercent }) => {
        const rangeCharCount = range[1] - range[0];
        const estimatedKnownPercent = curve(rangeMidpoint(range));
        if (isTested) {
          errors.push(rangeCharCount * (knownPercent - estimatedKnownPercent) / 100);
        }
        curveArea += rangeCharCount * estimatedKnownPercent / 100;
      });

      // Analyze error
      const errorMean = errors.reduce((sum, error) => sum + error, 0) / errors.length;
      const errorStd = Math.sqrt((1 / errors.length) * errors.reduce((sum, error) => sum + Math.pow(error - errorMean, 2), 0));

      // Calculate error area
      const rawUncertainty = testData.reduce((sum, { range }) => sum + errorStd * curve(rangeMidpoint(range)) / 100, 0);
      const uncertainty = Math.max(10, Math.round(rawUncertainty / 10) * 10);

      // Create graph points
      const curveXPoints = [testData[0].range[0]].concat(testData.map(({ range }) => range[1]));
      let curvePoints = curveXPoints.map(xi => [xi, curve(xi)]);

      res.json({
        samplePoints,
        curvePoints,
        knownEstimate: Math.round(curveArea / uncertainty) * uncertainty,
        knownEstimateUncertainty: uncertainty
      });
    } catch (error) {
      res.statusCode(500).json({ error: true });
      console.error('Could not calculate curve parameters', error);
    }
  });
  return router;
};

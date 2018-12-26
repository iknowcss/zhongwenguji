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

  const [amplitude, decayStartX, decayPeriod] = fminsearch(fun, [100, 500, 200], x, y);
  return { amplitude, decayStartX, decayPeriod };
}

module.exports = () => {
  const router = Router();
  router.use(bodyParser.json());
  router.use((req, res) => {
    const { testData } = req.body;
    try {
      res.json({
        curveParams: getCurveParameters(testData)
      });
    } catch (error) {
      console.error('Could not calculate curve parameters', error);
    }
  });
  return router;
};

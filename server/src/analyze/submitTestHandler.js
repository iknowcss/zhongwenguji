const uuid = require('uuid/v4');
const { rangeMidpoint, getCurveParameters, buildCurve } = require('./submitTest');

module.exports = (req, res) => {
  const { testData, seed } = req.body;
  const testId = uuid();
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

    // Create graph points at the boundaries of each of the bins (TODO: just make i the midpoint maybe?)
    const curveXPoints = [testData[0].range[0]].concat(testData.map(({ range }) => range[1]));
    let curvePoints = curveXPoints.map(xi => [xi, curve(xi)]);

    /**
     * @type {TestResult}
     */
    const testResults = {
      testId,
      samplePoints,
      curvePoints,
      knownEstimate: Math.round(curveArea / uncertainty) * uncertainty,
      knownEstimateUncertainty: uncertainty
    };

    res.json(testResults);
  } catch (error) {
    res.status(500).json({ error: true });
    console.error('Could not calculate curve parameters', error);
  }
};

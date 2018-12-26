const { Router } = require('express');
const bodyParser = require('body-parser');

function getCurveParameters() {
  return {};
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

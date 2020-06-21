const uuid = require('uuid/v4');
const allCharacters = require('../../all-characters').characters;
const { fitModelToMarkings } = require('./submitTest');

/**
 * @typedef SubmitTestHandlerRequestBody
 * @property {BinTestResult[]} testData
 * @property {number|undefined} seed
 */

/**
 *
 * @param {{body: SubmitTestHandlerRequestBody}} req
 * @param {{json: function(object):undefined, status:function(number):undefined}} res
 */
function submitTestHandler(req, res) {
  const { seed } = req.body;
  let { markedEntries } = req.body;
  const testId = uuid();
  try {
    // TODO: Read this from the query params
    const binSampleParameters = { binCount: 40, subsetSize: 5, seed };
    if (!markedEntries) {
      if (req.body.testData) {
        markedEntries = adaptOldDataFormat(binSampleParameters, req.body.testData);
      } else {
        return res.status(400).json({ error: true });
      }
    }
    const modelFitResult = fitModelToMarkings(allCharacters, binSampleParameters, markedEntries);

    /**
     * @type {TestResult}
     */
    const testResults = {
      testId,
      samplePoints: modelFitResult.graphData.samplePoints.map(({ x, y }) => [x, y]),
      curvePoints: modelFitResult.graphData.modelFitPoints.map(({ x, y }) => [x, y]),
      knownEstimate: modelFitResult.knownEstimate,
      knownEstimateUncertainty: modelFitResult.knownEstimateError,
    };

    res.json(testResults);
  } catch (error) {
    res.status(500).json({ error: true });
    console.error('Could not calculate curve parameters', error);
  }
}

/**
 * Converts the old style test data to an analogue of the new style.
 *
 * @param {BinSampleParameters} binSampleParameters - See {@link BinSampleParameters}.
 * @param {{isTested: boolean, knownPercent: number, range: [number, number]}[]} testData
 * @returns {MarkedFrequencyEntry[]}
 */
function adaptOldDataFormat(binSampleParameters, testData) {
  const binSize = Math.ceil(allCharacters[allCharacters.length - 1].i / binSampleParameters.binCount);
  return testData
    .filter(({ isTested }) => isTested)
    .reduce((result, entry) => {
      const { knownPercent, range } = entry;
      const binIndex = Math.round(range[0] / (range[1] - range[0]));
      const newEntries = Array.from({ length: 5 }, (_, i) => ({
        known: knownPercent === 100 || i * 20 < knownPercent,
        i: binIndex * binSize + 1 + i,
      }));
      return result.concat(newEntries);
    }, []);
}

module.exports = submitTestHandler;

const uuid = require('uuid/v4');
const allCharacters = require('../../all-characters').characters;
const { fitModelToMarkings } = require('./submitTest');

/**
 * @typedef LegacySubmitTestHandlerRequestBody
 * @property {BinTestResult[]} testData
 * @property {number|undefined} seed
 */

/**
 * @typedef SubmitTestHandlerRequestBody
 * @property {BinSampleParameters} binSampleParameters - See {@link BinSampleParameters}.
 * @property {MarkedFrequencyEntry[]} markedEntries
 * @property {characterSetEnum} characterSet
 */

/**
 *
 * @param {{body: SubmitTestHandlerRequestBody|LegacySubmitTestHandlerRequestBody}} req
 * @param {{json: function(object):undefined, status:function(number):undefined}} res
 */
async function submitTestHandler(req, res) {
  let { binSampleParameters, markedEntries, characterSet } = req.body;
  const testId = uuid();
  try {
    if (markedEntries) {
      await storeMarkedEntries(testId, req.body);
    } else {
      if (req.body.testData) {
        binSampleParameters = { binCount: 40, subsetSize: 5, seed: req.body.seed };
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

/**
 *
 * @param {string} testId
 * @param {SubmitTestHandlerRequestBody} body
 */
async function storeMarkedEntries(testId, body) {
  const testResultsBucketName = process.env['TEST_RESULTS_BUCKET_NAME'];
  if (!testResultsBucketName) {
    console.info('Will not store marked entries. TEST_RESULTS_BUCKET_NAME is not set.');
    return;
  }

  const AWS = require('aws-sdk');
  const s3 = new AWS.S3();
  try {
    const markedEntries = body.markedEntries.map(({ i, cs, ct, known }) => ({ i, cs, ct, known }));
    const gmtDateStamp = (new Date().toISOString()).split('T')[0];
    await s3.upload({
      Bucket: testResultsBucketName,
      Key: `${gmtDateStamp}/${testId}.json`,
      Body: JSON.stringify({ ...body, markedEntries }),
    }).promise();
    console.info('Stored marked entries for test.', testId);
  } catch (error) {
    console.warn('Failed to store marked entries.', error.message, error.stack);
  }
}

module.exports = submitTestHandler;

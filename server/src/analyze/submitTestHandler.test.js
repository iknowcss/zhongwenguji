const express = require('express');
const bodyParser = require('body-parser');
const supertest = require('supertest');
const submitTestHandler = require('./submitTestHandler');

describe('submitTestHandler', () => {
  let body;

  beforeAll(() => {
    const app = express();
    app.post('/', bodyParser.json(), submitTestHandler);
    return supertest(app)
      .post('/')
      .send({
        testData: [
          { isTested: true, knownPercent: 100, range: [0, 250] },
          { isTested: false, knownPercent: NaN, range: [250, 500] },
          { isTested: true, knownPercent: 80, range: [500, 750] },
          { isTested: true, knownPercent: 40, range: [750, 1000] },
          { isTested: true, knownPercent: 60, range: [1000, 1250] },
          { isTested: true, knownPercent: 20, range: [1250, 1500] },
          { isTested: true, knownPercent: 0, range: [1500, 1750] },
          { isTested: true, knownPercent: 0, range: [1750, 2000] },
          { isTested: false, knownPercent: NaN, range: [2000, 2250] },
          { isTested: false, knownPercent: NaN, range: [2250, 2500] }
        ]
      })
      .expect(200)
      .then((result) => {
        body = result.body;
      });
  });

  it('calculates curve points', () => {
    const { curvePoints } = body;
    expect(curvePoints.slice(0, 5).map(([x]) => x))
      .toEqual([0, 249, 498, 747, 996]);
  });

  it('calculates sample points', () => {
    const { samplePoints } = body;
    expect(samplePoints).toEqual([
      [125, 100],
      [623, 80],
      [872, 40],
      [1121, 60],
      [1370, 20],
      [1619, 0],
      [1868, 0]
    ]);
  });

  it('known character range estimate', () => {
    const { knownEstimate, knownEstimateUncertainty } = body;
    expect({ knownEstimate, knownEstimateUncertainty }).toMatchSnapshot();
  });
});

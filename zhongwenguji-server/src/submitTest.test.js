const express = require('express');
const supertest = require('supertest');
const submitTest = require('./submitTest');

describe('submitTest', () => {
  it('calculates curve parameters', () => {
    const app = express();
    app.post('/', submitTest());
    return supertest(app)
      .post('/')
      .send({
        testData: [
          { isTested: true, knownPercent: 100, range: [0, 250] },
          { isTested: false, knownPercent: NaN, range: [250, 500] },
          { isTested: true, knownPercent: 50, range: [500, 750] },
          { isTested: true, knownPercent: 10, range: [750, 1000] },
          { isTested: true, knownPercent: 0, range: [1000, 1250] },
          { isTested: true, knownPercent: 0, range: [1250, 1500] },
          { isTested: false, knownPercent: NaN, range: [1500, 1750] },
          { isTested: false, knownPercent: NaN, range: [1750, 2000] }
        ]
      })
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.curveParams.amplitude).toBe('number');
        expect(typeof body.curveParams.decayStartX).toBe('number');
        expect(typeof body.curveParams.decayPeriod).toBe('number');
        expect(body.curveParams).toMatchSnapshot();
      });
  });
});

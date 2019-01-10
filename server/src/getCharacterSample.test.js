const express = require('express');
const supertest = require('supertest');
const getCharacterSample = require('./getCharacterSample');

describe('getCharacterSample', () => {
  it('returns', () => {
    const app = express();
    app.get('/', getCharacterSample());
    return supertest(app)
      .get('/?seed=99999')
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
          seed: 99999,
          binCount: 40,
          samplesPerBin: 5
        });

        expect(response.body).toMatchSnapshot();
      });
  });
});

const fs = require('fs');
const path = require('path');
const serverless = require('serverless-http');
const express = require('express');

const app = express();

const allCharacters = fs
  .readFileSync(path.join(__dirname, 'all-characters.txt'))
  .toString()
  .split('\n')
  .map(x => {
    const [i, c, , p, d] = x.split('\t');
    return { i, c, p, d };
  });

function sampleCharacters(seed) {
  return [ seed ]
}

function extractSeed(req) {
  if (req && req.query && req.query.seed) {
    try {
      const seed = parseInt(req.query.seed, 10);
      if (seed >= 0 && seed <= Number.MAX_SAFE_INTEGER) {
        return seed;
      }
    } catch (err) { }
  }
  return Math.floor(Math.random() * 100000);
}

app.get('/', (req, res) => {
  res.json({
    characters: sampleCharacters(extractSeed(req))
  });
});

module.exports.handler = serverless(app);

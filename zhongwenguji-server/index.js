const fs = require('fs');
const path = require('path');
const serverless = require('serverless-http');
const express = require('express');

const DEFAULT_BIN_COUNT = 40;
const DEFAULT_SAMPLES_PER_BIN = 5;

const app = express();

const allCharacters = fs
  .readFileSync(path.join(__dirname, 'all-characters.txt'))
  .toString()
  .split('\n')
  .map(x => {
    const [i, c, , , p, d] = x.split('\t');
    return { i, c, p, d };
  });

const random = seed => (min = 0, max = 1) => {
  const x = Math.sin(seed++) * 10000;
  return (x - Math.floor(x)) * (max - min) + min;
};

const xxx = ({ seed, samplesPerBin }) => {
  const r = random(seed);
  return (bin) => {
    const copy = bin.slice(0);
    return Array.from({ length: samplesPerBin }, () => {
      return copy.splice(Math.floor(r(0, copy.length)), 1)[0];
    });
  }
};

function sampleCharacters({ seed, binCount, samplesPerBin }) {
  const binSize = Math.ceil(allCharacters.length / binCount);
  const sampler = xxx({ seed, samplesPerBin });
  return Array
    .from({ length: binCount }, (x, i) => allCharacters.slice(i * binSize, (i + 1) * binSize))
    .map((bin, i) => ({
      range: [i * binSize, i * binSize + bin.length],
      sample: sampler(bin)
    }));
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
  const config = {
    seed: extractSeed(req),
    binCount: DEFAULT_BIN_COUNT,
    samplesPerBin: DEFAULT_SAMPLES_PER_BIN
  };
  res.json({
    ...config,
    totalCharacters: allCharacters.length,
    characters: sampleCharacters(config)
  });
});

module.exports.handler = serverless(app);

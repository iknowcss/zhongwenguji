const fs = require('fs');
const path = require('path');

const DEFAULT_BIN_COUNT = 40;
const DEFAULT_SAMPLES_PER_BIN = 5;

function extractSeed({ query }) {
  if (query.seed) {
    try {
      const seed = parseInt(query.seed, 10);
      if (seed >= 0 && seed <= Number.MAX_SAFE_INTEGER) {
        return seed;
      }
    } catch (err) { }
  }
  return Math.floor(Math.random() * 100000);
}

const rng = seed => (min = 0, max = 1) => {
  const x = Math.sin(seed++) * 10000;
  return (x - Math.floor(x)) * (max - min) + min;
};

const characterSampler = ({ seed, samplesPerBin }) => {
  const random = rng(seed);
  return (bin) => {
    const copy = bin.slice(0);
    return Array.from({ length: samplesPerBin }, () => {
      return copy.splice(Math.floor(random(0, copy.length)), 1)[0];
    });
  }
};

function sampleCharacters(allCharacters, { seed, binCount, samplesPerBin }) {
  const binSize = Math.ceil(allCharacters.length / binCount);
  const sampler = characterSampler({ seed, samplesPerBin });
  return Array
    .from({ length: binCount }, (x, i) => allCharacters.slice(i * binSize, (i + 1) * binSize))
    .map((bin, i) => ({
      range: [i * binSize, i * binSize + bin.length],
      sample: sampler(bin)
    }));
}

module.exports = (configOverride) => {
  const config = {
    binCount: DEFAULT_BIN_COUNT,
    samplesPerBin: DEFAULT_SAMPLES_PER_BIN,
    ...configOverride
  };

  const allCharacters = fs
    .readFileSync(path.join(__dirname, '../all-characters.txt'))
    .toString()
    .split('\n')
    .map(x => {
      const [i, c, , , p, d] = x.split('\t');
      return { i, c, p, d };
    });

  return (req, res) => {
    const seed = extractSeed(req);
    res.json({
      ...config,
      seed,
      totalCharacters: allCharacters.length,
      characters: sampleCharacters(allCharacters, { ...config, seed })
    });
  };
};

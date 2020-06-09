const allCharacters = require('../all-characters.json').characters;

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
  return 1 + Math.floor(Math.random() * 99999);
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

function sampleCharacters(characters, { seed, totalCharacters, binCount, samplesPerBin }) {
  const binSize = Math.ceil(totalCharacters / binCount);
  const sampler = characterSampler({ seed, samplesPerBin });
  let i = 0;
  const acl = characters.length;
  return Array
    .from({ length: binCount }, (_, binNumber) => {
      const bin = [];
      let char;
      while (i < acl && (char = characters[i]).i < (binNumber + 1) * binSize + 1) {
        bin.push(char);
        i++;
      }
      return bin;
    })
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
  return (req, res) => {
    const seed = extractSeed(req);
    const totalCharacters = allCharacters[allCharacters.length - 1].i;
    const characters = sampleCharacters(allCharacters, { ...config, totalCharacters, seed });
    console.log(JSON.stringify({
      ...config,
      seed,
      totalCharacters,
      characters,
    }));
    res.json({
      ...config,
      seed,
      characters,
    });
  };
};

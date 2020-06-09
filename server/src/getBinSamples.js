/**
 * A Chinese character entry from all-characters.json
 *
 * @typedef {Object} CharacterEntry
 * @property {number} i Character identifier
 * @property {string} cs Simplified string
 * @property {string} ct Traditional string
 * @property {string[]} p Available pronunciations
 * @property {string[]} d Available definitions
 * @example
 * {
 *   "i": 1,
 *   "cs": "的",
 *   "ct": "的",
 *   "p": ["de5", "di1", "di2", "di4"],
 *   "d": [
 *     "of/~'s (possessive particle)/...",
 *     "see 的士[di1 shi4]",
 *     "really and truly",
 *     "aim/clear",
 *   ]
 * }
 */

/**
 * @typedef {object} BinSampleResult
 * @property {number} randomSeed
 * @property {[][]} samples
 */


/**
 * @private
 * @param seed - Random number generator seed
 * @returns {function(Array): Array}
 */
const shuffler = seed => items => {
  const rng = (min = 0, max = 1) => {
    const x = Math.sin(seed++) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min) + min);
  };
  for (let i = 0; i < items.length; i++) {
    const newHome = rng(i, items.length);
    const old = items[newHome];
    items[newHome] = items[i];
    items[i] = old;
  }
  return items;
};

/**
 * Divides the provided entries into equally sized bins and
 * then selects from each of the specified bins a random
 * subset of the specified size.
 *
 * @param {[]} items - The full set of items
 * @param {number} binCount - The number of bins to divide the set into
 * @param {number} subsetSize - The maximum number of items to retrieve from each bin
 * @param {number[]} selectionBins - The zero-indexed bins to make the selection from
 * @param {number} [subsetSkip] - The number of subsets to skip before making the selection
 * @param {number} [seed] - Seed used during random sample selection
 * @returns {BinSampleResult}
 */
function getBinSamples(
  items,
  binCount,
  subsetSize,
  selectionBins,
  subsetSkip,
  seed,
) {
  const binSize = Math.ceil(items.length / binCount);
  return {
    seed,
    samples: Array.from(selectionBins, (binIndex) => {
      const shuffle = shuffler(seed + binIndex);
      const binOffset = binIndex * binSize;
      const binItems = shuffle(items.slice(binOffset, binOffset + binSize));
      const subsetOffset = (subsetSkip || 0) * subsetSize;
      return binItems.slice(subsetOffset, subsetOffset + subsetSize);
    }),
  };
}
module.exports = getBinSamples;

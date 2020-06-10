/**
 * @typedef {object} BinSampleResult
 * @property {number|undefined} randomSeed
 * @property {CharacterEntry[][]} samples
 */

/**
 * Return a function which takes an {Array} of items to shuffle in place.
 *
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
 * Divides the provided entries into bins grouped by character frequency, then selects from each of the requested bins
 * a random subset of the specified size. If another round of characters is needed from the sample, call again with the
 * same {seed} and specify a {subsetSkip} of 1 or more depending on what round this is. The first round will be 0, the
 * second will be 1, etc.
 *
 * Entries are grouped into bins by their character frequency (@see {CharacterEntry.i}). The bin size is calculated
 * by taking the frequency index of the last entry, dividing it by the {binCount}, and rounding up. The bins are then
 * filled with each entry by its frequency index.
 *
 * For example, if the {binCount} is 5 and the last entry has a frequency index of 50, the bin size will be 10. Bin "0"
 * will have character entries 1-10, bin "1" will have entries 11-20. In this example, a bin may have fewer than 10
 * entries if one of those entries is missing from {entries}. For example, if the entry with frequency index "3" is
 * missing, then bin "0" will have just 9 entries: 1-2 plus 4-10.
 *
 * @param {CharacterEntry[]} entries - The set of {CharacterEntry}s to sample from sorted ascending by Character
 *    identifier.
 * @param {number} binCount - The number of bins to divide the set into.
 * @param {number} subsetSize - The maximum number of items to retrieve from each bin.
 * @param {number[]} selectionBins - The zero-indexed bins to make the selection from.
 * @param {number} subsetSkip - The number of subsets to skip before making the selection.
 * @param {number|undefined} [randomSeed] - Seed used during random sample selection. If {undefined} then the selection
 *    is not randomized.
 * @returns {BinSampleResult}
 */
function getBinSamples(
  entries,
  binCount,
  subsetSize,
  selectionBins,
  subsetSkip,
  randomSeed,
) {
  const totalCharacterCount = entries[entries.length - 1].i;
  const binSize = Math.ceil(totalCharacterCount / binCount);
  return {
    randomSeed,
    samples: Array.from(selectionBins, (binIndex) => {
      const firstId = 1 + binIndex * binSize;
      const lastId = firstId + binSize - 1;
      let binItems = entries.filter(({ i }) => firstId <= i && i <= lastId);
      if (typeof randomSeed === 'number') {
        binItems = shuffler(randomSeed + binIndex)(binItems);
      }
      const subsetOffset = (subsetSkip || 0) * subsetSize;
      return binItems.slice(subsetOffset, subsetOffset + subsetSize);
    }),
  };
}
module.exports = getBinSamples;

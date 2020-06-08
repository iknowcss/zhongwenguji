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
 * Divides the provided entries into equally sized bins and
 * then selects from each of the specified bins a random
 * subset of the specified size.
 *
 * @param {[]} items - The full set of items
 * @param {number} binCount - The number of bins to divide the set into
 * @param {number} subsetSize - The maximum number of items to retrieve from each bin
 * @param {number[]} selectionBins - The zero-indexed bins to make the selection from
 * @param {number} [subsetSkip] - The number of subsets to skip before making the selection
 * @returns {[][]}
 */
module.exports = function (
  items,
  binCount,
  subsetSize,
  selectionBins,
  subsetSkip = 0,
) {
  const binSize = Math.ceil(items.length / binCount);
  return Array.from(selectionBins, (binIndex) => {
    const binOffset = binIndex * binSize;
    const binItems = items.slice(binOffset, binOffset + binSize);
    const subsetOffset = subsetSkip * subsetSize;
    return binItems.slice(subsetOffset, subsetOffset + subsetSize);
  });
};

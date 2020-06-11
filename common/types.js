/**
 * A Chinese character entry from all-characters.json
 *
 * @typedef {Object} CharacterEntry
 * @property {number} i Character frequency index. The index corresponds to the character's frequency relative to the
 *    other characters. The lower the identifier, the higher the frequency.
 * @property {string} cs Simplified string.
 * @property {string} ct Traditional string.
 * @property {string[]} p Available pronunciations.
 * @property {string[]} d Available definitions.
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
 * @typedef ScoredCharacterEntry
 * @property {number} index - Frequency index.
 * @property {string} simplified - Simplified string.
 * @property {string} traditional - Traditional string.
 * @property {string[]} pinyin - Available pronunciations.
 * @property {string[]} definition - Available definitions.
 * @property {number} score - Character score. Possible values are {NaN}, {0}, or {1}. {NaN} means "un-scored",
 *    {0} means "unknown" and {1} means "known".
 */

/**
 * @typedef {object} LegacyCharacterBin
 * @property {number[]} range - The range of character frequency indices this sample represents.
 * @property {CharacterEntry[]} sample - The selection of characters to test.
 */

/**
 * @typedef ScoredCharacterBin
 * @augments LegacyCharacterBin
 * @property {ScoredCharacterEntry[]} sample - The scored sample of characters which represent this bin.
 */

/**
 * @typedef TestResult
 * @property {string} testId - A UUID which correlates these test results with log entries and surveys.
 * @property {number} knownEstimate - An estimate of the number of characters the user knows.
 * @property {number} knownEstimateUncertainty - The calculated uncertainty of the estimate above.
 * @property {[number, number][]} samplePoints - Co-ordinate pairs representing the "known/unknown" ratio for each bin.
 *    The domain is "character frequency index" and the range is "known/unknown" character ratio for the bin.
 * @property {[number, number][]} curvePoints - Co-ordinate pairs of points along the best fit curve. The domain and
 *    range are the same as {samplePoints}.
 */

/**
 * @typedef {object} BinSample
 * @property {number|undefined} binIndex
 * @property {CharacterEntry[]} characters
 */

/**
 *
 * @typedef GetBinSamplesResponse
 * @property {number} binCount
 * @property {number} subsetSize
 * @property {number} seed
 * @property {number} totalCharacterCount
 * @property {BinSample[]} binSamples
 */

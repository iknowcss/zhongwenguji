/**
 * @typedef FrequencyEntry
 * @property {number} i - Frequency index. The index corresponds to the entry's frequency relative to the other entries.
 *    The lower the identifier, the higher the frequency.
 */

/**
 * @typedef {FrequencyEntry} MarkedFrequencyEntry
 * @property {number} originBinIndex -
 * @property {boolean} known - {true} if the entry is known, {false} if it is not.
 */

/**
 * A Chinese character entry from all-characters.json
 *
 * @typedef {FrequencyEntry} CharacterEntry
 * @property {string} cs - Simplified string.
 * @property {string} ct - Traditional string.
 * @property {string[]} p - Available pronunciations.
 * @property {string[]} d - Available definitions.
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
 * @typedef {LegacyCharacterBin} ScoredCharacterBin
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
 * @typedef {object} MarkedBinSample
 * @property {number} binIndex
 * @property {MarkedFrequencyEntry[]} characters
 */

/**
 * @typedef BinSampleParameters
 * @property {number} binCount - the number of frequency bins to slice the full character set into.
 * @property {number} subsetSize - the number of character entries to sample from each bin.
 * @property {number} [seed] - the randomization seed used for selecting the entries to go into the sample.
 *    If {undefined} then the selection is not randomized.
 */

/**
 *
 * @typedef {BinSampleParameters} GetBinSamplesResponse
 * @property {number} totalCharacterCount
 * @property {BinSample[]} binSamples
 */

/**
 * @typedef BinTestResult
 * @property {boolean} isTested
 * @property {number} knownPercent
 * @property {number[]} range
 */

/**
 * @typedef ScoreStatistics
 * @property {number} lastTestedSectionIndex
 * @property {number} failedSectionCount
 * @property {number} seed
 * @property {BinTestResult[]} sectionStats
 */

/**
 * @typedef CharacterMarking
 * @property {number} i - Character frequency index. See {@link CharacterEntry}.
 * @property {boolean} known - {true} if the character is known, {false} if not.
 */

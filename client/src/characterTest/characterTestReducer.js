import { actionTypes } from './characterTestActions';

/// - Test state enum ------------------------------------------------------------------------------

/**
 * @readonly
 * @enum
 */
export const statusEnum = {
  READY: 'READY',
  LOADING: 'LOADING',
  RESULTS_LOADING: 'LOADING_RESULTS',
  RESULTS_READY: 'RESULTS_READY',
  TESTING: 'TESTING',
  REVIEW: 'REVIEW',
  ERROR: 'ERROR',
  COMPLETE: 'COMPLETE',
  ADDING_TO_SKRITTER: 'ADDING_TO_SKRITTER'
};

/**
 * @readonly
 * @enum
 */
export const characterSetEnum = {
  SIMPLIFIED: 'SIMPLIFIED',
  TRADITIONAL: 'TRADITIONAL'
};

/// ------------------------------------------------------------------------------------------------

/**
 * @typedef CharacterTestState
 * @property {number} binCount -
 * @property {number} subsetSize -
 * @property {number} totalCharacterCount -
 * @property {BinSample[]} binSamples -
 * @property {MarkedFrequencyEntry[]} markedEntries -
 * @property {number} currentBinIndex -
 * @property {number} seed - Random seed.
 * @property {boolean} isShowDefinition - Is currently showing the character definition.
 * @property {statusEnum} state - The current stage of the test.
 * @property {TestResult|null} resultData - The test result data. Set to {null} when there are no test results
 *    available.
 * @property {characterSetEnum} characterSet - The character set to use, "simplified" or "traditional".
 */

/**
 * @type {CharacterTestState}
 */
const DEFAULT_STATE = {
  binCount: 40,
  subsetSize: 5,
  seed: -1,
  totalCharacterCount: 0,
  binSamples: [],
  markedEntries: [],
  currentBinIndex: 0,
  isShowDefinition: false,
  state: statusEnum.READY,
  resultData: null,
  characterSet: characterSetEnum.SIMPLIFIED
};


/**
 * Find the first entry in the current bin which has not yet been marked and returns the index of the entry in the
 * context of the bin. If all of the entries in the bin marked, returns {-1}.
 *
 * @param {CharacterTestState} characterTestState
 * @returns {number}
 */
function currentCardIndex(characterTestState) {
  const { binSamples, currentBinIndex, markedEntries } = characterTestState;
  const currentBinCharacters = binSamples[currentBinIndex].characters;
  const markedBinCharacters = markedEntries
    .filter((entry) => entry.originBinIndex === currentBinIndex);
  if (currentBinCharacters.length === markedBinCharacters.length) {
    return -1;
  }
  return markedBinCharacters.length;
}

/**
 *
 * @param {CharacterTestState} state
 * @returns {CharacterTestState}
 */
function processUndo(state) {
  const { markedEntries } = state;
  if (markedEntries.length === 0) {
    return state;
  }

  const { originBinIndex } = markedEntries[markedEntries.length - 1];
  return {
    ...state,
    markedEntries: markedEntries.slice(0, -1),
    currentBinIndex: originBinIndex || DEFAULT_STATE.currentBinIndex,
  };
}

/**
 *
 * @param {CharacterTestState} state
 * @param {{type: actionTypes}} action
 * @returns {CharacterTestState}
 */
function processMark(state, action) {
  const { binSamples, currentBinIndex, subsetSize, binCount } = state;
  const known = action.type === actionTypes.TEST_CARD_MARK_UNKNOWN ? false
    : action.type === actionTypes.TEST_CARD_MARK_KNOWN ? true
      : undefined;
  if (typeof known === 'undefined') {
    return state;
  }

  // Mark the entry and add it to the list.
  const newEntry = {
    ...binSamples[currentBinIndex].characters[currentCardIndex(state)],
    known,
    originBinIndex: currentBinIndex,
  };
  const newState = { ...state, markedEntries: [...state.markedEntries, newEntry] };

  // The user hasn't reached the end of the current bin so we should continue with the current bin.
  if (currentCardIndex(newState) >= 0) {
    return newState;
  }

  // The user has reached the end of the current bin. Take the results of the last 3 tested bins and
  // calculate the known percentage.
  const lastEntriesCount = 3 * subsetSize;
  const lastEntries = newState.markedEntries.slice(-lastEntriesCount);
  const lastMarkedKnownPercentage = lastEntries
    .reduce((sum, { known }) => sum + known, 0) / lastEntries.length;

  // The user knows few of the most recently marked entries, so let's end the test.
  if (lastEntries.length === lastEntriesCount && lastMarkedKnownPercentage <= 0.4) {
    return { ...newState, state: statusEnum.COMPLETE };
  }

  // Decide which bin to pick from based on the user's performance.
  const newBinIndex = currentBinIndex + (lastMarkedKnownPercentage >= 0.9 ? 2 : 1);

  // If the new bin is out of range, end the test.
  if (newBinIndex > binCount) {
    return { ...newState, state: statusEnum.COMPLETE };
  }

  // Otherwise, set the current bin and continue.
  return { ...newState, currentBinIndex: newBinIndex };
}

/**
 *
 * @param {object} state
 * @param {GetBinSamplesResponse} response
 * @returns {GetBinSamplesResponse}
 */
function processBinSamplesResponse(state, response) {
  // TODO: merge with existing state when appropriate
  return response;
}

/// - State reducer --------------------------------------------------------------------------------

export default (state = DEFAULT_STATE, action = {}) => {
  switch (action.type) {

    /// - Loading characters -----------------------------------------------------------------------

    case actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_START:
      return { ...state, state: statusEnum.LOADING };
    case actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_SUCCESS:
      return {
        ...state,
        ...processBinSamplesResponse(state, action.response),
        state: statusEnum.TESTING
      };
    case actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_FAIL:
      return { ...state, state: statusEnum.ERROR };

    /// - Character set ----------------------------------------------------------------------------

    case actionTypes.TEST_SET_CHARACTER_SET_SIMPLIFIED:
      return { ...state, characterSet: characterSetEnum.SIMPLIFIED };
    case actionTypes.TEST_SET_CHARACTER_SET_TRADITIONAL:
      return { ...state, characterSet: characterSetEnum.TRADITIONAL };

    /// - Card Definition --------------------------------------------------------------------------

    case actionTypes.CHARACTER_SAMPLES_DEFINITION_SHOW:
      return { ...state, isShowDefinition: true };
    case actionTypes.CHARACTER_SAMPLES_DEFINITION_HIDE:
      return { ...state, isShowDefinition: false };

    /// - Card marking/undo ------------------------------------------------------------------------

    case actionTypes.TEST_CARD_MARK_UNKNOWN:
    case actionTypes.TEST_CARD_MARK_KNOWN:
      if (state.state === statusEnum.TESTING) {
        return { ...processMark(state, action), isShowDefinition: false };
      }
      break;
    case actionTypes.TEST_CARD_DISCARD_UNDO:
      if (state.state === statusEnum.TESTING) {
        return { ...processUndo(state), isShowDefinition: false };
      }
      break;

    /// - Test submission --------------------------------------------------------------------------

    case actionTypes.TEST_RESULTS_SUBMIT_START:
      return { ...state, state: statusEnum.RESULTS_LOADING, resultData: null };
    case actionTypes.TEST_RESULTS_SUBMIT_SUCCESS:
      return {
        ...state,
        state: statusEnum.RESULTS_READY,
        resultData: action.resultData
      };
    case actionTypes.TEST_RESULTS_SUBMIT_FAIL:
      return { ...state, state: statusEnum.ERROR };

    /// - Test conclusion and continue -------------------------------------------------------------

    case actionTypes.TEST_RESULTS_SHOW:
      return { ...state, state: statusEnum.RESULTS_READY };
    case actionTypes.REVIEW_MISSED_START:
      return { ...state, state: statusEnum.REVIEW };
    case actionTypes.TEST_RESET:
      return DEFAULT_STATE;

    /// - Default noop -----------------------------------------------------------------------------

    default:
      return state;
  }

  return state;
}

/// - Root state selectors -------------------------------------------------------------------------

/**
 * @param {{characterTestReducer: CharacterTestState}} rootState
 * @returns {statusEnum}
 */
export const status = rootState => rootState.characterTestReducer.state;

/**
 * @param {{characterTestReducer: CharacterTestState}} rootState
 * @returns {boolean}
 */
export const isShowDefinition = rootState => rootState.characterTestReducer.isShowDefinition;

/**
 * @param {{characterTestReducer: CharacterTestState}} rootState
 * @returns {CharacterEntry}
 */
export const currentCard = (rootState) => {
  const characterTestState = rootState.characterTestReducer;
  const { binSamples, currentBinIndex, state } = characterTestState;
  if (state === statusEnum.TESTING && binSamples[currentBinIndex]) {
    return binSamples[currentBinIndex].characters[currentCardIndex(characterTestState)];
  }
  return undefined;
};

/**
 * @param {{characterTestReducer: CharacterTestState}} rootState
 * @returns {number}
 */
export const binCount = (rootState) => rootState.characterTestReducer.binCount;

/**
 * @param {{characterTestReducer: CharacterTestState}} rootState
 * @returns {number}
 */
export const subsetSize = (rootState) => rootState.characterTestReducer.subsetSize;

/**
 *
 * @param {{characterTestReducer: CharacterTestState}} state
 * @returns {TestResult|null}
 */
export const resultData = state => state.characterTestReducer.resultData;

/**
 *
 * @param {{characterTestReducer: CharacterTestState}} state
 * @returns {MarkedFrequencyEntry[]}
 */
export const missedCards = (state) => state.characterTestReducer.markedEntries
  .filter((entry) => !entry.known);

/**
 *
 * @param {{characterTestReducer: CharacterTestState}} state
 * @returns {characterSetEnum}
 */
export const characterSet = (state) => state.characterTestReducer.characterSet;

/**
 *
 * @param {{characterTestReducer: CharacterTestState}} state
 * @returns {MarkedFrequencyEntry[]}
 */
export const markedEntries = (state) => state.characterTestReducer.markedEntries;

/**
 *
 * @param {{characterTestReducer: CharacterTestState}} state
 * @returns {boolean}
 */
export const lastEntryKnown = (state) => {
  const { markedEntries } = state.characterTestReducer;
  return (markedEntries[markedEntries.length - 1] || {}).known;
};

/**
 *
 * @param {{characterTestReducer: CharacterTestState}} state
 * @returns {number}
 */
export const characterTestSeed = (state) => state.characterTestReducer.seed;

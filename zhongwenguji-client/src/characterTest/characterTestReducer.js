import { actionTypes } from './characterTestActions';

const DEFAULT_STATE = {
  bins: [],
  seed: -1,
  isShowDefinition: false,
  state: 'READY',
  currentSectionIndex: 0,
  currentCardIndex: 0,
  resultData: null
};

function processTestComplete(state) {
  return {
    ...state,
    currentCardIndex: 0,
    currentSectionIndex: 0,
    state: 'COMPLETE',
  };
}

const calculateScoreStatisticsMemo = {};
const calculateScoreStatistics = ({ bins }) => {
  if (calculateScoreStatisticsMemo.bins === bins) {
    return calculateScoreStatisticsMemo.result;
  }

  let failedSectionCount = 0;
  let lastTestedSectionIndex = 0;

  const sectionStats = bins.map(({ sample, range }, i) => {
    const totalScore = sample.reduce((sum, { score }) => sum + score, 0);
    if (totalScore === 0) {
      failedSectionCount++;
    }
    const knownPercent = Math.round(100 * totalScore / sample.length);
    const isTested = sample[0].score >= 0;
    if (isTested) {
      lastTestedSectionIndex = i;
    }
    return { isTested, knownPercent, range };
  });

  const result = {
    lastTestedSectionIndex,
    failedSectionCount,
    sectionStats
  };

  calculateScoreStatisticsMemo.bins = bins;
  calculateScoreStatisticsMemo.result = result;

  return result;
};

function processStepCard(state) {
  return { ...state, currentCardIndex: state.currentCardIndex + 1 };
}

function processStepSection(state, stepSize = 1) {
  if (state.currentSectionIndex + stepSize < state.bins.length) {
    return {
      ...state,
      currentCardIndex: 0,
      currentSectionIndex: state.currentSectionIndex + stepSize
    };
  }
  return processTestComplete(state);
}

function processDiscard(state) {
  const {
    lastTestedSectionIndex,
    failedSectionCount,
    sectionStats
  } = calculateScoreStatistics(state);

  if (failedSectionCount > 1 || (failedSectionCount === 1 && lastTestedSectionIndex === 0)) {
    return processTestComplete(state);
  }
  if (state.currentCardIndex + 1 < state.bins[state.currentSectionIndex].sample.length) {
    return processStepCard(state);
  }
  if (sectionStats[lastTestedSectionIndex].knownPercent >= 100) {
    return processStepSection(state, 2);
  }
  return processStepSection(state, 1);
}

function processBinScore(bins, { sectionIndex, cardIndex, score }) {
  return Array.from(bins, (section, i) => {
    if (i === sectionIndex) {
      return {
        ...section,
        sample: Array.from(section.sample, (character, j) => {
          if (j === cardIndex) {
            return { ...character, score };
          }
          return character;
        })
      };
    }
    return section;
  });
}

function processUndoDiscard(state) {
  if (state.currentCardIndex <= 0 && state.currentSectionIndex <= 0) {
    return state;
  }

  let currentCardIndex = state.currentCardIndex;
  let currentSectionIndex = state.currentSectionIndex;

  if (currentCardIndex > 0) {
    currentCardIndex--;
  } else if (currentSectionIndex > 0) {
    currentCardIndex = state.bins[currentSectionIndex - 1].sample.length - 1;
    currentSectionIndex--;
  }

  return {
    ...state,
    currentCardIndex,
    currentSectionIndex,
    bins: processBinScore(state.bins, {
      cardIndex: currentCardIndex,
      sectionIndex: currentSectionIndex,
      score: NaN
    }),
  };
}

function processMark(state, action) {
  const score = ({
    [actionTypes.TEST_CARD_MARK_UNKNOWN]: 0,
    [actionTypes.TEST_CARD_MARK_KNOWN]: 1,
    [actionTypes.TEST_CARD_MARK_CLEAR]: NaN
  })[action.type];
  return {
    ...state,
    bins: processBinScore(state.bins, {
      sectionIndex: state.currentSectionIndex,
      cardIndex: state.currentCardIndex,
      score
    })
  };
}

function processBins(characers) {
  return characers.map(section => ({
    ...section,
    sample: section.sample.map(({ i, c, p, d }) => ({
      index: i,
      character: c,
      pinyin: p,
      definition: d,
      score: NaN
    }))
  }));
}

function processSampleData(state, sampleData) {
  return {
    ...state,
    seed: sampleData.seed,
    bins: processBins(sampleData.characters)
  };
}

/// - Test state enum ------------------------------------------------------------------------------

export const statusEnum = {
  LOADING: 'LOADING',
  RESULTS_LOADING: 'LOADING_RESULTS',
  RESULTS_READY: 'RESULTS_READY',
  TESTING: 'TESTING',
  ERROR: 'ERROR',
};

/// - State reducer --------------------------------------------------------------------------------

export default (state = DEFAULT_STATE, action = {}) => {
  switch (action.type) {
    case actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_START:
      return { ...state, state: statusEnum.LOADING, bins: [] };
    case actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_SUCCESS:
      return {
        ...processSampleData(state, action.sampleData),
        state: statusEnum.LOADING
      };
    case actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_FAIL:
    case actionTypes.TEST_RESULTS_SUBMIT_FAIL:
      return { ...state, state: statusEnum.ERROR };
    case actionTypes.CHARACTER_SAMPLES_DEFINITION_SHOW:
      return { ...state, isShowDefinition: true };
    case actionTypes.CHARACTER_SAMPLES_DEFINITION_HIDE:
      return { ...state, isShowDefinition: false };
    case actionTypes.TEST_CARD_MARK_UNKNOWN:
    case actionTypes.TEST_CARD_MARK_KNOWN:
    case actionTypes.TEST_CARD_MARK_CLEAR:
      if (state.state === statusEnum.TESTING) {
        return processMark(state, action);
      }
      break;
    case actionTypes.TEST_CARD_DISCARD:
      if (state.state === statusEnum.TESTING) {
        return {...processDiscard(state, action), isShowDefinition: false};
      }
      break;
    case actionTypes.TEST_CARD_DISCARD_UNDO:
      if (state.state === statusEnum.TESTING) {
        return {...processUndoDiscard(state, action), isShowDefinition: false};
      }
      break;
    case actionTypes.TEST_RESULTS_SUBMIT_START:
      return { ...state, state: statusEnum.RESULTS_LOADING, resultData: null };
    case actionTypes.TEST_RESULTS_SUBMIT_SUCCESS:
      return {
        ...state,
        state: statusEnum.RESULTS_READY,
        resultData: action.resultData
      };
    default:
      return state;
  }
  return state;
}

/// - Root state selectors -------------------------------------------------------------------------

export const status = rootState => rootState.characterTestReducer.state;

export const isShowDefinition = rootState => rootState.characterTestReducer.isShowDefinition;

export const currentCard = ({ characterTestReducer: { currentSectionIndex, currentCardIndex, bins, state } }) => {
  if (state === statusEnum.TESTING) {
    return bins[currentSectionIndex].sample[currentCardIndex];
  }
  return null;
};

export const scoreStatistics = rootState => calculateScoreStatistics(rootState.characterTestReducer);

export const resultData = rootState => rootState.characterTestReducer.resultData;

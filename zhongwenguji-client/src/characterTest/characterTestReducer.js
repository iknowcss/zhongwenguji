import { actionTypes } from './characterTestActions';

const DEFAULT_STATE = {
  bins: [],
  isShowDefinition: false,
  state: 'READY',
  currentSectionIndex: 0,
  currentCardIndex: 0
};

function processDiscard(state) {
  if (state.currentCardIndex + 1 < state.bins[state.currentSectionIndex].sample.length) {
    return { ...state, currentCardIndex: state.currentCardIndex + 1 };
  }
  if (state.currentSectionIndex + 1 < state.bins.length) {
    return { ...state, currentCardIndex: 0, currentSectionIndex: state.currentSectionIndex + 1 };
  }
  return {
    ...state,
    currentCardIndex: 0,
    currentSectionIndex: 0,
    state: 'COMPLETE',
  };
}

function updateScore(bins, sectionIndex, cardIndex, score) {
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

  const bins = updateScore(
    state.bins,
    state.currentSectionIndex,
    state.currentCardIndex,
    NaN
  );

  if (state.currentCardIndex > 0) {
    return {
      ...state,
      bins,
      currentCardIndex: state.currentCardIndex - 1
    };
  }
  if (state.currentSectionIndex > 0) {
    return {
      ...state,
      bins,
      currentSectionIndex: state.currentSectionIndex - 1,
      currentCardIndex: state.bins[state.currentSectionIndex - 1].sample.length - 1
    };
  }
}

function processMark(state, action) {
  const score = ({
    [actionTypes.TEST_CARD_MARK_UNKNOWN]: 0,
    [actionTypes.TEST_CARD_MARK_KNOWN]: 1,
    [actionTypes.TEST_CARD_MARK_CLEAR]: NaN
  })[action.type];
  return {
    ...state,
    bins: updateScore(
      state.bins,
      state.currentSectionIndex,
      state.currentCardIndex,
      score
    )
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

export default (state = DEFAULT_STATE, action = {}) => {
  switch (action.type) {
    case actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_START:
      return { ...state, state: 'LOADING', bins: [] };
    case actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_SUCCESS:
      return { ...state, state: 'TESTING', bins: processBins(action.characters) };
    case actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_FAIL:
      return { ...state, state: 'ERROR' };
    case actionTypes.CHARACTER_SAMPLES_DEFINITION_SHOW:
      return { ...state, isShowDefinition: true };
    case actionTypes.CHARACTER_SAMPLES_DEFINITION_HIDE:
      return { ...state, isShowDefinition: false };
    case actionTypes.TEST_CARD_MARK_UNKNOWN:
    case actionTypes.TEST_CARD_MARK_KNOWN:
    case actionTypes.TEST_CARD_MARK_CLEAR:
      return processMark(state, action);
    case actionTypes.TEST_CARD_DISCARD:
      return { ...processDiscard(state, action), isShowDefinition: false };
    case actionTypes.TEST_CARD_DISCARD_UNDO:
      return { ...processUndoDiscard(state, action), isShowDefinition: false };
    default:
      return state;
  }
}

export const status = state => state.characterTestReducer.state;
export const isShowDefinition = state => state.characterTestReducer.isShowDefinition;
export const currentCard = ({ characterTestReducer: { currentSectionIndex, currentCardIndex, bins, state } }) => {
  if (state === 'TESTING') {
    return bins[currentSectionIndex].sample[currentCardIndex];
  }
  return null;
};

import { actionTypes } from './characterTestActions';

const DEFAULT_STATE = {
  bins: [],
  isShowDefinition: false,
  state: 'READY',
  currentSectionIndex: 0,
  currentCardIndex: 0
};

function processMark(state) {
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

function processUndoMark(state) {
  if (state.currentCardIndex > 0) {
    return { ...state, currentCardIndex: state.currentCardIndex - 1 };
  }
  if (state.currentSectionIndex > 0) {
    return { ...state,
      currentSectionIndex: state.currentSectionIndex - 1,
      currentCardIndex: state.bins[state.currentSectionIndex - 1].sample.length - 1
    };
  }
  return state;
}

export default (state = DEFAULT_STATE, action = {}) => {
  switch (action.type) {
    case actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_START:
      return { ...state, state: 'LOADING', bins: [] };
    case actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_SUCCESS:
      return { ...state, state: 'TESTING', bins: action.characters };
    case actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_FAIL:
      return { ...state, state: 'ERROR' };
    case actionTypes.CHARACTER_SAMPLES_DEFINITION_SHOW:
      return { ...state, isShowDefinition: true };
    case actionTypes.CHARACTER_SAMPLES_DEFINITION_HIDE:
      return { ...state, isShowDefinition: false };
    case actionTypes.TEST_CARD_MARK_KNOWN:
    case actionTypes.TEST_CARD_MARK_UNKNOWN:
      return { ...processMark(state, action), isShowDefinition: false };
    case actionTypes.TEST_CARD_MARK_UNDO:
      return { ...processUndoMark(state, action), isShowDefinition: false };
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

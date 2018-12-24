import { actionTypes } from './characterSamplesActions';

const DEFAULT_STATE = {
  bins: [],
  isShowDefinition: false
};

export default (state = DEFAULT_STATE, action = {}) => {
  switch (action.type) {
    case actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_START:
      return { ...state, bins: [] };
    case actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_SUCCESS:
      return {
        ...state,
        bins: action.characters
      };
    case actionTypes.CHARACTER_SAMPLES_DEFINITION_SHOW:
      return { ...state, isShowDefinition: true };
    case actionTypes.CHARACTER_SAMPLES_DEFINITION_HIDE:
      return { ...state, isShowDefinition: false };
    default:
      return state;
  }

}

export const bins = state => state.characterSamples.bins;
export const isShowDefinition = state => state.characterSamples.isShowDefinition;

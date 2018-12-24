import { actionTypes } from './characterSamplesActions';

const DEFAULT_STATE = {
  bins: []
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
    default:
      return state;
  }

}

export const bins = state => state.characterSamples.bins;

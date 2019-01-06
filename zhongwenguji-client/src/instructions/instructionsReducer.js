import { actionTypes } from './instructionsActions';

const DEFAULT_STATE = {
  showInstructions: false
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case actionTypes.INSTRUCTIONS_DISMISS:
      return { ...state, showInstructions: false };
    default:
      return state;
  }
};

export const showInstructions = ({ instructions }) => instructions.showInstructions;

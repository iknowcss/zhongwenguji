import { actionTypes } from './instructionsActions';
import instructionsReducer, { showInstructions } from './instructionsReducer';

describe('instructionsReducer', () => {
  it('has a default state', () => {
    expect(instructionsReducer()).toEqual({
      showInstructions: true
    });
  });

  it('dismisses instructions', () => {
    expect(instructionsReducer({
      showInstructions: true
    }, {
      type: actionTypes.INSTRUCTIONS_DISMISS
    })).toEqual({
      showInstructions: false
    });
  });

  describe('selector', () => {
    it('selects "showInstructions"', () => {
      expect(showInstructions({
        instructions: { showInstructions: true }
      })).toEqual(true);
    });
  });
});

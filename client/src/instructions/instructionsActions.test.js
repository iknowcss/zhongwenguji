import {
  actionTypes,
  dismissInstructions
} from './instructionsActions';

describe('instructionsActions', () => {
  it('dismisses instructions', () => {
    expect(dismissInstructions())
      .toEqual({ type: actionTypes.INSTRUCTIONS_DISMISS });
  });
});

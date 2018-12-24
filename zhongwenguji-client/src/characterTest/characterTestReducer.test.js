import characterTestReducer from './characterTestReducer';
import { actionTypes } from './characterTestActions';

describe('characterTestReducer', () => {
  describe('loading', () => {
    it('has defaults', () => {
      expect(characterTestReducer()).toEqual({
        bins: [],
        isShowDefinition: false,
        state: 'READY',
        currentSectionIndex: 0,
        currentCardIndex: 0
      });
    });

    it('starts loading character samples', () => {
      expect(characterTestReducer(null, {
        type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_START
      })).toEqual({
        bins: [],
        state: 'LOADING'
      });
    });

    it('successfully loads character samples and starts the test', () => {
      expect(characterTestReducer(null, {
        type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_SUCCESS,
        characters: [[], [], []]
      })).toEqual({
        bins: [[], [], []],
        state: 'TESTING'
      });
    });

    it('handles a loading error', () => {
      const error = new Error('Oh no');
      expect(characterTestReducer(null, {
        type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_FAIL,
        error
      })).toEqual({
        state: 'ERROR'
      });
    });
  });

  describe('definition', () => {
    it('shows the current card definition', () => {
      expect(characterTestReducer(null, {
        type: actionTypes.CHARACTER_SAMPLES_DEFINITION_SHOW
      })).toEqual({
        isShowDefinition: true
      });
    });

    it('hides the current card definition', () => {
      expect(characterTestReducer(null, {
        type: actionTypes.CHARACTER_SAMPLES_DEFINITION_HIDE
      })).toEqual({
        isShowDefinition: false
      });
    });
  });

  describe('marking', () => {
    it('mark current and moves to next card', () => {
      expect(characterTestReducer({
        bins: [{ sample: [{}, {}] }, { sample: [{}, {}] }],
        state: 'TESTING',
        currentSectionIndex: 0,
        currentCardIndex: 0
      }, {
        type: actionTypes.TEST_CARD_MARK_KNOWN
      })).toEqual({
        bins: [{ sample: [{}, {}] }, { sample: [{}, {}] }],
        state: 'TESTING',
        currentSectionIndex: 0,
        currentCardIndex: 1
      });
    });

    it('mark current and moves to next section', () => {
      expect(characterTestReducer({
        bins: [{ sample: [{}, {}] }, { sample: [{}, {}] }],
        state: 'TESTING',
        currentSectionIndex: 0,
        currentCardIndex: 1
      }, {
        type: actionTypes.TEST_CARD_MARK_KNOWN
      })).toEqual({
        bins: [{ sample: [{}, {}] }, { sample: [{}, {}] }],
        state: 'TESTING',
        currentSectionIndex: 1,
        currentCardIndex: 0
      });
    });

    it('mark current and completes the test', () => {
      expect(characterTestReducer({
        bins: [{ sample: [{}, {}] }, { sample: [{}, {}] }],
        state: 'TESTING',
        currentSectionIndex: 1,
        currentCardIndex: 1
      }, {
        type: actionTypes.TEST_CARD_MARK_KNOWN
      })).toEqual({
        bins: [{ sample: [{}, {}] }, { sample: [{}, {}] }],
        state: 'COMPLETE',
        currentSectionIndex: 0,
        currentCardIndex: 0
      });
    });

    it('un-does the previous mark back to the previous card', () => {
      expect(characterTestReducer({
        bins: [{ sample: [{}, {}] }, { sample: [{}, {}] }],
        state: 'TESTING',
        currentSectionIndex: 0,
        currentCardIndex: 1
      }, {
        type: actionTypes.TEST_CARD_MARK_UNDO
      })).toEqual({
        bins: [{ sample: [{}, {}] }, { sample: [{}, {}] }],
        state: 'TESTING',
        currentSectionIndex: 0,
        currentCardIndex: 0
      });
    });

    it('un-does the previous mark back to the previous section', () => {
      expect(characterTestReducer({
        bins: [{ sample: [{}, {}] }, { sample: [{}, {}] }],
        state: 'TESTING',
        currentSectionIndex: 1,
        currentCardIndex: 0
      }, {
        type: actionTypes.TEST_CARD_MARK_UNDO
      })).toEqual({
        bins: [{ sample: [{}, {}] }, { sample: [{}, {}] }],
        state: 'TESTING',
        currentSectionIndex: 0,
        currentCardIndex: 1
      });
    });

    it('does not undo beyond the first card', () => {
      expect(characterTestReducer({
        bins: [{ sample: [{}, {}] }, { sample: [{}, {}] }],
        state: 'TESTING',
        currentSectionIndex: 0,
        currentCardIndex: 0
      }, {
        type: actionTypes.TEST_CARD_MARK_UNDO
      })).toEqual({
        bins: [{ sample: [{}, {}] }, { sample: [{}, {}] }],
        state: 'TESTING',
        currentSectionIndex: 0,
        currentCardIndex: 0
      });
    });
  });

  describe('selectors', () => {

  });
});

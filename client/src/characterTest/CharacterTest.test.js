import React from 'react';
import renderer from 'react-test-renderer';
import CardStackDisplay from '../card/CardStackDisplay';
import CardStackButtons from '../card/CardStackButtons';
import { Pure as CharacterTest } from './CharacterTest';

const mockUnregister = jest.fn();
let mockOnKeyDown = null;

jest.mock('../util/keyHandler', () => jest.fn(({ onKeyDown } = {}) => {
  mockOnKeyDown = onKeyDown;
  return { unregister: mockUnregister };
}));

describe('CharacterTest', () => {
  beforeEach(() => {
    mockUnregister.mockClear();
  });

  afterEach(() => {
    mockOnKeyDown = null;
  });

  let component;
  let cardStackDisplay;
  let cardStackButtons;

  function setup(props) {
    const currentCard = { index: 1, score: NaN };

    component = renderer.create(
      <CharacterTest currentCard={currentCard} {...props} />
    );
    cardStackDisplay = component.root.findByType(CardStackDisplay);
    cardStackButtons = component.root.findByType(CardStackButtons);
  }

  it('renders', () => {
    setup();
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('renders an empty card', () => {
    component = renderer.create(
      <CharacterTest />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  describe('keypress events', () => {
    it('toggles the definition', () => {
      const toggleDefinition = jest.fn();
      setup({ toggleDefinition });
      mockOnKeyDown('ArrowDown');
      expect(toggleDefinition).toHaveBeenCalled();
    });

    it('marks the card unknown', () => {
      const markCurrentUnknown = jest.fn();
      setup({ markCurrentUnknown });
      mockOnKeyDown('ArrowLeft');
      expect(markCurrentUnknown).toHaveBeenCalled();
    });

    it('marks the card known', () => {
      const markCurrentKnown = jest.fn();
      setup({ markCurrentKnown });
      mockOnKeyDown('ArrowRight');
      expect(markCurrentKnown).toHaveBeenCalled();
    });

    it('un-does the previous marking', () => {
      const undoDiscard = jest.fn();
      setup({ undoDiscard });
      mockOnKeyDown('ArrowUp');
      expect(undoDiscard).toHaveBeenCalled();
    });

    it('does nothing on an unknown key', () => {
      setup();
      mockOnKeyDown('Enter');
    });
  });

  describe('touch events', () => {
    let markCurrentKnown;
    let markCurrentUnknown;
    let toggleDefinition;
    let undoDiscard;

    beforeAll(() => {
      markCurrentKnown = jest.fn();
      markCurrentUnknown = jest.fn();
      toggleDefinition = jest.fn();
      undoDiscard = jest.fn();
      setup({
        markCurrentKnown,
        markCurrentUnknown,
        toggleDefinition,
        undoDiscard
      });
    });

    it('marks current unknown', () => {
      cardStackDisplay.props.onDiscardLeft();
      expect(markCurrentUnknown).toHaveBeenCalledTimes(1);
    });

    it('marks current known', () => {
      cardStackDisplay.props.onDiscardRight();
      expect(markCurrentKnown).toHaveBeenCalledTimes(1);
    });

    it('does undo', () => {
      cardStackButtons.props.onUndo();
      expect(undoDiscard).toHaveBeenCalledTimes(1);
    });

    it('shows definition', () => {
      cardStackButtons.props.onDefinition();
      expect(toggleDefinition).toHaveBeenCalledTimes(1);
    });
  });
});

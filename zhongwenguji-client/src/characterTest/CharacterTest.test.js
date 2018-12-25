import React from 'react';
import renderer from 'react-test-renderer';
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

  function setup(props) {
    component = renderer.create(
      <CharacterTest {...props} />
    );
  }

  it('renders', () => {
    setup();
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

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
});

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
    const toggleDefinitionMock = jest.fn();
    setup({ toggleDefinition: toggleDefinitionMock });
    mockOnKeyDown('ArrowUp');
    expect(toggleDefinitionMock).toHaveBeenCalled();
  });
});

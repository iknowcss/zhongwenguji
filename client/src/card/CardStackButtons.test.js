import React from 'react';
import Renderer from 'react-test-renderer';
import Button from '../component/Button';
import CardStackButtons from './CardStackButtons';

describe('CardStackButtons', () => {
  let component;
  let undoButton;
  let definitionButton;

  function setup(props) {
    component = Renderer.create(<CardStackButtons {...props} />);
    const buttons = component.root.findAllByType(Button);
    undoButton = buttons[0];
    definitionButton = buttons[1];
  }

  it('renders', () => {
    setup();
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('updates the buttons when showDefinition is true', () => {
    setup({ showDefinition: true });
    expect(undoButton.props.disabled).toEqual(true);
    expect(definitionButton.props.className.split(/\s+/)).toEqual(
      expect.arrayContaining(['buttonActive'])
    );
  });

  describe('click handlers', () => {
    let onUndo;
    let onDefinition;
    let preventDefault;

    beforeEach(() => {
      onUndo = jest.fn();
      onDefinition = jest.fn();
      preventDefault = jest.fn();
      setup({ onUndo, onDefinition });
    });

    it('calls onUndo', () => {
      undoButton.props.onClick({ preventDefault });
      expect(preventDefault).toHaveBeenCalledTimes(1);
      expect(onUndo).toHaveBeenCalledTimes(1);
    });

    it('calls onDefinition', () => {
      definitionButton.props.onClick({ preventDefault });
      expect(preventDefault).toHaveBeenCalledTimes(1);
      expect(onDefinition).toHaveBeenCalledTimes(1);
    });
  });
});

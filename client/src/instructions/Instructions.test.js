import React from 'react';
import Renderer from 'react-test-renderer';
import Button from '../component/Button';
import { Pure as Instructions } from './Instructions';

describe('Instructions', () => {
  it('renders keyboard instructions', () => {
    const component = Renderer.create(
      <Instructions />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('renders touch instructions', () => {
    const component = Renderer.create(
      <Instructions touch />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('dismisses instructions', () => {
    const dismissInstructions = jest.fn();
    const preventDefault = jest.fn();
    const component = Renderer.create(
      <Instructions dismissInstructions={dismissInstructions} />
    );
    const startSimplifiedButton = component.root.findAllByType(Button)[0];
    startSimplifiedButton.props.onClick({ preventDefault });

    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(dismissInstructions).toHaveBeenCalledTimes(1);
  });

  describe('toggle character set', () => {
    let component;
    let checkbox;
    let setCharacterSetTraditional;
    let setCharacterSetSimplified;

    beforeEach(() => {
      setCharacterSetTraditional = jest.fn();
      setCharacterSetSimplified = jest.fn();
      component = Renderer.create(
        <Instructions
          setCharacterSetTraditional={setCharacterSetTraditional}
          setCharacterSetSimplified={setCharacterSetSimplified}
        />
      );
      checkbox = component.root.findAllByProps({ id: 'traditionalCheckbox' })[0];
    });

    it('toggles the traditional character set', () => {
      checkbox.props.onChange({ target: { checked: true }});
      expect(setCharacterSetSimplified).not.toHaveBeenCalled();
      expect(setCharacterSetTraditional).toHaveBeenCalledTimes(1);
    });

    it('toggles the simplified character set', () => {
      checkbox.props.onChange({ target: { checked: false }});
      expect(setCharacterSetSimplified).toHaveBeenCalledTimes(1);
      expect(setCharacterSetTraditional).not.toHaveBeenCalled();
    });
  });
});

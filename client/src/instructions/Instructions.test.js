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
    const dismissButton = component.root.findAllByType(Button)[0];
    dismissButton.props.onClick({ preventDefault });

    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(dismissInstructions).toHaveBeenCalledTimes(1);
  });
});

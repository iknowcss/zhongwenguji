import React from 'react';
import Renderer from 'react-test-renderer';
import { LoadingIcon } from './Icon';

describe('Icon', () => {
  it('renders LoadingIcon with default size', () => {
    const component = Renderer.create(<LoadingIcon />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('renders LoadingIcon with medium size', () => {
    const component = Renderer.create(<LoadingIcon size="medium" />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});

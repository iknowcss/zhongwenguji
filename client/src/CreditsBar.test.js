import React from 'react';
import Renderer from 'react-test-renderer';
import CreditsBar from './CreditsBar';

describe('CreditsBar', () => {
  it('renders', () => {
    const component = Renderer.create(<CreditsBar />);
    expect(component).toMatchSnapshot();
  });
});

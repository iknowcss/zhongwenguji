import React from 'react';
import Renderer from 'react-test-renderer';
import ResultsDisplay from './ResultsDisplay';

describe('ResultsDisplay', () => {
  it('renders', () => {
    const component = Renderer.create(
      <ResultsDisplay
        estimate={1500}
        uncertainty={200}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});

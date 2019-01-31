import React from 'react';
import Renderer from 'react-test-renderer';
import { Pure as AddToSkritter } from './AddToSkritter';

describe('AddToSkritter', () => {
  let component;

  function setup(props) {
    component = Renderer.create(<AddToSkritter {...props} />);
  }

  it('renders with defaults', () => {
    setup();
  });
});

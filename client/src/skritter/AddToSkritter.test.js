import React from 'react';
import Renderer from 'react-test-renderer';
import { characterSetEnum } from '../characterTest/characterTestReducer';
import { Pure as AddToSkritter } from './AddToSkritter';

describe('AddToSkritter', () => {
  let component;

  function setup(props) {
    component = Renderer.create(
      <AddToSkritter
        missedCards={[]}
        characterSet={characterSetEnum.SIMPLIFIED}
        userName="iknowcss"
        auth="b2hhaQ=="
        {...props}
      />
    );
  }

  it('renders with defaults', () => {
    setup();
    expect(component.toJSON()).toMatchSnapshot();
  });
});

import React from 'react';
import renderer from 'react-test-renderer';
import CardStackMobile from './CardStackMobile';

describe('CardStackMobile', () => {
  let component;

  function setup(overrides) {
    const props = {
      character: '科',
      pinyin: 'ke1',
      definition: 'branch of study'
    };

    component = renderer.create(
      <CardStackMobile {...props} {...overrides} />
    );
  }

  it('renders', () => {
    setup();
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

import React from 'react';
import renderer from 'react-test-renderer';
import CharacterCard from './CharacterCard';

describe('CharacterCard', () => {
  let component;

  function setup(overrides) {
    const props = {
      character: '科',
      pinyin: 'ke1',
      definition: 'branch of study'
    };

    component = renderer.create(
      <CharacterCard {...props} {...overrides} />
    );
  }

  it('renders the character', () => {
    setup();
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders the definition', () => {
    setup({ showDefinition: true });
    const tree = component.toJSON();

    expect(tree.props.className.trim().split(/\s+/))
      .toEqual(['TestCard', 'TestCard--showDefinition']);
    expect(tree).toMatchSnapshot();
  });

  it('has a class for unknown marking', () => {
    setup({ score: 0 });
    const tree = component.toJSON();

    expect(tree.props.className.trim().split(/\s+/))
      .toEqual(['TestCard', 'TestCard--markedUnknown']);
  });

  it('has a class for unknown marking', () => {
    setup({ score: 1 });
    const tree = component.toJSON();

    expect(tree.props.className.trim().split(/\s+/))
      .toEqual(['TestCard', 'TestCard--markedKnown']);
  });
});

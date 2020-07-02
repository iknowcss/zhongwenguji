import React from 'react';
import renderer from 'react-test-renderer';
import CharacterCard from './CharacterCard';

describe('CharacterCard', () => {
  let component;

  function setup(overrides) {
    const props = {
      i: 33,
      cs: '对',
      ct: '對',
      p: ['dui4'],
      d: ['right/correct']
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
      .toEqual(['container', 'showDefinition']);
    expect(tree).toMatchSnapshot();
  });

  it('renders the fallback definition', () => {
    setup({ showDefinition: true, d: undefined });
    const tree = component.toJSON();

    expect(tree.props.className.trim().split(/\s+/))
      .toEqual(['container', 'showDefinition']);
    expect(tree).toMatchSnapshot();
  });

  it('has a class for unknown marking', () => {
    setup({ known: false });
    const tree = component.toJSON();

    expect(tree.props.className.trim().split(/\s+/))
      .toEqual(['container', 'markedUnknown']);
  });

  it('has a class for unknown marking', () => {
    setup({ known: true });
    const tree = component.toJSON();

    expect(tree.props.className.trim().split(/\s+/))
      .toEqual(['container', 'markedKnown']);
  });
});

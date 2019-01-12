import mapSelectors from './mapSelectors';

describe('mapSelectors', () => {
  it('returns a function which generates props from state', () => {
    const mapStateToProps = mapSelectors({
      alphafoo: ({ alpha }) => alpha.foo,
      bravobar: ({ bravo }) => bravo.bar
    });

    expect(mapStateToProps({
      alpha: { foo: 'mochi' },
      bravo: { bar: 'margarita' }
    })).toEqual({
      alphafoo: 'mochi',
      bravobar: 'margarita'
    });
  });
});

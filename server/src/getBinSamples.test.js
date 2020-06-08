const getBinSamples = require('./getBinSamples');

describe('getBinSamples', () => {
  function range(end) {
    return Array.from({ length: end }, (x, i) => i);
  }

  it('gets the subset from plentiful data', () => {
    const items = range(100);
    const result = getBinSamples(items, 10, 5, [0, 1, 2]);
    expect(result).toHaveLength(3);
    expect(result).toEqual([
      [0, 1, 2, 3, 4],
      [10, 11, 12, 13, 14],
      [20, 21, 22, 23, 24],
    ]);
  });

  it('gets the next subset from plentiful data', () => {
    const items = range(100);
    const result = getBinSamples(items, 10, 5, [1], 1);
    expect(result).toHaveLength(1);
    expect(result).toEqual([
      [15, 16, 17, 18, 19],
    ]);
  });

  it('treats non-existent bin ids as empty arrays', () => {
    const items = range(100);
    const result = getBinSamples(items, 10, 5, [8, 9, 10]);
    expect(result).toHaveLength(3);
    expect(result).toEqual([
      [80, 81, 82, 83, 84],
      [90, 91, 92, 93, 94],
      [],
    ]);
  });

  it('returns less than the requested subset size if there are not enough items', () => {
    const items = range(11);
    const result = getBinSamples(items, 3, 4, [0, 1, 2]);
    expect(result).toHaveLength(3);
    expect(result).toEqual([
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [8, 9, 10],
    ]);
  });

  it('returns less than the requested subset size if there are not enough items in the next selection', () => {
    const items = range(100);
    const result = getBinSamples(items, 10, 3, [1], 3);
    expect(result).toHaveLength(1);
    expect(result).toEqual([
      [19],
    ]);
  });
});

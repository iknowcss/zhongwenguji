const getBinSamples = require('./getBinSamples');

describe('getBinSamples', () => {
  function range(end) {
    return Array.from({ length: end }, (x, i) => ({ i: i + 1 }));
  }

  it('gets the subset from plentiful data', () => {
    const items = range(100);
    const result = getBinSamples(items, 10, 5, [0, 1, 2], 0);
    expect(result.seed).toBeUndefined();
    expect(result.samples).toHaveLength(3);
    expect(result.samples).toEqual([
      [{ i: 1 }, { i: 2 }, { i: 3 }, { i: 4 }, { i: 5 }],
      [{ i: 11 }, { i: 12 }, { i: 13 }, { i: 14 }, { i: 15 }],
      [{ i: 21 }, { i: 22 }, { i: 23 }, { i: 24 }, { i: 25 }],
    ]);
  });

  it('gets the next subset from plentiful data', () => {
    const items = range(100);
    const result = getBinSamples(items, 10, 5, [1], 1);
    expect(result.seed).toBeUndefined();
    expect(result.samples).toHaveLength(1);
    expect(result.samples).toEqual([
      [{ i: 16 }, { i: 17 }, { i: 18 }, { i: 19 }, { i: 20 }],
    ]);
  });

  it('treats non-existent bin ids as empty arrays', () => {
    const items = range(100);
    const result = getBinSamples(items, 10, 5, [8, 9, 10], 0);
    expect(result.seed).toBeUndefined();
    expect(result.samples).toHaveLength(3);
    expect(result.samples).toEqual([
      [{ i: 81 }, { i: 82 }, { i: 83 }, { i: 84 }, { i: 85 }],
      [{ i: 91 }, { i: 92 }, { i: 93 }, { i: 94 }, { i: 95 }],
      [],
    ]);
  });

  it('returns less than the requested subset size if there are not enough items', () => {
    const items = range(11);
    const result = getBinSamples(items, 3, 4, [0, 1, 2], 0);
    expect(result.seed).toBeUndefined();
    expect(result.samples).toHaveLength(3);
    expect(result.samples).toEqual([
      [{ i: 1 }, { i: 2 }, { i: 3 }, { i: 4 }],
      [{ i: 5 }, { i: 6 }, { i: 7 }, { i: 8 }],
      [{ i: 9 }, { i: 10 }, { i: 11 }],
    ]);
  });

  it('returns less than the requested subset size if there are not enough items in the next selection', () => {
    const items = range(100);
    const result = getBinSamples(items, 10, 3, [1], 3);
    expect(result.seed).toBeUndefined();
    expect(result.samples).toHaveLength(1);
    expect(result.samples).toEqual([
      [{ i: 20 }],
    ]);
  });

  describe('incomplete bins', () => {
    const items = [
      { i: 1 }, { i: 2 }, { i: 3 }, { i: 4 }, { i: 5 },
      { i: 6 }, { i: 7 }, { i: 9 }, { i: 10 }, // Missing { i: 8 }
      { i: 11 }, { i: 12 }, { i: 13 }, { i: 14 }, { i: 15 },
    ];

    it('gets the first sample', () => {
      const result = getBinSamples(items, 3, 3, [0, 1, 2], 0);
      expect(result.seed).toBeUndefined();
      expect(result.samples).toHaveLength(3);
      expect(result.samples).toEqual([
        [{ i: 1 }, { i: 2 }, { i: 3 }],
        [{ i: 6 }, { i: 7 }, { i: 9 }],
        [{ i: 11 }, { i: 12 }, { i: 13 }],
      ]);
    });

    it('gets the last sample', () => {
      const result = getBinSamples(items, 3, 3, [0, 1, 2], 1);
      expect(result.seed).toBeUndefined();
      expect(result.samples).toHaveLength(3);
      expect(result.samples).toEqual([
        [{ i: 4 }, { i: 5 }],
        [{ i: 10 }],
        [{ i: 14 }, { i: 15 }],
      ]);
    });
  });
});

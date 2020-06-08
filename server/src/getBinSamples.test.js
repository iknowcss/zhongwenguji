const { getBinSamples } = require('./getBinSamples');

describe('/getBinSamples', () => {

  describe('getBinSamples', () => {
    const seed = .314159;

    function range(end) {
      return Array.from({ length: end }, (x, i) => i);
    }

    it('gets the subset from plentiful data', () => {
      const items = range(100);
      const result = getBinSamples(items, 10, 5, [0, 1, 2], { seed });
      expect(result.seed).toEqual(seed);
      expect(result.samples).toHaveLength(3);
      expect(result.samples).toEqual([
        [1, 5, 9, 2, 7],
        [14, 19, 11, 16, 17],
        [29, 28, 26, 27, 21],
      ]);
    });

    it('gets the next subset from plentiful data', () => {
      const items = range(100);
      const result = getBinSamples(items, 10, 5, [1], { seed, subsetSkip: 1 });
      expect(result.seed).toEqual(seed);
      expect(result.samples).toHaveLength(1);
      expect(result.samples).toEqual([
        [18, 12, 13, 10, 15],
      ]);
    });

    it('treats non-existent bin ids as empty arrays', () => {
      const items = range(100);
      const result = getBinSamples(items, 10, 5, [8, 9, 10], { seed });
      expect(result.seed).toEqual(seed);
      expect(result.samples).toHaveLength(3);
      expect(result.samples).toEqual([
        [87, 89, 83, 84, 80],
        [99, 92, 93, 96, 95],
        [],
      ]);
    });

    it('returns less than the requested subset size if there are not enough items', () => {
      const items = range(11);
      const result = getBinSamples(items, 3, 4, [0, 1, 2], { seed });
      expect(result.seed).toEqual(seed);
      expect(result.samples).toHaveLength(3);
      expect(result.samples).toEqual([
        [0, 2, 3, 1],
        [5, 7, 4, 6],
        [10, 8, 9],
      ]);
    });

    it('returns less than the requested subset size if there are not enough items in the next selection', () => {
      const items = range(100);
      const result = getBinSamples(items, 10, 3, [1], { seed, subsetSkip: 3 });
      expect(result.seed).toEqual(seed);
      expect(result.samples).toHaveLength(1);
      expect(result.samples).toEqual([
        [15],
      ]);
    });
  });
});

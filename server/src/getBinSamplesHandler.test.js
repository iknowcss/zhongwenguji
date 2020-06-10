const allCharacters = require('../all-characters.json').characters;
const getBinSamples = require('./getBinSamples');
const getBinSampleHandler = require('./getBinSamplesHandler');

jest.mock('./getBinSamples', () => jest.fn(args => ({ mockJson: true })));

describe('/getBinSamples', () => {
  const totalCharacterCount = allCharacters[allCharacters.length - 1].i;

  function runWithQuery(query) {
    const json = jest.fn();
    getBinSampleHandler({ query }, { json });
    expect(json).toHaveBeenCalledTimes(1);
    expect(getBinSamples).toHaveBeenCalledTimes(1);

    const args = getBinSamples.mock.calls[0];
    return {
      allCharacters: args[0],
      binCount: args[1],
      subsetSize: args[2],
      selectionBins: args[3],
      subsetSkip: args[4],
      seed: args[5],
      responseJson: json.mock.calls[0][0],
    };
  }

  beforeEach(() => {
    getBinSamples.mockClear();
  });

  it('handles a minimal request', () => {
    const args = runWithQuery({});
    expect(args.allCharacters).toEqual(allCharacters);
    expect(args.binCount).toEqual(40);
    expect(args.subsetSize).toEqual(5);
    expect(args.selectionBins).toEqual(Array.from({
      length: Math.ceil(totalCharacterCount / 40),
    }, (n, i) => i));
    expect(args.subsetSkip).toEqual(0);
    expect(args.seed).toBeLessThan(100000);

    expect(args.responseJson).toEqual({
      binCount: 40,
      subsetSize: 5,
      seed: args.seed,
      totalCharacterCount,
      characters: { mockJson: true },
    });
  });

  it('handles a maximal request', () => {
    const args = runWithQuery({
      binCount: '10',
      subsetSize: '12',
      selectionBins: '2,3,4',
      subsetSkip: '1',
      seed: '314159'
    });
    expect(args.allCharacters).toEqual(allCharacters);
    expect(args.binCount).toEqual(10);
    expect(args.subsetSize).toEqual(12);
    expect(args.selectionBins).toEqual([2, 3, 4]);
    expect(args.subsetSkip).toEqual(1);
    expect(args.seed).toEqual(314159);
  });

  it('handles bad input gracefully', () => {
    const args = runWithQuery({
      binCount: '-1',
      subsetSize: 'words',
      selectionBins: '1,two,3,',
      subsetSkip: '999999999999999999999999999999999999999999999999999999999999',
    });
    expect(args.allCharacters).toEqual(allCharacters);
    expect(args.binCount).toEqual(40);
    expect(args.subsetSize).toEqual(5);
    expect(args.selectionBins).toEqual([1, 3]);
    expect(args.subsetSkip).toEqual(0);
  });
});

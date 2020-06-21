const { fitModelToMarkings } = require('./submitTest');

describe('submitTest', () => {
  /**
   * @type {FrequencyEntry[]}
   */
  const entries = Array
    .from({ length: 8 * 8 }, (n, i) => ({ i: i + 1 }));

  /**
   * @type BinSampleParameters
   */
  const binSampleParameters = {
    binCount: 8,
    seed: 0,
    subsetSize: 4,
  };

  it('does a close fit', () => {
    const markedEntries = [
      [ 1,  true], [ 2,  true], [ 3,  true], [ 4,  true],
      [ 9,  true], [10, false], [11,  true], [12, false],
      [17, false], [18, false], [19, false], [20, false],
    ].map(([ i, known ]) => ({ i, known }));

    const result = fitModelToMarkings(entries, binSampleParameters, markedEntries);
    const {
      knownEstimate,
      knownEstimateError,
      graphData,
    } = result;

    expect(graphData.samplePoints).toEqual([
      { x: 4.5 + 8 * 0, y: 100 },
      { x: 4.5 + 8 * 1, y: 50 },
      { x: 4.5 + 8 * 2, y: 0 },
    ]);
    expect(knownEstimate).toEqual(12.6);
    expect(knownEstimateError).toEqual(0.6); // Can't be less than 5%
    expect(graphData.modelFitPoints).toMatchSnapshot();
  });

  it('does a wide fit', () => {
    const markedEntries = [
      [ 1,  true], [ 2,  true], [ 3,  true], [ 4,  true],
      [ 9, false], [10, false], [11, false], [12, false],
      [17,  true], [18,  true], [19,  true], [20,  true],
      [25, false], [26, false], [27, false], [28, false],
      [33, false], [34, false], [35, false], [36, false],
    ].map(([ i, known ]) => ({ i, known }));

    const result = fitModelToMarkings(entries, binSampleParameters, markedEntries);
    const {
      knownEstimate,
      knownEstimateError,
      graphData,
    } = result;

    expect(graphData.samplePoints).toEqual([
      { x: 4.5 + 8 * 0, y: 100 },
      { x: 4.5 + 8 * 1, y: 0 },
      { x: 4.5 + 8 * 2, y: 100 },
      { x: 4.5 + 8 * 3, y: 0 },
      { x: 4.5 + 8 * 4, y: 0 },
    ]);
    expect(knownEstimate).toEqual(20);
    expect(knownEstimateError).toEqual(10);
    expect(graphData.modelFitPoints).toMatchSnapshot();
  });
});

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

  it('does something', () => {
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
      { x:  4.5, y: 100 },
      { x: 12.5, y: 50 },
      { x: 20.5, y: 0 },
    ]);
    expect(knownEstimate).toMatchSnapshot();
    expect(knownEstimateError).toMatchSnapshot();
    expect(graphData.modelFitPoints).toMatchSnapshot();

    // console.log(result)
  });


});

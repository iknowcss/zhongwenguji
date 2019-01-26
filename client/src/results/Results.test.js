import React from 'react';
import Renderer from 'react-test-renderer';
import { hasClassName } from '../util/asdf.testutil';
import ResultsDisplay from './ResultsDisplay';
import ResultsChart from './ResultsChart';
import { Pure as Results } from './Results';

jest.mock('./ResultsDisplay', () => () => <div className="ResultsDisplay" />);
jest.mock('./ResultsChart', () => () => <div className="ResultsChart" />);

describe('Results', () => {
  it('renders', () => {
    const component = Renderer.create(<Results />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('passes results data down to children', () => {
    const knownEstimate = 1500;
    const knownEstimateUncertainty = 200;
    const curvePoints = [[0, 53], [249, 53], [498, 53]];
    const samplePoints = [[124.5, 60], [373.5, 40], [622.5, 60]];
    const resultData = { knownEstimate, knownEstimateUncertainty, curvePoints, samplePoints };
    const component = Renderer.create(<Results resultData={resultData} />);

    const resultsDisplay = component.root.findByType(ResultsDisplay);
    expect(resultsDisplay.props).toEqual(
      expect.objectContaining({
        estimate: knownEstimate,
        uncertainty: knownEstimateUncertainty
      })
    );

    const resultsChart = component.root.findByType(ResultsChart);
    expect(resultsChart.props).toEqual(
      expect.objectContaining({ curvePoints, samplePoints })
    );
  });

  it('starts again', () => {
    const preventDefault = jest.fn();
    const resetTest = jest.fn();
    const component = Renderer.create(<Results resetTest={resetTest} />);
    const startAgainButton = component.root.findByProps({ stringId: 'results.startAgain' });
    startAgainButton.props.onClick({ preventDefault });
    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(resetTest).toHaveBeenCalledTimes(1);
  });

  it('reviews missed characters', () => {
    const preventDefault = jest.fn();
    const reviewMissed = jest.fn();
    const component = Renderer.create(<Results reviewMissed={reviewMissed} />);
    const reviewMissedButton = component.root.findByProps({ stringId: 'results.reviewMissedCharacters' });
    reviewMissedButton.props.onClick({ preventDefault });
    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(reviewMissed).toHaveBeenCalledTimes(1);
  });
});

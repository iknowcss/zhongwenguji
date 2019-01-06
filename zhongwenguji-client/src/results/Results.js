import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import mapSelectors from '../util/mapSelectors';
import ResultsDisplay from './ResultsDisplay';
import ResultsChart from './ResultsChart';
import { resultData, scoreStatistics } from '../characterTest/characterTestReducer';
import { resetTest } from '../characterTest/characterTestActions';
import style from './Results.module.scss';
import Button from '../component/Button';
import I18n from '../i18n/I18n';

const noop = () => {};

class Results extends Component {
  static propTypes = {
    scoreStatistics: PropTypes.object,
    resultData: PropTypes.object,
    resetTest: PropTypes.func
  };

  static defaultProps = {
    scoreStatistics: {},
    resultData: {},
    resetTest: noop
  };

  handleStartAgainClick = (event) => {
    event.preventDefault();
    this.props.resetTest();
  };

  render() {
    const resultData = this.props.resultData || {};

    return (
      <div className={style.container}>
        <ResultsDisplay
          estimate={resultData.knownEstimate}
          uncertainty={resultData.knownEstimateUncertainty}
        />
        <ResultsChart
          curvePoints={resultData.curvePoints}
          samplePoints={resultData.samplePoints}
        />
        <div className={style.startAgainContainer}>
          <I18n component={Button} stringId="results.startAgain" onClick={this.handleStartAgainClick} />
        </div>
      </div>
    );
  }
}

export { Results as Pure };

export default connect(mapSelectors({
  scoreStatistics,
  resultData
}), { resetTest })(Results);

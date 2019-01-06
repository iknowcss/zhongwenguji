import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import mapSelectors from '../util/mapSelectors';
import ResultsDisplay from './ResultsDisplay';
import ResultsChart from './ResultsChart';
import { resultData, scoreStatistics } from '../characterTest/characterTestReducer';
import style from './Results.module.scss';

class Results extends Component {
  static propTypes = {
    scoreStatistics: PropTypes.object,
    resultData: PropTypes.object
  };

  static defaultProps = {
    scoreStatistics: {},
    resultData: {}
  };

  render() {
    return (
      <div className={style.container}>
        <ResultsDisplay
          estimate={this.props.resultData.knownEstimate}
          uncertainty={this.props.resultData.knownEstimateUncertainty}
        />
        <ResultsChart
          curvePoints={this.props.resultData.curvePoints}
          samplePoints={this.props.resultData.samplePoints}
        />
      </div>
    );
  }
}

export { Results as Pure };

export default connect(mapSelectors({
  scoreStatistics,
  resultData
}))(Results);

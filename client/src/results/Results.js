import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';
import getConfig from '../getConfig';
import mapSelectors from '../util/mapSelectors';
import noop from '../util/noop';
import ResultsDisplay from './ResultsDisplay';
import ResultsChart from './ResultsChart';
import MissedCards from './MissedCards';
import { resultData, scoreStatistics, missedCards } from '../characterTest/characterTestReducer';
import { resetTest } from '../characterTest/characterTestActions';
import Button from '../component/Button';
import I18n from '../i18n/I18n';
import style from './Results.module.scss';

const feedbackPrefillUrl = getConfig().feedbackPrefillUrl;

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
          className={style.resultsDisplay}
          estimate={resultData.knownEstimate}
          uncertainty={resultData.knownEstimateUncertainty}
        />
        <ResultsChart
          curvePoints={resultData.curvePoints}
          samplePoints={resultData.samplePoints}
        />
        <div className={style.actionContainer}>
          <I18n component={Button} className={style.action} stringId="results.reviewMissedCharacters" />
          <I18n component={Button} className={style.action} stringId="results.startAgain" onClick={this.handleStartAgainClick} />
          <div className={cx(style.action, style.feedbackBar)}>
            <I18n component="div" stringId="results.feedbackPreface" />
            <I18n
              component="a"
              stringId="results.feedbackLinkText"
              href={`${feedbackPrefillUrl}${resultData.testId}`}
              target="_blank"
              rel="noopener"
            />
          </div>
        </div>
      </div>
    );
  }
}

export { Results as Pure };

export default connect(mapSelectors({
  scoreStatistics,
  resultData,
  missedCards
}), { resetTest })(Results);

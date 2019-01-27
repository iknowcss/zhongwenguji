import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import I18n from '../i18n/I18n';
import style from './ResultsDisplay.module.scss';

const ResultsDisplay = ({ estimate, uncertainty, className }) => (
  <div className={cx(style.container, className)}>
    <I18n
      component="div"
      stringId="results.youKnow"
      className={style.youKnow}
    />
    <div className={style.estimate}>
      <span className={style.mean}>{estimate}</span>
      <span className={style.plusMinus}>±</span>
      <span className={style.std}>{uncertainty}</span>
    </div>
    <I18n
      component="div"
      stringId="results.measure"
      className={style.measure}
    />
  </div>
);

ResultsDisplay.propTypes = {
  estimate: PropTypes.number,
  uncertainty: PropTypes.number
};

ResultsDisplay.defaultProps = {
  estimate: 0,
  resultData: 0
};

export default ResultsDisplay;
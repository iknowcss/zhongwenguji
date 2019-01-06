import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import cx from 'classnames';
import { loadSamples } from './characterTest/characterTestActions';
import CharacterTest from './characterTest/CharacterTest';
import { LoadingIcon } from './component/Icon';
import { status, statusEnum } from './characterTest/characterTestReducer';
import { showInstructions } from './instructions/instructionsReducer';
import Instructions from './instructions/Instructions';
import Results from './results/Results';
import CreditsBar from './CreditsBar';
import mapSelectors from './util/mapSelectors'
import style from './App.module.scss';

const noop = () => {};

const LoadingPage = ({ className }) => (
  <div className={cx(style.loadingPage, className)}>
    <LoadingIcon size="large" />
  </div>
);

class App extends Component {
  static propTypes = {
    status: PropTypes.string,
    showInstructions: PropTypes.bool,
    loadSamples: PropTypes.func
  };

  static defaultProps = {
    status: '',
    showInstructions: false,
    loadSamples: noop
  };

  componentDidMount() {
    this.props.loadSamples();
  }

  componentDidUpdate() {
    if (this.props.status === statusEnum.READY) {
      this.props.loadSamples();
    }
  }

  render() {
    const isTouch = 'ontouchstart' in document.documentElement;
    const { status, showInstructions } = this.props;
    return (
      <CSSTransitionGroup
        component="div"
        transitionName={style}
        transitionEnterTimeout={200}
        transitionLeaveTimeout={200}
      >
        {status === statusEnum.TESTING ? <div className={style.container} key="characterTest"><CharacterTest /></div> : null}
        {status === statusEnum.LOADING ? <div className={style.container} key="loadingPage1"><LoadingPage /></div> : null}
        {showInstructions ? <div className={style.container} key="instructions"><Instructions touch={isTouch}/></div> : null}
        {status === statusEnum.RESULTS_READY ? <div className={style.container} key="results"><Results /></div> : null}
        {status === statusEnum.RESULTS_LOADING ? <div className={style.container} key="loadingPage2"><LoadingPage /></div> : null}
        {!showInstructions && status === statusEnum.TESTING ? <div className={style.container} key="creditsBar"><CreditsBar /></div> : null}
      </CSSTransitionGroup>
    );
  }
}

export { App as Pure };

export default connect(
  mapSelectors({ status, showInstructions }),
  { loadSamples }
)(App);

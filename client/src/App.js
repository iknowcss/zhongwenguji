import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { loadSamples } from './characterTest/characterTestActions';
import CharacterTest from './characterTest/CharacterTest';
import { status, statusEnum } from './characterTest/characterTestReducer';
import { showInstructions } from './instructions/instructionsReducer';
import Instructions from './instructions/Instructions';
import Results from './results/Results';
import LoadingPage from './page/LoadingPage';
import CreditsBar from './CreditsBar';
import mapSelectors from './util/mapSelectors'
import style from './App.module.scss';
import noop from './util/noop';

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
        {status === statusEnum.TESTING ? (
          <div className={style.transitionElement} key="characterTest">
            <CharacterTest />
          </div>
        ) : null}

        {status === statusEnum.LOADING ? (
          <div className={style.transitionElement} key="loadingPage1">
            <LoadingPage />
          </div>
        ): null}

        {showInstructions ? (
          <div className={style.transitionElement} key="instructions">
            <Instructions touch={isTouch}/>
          </div>
        ): null}

        {status === statusEnum.RESULTS_READY ? (
          <div className={style.transitionElement} key="results">
            <Results />
          </div>
        ): null}

        {status === statusEnum.RESULTS_LOADING ? (
          <div className={style.transitionElement} key="loadingPage2">
            <LoadingPage />
          </div>
        ): null}

        {!showInstructions && status === statusEnum.TESTING ? (
          <CreditsBar />
        ): null}
      </CSSTransitionGroup>
    );
  }
}

export { App as Pure };

export default connect(
  mapSelectors({ status, showInstructions }),
  { loadSamples }
)(App);

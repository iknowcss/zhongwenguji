import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadSamples } from './characterTest/characterTestActions';
import CharacterTest from './characterTest/CharacterTest';
import { status } from './characterTest/characterTestReducer';
import Instructions from './instructions/Instructions';
import Results from './results/Results';
import style from './App.module.scss';

const noop = () => {};

class App extends Component {
  static propTypes = {
    status: PropTypes.string,
    loadSamples: PropTypes.func
  };

  static defaultProps = {
    status: '',
    loadSamples: noop
  };

  componentDidMount() {
    this.props.loadSamples();
  }

  render() {
    return (
      <div className={style.container}>
        {/*<div>{this.props.status || '(none)'}</div>*/}
        {this.props.status !== 'RESULTS_READY' ? <CharacterTest /> : null}
        <Instructions />
        {this.props.status === 'RESULTS_READY' ? <Results /> : null}
      </div>
    );
  }
}

export { App as Pure };

export default connect(
  (state) => ({ status: status(state) }),
  { loadSamples }
)(App);

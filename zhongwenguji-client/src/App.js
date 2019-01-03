import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadSamples } from './characterTest/characterTestActions';
import CharacterTest from './characterTest/CharacterTest';
import Instructions from './instructions/Instructions';
import Results from './results/Results';
import style from './App.module.scss';

const noop = () => {};

class App extends Component {
  static propTypes = {
    loadSamples: PropTypes.func
  };

  static defaultProps = {
    loadSamples: noop
  };

  componentDidMount() {
    this.props.loadSamples();
  }

  render() {
    return (
      <div className={style.container}>
        <CharacterTest />
        <Instructions />
        <Results />
      </div>
    );
  }
}

export { App as Pure };

export default connect(
  () => ({}),
  { loadSamples }
)(App);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadSamples, toggleDefinition } from './characterSamples/characterSamplesActions';
import { bins, isShowDefinition } from './characterSamples/characterSamplesReducer';
import CharacterCard from './CharacterCard';
import './App.css';

function keyHandler({ onKeyUp = () => {}, onKeyDown = () => {} }) {
  const regexp = /^Arrow/;
  const pressMap = {};

  function keydown(e) {
    if (!regexp.test(e.key)) return;
    if (pressMap[e.key]) return;
    pressMap[e.key] = true;
    onKeyDown(e.key);
  }

  function keyup(e) {
    if (!regexp.test(e.key)) return;
    delete pressMap[e.key];
    onKeyUp(e.key);
  }

  window.addEventListener('keydown', keydown);
  window.addEventListener('keyup', keyup);

  return {
    unregister() {
      window.removeEventListener('keydown', keydown);
      window.removeEventListener('keyup', keyup);
      this.unregister = () => {};
    }
  };
}

class App extends Component {
  static propTypes = {
    bins: PropTypes.array,
    isShowDefinition: PropTypes.bool,
    loadSamples: PropTypes.func,
    toggleDefinition: PropTypes.func
  };

  static defaultProps = {
    bins: [],
    isShowDefinition: false,
    loadSamples: () => {},
    toggleDefinition: () => {}
  };

  handleKeyDown = (key) => {
    switch (key) {
      case 'ArrowLeft':
        break;
      case 'ArrowRight':
        break;
      case 'ArrowUp':
        this.props.toggleDefinition();
        break;
      default:
        break;
    }
  };

  componentDidMount() {
    this.props.loadSamples();
    this.keyHandler = keyHandler({
      onKeyDown: this.handleKeyDown
    });
  }

  componentWillUnmount() {
    this.keyHandler.unregister();
  }

  renderCurrentCard() {
    const binI = 0;
    const sampleI = 0;
    if (!this.props.bins[binI] || !this.props.bins[binI].sample[sampleI]) {
      return null;
    }
    return (
      <CharacterCard
        data={this.props.bins[binI].sample[sampleI]}
        showDefinition={this.props.isShowDefinition}
      />
    );
  }

  render() {
    return (
      <div className="App">
        {/*this.props.bins.map(({ range, sample }) => (
          <div key={range.join('-')}>
            {sample.map(data => <CharacterCard data={data} />)}
          </div>
        ))*/}
        <div className="TestCardStack">
          {this.renderCurrentCard()}
        </div>
      </div>
    );
  }
}

export { App as Pure };

export default connect(state => ({
  bins: bins(state),
  isShowDefinition: isShowDefinition(state)
}), { loadSamples, toggleDefinition })(App);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadSamples } from './characterSamples/characterSamplesActions';
import { bins } from './characterSamples/characterSamplesReducer';
import CharacterCard from './CharacterCard';
import './App.css';

class App extends Component {
  static propTypes = {
    bins: PropTypes.array,
    loadSamples: PropTypes.func
  };

  static defaultProps = {
    bins: [],
    loadSamples: () => {}
  };

  componentDidMount() {
    this.props.loadSamples();
  }

  renderCurrentCard() {
    const binI = 0;
    const sampleI = 0;
    if (!this.props.bins[binI] || !this.props.bins[binI].sample[sampleI]) {
      return null;
    }
    return (
      <CharacterCard data={this.props.bins[binI].sample[sampleI]} />
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
  bins: bins(state)
}), { loadSamples })(App);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadSamples } from './characterSamples/characterSamplesActions';
import { bins } from './characterSamples/characterSamplesReducer';
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

  render() {
    return (
      <div className="App">
        {this.props.bins.map(({ range, sample }) => (
          <div key={range.join('-')}>
            {sample.map(({ i, c, p, d }) => (
              <span>{c}</span>
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export { App as Pure };

export default connect(state => ({
  bins: bins(state)
}), { loadSamples })(App);

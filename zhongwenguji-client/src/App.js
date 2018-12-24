import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadSamples } from './characterTest/characterTestActions';
import CharacterTest from './characterTest/CharacterTest';
import './App.css';

class App extends Component {
  componentDidMount() {
    this.props.loadSamples();
  }

  render() {
    return (
      <div className="App">
        <CharacterTest />
      </div>
    );
  }
}

export { App as Pure };

export default connect(
  state => ({}),
  { loadSamples }
)(App);

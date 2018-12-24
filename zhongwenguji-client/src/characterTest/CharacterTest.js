import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleDefinition } from './characterTestActions';
import { currentCard, isShowDefinition, status } from './characterTestReducer';
import keyHandler from '../util/keyHandler';
import CharacterCard from './CharacterCard';
import './CharacterTest.css';

class CharacterTest extends Component {
  static propTypes = {
    currentCard: PropTypes.object,
    isShowDefinition: PropTypes.bool,
    status: PropTypes.string,
    toggleDefinition: PropTypes.func
  };

  static defaultProps = {
    currentCard: null,
    isShowDefinition: false,
    toggleDefinition: () => {}
  };

  componentDidMount() {
    this.keyHandler = keyHandler({
      onKeyDown: this.handleKeyDown
    });
  }

  componentWillUnmount() {
    this.keyHandler.unregister();
  }

  handleKeyDown = (key) => {
    if (key === 'ArrowUp') {
      this.props.toggleDefinition();
    }
  };

  render() {
    return (
      <>
        <div>Test status: {this.props.status}</div>
        <div className="TestCardStack">
          {this.props.currentCard ? (
            <CharacterCard
              card={this.props.currentCard}
              showDefinition={this.props.isShowDefinition}
            />
          ) : null}
        </div>
      </>
    );
  }
}

export { CharacterTest as Pure };

const mapSelectors = (map) => (state) => Object.keys(map).reduce((props, key) => {
  props[key] = map[key](state);
  return props;
}, {});

export default connect(mapSelectors({
  currentCard,
  isShowDefinition,
  status
}), {
  toggleDefinition
})(CharacterTest);


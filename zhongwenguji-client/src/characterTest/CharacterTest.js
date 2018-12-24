import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  toggleDefinition,
  markCurrentKnown,
  markCurrentUnknown,
  undoLastMark
} from './characterTestActions';
import { currentCard, isShowDefinition, status } from './characterTestReducer';
import keyHandler from '../util/keyHandler';
import CharacterCard from './CharacterCard';
import './CharacterTest.css';

const noop = () => {};

class CharacterTest extends Component {
  static propTypes = {
    currentCard: PropTypes.object,
    isShowDefinition: PropTypes.bool,
    status: PropTypes.string,

    toggleDefinition: PropTypes.func,
    markCurrentKnown: PropTypes.func,
    markCurrentUnknown: PropTypes.func
  };

  static defaultProps = {
    currentCard: null,
    isShowDefinition: false,
    toggleDefinition: noop,
    markCurrentKnown: noop,
    markCurrentUnknown: noop,
    undoLastMark: noop,
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
    switch (key) {
      case 'ArrowUp':
        this.props.toggleDefinition();
        break;
      case 'ArrowLeft':
        this.props.markCurrentUnknown();
        break;
      case 'ArrowRight':
        this.props.markCurrentKnown();
        break;
      case 'ArrowDown':
        this.props.undoLastMark();
        break;
      default:
        break;
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
  toggleDefinition,
  markCurrentKnown,
  markCurrentUnknown,
  undoLastMark
})(CharacterTest);


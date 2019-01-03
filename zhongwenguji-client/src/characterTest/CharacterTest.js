import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  toggleDefinition,
  markCurrentKnown,
  markCurrentUnknown,
  undoDiscard
} from './characterTestActions';
import {
  currentCard,
  isShowDefinition,
  status,
  scoreStatistics,
  resultData
} from './characterTestReducer';
import mapSelectors from '../util/mapSelectors';
import keyHandler from '../util/keyHandler';
import CardStackMobile from '../card/CardStackMobile';
import style from './CharacterTest.module.scss';

const noop = () => {};

class CharacterTest extends Component {
  static propTypes = {
    currentCard: PropTypes.object,
    isShowDefinition: PropTypes.bool,
    status: PropTypes.string,

    toggleDefinition: PropTypes.func,
    markCurrentKnown: PropTypes.func,
    markCurrentUnknown: PropTypes.func,
    undoDiscard: PropTypes.func,
  };

  static defaultProps = {
    currentCard: null,
    isShowDefinition: false,
    status: '',

    toggleDefinition: noop,
    markCurrentKnown: noop,
    markCurrentUnknown: noop,
    undoDiscard: noop,
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
      case 'ArrowDown':
        this.props.toggleDefinition();
        break;
      case 'ArrowLeft':
        this.props.markCurrentUnknown();
        break;
      case 'ArrowRight':
        this.props.markCurrentKnown();
        break;
      case 'ArrowUp':
        this.props.undoDiscard();
        break;
      default:
        break;
    }
  };

  handleDiscardLeft = () => {
    this.props.markCurrentUnknown();
  };

  handleDiscardRight = () => {
    this.props.markCurrentKnown();
  };

  handleUndo = () => {
    this.props.undoDiscard();
  };

  handleDefinition = () => {
    this.props.toggleDefinition();
  };

  render() {
    return (
      <div className={style.container}>
        {this.props.resultData ? null : (
          <CardStackMobile
            currentCard={this.props.currentCard}
            showDefinition={this.props.isShowDefinition}
            onDiscardLeft={this.handleDiscardLeft}
            onDiscardRight={this.handleDiscardRight}
            onUndo={this.handleUndo}
            onDefinition={this.handleDefinition}
          />
        )}
      </div>
    );
  }
}

export { CharacterTest as Pure };

export default connect(mapSelectors({
  currentCard,
  isShowDefinition,
  status,
  scoreStatistics,
  resultData
}), {
  toggleDefinition,
  markCurrentKnown,
  markCurrentUnknown,
  undoDiscard
})(CharacterTest);


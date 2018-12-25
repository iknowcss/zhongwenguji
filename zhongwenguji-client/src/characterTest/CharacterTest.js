import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CSSTransitionGroup } from 'react-transition-group';
import {
  toggleDefinition,
  markCurrentKnown,
  markCurrentUnknown,
  undoDiscard
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

  render() {
    return (
      <>
        <div>Test status: {this.props.status}</div>
        <CSSTransitionGroup
          component="div"
          className="TestCardStack"
          transitionName="cardSwipe"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
            {this.props.currentCard ? (
              <CharacterCard
                {...this.props.currentCard}
                showDefinition={this.props.isShowDefinition}
                key={this.props.currentCard.index}
              />
            ) : null}
        </CSSTransitionGroup>
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
  undoDiscard
})(CharacterTest);


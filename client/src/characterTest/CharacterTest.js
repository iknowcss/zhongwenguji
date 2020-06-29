import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';
import {
  toggleDefinition,
  markCurrentKnown,
  markCurrentUnknown,
  undoDiscard,
} from './characterTestActions';
import {
  currentCard,
  markedEntries,
  isShowDefinition,
  status,
  resultData,
  characterSet,
} from './characterTestReducer';
import mapSelectors from '../util/mapSelectors';
import keyHandler from '../util/keyHandler';
import noop from '../util/noop';
import style from './CharacterTest.module.scss';
import CardStackDisplay from '../card/CardStackDisplay';
import CardStackButtons from '../card/CardStackButtons';

const DISCARD_THRESHOLD = 50;

class CharacterTest extends Component {
  static propTypes = {
    currentCard: PropTypes.object,
    markedEntries: PropTypes.array,
    isShowDefinition: PropTypes.bool,
    status: PropTypes.string,
    characterSet: PropTypes.string,

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

  constructor() {
    super();
    this.state = { card: null, lastEntryKnown: undefined };
  }

  componentDidMount() {
    this.keyHandler = keyHandler({
      onKeyDown: this.handleKeyDown
    });
    this.setState({ card: this.props.currentCard });
  }

  componentWillUnmount() {
    this.keyHandler.unregister();
  }

  componentDidUpdate(prevProps) {
    const previousCard = prevProps.currentCard;
    const previousEntries = prevProps.markedEntries;
    const { currentCard, markedEntries } = this.props;
    if (currentCard && previousCard.i !== currentCard.i) {
      if (markedEntries.length > previousEntries.length) {
        const lastEntryKnown = (markedEntries[markedEntries.length - 1] || {}).known;
        this.setState({ lastEntryKnown });
      }
      setTimeout(() => {
        this.setState({ card: currentCard, lastEntryKnown: undefined });
      }, 1);
    }
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
    const { isShowDefinition, characterSet } = this.props;
    const { card, lastEntryKnown } = this.state;

    return (
      <div className={cx(style.container, this.props.className)}>
        <CardStackDisplay
          card={card}
          lastEntryKnown={lastEntryKnown}
          showDefinition={isShowDefinition}
          discardThreshold={DISCARD_THRESHOLD}
          onDiscardLeft={this.handleDiscardLeft}
          onDiscardRight={this.handleDiscardRight}
          characterSet={characterSet}
        />
        <CardStackButtons
          onUndo={this.handleUndo}
          onDefinition={this.handleDefinition}
          showDefinition={isShowDefinition}
        />
      </div>
    );
  }
}

export { CharacterTest as Pure };

export default connect(mapSelectors({
  currentCard,
  markedEntries,
  isShowDefinition,
  status,
  resultData,
  characterSet,
}), {
  toggleDefinition,
  markCurrentKnown,
  markCurrentUnknown,
  undoDiscard
})(CharacterTest);


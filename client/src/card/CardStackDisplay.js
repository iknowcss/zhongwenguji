import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { CSSTransitionGroup } from 'react-transition-group';
import CharacterCard from './CharacterCard';
import style from './CardStackDisplay.module.scss';
import noop from '../util/noop';

function isAncestor(ancestor, child) {
  let check = child;
  while (check) {
    if (check === ancestor) {
      return true;
    }
    check = check.parentElement;
  }
  return false;
}

export default class CardStackDisplay extends Component {
  /**
   * @property {CharacterEntry} card
   */
  static propTypes = {
    onDiscardLeft: PropTypes.func,
    onDiscardRight: PropTypes.func,
    transitionTimeout: PropTypes.number,
    card: PropTypes.any,
    lastEntryKnown: PropTypes.bool,
    characterSet: PropTypes.string,
  };

  static defaultProps = {
    onDiscardLeft: noop,
    onDiscardRight: noop,
    transitionTimeout: 300,
  };

  constructor() {
    super();
    this.state = { offsetVector: [0, 0, 0] };
    this.touchAreaRef = React.createRef();
  }

  getActiveTouch = (event) => {
    return this.state.activeTouch && [].find.call(event.changedTouches, touch => touch.identifier === this.state.activeTouch.identifier);
  };

  setOffsetVector(offsetVector) {
    this.setState({ offsetVector });
  }

  handleTouchStart = (event) => {
    const isTouchArea = isAncestor(this.touchAreaRef.current, event.target);
    const isNewFirstTouch = event.touches.length === 1;
    const isTouchActive = !!this.state.activeTouch;
    if (isTouchArea && (!isTouchActive || (isTouchActive && isNewFirstTouch))) {
      event.preventDefault();
      const { identifier, clientX, clientY } = event.changedTouches[0];
      this.setState({ activeTouch: { identifier, clientX, clientY } });
    }
  };

  handleTouchMove = (event) => {
    const activeTouch = this.getActiveTouch(event);
    if (activeTouch) {
      const dx = activeTouch.clientX - this.state.activeTouch.clientX;
      const dy = Math.abs(dx / 10);
      const dth = Math.sin(Math.PI * dx / 2000) * 180 / Math.PI;
      this.setOffsetVector([dx, dy, dth]);
    }
  };

  handleTouchEnd = (event) => {
    const activeTouch = this.getActiveTouch(event);
    if (activeTouch) {
      const { discardThreshold } = this.props;
      const dx = activeTouch.clientX - this.state.activeTouch.clientX;
      if (dx > discardThreshold) {
        this.props.onDiscardRight();
      } else if (-dx > discardThreshold) {
        this.props.onDiscardLeft();
      } else {
        this.setOffsetVector([0, 0, 0]);
      }
      this.setState({ activeTouch: null });
    }
  };

  componentDidMount() {
    document.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd);
    document.addEventListener('touchcancel', this.handleTouchEnd);
    document.addEventListener('touchmove', this.handleTouchMove);
  }

  componentWillUpdate(newProps) {
    const oldCard = this.props.card || { i: -1 };
    const newCard = newProps.card || { i: -1 };
    if (oldCard.i !== newCard.i) {
      this.setOffsetVector([0, 0, 0]);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('touchstart', this.handleTouchStart);
    document.removeEventListener('touchend', this.handleTouchEnd);
    document.removeEventListener('touchcancel', this.handleTouchEnd);
    document.removeEventListener('touchmove', this.handleTouchMove);
  }

  getPositionOffsetStyles() {
    return {
      left: `${Math.round(this.state.offsetVector[0])}px`,
      top: `${Math.round(this.state.offsetVector[1])}px`,
      transform: `rotate(${this.state.offsetVector[2]}deg)`
    };
  }

  renderTouchableCard() {
    const { card, showDefinition, discardThreshold, characterSet, lastEntryKnown } = this.props;
    const touchActive = !!this.state.activeTouch;
    const [ dx ] = this.state.offsetVector;

    return (
      <div
        className={cx(style.touchArea, { [style.touchAreaSnap]: touchActive })}
        style={this.getPositionOffsetStyles()}
      >
        <CharacterCard
          {...card}
          className={cx(style.card, {
            [style.predictDiscardRight]: dx > discardThreshold,
            [style.predictDiscardLeft]: dx < -discardThreshold
          })}
          characterSet={characterSet}
          showDefinition={showDefinition}
          known={lastEntryKnown}
        />
      </div>
    );
  }

  render() {
    const { card, transitionTimeout, lastEntryKnown } = this.props;
    return (
      <div className={style.cardContainer}>
        <div className={style.stackBase} ref={this.touchAreaRef}>
          <CSSTransitionGroup
            component="div"
            transitionName={style}
            transitionEnterTimeout={transitionTimeout}
            transitionLeaveTimeout={transitionTimeout}
          >
            {(card && card.i > 0) ? (
              <div
                key={card.i}
                className={cx(style.animationContainer, {
                  [style.discardRight]: lastEntryKnown === true,
                  [style.discardLeft]: lastEntryKnown === false,
                })}>
                {this.renderTouchableCard()}
              </div>
            ) : null}
          </CSSTransitionGroup>
        </div>
      </div>
    );
  }
}

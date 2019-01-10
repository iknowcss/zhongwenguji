import React, { Component } from 'react';
import cx from 'classnames';
import { CSSTransitionGroup } from 'react-transition-group';
import CharacterCard from './CharacterCard';
import style from './CardStackDisplay.module.scss';
import PropTypes from "prop-types";
import noop from "../util/noop";

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
  static propTypes = {
    onDiscardLeft: PropTypes.func,
    onDiscardRight: PropTypes.func,
  };

  static defaultProps = {
    onDiscardLeft: noop,
    onDiscardRight: noop
  };

  constructor() {
    super();
    this.state = { offsetVector: [0, 0, 0] };
    this.touchAreaRef = React.createRef();
  }

  getActiveTouch = (event) => {
    return this.state.activeTouch && [].find.call(event.changedTouches, touch => touch.identifier === this.state.activeTouch.identifier);
  };

  setOffsetVector(offsetVector, disableTransition = false) {
    this.setState({ offsetVector, disableTransition });
    if (disableTransition) {
      setTimeout(() => this.setState({ disableTransition: false }), 50);
    }
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
    if (this.getActiveTouch(event)) {
      const { discardThreshold } = this.props;
      const [ dx ] = this.state.offsetVector;
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
    if (this.props.card
      && newProps.card
      && this.props.card.index !== newProps.card.index
    ) {
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

  renderX() {
    const { card, showDefinition, discardThreshold } = this.props;
    const { disableTransition } = this.state;
    const touchActive = !!this.state.activeTouch;
    const [ dx ] = this.state.offsetVector;

    return (
      <div
        className={cx(style.touchArea, { [style.touchAreaSnap]: disableTransition || touchActive })}
        style={this.getPositionOffsetStyles()}
      >
        {card.index >= 0 ? (
          <CharacterCard
            {...card}
            className={cx(style.card, {
              [style.predictDiscardRight]: dx > discardThreshold,
              [style.predictDiscardLeft]: dx < -discardThreshold
            })}
            showDefinition={showDefinition}
          />
        ) : null}
      </div>
    );
  }

  render() {
    const { card } = this.props;
    return (
      <div className={style.cardContainer}>
        <div className={style.stackBase} ref={this.touchAreaRef}>
          <CSSTransitionGroup
            component="div"
            transitionName={style}
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}
          >
            {card ? (
              <div
                key={card.index}
                className={cx(style.animationContainer, {
                  [style.discardRight]: card.score === 1,
                  [style.discardLeft]: card.score === 0
                })}>
                {this.renderX()}
              </div>
            ) : null}
          </CSSTransitionGroup>
        </div>
      </div>
    );
  }
}

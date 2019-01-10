import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { CSSTransitionGroup } from 'react-transition-group';
import CharacterCard from './CharacterCard';
import Button from '../component/Button';
import { UndoIcon, SearchIcon } from '../component/Icon';
import style from './CardStackMobile.module.scss';

const DISCARD_THRESHOLD = 50;
const noop = () => {};

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

export default class CardStackMobile extends Component {
  static propTypes = {
    onDiscardLeft: PropTypes.func,
    onDiscardRight: PropTypes.func,
    onUndo: PropTypes.func,
    onDefinition: PropTypes.func,
    showDefinition: PropTypes.bool
  };

  static defaultProps = {
    onDiscardLeft: noop,
    onDiscardRight: noop,
    onUndo: noop,
    onDefinition: noop,
    showDefinition: false
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
      const [ dx ] = this.state.offsetVector;
      if (dx > DISCARD_THRESHOLD) {
        this.props.onDiscardRight();
      } else if (-dx > DISCARD_THRESHOLD) {
        this.props.onDiscardLeft();
      } else {
        this.setOffsetVector([0, 0, 0]);
      }
      this.setState({ activeTouch: null });
    }
  };

  handleUndoClick = (event) => {
    event.preventDefault();
    this.props.onUndo();
  };

  handleDefinitionClick = (event) => {
    event.preventDefault();
    this.props.onDefinition();
  };

  componentDidMount() {
    document.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd);
    document.addEventListener('touchcancel', this.handleTouchEnd);
    document.addEventListener('touchmove', this.handleTouchMove);
  }

  componentWillUpdate(newProps) {
    if (this.props.currentCard
      && newProps.currentCard
      && this.props.currentCard.index !== newProps.currentCard.index
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

  render() {
    const EMPTY_CARD = {
      index: -1,
      score: NaN
    };

    const { showDefinition } = this.props;
    const [ dx ] = this.state.offsetVector;

    const currentCard = this.props.currentCard || EMPTY_CARD;

    return (
      <div className={style.container}>
        <div className={style.cardContainer}>
          <div className={style.stackBase} ref={this.touchAreaRef}>
            <CSSTransitionGroup
              component="div"
              transitionName={style}
              transitionEnterTimeout={300}
              transitionLeaveTimeout={300}
            >
              <div
                key={currentCard.index}
                className={cx(style.animationContainer, {
                  [style.discardRight]: currentCard.score === 1,
                  [style.discardLeft]: currentCard.score === 0
                })}>
                <div
                  className={cx(style.touchArea, {
                    [style.touchAreaSnap]: this.state.disableTransition || !!this.state.activeTouch
                  })}
                  style={this.getPositionOffsetStyles()}
                >
                  {currentCard.index >= 0 ? (
                    <CharacterCard
                      {...currentCard}
                      className={cx(style.card, {
                        [style.predictDiscardRight]: dx > DISCARD_THRESHOLD,
                        [style.predictDiscardLeft]: dx < -DISCARD_THRESHOLD
                      })}
                      showDefinition={showDefinition}
                    />
                  ) : null}
                </div>
              </div>
            </CSSTransitionGroup>
          </div>
        </div>
        <div className={style.buttonContainer}>
          <Button
            className={cx(style.button, style.undoButton)}
            onClick={this.handleUndoClick}
          >
            <UndoIcon className={style.buttonIcon} />
          </Button>
          <Button
            className={cx(style.button, {
              [style.buttonActive]: showDefinition
            })}
            onClick={this.handleDefinitionClick}
          >
            <SearchIcon className={style.buttonIcon} />
          </Button>
        </div>
      </div>
    );
  }
}
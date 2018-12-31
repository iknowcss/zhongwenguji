import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import CharacterCard from './CharacterCard';
import style from './CardStackMobile.module.scss';

const DISCARD_THRESHOLD = 100;
const noop = () => {};

export default class CardStackMobile extends Component {
  static propTypes = {
    onDiscardLeft: PropTypes.func,
    onDiscardRight: PropTypes.func,
    onUndo: PropTypes.func,
    onDefinition: PropTypes.func
  };

  static defaultProps = {
    onDiscardLeft: noop,
    onDiscardRight: noop,
    onUndo: noop,
    onDefinition: noop
  };

  constructor() {
    super();
    this.state = { offsetVector: [0, 0, 0] };
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
    // event.preventDefault();
    if (!this.state.activeTouch) {
      const { identifier, clientX, clientY } = event.changedTouches[0];
      this.setState({ activeTouch: { identifier, clientX, clientY } });
    }
  };

  handleTouchMove = (event) => {
    const activeTouch = this.getActiveTouch(event);
    if (activeTouch) {
      const dx = activeTouch.clientX - this.state.activeTouch.clientX;
      const dy = activeTouch.clientY - this.state.activeTouch.clientY;
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

  componentDidMount() {
    document.addEventListener('touchend', this.handleTouchEnd);
    document.addEventListener('touchmove', this.handleTouchMove);
  }

  componentWillUpdate(newProps) {
    if (this.props.currentCard !== newProps.currentCard) {
      this.setOffsetVector([0, 0, 0], true);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('touchend', this.handleTouchEnd);
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
    const { currentCard, showDefinition } = this.props;
    if (!currentCard) {
      return null;
    }
    return (
      <div className={style.container}>
        <div className={style.cardContainer}>
          <div
            className={cx(style.touchArea, {
              [style.touchAreaSnap]: this.state.disableTransition || !!this.state.activeTouch
            })}
            onTouchStart={this.handleTouchStart}
            style={this.getPositionOffsetStyles()}
          >
            <CharacterCard
              {...currentCard}
              className={style.card}
              showDefinition={showDefinition}
              key={currentCard.index}
            />
          </div>
        </div>
        <div className={style.buttonContainer}>
          <button className={style.button} onClick={() => this.props.onUndo() }>Undo</button>
          <button className={style.button} onClick={() => this.props.onDefinition() }>Def</button>
        </div>
      </div>
    );
  }
}

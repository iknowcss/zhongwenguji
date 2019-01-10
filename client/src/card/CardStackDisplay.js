import React from 'react';
import cx from 'classnames';
import style from './CardStackMobile.module.scss';
import CharacterCard from './CharacterCard';

export default (props) => {
  const {
    card,
    disableTransition,
    touchActive,
    dx,
    showDefinition,
    positionOffsetStyles,
    discardThreshold
  } = props;
  return (
    <div
      className={cx(style.animationContainer, {
        [style.discardRight]: card.score === 1,
        [style.discardLeft]: card.score === 0
      })}>
      <div
        className={cx(style.touchArea, { [style.touchAreaSnap]: disableTransition || touchActive })}
        style={positionOffsetStyles}
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
    </div>
  );
}

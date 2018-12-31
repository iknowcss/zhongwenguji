import React from 'react';
import cx from 'classnames';
import { CSSTransitionGroup } from 'react-transition-group';
import CharacterCard from './CharacterCard';
import style from './CardStackDesktop.module.scss';

const CardStackDesktop = ({ currentCard, showDefinition }) => {
  const cardClassName = cx(style.card, {
    [style.discardLeft]: currentCard && currentCard.score === 0,
    [style.discardRight]: currentCard && currentCard.score === 1
  });

  return (
    <CSSTransitionGroup
      component="div"
      className={style.container}
      transitionName={style}
      transitionEnterTimeout={300}
      transitionLeaveTimeout={300}
    >
      {currentCard ? (
        <CharacterCard
          {...currentCard}
          className={cardClassName}
          showDefinition={showDefinition}
          key={currentCard.index}
        />
      ) : null}
    </CSSTransitionGroup>
  );
};

export default CardStackDesktop;

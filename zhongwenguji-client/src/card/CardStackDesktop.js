import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import CharacterCard from './CharacterCard';
import style from './CardStackDesktop.module.scss';
import characterCardStyle from './CharacterCard.module.scss'

const CardStackDesktop = ({ currentCard, showDefinition }) => (
  <CSSTransitionGroup
    component="div"
    className={style.container}
    transitionName={characterCardStyle}
    transitionEnterTimeout={300}
    transitionLeaveTimeout={300}
  >
    {currentCard ? (<CharacterCard
      {...currentCard}
      showDefinition={showDefinition}
      key={currentCard.index}
    />) : null}
  </CSSTransitionGroup>
);

export default CardStackDesktop;

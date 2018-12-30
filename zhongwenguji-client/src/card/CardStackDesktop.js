import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import CharacterCard from '../characterTest/CharacterCard';

const CardStackDesktop = ({ currentCard, showDefinition }) => (
  <CSSTransitionGroup
    component="div"
    className="TestCardStack"
    transitionName="cardSwipe"
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

import React, { Component } from 'react';
import CharacterCard from './CharacterCard';
import style from './CardStackMobile.module.scss';

export default class CardStackMobile extends Component {
  render() {
    const { currentCard, showDefinition } = this.props;
    if (!currentCard) {
      return null;
    }
    return (
      <CharacterCard
        {...currentCard}
        showDefinition={showDefinition}
      />
    );
  }
}

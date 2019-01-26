import React from 'react';
import style from './MissedCards.module.scss';

export default ({ cards }) => (
  <div className={style.container}>
    <ul>
      {cards.map(({ index, character, definition }) => (
        <li className={style.listItem} key={index}>{character} - {definition.join('***')}</li>
      ))}
    </ul>
  </div>
);

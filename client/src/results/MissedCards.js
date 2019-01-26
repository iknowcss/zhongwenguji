import React from 'react';
import style from './MissedCards.module.scss';
import connect from 'react-redux/es/connect/connect';
import mapSelectors from '../util/mapSelectors';
import { missedCards } from '../characterTest/characterTestReducer';
import {loadSamples} from '../characterTest/characterTestActions';

const MissedCards = ({ missedCards = [] } = {}) => (
  <div className={style.container}>
    <ul>
      {missedCards.map(({ index, character, definition }) => (
        <li className={style.listItem} key={index}>{character} - {definition.join('***')}</li>
      ))}
    </ul>
  </div>
);

export { MissedCards as Pure };

export default connect(
  mapSelectors({ missedCards }),
  { loadSamples }
)(MissedCards);

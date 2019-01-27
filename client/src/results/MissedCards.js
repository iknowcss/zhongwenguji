import React from 'react';
import style from './MissedCards.module.scss';
import connect from 'react-redux/es/connect/connect';
import mapSelectors from '../util/mapSelectors';
import { missedCards } from '../characterTest/characterTestReducer';
import {loadSamples} from '../characterTest/characterTestActions';
import formatPinyin from '../util/formatPinyin';
import Button from '../component/Button';

function pairPinyinDefinitions(pinyinArray, definitionArray) {
  const result = [];
  for (let i = 0; i < pinyinArray.length; i++) {
    const pinyin = pinyinArray[i];
    const definition = [definitionArray[i]];
    result.push({ pinyin, definition })
  }
  return result;
}

function formatDefinition(definition) {
  return definition.replace(/\//g, ' / ');
}

const MissedCards = ({ missedCards = [] } = {}) => {
  return (
    <div className={style.container}>
      <div className={style.cardRowContainer}>
      {missedCards.map((card) => (
        <div key={card.index} className={style.cardRowColor}>
          <div className={style.cardRow}>
            <div className={style.cardCharacterColumn}>
              <span>{card.character}</span>
            </div>
            <div className={style.cardPinyinDefColumn}>
              {pairPinyinDefinitions(card.pinyin, card.definition).map(({ pinyin, definition }, i) => (
                <div key={i} className={style.cardPinyinDefRow}>
                  <div className={style.cardPinyinColumn}>
                    <span>{formatPinyin(pinyin)}</span>
                  </div>
                  <div className={style.cardDefColumn}>
                    <span>{formatDefinition(definition[0])}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      </div>
      <div className={style.actionButtonContainer}>
        <Button secondary className={style.actionButton}>Back</Button>
        <Button className={style.actionButton}>Add to Skritter</Button>
      </div>
    </div>
  );
};

export { MissedCards as Pure };

export default connect(
  mapSelectors({ missedCards }),
  { loadSamples }
)(MissedCards);

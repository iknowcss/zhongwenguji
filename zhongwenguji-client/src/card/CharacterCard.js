import React from 'react';
import cx from 'classnames';
import formatPinyin from '../util/formatPinyin';
import style from './CharacterCard.module.scss'

export default (props) => {
  const {
    showDefinition,
    character,
    pinyin,
    definition,
    score
  } = props;

  const className = cx(style.container, {
    [style.showDefinition]: showDefinition,
    [style.markedUnknown]: score === 0,
    [style.markedKnown]: score === 1
  });

  return (
    <span className={className}>
      {showDefinition ? (
        <>
          <span className={style.pinyin}>
            {formatPinyin(pinyin)}
          </span>
          <span className={style.definition}>
            {(definition || '(No definition available)').replace(/\//g, ' / ')}
          </span>
        </>
      ) : (
        <span className={style.character}>
          {character}
        </span>
      )}
    </span>
  )
};

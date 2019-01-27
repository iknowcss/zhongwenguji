import React from 'react';
import cx from 'classnames';
import formatPinyin from '../util/formatPinyin';
import style from './CharacterCard.module.scss'

const WIDEN_SLASH_REGEX = /\//g;

function formatPinyinArray(pinyin) {
  return pinyin.map(formatPinyin).join(', ');
}

function formatDefinitionArray(definition) {
  if (!definition || definition.length === 0) {
    return '(No definition available)';
  }
  return definition.map(d => d.replace(WIDEN_SLASH_REGEX, ' / ')).join(' / ');
}

export default (props) => {
  const {
    showDefinition,
    character,
    pinyin,
    definition,
    score,
    className
  } = props;

  const finalClassName = cx(style.container, {
    [style.showDefinition]: showDefinition,
    [style.markedUnknown]: score === 0,
    [style.markedKnown]: score === 1
  }, className);

  return (
    <span className={finalClassName}>
      {showDefinition ? (
        <>
          <span className={style.pinyin}>
            {formatPinyinArray(pinyin)}
          </span>
          <span className={style.definition}>
            {formatDefinitionArray(definition)}
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

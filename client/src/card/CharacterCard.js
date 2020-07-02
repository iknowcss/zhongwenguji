import React from 'react';
import cx from 'classnames';
import formatPinyin from '../util/formatPinyin';
import style from './CharacterCard.module.scss'
import {characterSetEnum} from "../characterTest/characterTestReducer";

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

/**
 *
 * @param {CharacterEntry & {className: string, showDefinition: boolean, characterSet: characterSetEnum, known: boolean}} props
 * @returns {*}
 */
export default (props) => {
  const {
    className,
    showDefinition,
    characterSet,
    known,
    p: pinyin,
    d: definition,
  } = props;

  const character = characterSet === characterSetEnum.TRADITIONAL ? props.ct : props.cs;

  const finalClassName = cx(style.container, {
    [style.showDefinition]: showDefinition,
    [style.markedUnknown]: known === false,
    [style.markedKnown]: known === true,
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

import React from 'react';
import formatPinyin from '../util/formatPinyin';

export default (props) => {
  const {
    showDefinition,
    character,
    pinyin,
    definition,
    score
  } = props;

  const className = [
    'TestCard',
    showDefinition ? 'TestCard--showDefinition' : '',
    score === 0 ? 'TestCard--markedUnknown' : '',
    score === 1 ? 'TestCard--markedKnown' : ''
  ].filter(x => x).join(' ');

  return (
    <span className={className}>
      {showDefinition ? (
        <>
          <span className="TestCard__pinyin">
            {formatPinyin(pinyin)}
          </span>
          <span className="TestCard__definition">
            {(definition ||  '(No definition available)').replace(/\//g, ' / ')}
          </span>
        </>
      ) : (
        <span className="TestCard__character">
          {character}
        </span>
      )}
    </span>
  )
};

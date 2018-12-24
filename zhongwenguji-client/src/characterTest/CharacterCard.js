import React from 'react';
import formatPinyin from '../util/formatPinyin';

export default ({ showDefinition = false, card: { i, c, p, d } }) => (
  <span className={['TestCard', showDefinition ? 'TestCard--showDefinition' : ''].join(' ')}>
    {showDefinition ? (
      <>
        <span className="TestCard__pinyin">{formatPinyin(p)}</span>
        <span className="TestCard__definition">{d.replace(/\//g, ' / ')}</span>
      </>
    ) : (
      <span className="TestCard__character">{c}</span>
    )}
  </span>
);

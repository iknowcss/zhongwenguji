import React from 'react';
import { formatPinyin } from './util';

export default ({ showDefinition = false, data: { i, c, p, d } }) => (
  <span className="TestCard">
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

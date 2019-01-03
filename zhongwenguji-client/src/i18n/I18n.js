import React from 'react';
import en from './en.json';
import zh from './zh.json';

const language = ((navigator.languages
    ? navigator.languages[0]
    : (navigator.language || navigator.userLanguage)
) || 'en').split('-')[0];

const i18n = { en, zh };

export default ({ component: C = 'span', stringId, ...props }) => (
  <C {...props}>
    {(i18n[language] || {})[stringId] || stringId}
  </C>
);

const VALID_LANGUAGES = ['en', 'zh'];

const navigatorLanguage = (
  navigator.languages
    ? navigator.languages[0]
    : (navigator.language || navigator.userLanguage)
).split('-')[0];

const DEFAULT_STATE = {
  language: VALID_LANGUAGES.indexOf(navigatorLanguage) >= 0
    ? navigatorLanguage
    : VALID_LANGUAGES[0]
};

export default (state = DEFAULT_STATE) => {
  return state;
};

export const language = ({ i18n }) => i18n.language;

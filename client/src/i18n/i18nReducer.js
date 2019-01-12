import getNavigatorLanguage from './getNavigatorLanguage';

const VALID_LANGUAGES = ['en', 'zh'];

export const LANGUAGE_SET = '@zwgj//i18n/language/set';

function getValidLanguage(language = getNavigatorLanguage()) {
  return VALID_LANGUAGES.indexOf(language) >= 0
    ? language
    : VALID_LANGUAGES[0];
}

const DEFAULT_STATE = {};

export default (_state = DEFAULT_STATE, action = {}) => {
  let state = _state;
  if (!state.language) {
    state = { ...state, language: getValidLanguage() };
  }

  switch (action.type) {
    case LANGUAGE_SET:
      return { ...state, language: getValidLanguage(action.language) };
    default:
      return state;
  }
};

export const language = ({ i18n }) => i18n.language;

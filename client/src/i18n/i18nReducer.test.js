import i18nReducer, { language, LANGUAGE_SET } from './i18nReducer';

describe('i18nReducer', () => {
  it('picks the default language', () => {
    expect(i18nReducer()).toEqual({
      language: 'en'
    });
  });

  it('sets a valid language', () => {
    expect(i18nReducer({
      language: 'en'
    }, {
      type: LANGUAGE_SET,
      language: 'zh'
    })).toEqual({
      language: 'zh'
    });
  });

  it('falls back to the default language', () => {
    expect(i18nReducer({
      language: 'en'
    }, {
      type: LANGUAGE_SET,
      language: 'fr'
    })).toEqual({
      language: 'en'
    });
  });

  it('selects the language', () => {
    expect(language({
      i18n: { language: 'zh' }
    })).toEqual('zh');
  });
});

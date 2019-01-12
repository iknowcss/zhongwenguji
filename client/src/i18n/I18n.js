import React, { Component } from 'react';
import en from './en.json';
import zh from './zh.json';

export const I18nContext = React.createContext({});

// const navigatorLanguage = (
//   navigator.languages
//     ? navigator.languages[0]
//     : (navigator.language || navigator.userLanguage)
// );

const languages = { en, zh };

class I18n extends Component {
  render() {
    const language = this.context;
    const i18n = languages[language] || {};
    const {
      component: Component = 'span',
      stringId,
      ...props
    } = this.props;
    return (
      <Component {...props}>
        {i18n[stringId] || stringId}
      </Component>
    );
  }
}

I18n.contextType = I18nContext;


export default I18n;

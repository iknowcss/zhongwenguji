export default function getNavigatorLanguage() {
  let languageString = (() => {
    if (navigator.languages) {
      return navigator.languages[0]
    }
    if (navigator.language) {
      return navigator.language;
    }
    if (navigator.userLanguage) {
      return navigator.userLanguage;
    }
    return '';
  })();

  return languageString.split('-')[0];
}

const PAIR_SPLIT_REGEXP = /^\?|&/;
const KEY_VALUE_REGEXP = /^([^=]+)=([^&]*)/;

function getSearchParams(search) {
  return search
    .split(PAIR_SPLIT_REGEXP)
    .filter(x => KEY_VALUE_REGEXP.test(x))
    .map(param => param.match(KEY_VALUE_REGEXP).slice(1))
    .reduce((result, [key, value]) => {
      result[decodeURIComponent(key)] = decodeURIComponent(value);
      return result;
    }, {});
}

export default (search) => {
  const searchParams = getSearchParams(search);
  window.history.replaceState(null, null, '.');

  let skritterContext = null;
  if (searchParams.skritterContext) {
    try {
      skritterContext = JSON.parse(atob(searchParams.skritterContext));
    } catch (error) {
      console.warn('Failed to load skritter context', error);
    }
  }

  let initialState = null;
  if (skritterContext) {
    try {
      initialState = JSON.parse(localStorage.getItem('reduxState'));
    } catch (error) {
      console.warn('Failed to load initial redux state', error);
    }
  }

  return { initialState, skritterContext };
};

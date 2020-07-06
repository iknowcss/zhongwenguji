export default () => {
  window.history.replaceState(null, null, '.');
  return { initialState: null };
};

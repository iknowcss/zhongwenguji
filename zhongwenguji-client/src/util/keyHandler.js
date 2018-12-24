const noop = () => {};
const ARROW_REGEXP = /^Arrow/;

export default ({ onKeyUp = noop, onKeyDown = noop } = {}) => {
  const pressMap = {};

  function keydown(e) {
    if (!ARROW_REGEXP.test(e.key)) return;
    if (pressMap[e.key]) return;
    pressMap[e.key] = true;
    onKeyDown(e.key);
  }

  function keyup(e) {
    if (!ARROW_REGEXP.test(e.key)) return;
    delete pressMap[e.key];
    onKeyUp(e.key);
  }

  window.addEventListener('keydown', keydown);
  window.addEventListener('keyup', keyup);

  return {
    unregister() {
      window.removeEventListener('keydown', keydown);
      window.removeEventListener('keyup', keyup);
      this.unregister = () => {};
    }
  };
}
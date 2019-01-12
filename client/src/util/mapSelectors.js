export default map => state => Object.keys(map).reduce((props, key) => {
  props[key] = map[key](state);
  return props;
}, {});

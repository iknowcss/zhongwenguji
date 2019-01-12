export const classNames = (element) => {
  if (!element || !element.props) {
    throw new Error('A valid element was not provided');
  }
  return ((
    typeof element.props === 'function'
      ? element.props().className
      : element.props.className
  ) || '').split(/\s+/);
};

export const hasClassName = className => (element) => classNames(element).indexOf(className) >= 0;

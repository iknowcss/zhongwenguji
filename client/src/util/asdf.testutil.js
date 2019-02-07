import isString from 'lodash/isString';
import get from 'lodash/get';
import I18n from '../i18n/I18n';

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

export const text = (element) => [].map.call(get(element, 'props.children', []), (child) => {
  if (isString(child)) {
    return child;
  }
  if (child.type === I18n) {
    return child.props.stringId;
  }
  return text(child);
}).join('');

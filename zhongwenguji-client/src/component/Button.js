import React from 'react';
import cx from 'classnames';
import style from './Button.module.scss';

export default (props) => (
  <button {...props} className={cx(style.button, props.className)} />
);

import React from 'react';
import cx from 'classnames';
import style from './Button.module.scss';

export default ({ secondary, accent, ...props }) => (
  <button {...props} className={cx(style.button, {
    [style.secondary]: secondary,
    [style.accent]: accent,
  }, props.className)} />
);

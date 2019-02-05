import React from 'react';
import cx from 'classnames';
import style from './Button.module.scss';

export default ({ secondary, ...props }) => (
  <button {...props} className={cx(style.button, {
    [style.secondary]: secondary,
    [style.disabled]: props.disabled,
    [style.success]: props.success,
    [style.danger]: props.danger,
  }, props.className)} />
);

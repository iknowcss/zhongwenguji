import React from 'react';
import cx from 'classnames';
import style from './Icon.module.scss';
import undoSvg from './undo.svg';
import searchSvg from './search.svg';
import swipeLeftSvg from './swipeLeft.svg';
import swipeRightSvg from './swipeRight.svg';

const Icon = ({ className, viewBox, href, size = 'small' }) => (
  <span className={cx(style.span, style[`span--${size}`], className)}>
    <svg viewBox={viewBox} className={style.svg}>
      <use xlinkHref={href} />
    </svg>
  </span>
);

const iconClass = ({ baseClassName, href, viewBox }) => ({ className, ...props }) => (
  <Icon
    className={cx(baseClassName, className)}
    viewBox={viewBox}
    href={href}
    {...props}
  />
);

export const UndoIcon = iconClass({
  href: `${undoSvg}#main`,
  baseClassName: style.undoIcon,
  viewBox: '0 0 438.536 438.536'
});

export const SearchIcon = iconClass({
  href: `${searchSvg}#main`,
  baseClassName: style.searchIcon,
  viewBox: '0 0 250.313 250.313'
});

export const SwipeLeftIcon = iconClass({
  href: `${swipeLeftSvg}#main`,
  baseClassName: style.swipeLeftIcon,
  viewBox: '0 0 397.232 397.232'
});

export const SwipeRightIcon = iconClass({
  href: `${swipeRightSvg}#main`,
  baseClassName: style.swipeRightIcon,
  viewBox: '0 0 397.233 397.233'
});
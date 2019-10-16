/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react';
import cx from 'classnames';
import style from './Icon.module.scss';
import undoSvg from '-!svg-react-loader!./undo.svg';
import searchSvg from '-!svg-react-loader!./search.svg';
import swipeLeftSvg from '-!svg-react-loader!./swipeLeft.svg';
import swipeRightSvg from '-!svg-react-loader!./swipeRight.svg';
import keyboardArrowLeftSvg from '-!svg-react-loader!./keyboardArrowLeft.svg';
import keyboardArrowRightSvg from '-!svg-react-loader!./keyboardArrowRight.svg';

const Icon = ({ className, XXX, size = 'small' }) => (
  <span className={cx(style.span, style[`span--${size}`], className)}>
    <XXX className={style.svg} />
  </span>
);

const iconClass = ({ baseClassName, XXX, viewBox }) => ({ className, ...props }) => (
  <Icon
    className={cx(baseClassName, className)}
    viewBox={viewBox}
    XXX={XXX}
    {...props}
  />
);

export const UndoIcon = iconClass({
  XXX: undoSvg,
  baseClassName: style.undoIcon
});

export const SearchIcon = iconClass({
  XXX: searchSvg,
  baseClassName: style.searchIcon
});

export const SwipeLeftIcon = iconClass({
  XXX: swipeLeftSvg,
  baseClassName: style.swipeLeftIcon
});

export const SwipeRightIcon = iconClass({
  XXX: swipeRightSvg,
  baseClassName: style.swipeRightIcon
});

export const KeyboardArrowLeftIcon = iconClass({
  XXX: keyboardArrowLeftSvg,
  baseClassName: style.keyboardArrowLeftIcon
});

export const KeyboardArrowRightIcon = iconClass({
  XXX: keyboardArrowRightSvg,
  baseClassName: style.keyboardArrowRightIcon
});

export const LoadingIcon = ({ className, size = 'small' }) => (
  <span className={cx(style.span, style[`span--${size}`], style.loadingIcon, className)}>
    <span>加载</span>
    <span />
    <span />
    <span />
    <span />
  </span>
);

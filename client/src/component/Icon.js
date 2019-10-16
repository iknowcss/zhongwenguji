/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react';
import cx from 'classnames';
import style from './Icon.module.scss';
import UndoSvg from '-!svg-react-loader!./undo.svg';
import SearchSvg from '-!svg-react-loader!./search.svg';
import SwipeLeftSvg from '-!svg-react-loader!./swipeLeft.svg';
import SwipeRightSvg from '-!svg-react-loader!./swipeRight.svg';
import KeyboardArrowLeftSvg from '-!svg-react-loader!./keyboardArrowLeft.svg';
import KeyboardArrowRightSvg from '-!svg-react-loader!./keyboardArrowRight.svg';

const Icon = ({ IconComponent, className, size = 'small' }) => (
  <span className={cx(style.span, style[`span--${size}`], className)}>
    <IconComponent className={style.svg} />
  </span>
);

const iconClass = ({ IconComponent, baseClassName }) => ({ className, ...props }) => (
  <Icon
    IconComponent={IconComponent}
    className={cx(baseClassName, className)}
    {...props}
  />
);

export const UndoIcon = iconClass({
  IconComponent: UndoSvg,
  baseClassName: style.undoIcon
});

export const SearchIcon = iconClass({
  IconComponent: SearchSvg,
  baseClassName: style.searchIcon
});

export const SwipeLeftIcon = iconClass({
  IconComponent: SwipeLeftSvg,
  baseClassName: style.swipeLeftIcon
});

export const SwipeRightIcon = iconClass({
  IconComponent: SwipeRightSvg,
  baseClassName: style.swipeRightIcon
});

export const KeyboardArrowLeftIcon = iconClass({
  IconComponent: KeyboardArrowLeftSvg,
  baseClassName: style.keyboardArrowLeftIcon
});

export const KeyboardArrowRightIcon = iconClass({
  IconComponent: KeyboardArrowRightSvg,
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

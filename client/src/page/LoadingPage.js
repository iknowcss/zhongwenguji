import React from 'react';
import cx from 'classnames';
import style from './LoadingPage.module.scss';
import {LoadingIcon} from '../component/Icon';

export default ({ className }) => (
  <div className={cx(style.container, className)}>
    <LoadingIcon size="large" />
  </div>
);

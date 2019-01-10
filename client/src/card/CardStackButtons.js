import React from 'react';
import style from './CardStackMobile.module.scss';
import Button from '../component/Button';
import cx from 'classnames';
import { SearchIcon, UndoIcon } from '../component/Icon';

export default ({ onUndoClick, onDefinitionClick, showDefinition }) => (
  <div className={style.buttonContainer}>
    <Button
      className={cx(style.button, style.undoButton)}
      onClick={onUndoClick}
    >
      <UndoIcon className={style.buttonIcon} />
    </Button>
    <Button
      className={cx(style.button, { [style.buttonActive]: showDefinition })}
      onClick={onDefinitionClick}
    >
      <SearchIcon className={style.buttonIcon} />
    </Button>
  </div>
);

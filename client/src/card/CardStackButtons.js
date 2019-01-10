import React, { Component } from 'react';
import Button from '../component/Button';
import cx from 'classnames';
import { SearchIcon, UndoIcon } from '../component/Icon';
import style from './CardStackButtons.module.scss';
import PropTypes from "prop-types";
import noop from "../util/noop";

export default class CardStackButtons extends Component {
  static propTypes = {
    onUndo: PropTypes.func,
    onDefinition: PropTypes.func,
    showDefinition: PropTypes.bool
  };

  static defaultProps = {
    onUndo: noop,
    onDefinition: noop,
    showDefinition: false
  };

  handleUndoClick = (event) => {
    event.preventDefault();
    this.props.onUndo();
  };

  handleDefinitionClick = (event) => {
    event.preventDefault();
    this.props.onDefinition();
  };

  render() {
    const { showDefinition } = this.props;

    return (
      <div className={style.buttonContainer}>
        <Button
          className={cx(style.button, style.undoButton)}
          onClick={this.handleUndoClick}
        >
          <UndoIcon className={style.buttonIcon} />
        </Button>
        <Button
          className={cx(style.button, { [style.buttonActive]: showDefinition })}
          onClick={this.handleDefinitionClick}
        >
          <SearchIcon className={style.buttonIcon} />
        </Button>
      </div>
    );
  }
}

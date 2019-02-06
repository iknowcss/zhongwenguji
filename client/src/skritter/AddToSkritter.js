import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';
import mapSelectors from '../util/mapSelectors';
import { missedCards, characterSet, characterSetEnum } from '../characterTest/characterTestReducer';
import {
  addingStateEnum,
  userName,
  auth,
  isLoginPending,
  isLoginFailed,
  isLoggedIn,
  addingState
} from './skritterReducer';
import { cancelAddToSkritter, submitToSkritter } from './skritterActions';
import Button from '../component/Button';
import noop from '../util/noop';
import style from './AddToSkritter.module.scss';

class AddToSkritter extends Component {
  static propTypes = {
    missedCards: PropTypes.array.isRequired,
    characterSet: PropTypes.oneOf([
      characterSetEnum.SIMPLIFIED,
      characterSetEnum.TRADITIONAL
    ]).isRequired,
    userName: PropTypes.string,
    auth: PropTypes.string,
    isLoginPending: PropTypes.bool,
    isLoginFailed: PropTypes.bool,
    addingState: PropTypes.string,
    cancelAddToSkritter: PropTypes.func,
    submitToSkritter: PropTypes.func
  };

  static defaultProps = {
    userName: '',
    auth: '',
    isLoginPending: false,
    isLoginFailed: false,
    addingState: '',
    cancelAddToSkritter: noop,
    submitToSkritter: noop
  };

  handleClick = (e) => {
    e.preventDefault();
    const { missedCards, characterSet, auth } = this.props;
    const characters = missedCards.map(({ character }) => character);
    this.props.submitToSkritter(characters, characterSet, auth);
  };

  handleCancelClick = (e) => {
    e.preventDefault();
    this.props.cancelAddToSkritter();
  };

  getSubmitButtonState() {
    const { isLoginPending, isLoginFailed, addingState } = this.props;

    if (isLoginPending) {
      return { submitDisabled: true, submitText: 'Authorizing...' };
    }
    if (isLoginFailed) {
      return {
        submitDisabled: true,
        submitText: 'Login failed!',
        submitResultMessage: ''
      };
    }

    switch (addingState) {
      case addingStateEnum.SUBMIT_PENDING:
        return { submitDisabled: true, submitText: 'Adding...' };
      case addingStateEnum.SUBMIT_SUCCESS:
        return { submitDisabled: true, submitText: 'Success!', buttonSuccess: true };
      case addingStateEnum.SUBMIT_ERROR:
        return { submitDisabled: true, submitText: 'Failed!', buttonDanger: true};
      case addingStateEnum.SUBMIT_READY:
      default:
        return { submitDisabled: false, submitText: 'Add to Skritter' };
    }
  }

  render() {
    const {
      submitDisabled,
      submitText,
      submitResultMessage,
      buttonDanger,
      buttonSuccess
    } = this.getSubmitButtonState();
    const { isLoggedIn, userName } = this.props;
    return (
      <div className={style.container}>
        <div className={style.modal}>
          <div>Add all characters to Skritter</div>

          <div className={cx(style.accordion, { [style.accordionActive]: isLoggedIn })}>
            Logged in as <span className={style.loggedInUserName}>{userName}</span>
          </div>

          <div className={cx(style.accordion, { [style.accordionActive]: !!submitResultMessage })}>
            {submitResultMessage}
          </div>

          <Button
            disabled={submitDisabled}
            className={style.button}
            onClick={this.handleClick}
            success={buttonSuccess}
            danger={buttonDanger}
          >{submitText}</Button>

          <Button
            className={style.button}
            secondary
            onClick={this.handleCancelClick}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }
}

export { AddToSkritter as Pure };

export default connect(
  mapSelectors({
    missedCards,
    characterSet,
    userName,
    auth,
    isLoginPending,
    isLoginFailed,
    isLoggedIn,
    addingState
  }),
  { cancelAddToSkritter, submitToSkritter }
)(AddToSkritter);

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
import I18n from '../i18n/I18n';
import style from './AddToSkritter.module.scss';

class AddToSkritter extends Component {
  static propTypes = {
    missedCards: PropTypes.array.isRequired,
    characterSet: PropTypes.oneOf([
      characterSetEnum.SIMPLIFIED,
      characterSetEnum.TRADITIONAL
    ]).isRequired,
    addingState: PropTypes.string.isRequired,
    userName: PropTypes.string,
    auth: PropTypes.string,
    isLoginPending: PropTypes.bool,
    isLoginFailed: PropTypes.bool,
    cancelAddToSkritter: PropTypes.func,
    submitToSkritter: PropTypes.func
  };

  static defaultProps = {
    userName: '',
    auth: '',
    isLoginPending: false,
    isLoginFailed: false,
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
      return {
        submitTextStringId: 'addToSkritter.submit.authorizing',
        submitDisabled: true
      };
    }
    if (isLoginFailed) {
      return {
        submitTextStringId: 'addToSkritter.submit.loginFailed',
        submitDisabled: true
      };
    }

    switch (addingState) {
      case addingStateEnum.SUBMIT_PENDING:
        return {
          submitTextStringId: 'addToSkritter.submit.pending',
          submitDisabled: true
        };
      case addingStateEnum.SUBMIT_SUCCESS:
        return {
          submitTextStringId: 'addToSkritter.submit.success',
          submitDisabled: true,
          buttonSuccess: true
        };
      case addingStateEnum.SUBMIT_ERROR:
        return {
          submitTextStringId: 'addToSkritter.submit.failed',
          submitDisabled: true,
          buttonDanger: true
        };
      case addingStateEnum.SUBMIT_READY:
      default:
        return {
          submitTextStringId: 'addToSkritter.submit.start',
          submitDisabled: false
        };
    }
  }

  render() {
    const {
      submitDisabled,
      submitTextStringId,
      submitResultStringId,
      buttonDanger,
      buttonSuccess
    } = this.getSubmitButtonState();
    const { isLoggedIn, userName } = this.props;
    return (
      <div className={style.container}>
        <div className={style.modal}>
          <I18n component="div" stringId="addToSkritter.description" />

          <div className={cx(style.loginMessage, style.accordion, {
            [style.accordionActive]: isLoggedIn
          })}>
            <I18n stringId="addToSkritter.loggedInAs" />
            {' '}
            <span className={style.loggedInUserName}>{userName}</span>
          </div>

          <I18n
            component="div"
            stringId={submitResultStringId}
            className={cx(style.submitResult, style.accordion, {
              [style.accordionActive]: !!submitResultStringId
            })}
          />

          <I18n
            stringId={submitTextStringId}
            disabled={submitDisabled}
            className={cx(style.button)}
            onClick={this.handleClick}
            success={buttonSuccess}
            danger={buttonDanger}
          />

          <I18n
            component={Button}
            stringId="addToSkritter.cancelButton"
            className={style.button}
            secondary
            onClick={this.handleCancelClick}
          />
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

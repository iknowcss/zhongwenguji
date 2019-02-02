import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';
import getConfig from '../getConfig';
import mapSelectors from '../util/mapSelectors';
import { missedCards } from '../characterTest/characterTestReducer';
import { userName, auth, isLoginPending, isLoginFailed, isLoggedIn } from './skritterReducer';
import { cancelAddToSkritter } from './skritterActions';
import Button from '../component/Button';
import noop from '../util/noop';
import style from './AddToSkritter.module.scss';

class AddToSkritter extends Component {
  static propTypes = {
    missedCards: PropTypes.array.isRequired,
    userName: PropTypes.string,
    auth: PropTypes.string,
    isLoginPending: PropTypes.bool,
    isLoginFailed: PropTypes.bool,
    cancelAddToSkritter: PropTypes.func
  };

  static defaultProps = {
    userName: '',
    auth: '',
    isLoginPending: false,
    isLoginFailed: false,
    cancelAddToSkritter: noop
  };

  handleClick = (e) => {
    e.preventDefault();

    const { missedCards, auth } = this.props;
    const { skritterCharactersUrl } = getConfig();

    fetch(skritterCharactersUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-Session': auth
      },
      body: JSON.stringify({
        characters: missedCards.map(({ character }) => character)
      }),
    })
      .then((result) => {
        console.log(result.status);
      })
  };

  handleCancelClick = (e) => {
    e.preventDefault();
    this.props.cancelAddToSkritter();
  };

  render() {
    const { isLoginPending, isLoginFailed, isLoggedIn, userName } = this.props;
    return (
      <div className={style.container}>
        <div className={style.modal}>
          <div>Add all characters to Skritter</div>
          <div className={cx(style.loggedInMessage, {
            [style.loggedInMessageActive]: isLoggedIn
          })}>
            Logged in as <span className={style.loggedInUserName}>{userName}</span>
          </div>
          <Button
            disabled={isLoginPending || isLoginFailed}
            className={style.button}
            onClick={this.handleClick}
          >
            {isLoginPending ? 'Authorizing...' : isLoginFailed ? 'Failed :(' : 'Add to Skritter'}
          </Button>
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
  mapSelectors({ missedCards, userName, auth, isLoginPending, isLoginFailed, isLoggedIn }),
  { cancelAddToSkritter }
)(AddToSkritter);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import getConfig from '../getConfig';
import mapSelectors from '../util/mapSelectors';
import { missedCards } from '../characterTest/characterTestReducer';
import { userName, auth, isLoginPending } from './skritterReducer';
import Button from '../component/Button';
import style from './AddToSkritter.module.scss';

class AddToSkritter extends Component {
  static propTypes = {
    missedCards: PropTypes.array.isRequired,
    userName: PropTypes.string,
    auth: PropTypes.string,
    isLoginPending: PropTypes.bool,
  };

  static defaultProps = {
    userName: '',
    auth: '',
    isLoginPending: false
  };

  handleClick = (e) => {
    e.preventDefault();

    const { /*missedCards,*/ auth } = this.props;
    const { skritterCharactersUrl } = getConfig();

    fetch(skritterCharactersUrl, {
      method: 'POST',
      headers: { 'X-Session': auth }
    })
      .then((result) => {
        console.log(result.status);
      })

    // console.log({
    //   skritterCharactersUrl,
    //   characters: missedCards.map(({ character }) => character),
    //   auth
    // });
  };

  render() {
    const { isLoginPending } = this.props;
    return (
      <div className={style.container}>
        <div className={style.modal}>
          <div>Add all characters to Skritter</div>
          <Button
            disabled={isLoginPending}
            className={style.button}
            onClick={this.handleClick}
          >
            {isLoginPending ? 'Authorizing...' : 'Add'}
          </Button>
        </div>
      </div>
    );
  }
}

export { AddToSkritter as Pure };

export default connect(
  mapSelectors({ missedCards, userName, auth, isLoginPending })
)(AddToSkritter);

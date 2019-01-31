import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import mapSelectors from '../util/mapSelectors';
import { missedCards } from '../characterTest/characterTestReducer';
import { userName, auth } from './skritterReducer';
import Button from '../component/Button';
import style from './AddToSkritter.module.scss';

class AddToSkritter extends Component {
  static propTypes = {
    // missedCards: PropTypes.array.isRequired,
    // userName: PropTypes.string.isRequired,
    // auth: PropTypes.string.isRequired
  };

  render() {
    const { userName } = this.props;
    return (
      <div className={style.container}>
        <div className={style.modal}>
          <div>Add all characters to Skritter</div>
          <Button className={style.button}>Add</Button>
        </div>
      </div>
    );
  }
}

export { AddToSkritter as Pure };

export default connect(
  mapSelectors({ missedCards, userName, auth })
)(AddToSkritter);

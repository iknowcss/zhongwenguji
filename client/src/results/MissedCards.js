import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import style from './MissedCards.module.scss';
import mapSelectors from '../util/mapSelectors';
import { missedCards } from '../characterTest/characterTestReducer';
import { loadSamples, showTestResults } from '../characterTest/characterTestActions';
import formatPinyin from '../util/formatPinyin';
import noop from '../util/noop';
import Button from '../component/Button';
import I18n from '../i18n/I18n';

function pairPinyinDefinitions(pinyinArray, definitionArray) {
  return pinyinArray.map((pinyin, i) => ({
    pinyin,
    definition: definitionArray[i]
  }));
}

function formatDefinition(definition) {
  return definition.replace(/\//g, ' / ');
}

class MissedCards extends Component {
  static propTypes = {
    missedCards: PropTypes.arrayOf(PropTypes.object),
    showTestResults: PropTypes.func
  };

  static defaultProps = {
    missedCards: [],
    showTestResults: noop
  };

  handleBackButtonClick = (e) => {
    e.preventDefault();
    this.props.showTestResults();
  };

  renderCardPinyinDef = ({ pinyin, definition }, i) => (
    <div key={i} className={style.cardPinyinDefRow}>
      <div className={style.cardPinyinColumn}>
        <span>{formatPinyin(pinyin)}</span>
      </div>
      <div className={style.cardDefColumn}>
        <span>{formatDefinition(definition)}</span>
      </div>
    </div>
  );

  renderCardRow = card => (
    <div key={card.index} className={style.cardRowColor}>
      <div className={style.cardRow}>
        <div className={style.cardCharacterColumn}>
          <span>{card.character}</span>
        </div>
        <div className={style.cardPinyinDefColumn}>
          {pairPinyinDefinitions(card.pinyin, card.definition).map(this.renderCardPinyinDef)}
        </div>
      </div>
    </div>
  );

  render() {
    const { missedCards } = this.props;
    return (
      <div className={style.container}>
        <div className={style.cardRowContainer}>
          {missedCards.map(this.renderCardRow)}
        </div>
        <div className={style.actionButtonContainer}>
          <I18n
            component={Button}
            stringId="reviewMissed.backButton"
            className={style.actionButton}
            onClick={this.handleBackButtonClick}
          />
          {/*<Button
            className={style.actionButton}
          >Add to Skritter</Button>*/}
        </div>
      </div>
    );
  }
}

export { MissedCards as Pure };

export default connect(
  mapSelectors({ missedCards }),
  { loadSamples, showTestResults }
)(MissedCards);

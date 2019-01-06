import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { showInstructions } from './instructionsReducer';
import { dismissInstructions } from './instructionsActions';
import mapSelectors from '../util/mapSelectors';
import Button from '../component/Button';
import { SwipeLeftIcon, SwipeRightIcon, SearchIcon, UndoIcon } from '../component/Icon';
import I18n from '../i18n/I18n';
import style from './Instructions.module.scss'

class Instructions extends Component {
  static propTypes = {
    showInstructions: PropTypes.bool
  };

  static defaultProps = {
    showInstructions: false
  };

  handleDismissClick = (event) => {
    event.preventDefault();
    this.props.dismissInstructions();
  };

  render() {
    return (
      <div className={cx(style.container, this.props.className)}>
        <section className={style.modal}>
          <I18n component="p" className={style.paragraph} stringId={'instructions.overview'} />

          <div className={style.iconParagraphContainer}>
            <SwipeRightIcon size="medium" className={style.iconParagraphIcon}/>
            <I18n component="p" className={cx(style.iconParagraph)} stringId={'instructions.swipeRight'} />
          </div>

          <div className={style.iconParagraphContainer}>
            <SwipeLeftIcon size="medium" className={style.iconParagraphIcon}/>
            <I18n component="p" className={style.iconParagraph} stringId={'instructions.swipeLeft'} />
          </div>

          <div className={style.iconParagraphContainer}>
            <div className={style.fauxButton}>
              <SearchIcon size="tiny" className={style.iconParagraphIcon}/>
            </div>
            <I18n component="p" className={style.iconParagraph} stringId={'instructions.definition'} />
          </div>

          <div className={style.iconParagraphContainer}>
            <div className={style.fauxButton}>
              <UndoIcon size="tiny" className={style.iconParagraphIcon}/>
            </div>
            <I18n component="p" className={style.iconParagraph} stringId={'instructions.undo'} />
          </div>

          <I18n
            component={Button}
            className={style.button}
            stringId={'instructions.dismissButton'}
            onClick={this.handleDismissClick}
          />
        </section>
      </div>
    );
  }
}

export default connect(
  mapSelectors({ showInstructions }),
  { dismissInstructions }
)(Instructions);

export { Instructions as Pure };


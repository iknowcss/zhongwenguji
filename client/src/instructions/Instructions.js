import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { dismissInstructions } from './instructionsActions';
import { setCharacterSetSimplified, setCharacterSetTraditional } from '../characterTest/characterTestActions';
import Button from '../component/Button';
import {
  SwipeLeftIcon,
  SwipeRightIcon,
  KeyboardArrowLeftIcon,
  KeyboardArrowRightIcon,
  SearchIcon,
  UndoIcon
} from '../component/Icon';
import I18n from '../i18n/I18n';
import noop from '../util/noop';
import style from './Instructions.module.scss'

class Instructions extends Component {
  static propTypes = {
    isTouch: PropTypes.bool,
    dismissInstructions: PropTypes.func,
    setCharacterSetSimplified: PropTypes.func,
    setCharacterSetTraditional: PropTypes.func
  };

  static defaultProps = {
    touch: true,
    dismissInstructions: noop,
    setCharacterSetSimplified: noop,
    setCharacterSetTraditional: noop,
  };

  handleCharacterSetToggle = (event) => {
    if (event.target.checked) {
      this.props.setCharacterSetTraditional();
    } else {
      this.props.setCharacterSetSimplified();
    }
  };

  handleStartClick = (event) => {
    event.preventDefault();
    this.props.dismissInstructions();
  };

  render() {
    const { touch } = this.props;
    return (
      <div className={cx(style.container, this.props.className)}>
        <section className={style.modal}>
          <I18n component="p" className={style.paragraph} stringId="instructions.overview" />

          {touch ? (<>
            <div className={style.iconParagraphContainer}>
              <SwipeRightIcon size="medium" className={style.iconParagraphIcon}/>
              <I18n component="p" className={cx(style.iconParagraph)} stringId="instructions.swipeRight" />
            </div>

            <div className={style.iconParagraphContainer}>
              <SwipeLeftIcon size="medium" className={style.iconParagraphIcon}/>
              <I18n component="p" className={style.iconParagraph} stringId="instructions.swipeLeft" />
            </div>
          </>) : (<>
            <div className={style.iconParagraphContainer}>
              <KeyboardArrowRightIcon size="small" className={cx(style.iconParagraphIcon, style.iconParagraphKeyboardIcon)}/>
              <I18n component="p" className={cx(style.iconParagraph)} stringId="instructions.keyboardRight" />
            </div>

            <div className={style.iconParagraphContainer}>
              <KeyboardArrowLeftIcon size="small" className={cx(style.iconParagraphIcon, style.iconParagraphKeyboardIcon)}/>
              <I18n component="p" className={style.iconParagraph} stringId="instructions.keyboardLeft" />
            </div>
          </>)}

          <div className={style.iconParagraphContainer}>
            <div className={style.fauxButton}>
              <SearchIcon size="tiny" className={style.iconParagraphIcon}/>
            </div>
            <I18n component="p" className={style.iconParagraph} stringId={`instructions.definition${touch ? 'Touch' : 'Mouse'}`} />
          </div>

          <div className={style.iconParagraphContainer}>
            <div className={style.fauxButton}>
              <UndoIcon size="tiny" className={style.iconParagraphIcon}/>
            </div>
            <I18n component="p" className={style.iconParagraph} stringId={`instructions.undo${touch ? 'Touch' : 'Mouse'}`} />
          </div>

          <div className={style.characterSetContainer}>
            <input type="checkbox" id="traditionalCheckbox" onChange={this.handleCharacterSetToggle}/> <I18n component="label" stringId="instructions.traditionalLabel" htmlFor="traditionalCheckbox" />
          </div>

          <I18n
            component={Button}
            className={style.button}
            stringId={'instructions.startTestButton'}
            onClick={this.handleStartClick}
          />
        </section>
      </div>
    );
  }
}

export { Instructions as Pure };

export default connect(null, {
  dismissInstructions,
  setCharacterSetSimplified,
  setCharacterSetTraditional,
})(Instructions);

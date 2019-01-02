import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import { showInstructions } from './instructionsReducer';
import { dismissInstructions } from './instructionsActions';
import mapSelectors from '../util/mapSelectors';
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

  renderInstructions() {
    return (
      <div className={style.container}>
        <section className={style.modal}>
          <p className={style.paragraph}>
            Take this test to estimate how many Chinese characters you
            know.
          </p>
          <p className={style.paragraph}>
            If you know a character, swipe it to the right.
          </p>
          <p className={style.paragraph}>
            If you don't know a character, swipe it to the left.
          </p>

          <button
            className={style.button}
            onClick={this.handleDismissClick}
          >Dismiss</button>
        </section>
      </div>
    );
  }

  render() {
    return (
      <CSSTransitionGroup
        component="div"
        transitionName={style}
        transitionEnterTimeout={200}
        transitionLeaveTimeout={200}
      >
        {this.props.showInstructions ? this.renderInstructions() : null}
      </CSSTransitionGroup>
    );
  }
}

export default connect(
  mapSelectors({ showInstructions }),
  { dismissInstructions }
)(Instructions);

export { Instructions as Pure };


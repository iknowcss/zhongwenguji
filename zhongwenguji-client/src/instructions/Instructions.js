import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import { showInstructions } from './instructionsReducer';
import { dismissInstructions } from './instructionsActions';
import mapSelectors from '../util/mapSelectors';
import Button from '../component/Button';
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

  renderInstructions() {
    return (
      <div className={style.container}>
        <section className={style.modal}>
          <I18n component="p" className={style.paragraph} stringId={'instructions.p1'} />
          <I18n component="p" className={style.paragraph} stringId={'instructions.p2'} />
          <I18n component="p" className={style.paragraph} stringId={'instructions.p3'} />

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


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

  handleDismissClick = () => {
    this.props.dismissInstructions();
  };

  render() {
    return (
      <CSSTransitionGroup
        component="div"
        transitionName={style}
        transitionEnterTimeout={200}
        transitionLeaveTimeout={200}
      >
        {this.props.showInstructions ? (
          <div className={style.container}>
            instructions
            <button onClick={this.handleDismissClick}>Dismiss</button>
          </div>
        ): null}
      </CSSTransitionGroup>
    );
  }
}

export default connect(
  mapSelectors({ showInstructions }),
  { dismissInstructions }
)(Instructions);

export { Instructions as Pure };


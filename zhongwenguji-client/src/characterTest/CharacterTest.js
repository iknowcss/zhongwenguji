import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CSSTransitionGroup } from 'react-transition-group';
import {
  toggleDefinition,
  markCurrentKnown,
  markCurrentUnknown,
  undoDiscard
} from './characterTestActions';
import {
  currentCard,
  isShowDefinition,
  status,
  scoreStatistics,
  curveParams
} from './characterTestReducer';
import keyHandler from '../util/keyHandler';
import CharacterCard from './CharacterCard';
import './CharacterTest.css';

const noop = () => {};

class CharacterTest extends Component {
  static propTypes = {
    currentCard: PropTypes.object,
    isShowDefinition: PropTypes.bool,
    status: PropTypes.string,
    scoreStatistics: PropTypes.object,
    curveParams: PropTypes.object,

    toggleDefinition: PropTypes.func,
    markCurrentKnown: PropTypes.func,
    markCurrentUnknown: PropTypes.func,
    undoDiscard: PropTypes.func,
  };

  static defaultProps = {
    currentCard: null,
    isShowDefinition: false,
    status: '',
    scoreStatistics: {},
    curveParams: {},

    toggleDefinition: noop,
    markCurrentKnown: noop,
    markCurrentUnknown: noop,
    undoDiscard: noop,
  };

  componentDidMount() {
    this.keyHandler = keyHandler({
      onKeyDown: this.handleKeyDown
    });
  }

  componentWillUnmount() {
    this.keyHandler.unregister();
  }

  handleKeyDown = (key) => {
    switch (key) {
      case 'ArrowDown':
        this.props.toggleDefinition();
        break;
      case 'ArrowLeft':
        this.props.markCurrentUnknown();
        break;
      case 'ArrowRight':
        this.props.markCurrentKnown();
        break;
      case 'ArrowUp':
        this.props.undoDiscard();
        break;
      default:
        break;
    }
  };

  renderLiveStats() {
    const padding = 10;
    const barWidth = 10;
    const { sectionStats = [] } = this.props.scoreStatistics;

    const rangeWidth = sectionStats[0] ? sectionStats[0].range[1] - sectionStats[0].range[0] : 0;
    const curveParams = this.props.curveParams || {};
    const { amplitude = 0, decayStartX = 0, decayPeriod = 0 } = curveParams;
    function curve(xi) {
      const chari = rangeWidth * xi;
      if (chari < decayStartX) {
        return amplitude;
      } else if (chari >= decayStartX + decayPeriod) {
        return 0;
      }
      return amplitude / 2 * (1 + Math.cos((chari - decayStartX) * Math.PI / decayPeriod));
    }

    return (
      <svg width="420" height="220">
        {sectionStats.map(({ isTested, knownPercent, range }, i) => (<g key={i}>
          {(isTested && knownPercent >= 0) ? (
            <circle
              cx={padding + barWidth * i}
              cy={padding + 100 - knownPercent}
              r={3}
              style={{fill: 'rgb(0,0,255)'}}
            />
          ) : null}
          {(curveParams) ? (
            <line
              x1={padding + barWidth * i}
              y1={padding + 100 - curve(i)}
              x2={padding + barWidth * (i + 1)}
              y2={padding + 100 - curve(i + 1)}
              style={{stroke: 'rgb(0,0,255)', 'strokeWidth': '2'}}
            />
          ) : null}
        </g>))}
      </svg>
    );
  }

  render() {
    return (
      <>
        <div>Test status: {this.props.status}</div>
        <div>
          Live Stats
          {this.renderLiveStats()}
        </div>
        <CSSTransitionGroup
          component="div"
          className="TestCardStack"
          transitionName="cardSwipe"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {this.props.currentCard ? (<CharacterCard
            {...this.props.currentCard}
            showDefinition={this.props.isShowDefinition}
            key={this.props.currentCard.index}
          />) : null}
        </CSSTransitionGroup>
      </>
    );
  }
}

export { CharacterTest as Pure };

const mapSelectors = (map) => (state) => Object.keys(map).reduce((props, key) => {
  props[key] = map[key](state);
  return props;
}, {});

export default connect(mapSelectors({
  currentCard,
  isShowDefinition,
  status,
  scoreStatistics,
  curveParams
}), {
  toggleDefinition,
  markCurrentKnown,
  markCurrentUnknown,
  undoDiscard
})(CharacterTest);


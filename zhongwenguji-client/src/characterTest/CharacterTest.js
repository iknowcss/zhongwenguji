import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
  resultData
} from './characterTestReducer';
import mapSelectors from '../util/mapSelectors';
import keyHandler from '../util/keyHandler';
import CardStackMobile from '../card/CardStackMobile';
// import CardStackDesktop from '../card/CardStackDesktop';
import style from './CharacterTest.module.scss';

const noop = () => {};

const GRAPH_PADDING = 10;

class CharacterTest extends Component {
  static propTypes = {
    currentCard: PropTypes.object,
    isShowDefinition: PropTypes.bool,
    status: PropTypes.string,
    scoreStatistics: PropTypes.object,
    resultData: PropTypes.object,

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
    resultData: {},

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

  handleDiscardLeft = () => {
    this.props.markCurrentUnknown();
  };

  handleDiscardRight = () => {
    this.props.markCurrentKnown();
  };

  handleUndo = () => {
    this.props.undoDiscard();
  };

  handleDefinition = () => {
    this.props.toggleDefinition();
  };

  renderLiveStats() {
    const padding = 10;
    const barWidth = 10;
    const { sectionStats = [] } = this.props.scoreStatistics;

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
        </g>))}
      </svg>
    );
  }

  renderResults() {
    const {
      curvePoints = [],
      samplePoints = [],
      knownEstimate = -1,
      knownEstimateUncertainty = -1
    } = this.props.resultData;

    return (
      <div>
        <div>You know {knownEstimate} 汉字 ± {knownEstimateUncertainty}</div>
        <div>
          <svg width={1000 + 2 * GRAPH_PADDING} height={100 + 2 * GRAPH_PADDING}>
            <g>
              {curvePoints.map(([x1, y1], i) => {
                const next = curvePoints[i + 1];
                if (next) {
                  const [x2, y2] = next;
                  return (
                    <line
                      key={x1}
                      x1={GRAPH_PADDING + x1 / 10}
                      y1={GRAPH_PADDING + 100 - y1}
                      x2={GRAPH_PADDING + x2 / 10}
                      y2={GRAPH_PADDING + 100 - y2}
                      style={{stroke: 'rgb(255,0,0)', 'strokeWidth': 1}}
                    />
                  );
                }
                return null;
              })}
            </g>
            <g>
              {samplePoints.map(([x, y]) => (
                <circle
                  key={x}
                  cx={GRAPH_PADDING + x / 10}
                  cy={GRAPH_PADDING + 100 - y}
                  r={3}
                  style={{fill: 'rgb(0,0,255)'}}
                />
              ))}
            </g>
          </svg>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={style.container}>
        {this.props.resultData ? this.renderResults() : (
          <CardStackMobile
            currentCard={this.props.currentCard}
            showDefinition={this.props.isShowDefinition}
            onDiscardLeft={this.handleDiscardLeft}
            onDiscardRight={this.handleDiscardRight}
            onUndo={this.handleUndo}
            onDefinition={this.handleDefinition}
          />
        )}
      </div>
    );
  }
}

export { CharacterTest as Pure };

export default connect(mapSelectors({
  currentCard,
  isShowDefinition,
  status,
  scoreStatistics,
  resultData
}), {
  toggleDefinition,
  markCurrentKnown,
  markCurrentUnknown,
  undoDiscard
})(CharacterTest);


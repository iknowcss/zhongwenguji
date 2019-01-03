import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import mapSelectors from '../util/mapSelectors';
import { resultData, scoreStatistics } from '../characterTest/characterTestReducer';

const GRAPH_PADDING = 10;

class Results extends Component {
  static propTypes = {
    scoreStatistics: PropTypes.object,
    resultData: PropTypes.object
  };

  static defaultProps = {
    scoreStatistics: {},
    resultData: {}
  };

  render() {
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
}

export { Results as Pure };

export default connect(mapSelectors({
  scoreStatistics,
  resultData
}))(Results);

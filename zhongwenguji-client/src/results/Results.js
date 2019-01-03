import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Chart } from 'chart.js';
import mapSelectors from '../util/mapSelectors';
import { resultData, scoreStatistics } from '../characterTest/characterTestReducer';
import I18n from '../i18n/I18n';
import style from './Results.module.scss';

class Results extends Component {
  static propTypes = {
    scoreStatistics: PropTypes.object,
    resultData: PropTypes.object
  };

  static defaultProps = {
    scoreStatistics: {},
    resultData: {}
  };

  constructor() {
    super();
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const {
      curvePoints = [],
      samplePoints = []
    } = this.props.resultData;

    function datify(curvePoints, samplePoints) {
      let stopIndex = 0;
      curvePoints.find(([,y], i) => (stopIndex = i) && y === 0);
      stopIndex = Math.max(10, stopIndex + 2);

      return {
        // labels: Array.from(curvePoints.slice(0, stopIndex), ([x]) => x),
        datasets: [
          {
            data: Array.from(samplePoints, ([x, y]) => ({x, y})),
            backgroundColor: 'transparent',
            borderColor: 'red',
            showLine: false,
            borderWidth: 2,
            pointRadius: 2
          },
          {
            showLine: true,
            data: Array.from(curvePoints.slice(0, stopIndex), ([x, y]) => ({x, y})),
            backgroundColor: 'rgb(240, 248, 255, .5)',
            borderColor: 'cornflowerblue',
            borderWidth: 2,
            pointRadius: 0
          }
        ]
      };
    }

    this.canvasContext = this.canvasRef.current.getContext('2d');
    this.chart = new Chart(this.canvasContext, {
      responsive: true,
      type: 'scatter',
      data: datify(curvePoints, samplePoints),
      options: {
        legend: { display: false },
        scales: {
          xAxes: [{
            ticks: {
              callback: x => Math.round(x / 100) * 100,
              maxTicksLimit: 5,
              startAtZero: true
            }
          }],
          yAxes: [{
            ticks: {
              callback: y => y === 100 ? '100%' : y < 100 ? y : '',
              beginAtZero: true,
              max: 120
            }
          }]
        }
      }
    });
  }

  render() {
    const {
      knownEstimate = -1,
      knownEstimateUncertainty = -1
    } = this.props.resultData;

    // <svg width={1000 + 2 * GRAPH_PADDING} height={100 + 2 * GRAPH_PADDING}>
    //   <g>
    //     {curvePoints.map(([x1, y1], i) => {
    //       const next = curvePoints[i + 1];
    //       if (next) {
    //         const [x2, y2] = next;
    //         return (
    //           <line
    //             key={x1}
    //             x1={GRAPH_PADDING + x1 / 10}
    //             y1={GRAPH_PADDING + 100 - y1}
    //             x2={GRAPH_PADDING + x2 / 10}
    //             y2={GRAPH_PADDING + 100 - y2}
    //             style={{stroke: 'rgb(255,0,0)', 'strokeWidth': 1}}
    //           />
    //         );
    //       }
    //       return null;
    //     })}
    //   </g>
    //   <g>
    //     {samplePoints.map(([x, y]) => (
    //       <circle
    //         key={x}
    //         cx={GRAPH_PADDING + x / 10}
    //         cy={GRAPH_PADDING + 100 - y}
    //         r={3}
    //         style={{fill: 'rgb(0,0,255)'}}
    //       />
    //     ))}
    //   </g>
    // </svg>

    return (
      <div className={style.container}>
        <I18n
          component="div"
          stringId="results.youKnow"
          className={style.youKnow}
        />
        <div className={style.estimate}>
          <span className={style.mean}>{knownEstimate}</span>
          <span className={style.plusMinus}>±</span>
          <span className={style.std}>{knownEstimateUncertainty}</span>
        </div>
        <I18n
          component="div"
          stringId="results.measure"
          className={style.measure}
        />
        <div className={style.canvasContainer}>
          <canvas ref={this.canvasRef} />
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Chart } from 'chart.js';
import style from './ResultsChart.module.scss';
import colors from '../style/colors.scss';

const lightTransparent = 'rgba(' + [].slice.call(colors.light.match(/^#?(..)(..)(..)$/), 1, 4).map(n => parseInt(n, 16)).join(',') + ',.5)';

function datify(curvePoints, samplePoints) {
  let stopIndex = 0;
  curvePoints.find(([,y], i) => (stopIndex = i) && y === 0);
  stopIndex = stopIndex + 2;

  return {
    datasets: [
      {
        data: Array.from(samplePoints, ([x, y]) => ({x, y})),
        backgroundColor: 'transparent',
        borderColor: colors.accent,
        showLine: false,
        borderWidth: 2,
        pointRadius: 2
      },
      {
        showLine: true,
        data: Array.from(curvePoints.slice(0, stopIndex), ([x, y]) => ({x, y})),
        backgroundColor: lightTransparent,
        borderColor: colors.primary,
        borderWidth: 2,
        pointRadius: 0
      }
    ]
  };
}

export const renderXTick = x => Math.round(x / 100) * 100;

export const renderYTick = y => y === 100 ? '100%' : y < 100 ? `${y}` : '';

export default class ResultsChart extends Component {
  static propTypes = {
    curvePoints: PropTypes.array,
    samplePoints: PropTypes.array,
  };

  static defaultProps = {
    curvePoints: [],
    samplePoints: []
  };

  constructor() {
    super();
    this.canvasRef = React.createRef();
  }

  destroyChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = null;
    this.canvasContext = null;
  }

  initChart() {
    const { curvePoints, samplePoints } = this.props;

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
              callback: renderXTick,
              maxTicksLimit: 5,
              startAtZero: true
            }
          }],
          yAxes: [{
            ticks: {
              callback: renderYTick,
              beginAtZero: true,
              max: 120
            }
          }]
        }
      }
    });
  }

  componentDidMount() {
    this.initChart();
  }

  componentWillUnmount() {
    this.destroyChart();
  }

  render() {
    return (
      <div className={style.container}>
        <canvas ref={this.canvasRef} />
      </div>
    )
  }
}

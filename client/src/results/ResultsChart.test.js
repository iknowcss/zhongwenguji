import React from 'react';
import { mount } from 'enzyme';
import ResultsChart, { renderXTick, renderYTick } from './ResultsChart';

const chartClassConstructorMock = jest.fn();
const chartClassDestroyMock = jest.fn();
const canvasContextMock = { canvas: 'mock' };
global.__ResultsChart = {
  chartClassConstructorMock,
  chartClassDestroyMock
};

jest.mock('chart.js', () => ({
  Chart: class {
    constructor(...args) {
      global.__ResultsChart.chartClassConstructorMock(...args);
    }

    destroy = global.__ResultsChart.chartClassDestroyMock;
  }
}));

jest.mock('../style/colors.scss', () => ({
    brandColor: '#0000ff',
    lightShades: '#fefefe',
    lightAccent: '#ffaaaa'
}));

describe('ResultsChart', () => {
  beforeAll(() => {
    chartClassConstructorMock.mockClear();
    jest
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockImplementation(() => canvasContextMock);
  });

  it('initalises the chart', () => {
    const curvePoints = [[0, 53], [249, 53], [498, 53]];
    const samplePoints = [[124.5, 60], [373.5, 40], [622.5, 60]];
    mount(
      <ResultsChart
        curvePoints={curvePoints}
        samplePoints={samplePoints}
      />
    );
    expect(chartClassConstructorMock).toHaveBeenCalledTimes(1);
    expect(chartClassConstructorMock.mock.calls[0])
      .toMatchSnapshot();
  });

  it('destroys the chart', () => {
    const component = mount(<ResultsChart />);

    component.unmount();

    expect(chartClassDestroyMock).toHaveBeenCalledTimes(1);
  });

  it('rounds x-ticks to the nearest hundred', () => {
    expect(renderXTick(123)).toEqual(100);
    expect(renderXTick(150)).toEqual(200);
    expect(renderXTick(178)).toEqual(200);
  });

  it('displays the y-ticks', () => {
    expect(renderYTick(0)).toEqual('0');
    expect(renderYTick(50)).toEqual('50');
    expect(renderYTick(100)).toEqual('100%');
    expect(renderYTick(101)).toEqual('');
  });
});

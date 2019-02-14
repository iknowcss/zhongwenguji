import mockConsole from 'jest-mock-console';
import analyticsService, { initStateEnum } from './analyticsService';
import * as getConfigModule from '../getConfig';

describe('analyticsService', () => {
  let restoreConsole;
  let getConfigStub;

  beforeEach(() => {
    restoreConsole = mockConsole();
    global.window.ga = jest.fn();
    getConfigStub = jest.spyOn(getConfigModule, 'default');
    analyticsService.state = initStateEnum.UNINITIALIZED;
    delete global.window.dataLayer;
  });

  afterEach(() => {
    restoreConsole();
    getConfigStub.mockRestore();
  });

  describe('GA active', () => {
    beforeEach(() => {
      getConfigStub.mockImplementation(() => ({ enableGA: true }));
      analyticsService.init();
      analyticsService.gtag = jest.fn();
    });

    it('initializes', () => {
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith('GA Enabled');
      expect(global.window.dataLayer).toHaveLength(2);
    });

    it('sends events', () => {
      analyticsService.sendEvent('firstSwipe', {
        event_category: 'Test',
        event_label: 'foo'
      });
      expect(analyticsService.gtag).toHaveBeenCalledTimes(1);
      expect(analyticsService.gtag).toHaveBeenCalledWith('event', 'firstSwipe', {
        event_category: 'Test',
        event_label: 'foo'
      });
    });
  });

  describe('GA inactive', () => {
    beforeEach(() => {
      getConfigStub.mockImplementation(() => ({ enableGA: false }));
      analyticsService.init();
      analyticsService.gtag = jest.fn();
    });

    it('initializes', () => {
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith('GA Disabled');
      expect(global.window.dataLayer).not.toBeDefined();
    });

    it('does not send', () => {
      analyticsService.sendEvent('firstSwipe', {
        event_category: 'Test',
        event_label: 'foo'
      });
      expect(analyticsService.gtag).toHaveBeenCalledTimes(0);
    });
  });
});

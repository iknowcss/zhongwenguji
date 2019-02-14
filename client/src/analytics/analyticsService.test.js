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
    });

    it('initializes', () => {
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith('GA Enabled');
      expect(global.window.dataLayer).toHaveLength(2);
    });

    it('sends events', () => {
      analyticsService.sendEvent({
        eventCategory: 'Test',
        eventAction: 'firstSwipe',
        eventLabel: 'foo'
      });
      expect(global.window.ga).toHaveBeenCalledTimes(1);
      expect(global.window.ga).toHaveBeenCalledWith('send', 'event', {
        eventCategory: 'Test',
        eventAction: 'firstSwipe',
        eventLabel: 'foo'
      });
    });
  });

  describe('GA inactive', () => {
    beforeEach(() => {
      getConfigStub.mockImplementation(() => ({ enableGA: false }));
      analyticsService.init();
    });

    it('initializes', () => {
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith('GA Disabled');
      expect(global.window.dataLayer).not.toBeDefined();
    });

    it('does not send', () => {
      analyticsService.sendEvent({
        eventCategory: 'Test',
        eventAction: 'firstSwipe',
        eventLabel: 'foo'
      });
      expect(global.window.ga).toHaveBeenCalledTimes(0);
    });
  });
});

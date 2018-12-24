import keyHandler from './keyHandler';

describe('keyHandler', () => {
  const oldMethods = {};
  let eventMap;

  beforeAll(() => {
    oldMethods.addEventListener = window.addEventListener;
    oldMethods.removeEventListener = window.removeEventListener;
    eventMap = {};

    window.addEventListener = jest.fn((type, handler) => {
      if (eventMap[type]) {
        throw new Error('Can only mock one type/handler combo at a time');
      }
      eventMap[type] = handler;
    });

    window.removeEventListener = jest.fn((type, handler) => {
      if (eventMap[type] === handler) {
        delete eventMap[type];
      }
    });
  });

  afterAll(() => {
    window.addEventListener = oldMethods.addEventListener;
    window.removeEventListener = oldMethods.removeEventListener;
  });

  describe('registration', () => {
    let handler;

    afterAll(() => {
      if (handler) handler.unregister();
    });

    it('unregisters', () => {
      const handler = keyHandler();
      expect(eventMap['keydown']).toBeDefined();
      expect(eventMap['keyup']).toBeDefined();

      handler.unregister();
      expect(eventMap['keydown']).toBeUndefined();
      expect(eventMap['keyup']).toBeUndefined();
    });
  });

  describe('event processing', () => {
    let onKeyDown;
    let onKeyUp;
    let handler;

    beforeAll(() => {
      onKeyDown = jest.fn();
      onKeyUp = jest.fn();
      handler = keyHandler({ onKeyDown, onKeyUp });
    });

    afterAll(() => {
      handler.unregister();
    });

    beforeEach(() => {
      onKeyDown.mockClear();
      onKeyUp.mockClear();
    });

    it('only fires events for arrow keys', () => {
      eventMap['keydown']({ key: 'ArrowUp' });
      eventMap['keyup']({ key: 'ArrowUp' });

      eventMap['keydown']({ key: 'ArrowRight' });
      eventMap['keyup']({ key: 'ArrowRight' });

      eventMap['keydown']({ key: 'ArrowDown' });
      eventMap['keyup']({ key: 'ArrowDown' });

      eventMap['keydown']({ key: 'ArrowLeft' });
      eventMap['keyup']({ key: 'ArrowLeft' });

      eventMap['keydown']({ key: 'E' });
      eventMap['keyup']({ key: 'E' });

      expect(onKeyDown).toHaveBeenCalled();
      expect(onKeyDown.mock.calls).toEqual([
        ['ArrowUp'],
        ['ArrowRight'],
        ['ArrowDown'],
        ['ArrowLeft']
      ]);
    });

    it('only fires keydown once until keyup is fired', () => {
      eventMap['keydown']({ key: 'ArrowLeft' });
      eventMap['keydown']({ key: 'ArrowLeft' });
      eventMap['keyup']({ key: 'ArrowLeft' });

      expect(onKeyDown).toHaveBeenCalled();
      expect(onKeyDown.mock.calls).toEqual([['ArrowLeft']]);
    });
  });
});

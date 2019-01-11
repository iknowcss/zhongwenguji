import React from 'react';
import Renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { JSDOM } from 'jsdom';
import CharacterCard from './CharacterCard';
import CardStackDisplay from './CardStackDisplay';

const classNames = (element) => {
  if (!element || !element.props) {
    throw new Error('A valid element was not provided');
  }
  return ((
    typeof element.props === 'function'
      ? element.props().className
      : element.props.className
  ) || '').split(/\s+/);
};
const hasClassName = className => (element) => classNames(element).indexOf(className) >= 0;

const BASE_CARD = { index: 1, score: NaN };
const DISCARD_THRESHOLD = 50;

describe('CardStackDisplay', () => {
  let eventListener;
  let component;
  let animationContainer;
  let touchArea;
  let characterCard;

  function setupEventListener() {
    eventListener = {};
    document.addEventListener = jest.fn((eventType, callback) => {
      eventListener[eventType] = callback;
    });
    document.removeEventListener = jest.fn((eventType, callback) => {
      if (eventListener[eventType] === callback) {
        delete eventListener[eventType];
      }
    });
  }

  function update() {
    animationContainer = component.root.find(hasClassName('animationContainer'));
    touchArea = component.root.find(hasClassName('touchArea'));
    characterCard = component.root.findByType(CharacterCard);
  }

  function setup(props) {
    setupEventListener();
    component = Renderer.create(
      <CardStackDisplay
        card={BASE_CARD}
        discardThreshold={DISCARD_THRESHOLD}
        {...props}
      />
    );
    update();
  }

  async function updateEnzyme() {
    component.update();
    await new Promise((resolve) => setTimeout(resolve, 1));
    animationContainer = component.find('.animationContainer').at(0);
    touchArea = component.find('.touchArea').at(0);
    characterCard = component.find(CharacterCard).at(0);
  }

  async function setupEnzyme(props) {
    setupEventListener();
    component = mount(
      <CardStackDisplay
        card={BASE_CARD}
        discardThreshold={DISCARD_THRESHOLD}
        {...props}
      />
    );
    await updateEnzyme();
  }

  it('renders', () => {
    setup();
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('renders without a card', () => {
    try {
      setup({ card: null });
    } catch (e) {}
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('cleans up event listeners', () => {
    setup();
    component.unmount();

    expect(eventListener).toEqual(
      expect.not.objectContaining({
        touchstart: expect.anything(),
        touchend: expect.anything(),
        touchcancel: expect.anything(),
        touchmove: expect.anything()
      })
    );
  });

  describe('animation', () => {
    it('applies the discardLeft style', () => {
      setup({ card: { ...BASE_CARD, score: 0 } });
      expect(classNames(animationContainer))
        .toEqual(expect.arrayContaining(['discardLeft']));
    });

    it('applies the discardRight style', () => {
      setup({ card: { ...BASE_CARD, score: 1 } });
      expect(classNames(animationContainer))
        .toEqual(expect.arrayContaining(['discardRight']));
    });
  });

  describe('swiping', () => {
    let target;
    let onDiscardLeft;
    let onDiscardRight;

    const applyTouch = async (eventType, params = {}) => {
      const {
        dx = 0,
        identifier = 0,
        preventDefault = () => {},
      } = params;
      const actualTarget = params.target || target;
      eventListener[eventType]({
        target: actualTarget,
        preventDefault,
        touches: [{ identifier, clientX: 150 + dx, clientY: 150 }],
        changedTouches: [{ identifier, clientX: 150 + dx, clientY: 150 }],
      });
      await updateEnzyme();
    };

    beforeAll(async () => {
      onDiscardLeft = jest.fn();
      onDiscardRight = jest.fn();
      await setupEnzyme({ onDiscardLeft, onDiscardRight, transitionTimeout: 0 });
      target = touchArea.getDOMNode();
    });

    beforeEach(() => {
      onDiscardLeft.mockClear();
      onDiscardRight.mockClear();
    });

    afterEach(async () => {
      await applyTouch('touchend');
    });

    it('starts', async () => {
      const dx = 0;
      const preventDefault = jest.fn();
      await applyTouch('touchstart', { dx: 0, preventDefault });
      expect(classNames(touchArea)).toEqual(
        expect.arrayContaining(['touchAreaSnap'])
      );
      expect(touchArea.props().style).toEqual(
        expect.objectContaining({ left: `${dx}px` })
      );
      expect(preventDefault).toHaveBeenCalledTimes(1);
    });

    it('moves within the threshold', async () => {
      const dx = -DISCARD_THRESHOLD;
      await applyTouch('touchstart');
      await applyTouch('touchmove', { dx });
      expect(touchArea.props().style).toEqual(
        expect.objectContaining({ left: `${dx}px` })
      );
      expect(classNames(characterCard)).toEqual(['card']);
    });

    it('moves to the left', async () => {
      const dx = -DISCARD_THRESHOLD - 1;
      await applyTouch('touchstart');
      await applyTouch('touchmove', { dx });
      expect(touchArea.props().style).toEqual(
        expect.objectContaining({ left: `${dx}px` })
      );
      expect(classNames(characterCard)).toEqual(
        expect.arrayContaining(['card', 'predictDiscardLeft'])
      );
    });

    it('moves to the right', async () => {
      const dx = DISCARD_THRESHOLD + 1;
      await applyTouch('touchstart');
      await applyTouch('touchmove', { dx });
      expect(touchArea.props().style).toEqual(
        expect.objectContaining({ left: `${dx}px` })
      );
      expect(classNames(characterCard)).toEqual(
        expect.arrayContaining(['card', 'predictDiscardRight'])
      );
    });

    it('cancels swipe', async () => {
      await applyTouch('touchstart');
      await applyTouch('touchend', { dx: DISCARD_THRESHOLD });
      expect(touchArea.props().style).toEqual(
        expect.objectContaining({ left: '0px' })
      );
      expect(classNames(characterCard)).toEqual(['card']);
    });

    it('swipes left', async () => {
      const dx = -DISCARD_THRESHOLD - 1;

      await applyTouch('touchstart');
      await applyTouch('touchmove', { dx });
      await applyTouch('touchend', { dx });

      expect(onDiscardLeft).toHaveBeenCalledTimes(1);
    });

    it('swipes right', async () => {
      const dx = DISCARD_THRESHOLD + 1;

      await applyTouch('touchstart');
      await applyTouch('touchmove', { dx });
      await applyTouch('touchend', { dx });

      expect(onDiscardRight).toHaveBeenCalledTimes(1);
    });

    it('ignores touches on other elements', async () => {
      const preventDefault = jest.fn();
      await applyTouch('touchstart', { target: component.getDOMNode(), preventDefault });
      expect(preventDefault).not.toHaveBeenCalled();
    });

    it('does not move if there is not an active touch', async () => {
      const dx = 9;
      await applyTouch('touchmove', { dx });
      expect(touchArea.props().style).toEqual(
        expect.not.objectContaining({ left: `${dx}px` })
      );
    });

    it('does not end if there is not an active touch', async () => {
      const dx = DISCARD_THRESHOLD + 1;
      await applyTouch('touchend', { dx });
      expect(onDiscardRight).not.toHaveBeenCalled();
    });

    it('accepts a fresh touch (fix touch lock bug)', async () => {
      const preventDefault = jest.fn();
      await applyTouch('touchstart', { preventDefault });
      await applyTouch('touchstart', { preventDefault });

      expect(preventDefault).toHaveBeenCalledTimes(2);
    });

    it('receives a new card', async () => {
      const dx = DISCARD_THRESHOLD + 1;
      await applyTouch('touchstart');
      await applyTouch('touchmove', { dx });
      await applyTouch('touchend', { dx });

      component.setProps({
        transitionTimeout: 0,
        card: { ...BASE_CARD, index: 2 }
      });
      await updateEnzyme();

      expect(touchArea.props().style).toEqual(
        expect.objectContaining({ left: '0px' })
      );
      expect(classNames(characterCard)).toEqual(['card']);
    });
  });
});

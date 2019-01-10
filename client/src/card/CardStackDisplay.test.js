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
  return (element.props.className || '').split(/\s+/);
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
    animationContainer = component.root.find(hasClassName('animationContainer'));
    touchArea = component.root.find(hasClassName('touchArea'));
    characterCard = component.root.findByType(CharacterCard);
  }

  function setupEnzyme(props) {
    setupEventListener();
    component = mount(
      <CardStackDisplay
        card={BASE_CARD}
        discardThreshold={DISCARD_THRESHOLD}
        {...props}
      />
    );
    animationContainer = component.find('.animationContainer');
    touchArea = component.find('.touchArea');
    characterCard = component.find(CharacterCard);
  }

  it('renders', () => {
    setup();
    expect(component.toJSON()).toMatchSnapshot();
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

  describe('swiping left', () => {
    const applyTouch = ({ x: clientX, y: clientY, identifier = 0 }) => ({
      touches: [{ identifier, clientX, clientY }],
      changedTouches: [{ identifier, clientX, clientY }]
    });

    beforeAll(() => {
      setupEnzyme();
    });

    it('starts', () => {
      const preventDefault = jest.fn();
      eventListener['touchstart']({
        target: touchArea.getDOMNode(),
        preventDefault,
        ...applyTouch({ x: 150, y: 150 })
      });
      expect(preventDefault).toHaveBeenCalledTimes(1);
    });

    it('moves', () => {
      eventListener['touchmove']({
        target: touchArea.getDOMNode(),
        ...applyTouch({ x: 99, y: 150 })
      });

      // TODO: write assertion
    });
  });
});

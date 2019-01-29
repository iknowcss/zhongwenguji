import React from 'react';
import Renderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';
import { Pure as App } from './App';
import { statusEnum } from './characterTest/characterTestReducer';
import CharacterTest from './characterTest/CharacterTest';
import LoadingPage from './page/LoadingPage';
import Instructions from './instructions/Instructions';
import Results from './results/Results';
import CreditsBar from './CreditsBar';

jest.mock('react-transition-group', () => ({ CSSTransitionGroup: 'div' }));
jest.mock('./results/Results', () => 'div');

describe('App', () => {
  describe('loading samples', () => {
    let component;

    function mount(props) {
      component = Renderer.create(<App {...props} />);
    }

    function update(props) {
      component.update(<App {...props} />);
    }

    it('occurs after component updates to "READY" state', () => {
      const loadSamplesStub = jest.fn();
      mount({
        loadSamples: loadSamplesStub,
        status: statusEnum.RESULTS_READY
      });

      loadSamplesStub.mockClear();

      update({
        loadSamples: loadSamplesStub,
        status: statusEnum.READY
      });

      expect(loadSamplesStub).toHaveBeenCalled();
    });

    it('does not occur after component updates another "READY" state', () => {
      const loadSamplesStub = jest.fn();
      mount({
        loadSamples: loadSamplesStub,
        status: statusEnum.READY
      });

      loadSamplesStub.mockClear();

      update({
        loadSamples: loadSamplesStub,
        status: statusEnum.LOADING
      });

      expect(loadSamplesStub).not.toHaveBeenCalled();
    });
  });

  describe('rendering states', () => {
    let children;

    function setup(props) {
      const renderer = new ShallowRenderer();
      renderer.render(<App {...props} />);

      const i18nContext = renderer.getRenderOutput();
      const transitionGroup = i18nContext.props.children;
      children = transitionGroup.props.children.filter(x => x);
    }

    it('renders the CharacterTest', () => {
      setup({ status: statusEnum.TESTING });
      expect(children[0].props.children.type).toBe(CharacterTest);
    });

    it('renders the LoadingPage', () => {
      setup({ status: statusEnum.LOADING });
      expect(children[0].props.children.type).toBe(LoadingPage);

      setup({ status: statusEnum.RESULTS_LOADING });
      expect(children[0].props.children.type).toBe(LoadingPage);
    });

    it('renders the Instructions', () => {
      setup({ showInstructions: true });
      expect(children[0].props.children.type).toBe(Instructions);
    });

    it('renders the Results', () => {
      setup({ status: statusEnum.RESULTS_READY });
      expect(children[0].props.children.type).toBe(Results);
    });

    it('renders the CreditsBar', () => {
      setup({
        showInstructions: false,
        status: statusEnum.TESTING
      });
      expect(children[1].type).toBe(CreditsBar);
    });
  });
});

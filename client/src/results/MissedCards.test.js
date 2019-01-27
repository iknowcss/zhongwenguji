import React from 'react';
import Renderer from 'react-test-renderer';
import { Pure as MissedCards } from './MissedCards';

describe('MissedCards', () => {
  let component;

  function setup(props) {
    component = Renderer.create(<MissedCards {...props} />);
  }

  it('renders no cards', () => {
    setup();
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('renders cards', () => {
    setup({
      missedCards: [
        {
          index: 1,
          character: '读',
          pinyin: ['dou4', 'du2'],
          definition: [
            'comma/phrase marked by pause',
            'to read/to study'
          ]
        }
      ]
    });

    expect(component.toJSON()).toMatchSnapshot();
  });

  it('returns to the results page', () => {
    const preventDefault = jest.fn();
    const showTestResults = jest.fn();
    setup({ showTestResults });
    const button = component.root.findByProps({ stringId: 'reviewMissed.backButton' });
    button.props.onClick({ preventDefault });
    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(showTestResults).toHaveBeenCalledTimes(1);
  });
});

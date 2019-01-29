import React from 'react';
import Renderer from 'react-test-renderer';
import { Pure as MissedCards } from './MissedCards';

describe('MissedCards', () => {
  let component;
  let backButton;
  let addToSkritterButton;
  let skritterUserName;

  function setup(props) {
    component = Renderer.create(<MissedCards {...props} />);
    backButton = component.root.findAllByProps({ stringId: 'reviewMissed.backButton' })[0];
    addToSkritterButton = component.root.findAllByProps({ stringId: 'reviewMissed.addToSkritter' })[0];
    skritterUserName = component.root.findAllByProps({ className: 'skritterUserName' })[0];
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
    backButton.props.onClick({ preventDefault });

    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(showTestResults).toHaveBeenCalledTimes(1);
  });

  it('links to skritter', () => {
    const preventDefault = jest.fn();
    const addToSkritter = jest.fn();
    setup({ addToSkritter });
    addToSkritterButton.props.onClick({ preventDefault });

    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(addToSkritter).toHaveBeenCalledTimes(1);
  });

  it('renders the user name', () => {
    setup({ isLoggedIn: true, userName: 'iknowcss' });

    expect(skritterUserName).toBeDefined();
    expect(skritterUserName.children).toEqual(['iknowcss']);
  });
});

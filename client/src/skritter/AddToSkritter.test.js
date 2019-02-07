import React from 'react';
import Renderer from 'react-test-renderer';
import {hasClassName, text} from '../util/asdf.testutil';
import {characterSetEnum} from '../characterTest/characterTestReducer';
import {addingStateEnum} from '../skritter/skritterReducer';
import {Pure as AddToSkritter} from './AddToSkritter';

describe('AddToSkritter', () => {
  let component;
  let loginMessage;
  let submitButton;
  let submitResult;

  function setup(props) {
    component = Renderer.create(
      <AddToSkritter
        missedCards={[]}
        characterSet={characterSetEnum.SIMPLIFIED}
        userName="iknowcss"
        auth="b2hhaQ=="
        {...props}
      />
    );

    loginMessage = component.root.findAll(hasClassName('loginMessage'))[0];
    submitResult = component.root.findAll(hasClassName('submitResult'))[0];
    submitButton = component.root.findAllByProps({ className: 'button' })[0];
  }

  describe('login', () => {
    it('renders login pending state', () => {
      setup({ addingState: addingStateEnum.SUBMIT_READY, isLoginPending: true });

      expect(submitButton.props).toEqual(expect.objectContaining({
        stringId: 'addToSkritter.submit.authorizing',
        disabled: true
      }));
      expect(hasClassName('accordionActive')(loginMessage)).toEqual(false);
    });

    it('renders login success state', () => {
      setup({ addingState: addingStateEnum.SUBMIT_READY, isLoggedIn: true });

      expect(submitButton.props).toEqual(expect.objectContaining({
        stringId: 'addToSkritter.submit.start',
        disabled: false
      }));
      expect(hasClassName('accordionActive')(loginMessage)).toEqual(true);
      expect(text(loginMessage)).toEqual('addToSkritter.loggedInAs iknowcss');
    });

    it('renders login failed state', () => {
      setup({ addingState: addingStateEnum.SUBMIT_READY, isLoginFailed: true });

      expect(submitButton.props).toEqual(expect.objectContaining({
        stringId: 'addToSkritter.submit.loginFailed',
        disabled: true
      }));
      expect(hasClassName('accordionActive')(loginMessage)).toEqual(false);
    });
  });

  describe('submit to skritter', () => {
    it('renders submit ready state', () => {
      setup({ addingState: addingStateEnum.SUBMIT_READY });

      expect(submitButton.props).toEqual(expect.objectContaining({
        stringId: 'addToSkritter.submit.start',
        disabled: false
      }));
    });

    it('renders submit pending state', () => {
      setup({ addingState: addingStateEnum.SUBMIT_PENDING });

      expect(submitButton.props).toEqual(expect.objectContaining({
        stringId: 'addToSkritter.submit.pending',
        disabled: true
      }));
    });

    it('renders submit success', () => {
      setup({ addingState: addingStateEnum.SUBMIT_SUCCESS });

      expect(submitButton.props).toEqual(expect.objectContaining({
        stringId: 'addToSkritter.submit.success',
        disabled: true,
        success: true
      }));
    });

    it('renders submit fail', () => {
      setup({ addingState: addingStateEnum.SUBMIT_ERROR });

      expect(submitButton.props).toEqual(expect.objectContaining({
        stringId: 'addToSkritter.submit.failed',
        disabled: true,
        danger: true
      }));
    });
  });
});

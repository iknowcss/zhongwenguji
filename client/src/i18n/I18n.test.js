import React from 'react';
import Renderer from 'react-test-renderer';
import I18n, { I18nContext } from './I18n';

jest.mock('./en.json', () => ({ 'plant.flower': 'Chrysanthemum' }));
jest.mock('./zh.json', () => ({ 'plant.flower': '菊花' }));

describe('I18n', () => {
  it('renders English', () => {
    const component = Renderer.create(
      <I18nContext.Provider value="en">
        <I18n stringId="plant.flower" />
      </I18nContext.Provider>
    );
    const { type, children: [text] } = component.toJSON();
    expect(type).toEqual('span');
    expect(text).toEqual('Chrysanthemum');
  });

  it('renders 中文', () => {
    const component = Renderer.create(
      <I18nContext.Provider value="zh">
        <I18n stringId="plant.flower" />
      </I18nContext.Provider>
    );
    const { type, children: [text] } = component.toJSON();
    expect(type).toEqual('span');
    expect(text).toEqual('菊花');
  });

  it('renders the string ID when there is no translation context', () => {
    const component = Renderer.create(<I18n stringId="plant.flower" />);
    const { type, children: [text] } = component.toJSON();
    expect(type).toEqual('span');
    expect(text).toEqual('plant.flower');
  });
});

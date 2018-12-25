import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock';
import {
  actionTypes,
  loadSamples,
  markCurrentUnknown,
  markCurrentKnown,
  undoDiscard,
  discardCurrent
} from './characterTestActions';

const mockStore = configureMockStore([thunk]);

describe('characterTestActions', () => {
  const oldConsole = {};
  let store;

  beforeEach(() => {
    store = mockStore({});
    oldConsole.error = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    fetchMock.restore();
    console.error = oldConsole.error;
  });

  it('loads character samples', () => {
    fetchMock.getOnce('http://example.com/characters/sample', {
      body: { mockData: true },
      headers: { 'Content-type': 'application/json' }
    });

    return store.dispatch(loadSamples('http://example.com/characters/sample'))
      .then(() => {
        expect(store.getActions()).toEqual([
          { type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_START },
          {
            type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_SUCCESS,
            mockData: true
          }
        ]);
      });
  });

  it('handles character sample load failure', () => {
    fetchMock.getOnce('http://example.com/characters/sample', 500);

    return store.dispatch(loadSamples('http://example.com/characters/sample'))
      .then(() => {
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith(
          'Could not fetch samples',
          new Error('Response was not OK')
        );
        expect(store.getActions()).toEqual([
          { type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_START },
          {
            type: actionTypes.CHARACTER_SAMPLES_LOAD_SAMPLES_FAIL,
            error: new Error('Response was not OK')
          }
        ]);
      });
  });

  it('discards the current card', () => {
    expect(discardCurrent()).toEqual({ type: actionTypes.TEST_CARD_DISCARD });
  });

  it('marks the current character unknown', () => {
    store.dispatch(markCurrentUnknown());
    expect(store.getActions()).toEqual([
      { type: actionTypes.TEST_CARD_MARK_UNKNOWN },
      { type: actionTypes.TEST_CARD_DISCARD }
    ]);
  });

  it('marks the current character known', () => {
    store.dispatch(markCurrentKnown());
    expect(store.getActions()).toEqual([
      { type: actionTypes.TEST_CARD_MARK_KNOWN },
      { type: actionTypes.TEST_CARD_DISCARD }
    ]);
  });

  it('un-does the previous marking', () => {
    store.dispatch(undoDiscard());
    expect(store.getActions()).toEqual([
      { type: actionTypes.TEST_CARD_MARK_CLEAR },
      { type: actionTypes.TEST_CARD_DISCARD_UNDO }
    ]);
  });
});

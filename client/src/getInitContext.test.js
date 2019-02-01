import mockConsole from 'jest-mock-console';
import rootReducer from './reducer';
import getInitContext from './getInitContext';

describe('getInitContext', () => {
  let initialState;
  let restoreConsole;

  beforeEach(() => {
    restoreConsole = mockConsole();
    initialState = rootReducer();
    localStorage.__STORE__['reduxState'] = JSON.stringify(initialState);
  });

  afterEach(() => {
    restoreConsole();
  });

  it('returns an empty state when there is no context', () => {
    expect(getInitContext('')).toEqual({
      skritterCode: null,
      initialState: null
    });
  });

  describe('skritter code', () => {
    it('returns the skritter code and parses initial state', () => {
      expect(getInitContext('?code=deadbeef&state=addtoskritter'))
        .toEqual({
          skritterCode: 'deadbeef',
          initialState
        });
    });

    it('handles an inital state parse error', () => {
      localStorage.__STORE__['reduxState'] = 'totallynotjson';
      expect(getInitContext('?code=deadbeef&state=addtoskritter'))
        .toEqual({
          skritterCode: 'deadbeef',
          initialState: null
        });
      expect(console.warn).toHaveBeenCalledWith('Failed to load initial redux state', expect.any(Error))
    });
  });
});

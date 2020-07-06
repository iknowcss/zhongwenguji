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
      initialState: null
    });
  });
});

import cloneDeep from 'lodash/cloneDeep';
import rootReducer from './reducer';
import getInitContext from './getInitContext';

describe('getInitContext', () => {
  function encode(object) {
    return Buffer.from(JSON.stringify(object)).toString('base64');
  }

  let initialState;
  beforeEach(() => {
    initialState = rootReducer();
    localStorage.__STORE__['reduxState'] = JSON.stringify(initialState);
  });

  it('returns an empty state when there is no context', () => {
    expect(getInitContext('')).toEqual({
      skritterContext: null,
      initialState: null
    });
  });

  it('parses the skritter context and initial state', () => {
    const skritterContext = { user: 'iknowcss', auth: 'b2hhaQ==' };
    expect(getInitContext(`?skritterContext=${encode(skritterContext)}`))
      .toEqual({
        skritterContext,
        initialState
      });
  });

  it('handles a skritter context parse error', () => {
    global.console = { warn: jest.fn() };
    expect(getInitContext(`?skritterContext=totallynotbase64orjson`))
      .toEqual({
        skritterContext: null,
        initialState: null
      });
    expect(console.warn).toHaveBeenCalledWith('Failed to load skritter context', expect.any(Error))
  });

  it('handles an inital state parse error', () => {
    global.console = { warn: jest.fn() };
    const skritterContext = { user: 'iknowcss', auth: 'b2hhaQ==' };
    localStorage.__STORE__['reduxState'] = 'totallynotjson';
    expect(getInitContext(`?skritterContext=${encode(skritterContext)}`))
      .toEqual({
        skritterContext,
        initialState: null
      });
    expect(console.warn).toHaveBeenCalledWith('Failed to load initial redux state', expect.any(Error))
  });
});

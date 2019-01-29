import getInitContext from './getInitContext';

describe('getInitContext', () => {
  function encode(object) {
    return Buffer.from(JSON.stringify(object)).toString('base64');
  }

  it('returns an empty state when there is no context', () => {
    expect(getInitContext('')).toEqual({
      skritterContext: null,
      initialState: null
    });
  });

  it('parses the skritter context', () => {
    const skritterContext = {
      user: 'iknowcss',
      auth: 'b2hhaQ=='
    };
    expect(getInitContext(`?skritterContext=${encode(skritterContext)}`))
      .toEqual({
        skritterContext,
        initialState: null
      });
  });

  it('handles a parse error', () => {
    global.console = { warn: jest.fn() };
    expect(getInitContext(`?skritterContext=totallynotbase64orjson`))
      .toEqual({
        skritterContext: null,
        initialState: null
      });
    expect(console.warn).toHaveBeenCalledWith('Failed to load skritter context', expect.any(Error))
  });
});

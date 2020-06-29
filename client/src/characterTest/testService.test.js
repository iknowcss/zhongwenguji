import fetchMock from 'fetch-mock';
import getConfig from '../getConfig';
import * as testService from './testService';

function expectOneFetchCallWithJsonBody(expectedBody) {
  expect(fetchMock.calls()).toHaveLength(1);
  const [, { body: bodyJson, headers }] = fetchMock.lastCall();
  expect(headers).toMatchObject({ 'Content-type': 'application/json' });
  expect(JSON.parse(bodyJson)).toEqual(expectedBody);
}

function expectOneFetchCallWithQueryParams(expectedQueryParams) {
  expect(fetchMock.calls()).toHaveLength(1);
  const [requestUrl] = fetchMock.lastCall();
  const queryParams = requestUrl.substr(requestUrl.indexOf('?') + 1)
    .split('&')
    .reduce((result, pair) => {
      const [key, value] = pair.split('=');
      if (key) {
        result[decodeURIComponent(key)] = decodeURIComponent(value);
      }
      return result;
    }, {});
  expect(queryParams).toEqual(expectedQueryParams);
}

describe('testService', () => {
  const { getCharacterSampleUrl, submitTestUrl } = getConfig();

  beforeEach(() => {
    fetchMock.reset();
  });

  it('gets test samples', async () => {
    fetchMock.getOnce(new RegExp(`${getCharacterSampleUrl}(\\?.*)?`), {
      body: { mockData: true },
      headers: { 'Content-type': 'application/json' },
    });

    const result = await testService.getBinSamples({
      selectionBins: [0, 1, 2, 3],
      subsetSkip: 2,
      subsetSize: 5,
      binCount: 40,
      seed: 1337,
    });

    expect(result).toEqual({ mockData: true });
    expectOneFetchCallWithQueryParams({
      selectionBins: '0,1,2,3',
      subsetSkip: '2',
      subsetSize: '5',
      binCount: '40',
      seed: '1337',
    });
  });

  it('submits the test', async () => {
    fetchMock.postOnce(submitTestUrl, {
      body: { mockData: true },
      headers: { 'Content-type': 'application/json' },
    });

    const markedEntries = [{ i: 1, known: false }, { i: 2, known: false }];
    const binSampleParameters = { binCount: 40, subsetSize: 5, seed: 0 };
    const result = await testService.submitTest(markedEntries, binSampleParameters);

    expect(result).toEqual({ mockData: true });
    expectOneFetchCallWithJsonBody({
      binSampleParameters,
      markedEntries,
    });
  });
});

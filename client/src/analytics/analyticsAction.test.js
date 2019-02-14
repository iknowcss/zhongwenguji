import analyticsService from './analyticsService';
import {
  firstSwipe,
  completeTestAfterDuration,
  receiveKnownEstimate,
  reviewMissed
} from './analyticsAction';

describe('analyticsAction', () => {
  let sendEventStub;

  beforeEach(() => {
    sendEventStub = jest.spyOn(analyticsService, 'sendEvent');
  });

  afterEach(() => {
    sendEventStub.mockRestore();
  });

  it('firstSwipe', () => {
    firstSwipe('traditional');
    expect(sendEventStub).toHaveBeenCalledTimes(1);
    expect(sendEventStub.mock.calls[0]).toMatchSnapshot();
  });

  it('completeTestAfterDuration', () => {
    completeTestAfterDuration(42);
    expect(sendEventStub).toHaveBeenCalledTimes(1);
    expect(sendEventStub.mock.calls[0]).toMatchSnapshot();
  });

  it('receiveKnownEstimate', () => {
    receiveKnownEstimate(980);
    expect(sendEventStub).toHaveBeenCalledTimes(1);
    expect(sendEventStub.mock.calls[0]).toMatchSnapshot();
  });

  it('reviewMissed', () => {
    reviewMissed();
    expect(sendEventStub).toHaveBeenCalledTimes(1);
    expect(sendEventStub.mock.calls[0]).toMatchSnapshot();
  });
});

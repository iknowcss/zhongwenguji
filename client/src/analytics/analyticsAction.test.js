import analyticsService from './analyticsService';
import {
  firstSwipe,
  completeTestAfterDuration,
  receiveKnownEstimate,
  reviewMissed
} from './analyticsAction';
import { characterSetEnum } from '../characterTest/characterTestReducer'

describe('analyticsAction', () => {
  let sendEventStub;

  beforeEach(() => {
    sendEventStub = jest.spyOn(analyticsService, 'sendEvent');
  });

  afterEach(() => {
    sendEventStub.mockRestore();
  });

  describe('firstSwipe', () => {
    it('firstSwipeSimplified', () => {
      firstSwipe(characterSetEnum.SIMPLIFIED);
      expect(sendEventStub).toHaveBeenCalledTimes(1);
      expect(sendEventStub.mock.calls[0]).toEqual([
        'firstSwipeSimplified',
        { event_category: 'In-test' }
      ]);
    });

    it('firstSwipeTraditional', () => {
      firstSwipe(characterSetEnum.TRADITIONAL);
      expect(sendEventStub).toHaveBeenCalledTimes(1);
      expect(sendEventStub.mock.calls[0]).toEqual([
        'firstSwipeTraditional',
        { event_category: 'In-test' }
      ]);
    });

    it('firstSwipe fallback', () => {
      firstSwipe('JAPANESE');
      expect(sendEventStub).toHaveBeenCalledTimes(1);
      expect(sendEventStub.mock.calls[0]).toEqual([
        'firstSwipeJAPANESE',
        { event_category: 'In-test' }
      ]);
    });
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

import analyticsService from './analyticsService';
import { characterSetEnum } from '../characterTest/characterTestReducer';

const cse = characterSetEnum || {};
const characterSetActionMap = {
  [cse.SIMPLIFIED]: 'firstSwipeSimplified',
  [cse.TRADITIONAL]: 'firstSwipeTraditional'
};

export const firstSwipe = (characterSet) => {
  const eventAction = characterSetActionMap[characterSet] || `firstSwipe${characterSet}`;
  analyticsService.sendEvent(eventAction, { event_category: 'In-test' });
};

export const completeTestAfterDuration = (duration) => analyticsService.sendEvent('completeTestAfterDuration', {
  event_category: 'In-test',
  value: duration
});

export const receiveKnownEstimate = (knownEstimate) => analyticsService.sendEvent('receiveKnownEstimate', {
  event_category: 'Test results',
  value: knownEstimate
});

export const reviewMissed = () => analyticsService.sendEvent('reviewMissed', {
  event_category: 'Test results'
});

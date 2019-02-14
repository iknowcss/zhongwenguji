import analyticsService from './analyticsService';

export const firstSwipe = (characterSet) => analyticsService.sendEvent('firstSwipe', {
  event_category: 'Test',
  event_label: characterSet
});

export const completeTestAfterDuration = (duration) => analyticsService.sendEvent('completeTestAfterDuration', {
  event_category: 'Test',
  value: duration
});

export const receiveKnownEstimate = (knownEstimate) => analyticsService.sendEvent('receiveKnownEstimate', {
  event_category: 'Test results',
  value: knownEstimate
});

export const reviewMissed = () => analyticsService.sendEvent('reviewMissed', {
  event_category: 'Test results'
});

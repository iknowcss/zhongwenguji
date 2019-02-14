import analyticsService from './analyticsService';

export const firstSwipe = (characterSet) => analyticsService.sendEvent({
  eventCategory: 'Test',
  eventAction: 'firstSwipe',
  eventLabel: characterSet
});

export const completeTestAfterDuration = (duration) => analyticsService.sendEvent({
  eventCategory: 'Test',
  eventAction: 'completeTestAfterDuration',
  eventValue: duration
});

export const receiveKnownEstimate = (knownEstimate) => analyticsService.sendEvent({
  eventCategory: 'Test results',
  eventAction: 'receiveKnownEstimate',
  eventValue: knownEstimate
});

export const reviewMissed = () => analyticsService.sendEvent({
  eventCategory: 'Test results',
  eventAction: 'reviewMissed'
});

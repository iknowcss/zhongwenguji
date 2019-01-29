import { combineReducers } from 'redux';
import characterTestReducer from './characterTest/characterTestReducer';
import { default as instructions } from './instructions/instructionsReducer';
import { default as skritter } from './skritter/skritterReducer';
import { default as i18n } from './i18n/i18nReducer';

export default combineReducers({
  characterTestReducer,
  instructions,
  skritter,
  i18n
});

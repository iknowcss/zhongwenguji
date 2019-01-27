import { combineReducers } from 'redux';
import characterTestReducer from './characterTest/characterTestReducer';
import instructionsReducer from './instructions/instructionsReducer';
import i18nReducer from './i18n/i18nReducer';

export default combineReducers({
  characterTestReducer,
  instructions: instructionsReducer,
  i18n: i18nReducer
});

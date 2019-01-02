import { combineReducers } from 'redux';
import characterTestReducer from './characterTest/characterTestReducer';
import instructionsReducer from './instructions/instructionsReducer';

export default combineReducers({
  characterTestReducer,
  instructions: instructionsReducer
});

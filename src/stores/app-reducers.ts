import { combineReducers } from 'redux';
import { commonReducer } from './common/reducers';
import { userReducer } from './user/reducer';

const appReducer = combineReducers({
  commonReducer,
  userReducer
});

export default appReducer;

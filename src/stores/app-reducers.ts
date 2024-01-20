import { combineReducers } from 'redux';
import { authReducer } from './auth/reducers';
import { commonReducer } from './common/reducers';

const appReducer = combineReducers({
  commonReducer,
  authReducer,
});

export default appReducer;

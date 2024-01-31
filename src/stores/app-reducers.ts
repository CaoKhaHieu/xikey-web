import { combineReducers } from 'redux';
import { commonReducer } from './common/reducers';
import { userReducer } from './user/reducer';
import { conversationReducer } from './conversation/reducer';
import { messageReducer } from './message/reducer';

const appReducer = combineReducers({
  commonReducer,
  userReducer,
  conversationReducer,
  messageReducer
});

export default appReducer;

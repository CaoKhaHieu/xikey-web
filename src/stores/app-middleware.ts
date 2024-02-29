import { all } from 'redux-saga/effects';
import { watchAuth } from './auth/middlewares';
import { watchCommon } from './common/middlewares';
import { watchUser } from './user/middleware';
import { watchConversation } from './conversation/middleware';
import { watchMessage } from './message/middleware';
import { watchCall } from './call/middlewares';

export default function* appMiddleware() {
  yield all([
    watchAuth(),
    watchCommon(),
    watchUser(),
    watchConversation(),
    watchMessage(),
    watchCall(),
  ]);
}

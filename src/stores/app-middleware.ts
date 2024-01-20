import { all } from 'redux-saga/effects';
import { watchAuth } from './auth/middlewares';
import { watchCommon } from './common/middlewares';

export default function* appMiddleware() {
  yield all([
    watchAuth(),
    watchCommon(),
  ]);
}

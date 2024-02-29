import { AnyAction } from 'redux';
import { types } from '../types';
import { get, post } from '../saga';

import { all, put, takeLatest } from 'redux-saga/effects';
import { handleApiResponseError } from '../common/actions';

function* getTokenVideoCall({ payload, resolve, reject }: AnyAction): any {
  try {
    const res = yield get(['v1', 'call', 'get-token']);
    resolve(res.data.token);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

export function* watchCall() {
  yield all([
    takeLatest(types.GET_TOKEN_VIDEO_CALL, getTokenVideoCall),
  ]);
};

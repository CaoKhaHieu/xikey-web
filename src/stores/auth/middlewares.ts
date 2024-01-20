import { AnyAction } from 'redux';
import { types } from '../types';
import { post } from '../saga';

import { all, put, takeLatest } from 'redux-saga/effects';
import { handleApiResponseError } from '../common/actions';

function* login({ payload, resolve, reject }: AnyAction): any {
  const endPoint: string = payload.endPoint || 'login';
  try {
    const res = yield post(['v1', 'auth', endPoint], { data: payload.body });

    resolve(res.data);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

function* register({ payload, resolve, reject }: AnyAction): any {
  try {
    const res = yield post(
      ['v1', 'auth', 'register'],
      { data: payload },
      {}
    );
    resolve(res.data);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

export function* watchAuth() {
  yield all([
    takeLatest(types.LOGIN, login),
    takeLatest(types.REGISTER, register),
  ]);
};

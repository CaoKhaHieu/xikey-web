import { AnyAction } from 'redux';
import { types } from '../types';
import { post } from '../saga';

import { all, put, takeLatest } from 'redux-saga/effects';
import { handleApiResponseError } from '../common/actions';
import { setRefreshToken, setToken } from '@/shared/utils/utils';

function* login({ payload, resolve, reject }: AnyAction): any {
  try {
    const res = yield post(['v1', 'auth', 'login'], { data: payload });
    const { tokens } = res;
    setToken(tokens.access.token);
    setRefreshToken(tokens.refresh.token);

    resolve(res);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

function* register({ payload, resolve, reject }: AnyAction): any {
  try {
    const res = yield post(['v1', 'auth', 'register'], { data: payload });
    resolve(res);
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

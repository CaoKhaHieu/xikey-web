import { AnyAction } from 'redux';
import { types } from '../types';
import { get, post } from '../saga';

import { all, put, takeLatest } from 'redux-saga/effects';
import { handleApiResponseError } from '../common/actions';
import { setRefreshToken, setToken } from '@/shared/utils/utils';
import { User } from '@/shared/models/User';
import { setUser } from '../user/action';

function* login({ payload, resolve, reject }: AnyAction): any {
  try {
    const res = yield post(['v1', 'auth', 'login'], { data: payload });
    const { tokens } = res;
    setToken(tokens.access.token);
    setRefreshToken(tokens.refresh.token);

    const user = new User(res.user);
    yield put(setUser(user));
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

function* logout({ payload, resolve, reject }: AnyAction): any {
  try {
    const res = yield post(['v1', 'auth', 'logout'], { data: payload });
    resolve(res);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

function* getUser({ payload, resolve, reject }: AnyAction): any {
  try {
    const res = yield get(['v1', 'users', 'profile'], { data: payload });
    const user = new User(res.data);
    yield put(setUser(user));
    resolve(res);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

function* getUserGMSH({ payload, resolve, reject }: AnyAction): any {
  try {
    const res = yield get(['v1', 'users', 'profile-gmsh', `${payload}`]);
    const user = new User(res.data);
    localStorage.setItem('ACCESS-TOKEN', res.data.tokens.access.token);
    localStorage.setItem('REFRESH-TOKEN', res.data.tokens.refresh.token);

    yield put(setUser(user));
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
    takeLatest(types.LOGOUT, logout),
    takeLatest(types.GET_USER, getUser),
    takeLatest(types.GET_USER_GMSH, getUserGMSH),
  ]);
};

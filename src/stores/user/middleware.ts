import { AnyAction } from 'redux';
import { types } from '../types';
import { get, patch, post } from '../saga';

import { all, put, takeLatest } from 'redux-saga/effects';
import { handleApiResponseError } from '../common/actions';
import { User } from '@/shared/models/User';
import { saveAllUsers, setUser } from './action';

function* getAllUser({ resolve, reject }: AnyAction): any {
  try {
    const res = yield get(['v1', 'user', 'all-user']);
    const mappingData = res.data.map((user: any) => new User(user));
    
    yield put(saveAllUsers(mappingData));
    resolve(mappingData);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

function* updateAvatar({ payload, resolve, reject }: AnyAction): any {
  try {
    const res = yield post(['v1', 'user', 'update-avatar'], { data: payload });
    resolve(res);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

function* searchUser({ payload, resolve, reject }: AnyAction): any {
  const query = {
    name: payload.name,
  };
  try {
    const res = yield get(['v1', 'user', 'search-user'], { ...query });
    const mappingData: User[] = res.data.map((item: any) => new User(item));
    resolve(mappingData);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

function* updateInfoAccount({ payload, resolve, reject }: AnyAction): any {
  const body = {
    name: payload.name,
    email: payload.email,
  };
  try {
    const res = yield patch(['v1', 'user', 'update-info'], { data: body });
    const updatedUser = new User(res.data);
    yield put(setUser(updatedUser));
    resolve(updatedUser);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

export function* watchUser() {
  yield all([
    takeLatest(types.GET_ALL_USER, getAllUser),
    takeLatest(types.UPDATE_AVATAR, updateAvatar),
    takeLatest(types.SEARCH_USER, searchUser),
    takeLatest(types.UPDATE_INFO_ACCOUNT, updateInfoAccount),
  ]);
};

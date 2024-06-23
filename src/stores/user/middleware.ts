import { AnyAction } from 'redux';
import { types } from '../types';
import { get, patch, post } from '../saga';

import { all, put, takeLatest } from 'redux-saga/effects';
import { handleApiResponseError } from '../common/actions';
import { User } from '@/shared/models/User';
import { saveAllUsers, setUser } from './action';

function* getAllUser({ resolve, reject }: AnyAction): any {
  try {
    const res = yield get(['v1', 'users']);
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
    const res = yield post(['v1', 'users', 'avatar'], { data: payload });
    resolve(res);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

function* searchUser({ payload, resolve, reject }: AnyAction): any {
  const { name, page } = payload;
  const query = {
    name,
    page,
  };
  try {
    const res = yield get(['v1', 'users', 'search'], { ...query });
    const mappingData: User[] = res.data.users.map((item: any) => new User(item));
    const hasMore: boolean = res.data.hasMore;
    const page: number = +res.data.page;
    resolve(mappingData, page, hasMore);
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
    const res = yield patch(['v1', 'users', 'info'], { data: body });
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
    takeLatest(types.UPDATE_INFO_ACCOUNT, updateInfoAccount),
  ]);
};

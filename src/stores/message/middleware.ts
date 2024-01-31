import { AnyAction } from 'redux';
import { types } from '../types';
import { get, post } from '../saga';

import { all, put, takeLatest } from 'redux-saga/effects';
import { handleApiResponseError } from '../common/actions';
import { saveListMessage } from './action';

function* createMessage({ payload, resolve, reject }: AnyAction): any {
  try {
    const res = yield post(['v1', 'message', 'create'], { data: payload });
    resolve();
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

function* getListMessage({ payload, resolve, reject }: AnyAction): any {
  const query = {
    conversationId: payload.conversationId,
  };
  try {
    const res = yield get(['v1', 'message', 'get-all'], { ...query });
    
    yield put(saveListMessage(res.data));
    resolve();
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

export function* watchMessage() {
  yield all([
    takeLatest(types.CREATE_MESSAGE, createMessage),
    takeLatest(types.GET_LIST_MESSAGE, getListMessage),
  ]);
};

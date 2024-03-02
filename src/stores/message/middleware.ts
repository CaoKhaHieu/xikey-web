import { AnyAction } from 'redux';
import { types } from '../types';
import { get, patch, post } from '../saga';

import { all, put, takeLatest } from 'redux-saga/effects';
import { handleApiResponseError } from '../common/actions';
import { saveListMessage } from './action';

function* createMessage({ payload, resolve, reject }: AnyAction): any {
  try {
    const res = yield post(['v1', 'message', 'create'], { data: payload });
    resolve(res);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

function* getListMessage({ payload, resolve, reject }: AnyAction): any {
  const { conversationId } = payload;
  try {
    const res = yield get(['v1', 'message', 'get-messages'], { ...payload });
    
    yield put(saveListMessage({
      conversationId,
      messages: res.data,
    }));
    resolve();
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

function* reactMessage({ payload, resolve, reject }: AnyAction): any {
  try {
    const res = yield patch(['v1', 'message', 'reactions', `${payload.messageId}`], { data: payload });
    resolve(res);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

export function* watchMessage() {
  yield all([
    takeLatest(types.CREATE_MESSAGE, createMessage),
    takeLatest(types.GET_LIST_MESSAGE, getListMessage),
    takeLatest(types.REACT_MESSAGE, reactMessage),
  ]);
};

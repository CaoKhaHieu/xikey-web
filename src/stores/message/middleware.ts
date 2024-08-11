import { AnyAction } from 'redux';
import { types } from '../types';
import { get, patch, post, remove } from '../saga';

import { all, put, takeLatest } from 'redux-saga/effects';
import { handleApiResponseError } from '../common/actions';
import { saveListMessage } from './action';
import { Message } from '@/shared/models/Message';

function* createMessage({ payload, resolve, reject }: AnyAction): any {
  try {
    const res = yield post(['v1', 'messages'], { data: payload });
    resolve(res);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

function* deleteMessage({ payload, resolve, reject }: AnyAction): any {
  try {
    const res = yield remove(['v1', 'messages', `${payload.id}`]);
    resolve(res);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

function* getListMessage({ payload, resolve, reject }: AnyAction): any {
  const { conversationId, messageId } = payload;
  try {
    const res = yield get(['v1', 'messages'], { ...payload });
    // init isNew = true to scroll to end list messgage for image message
    const mappingMessage: Message[] = res.data.map((message: any) => new Message({ ...message, isNew: !messageId && true }));

    yield put(saveListMessage({
      conversationId,
      messages: mappingMessage,
    }));
    resolve(mappingMessage);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

function* reactMessage({ payload, resolve, reject }: AnyAction): any {
  try {
    const res = yield patch(['v1', 'messages', `${payload.messageId}`, 'reaction'], { data: payload });
    resolve(res);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

function* pinMessage({ payload, resolve, reject }: AnyAction): any {
  try {
    const res = yield post(['v1', 'messages', 'pin'], { data: payload });
    resolve(res.data);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

function* unpinMessage({ payload, resolve, reject }: AnyAction): any {
  try {
    const res = yield remove(['v1', 'messages', 'pin'], { data: payload });
    resolve(res.data);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

function* getPinedMessages({ payload, resolve, reject }: AnyAction): any {
  try {
    const res = yield get(['v1', 'messages', 'pin', `${payload.conversationId}`]);
    const mappingMessages = res.data.map((message: any) => new Message(message));
    resolve(mappingMessages);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

function* reportMessage({ payload, resolve, reject }: AnyAction): any {
  const { messageId, reason } = payload;
  try {
    const res = yield post(['v1', 'messages', `${messageId}`, 'report'], { data: { messageId, reason }});
    resolve();
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

export function* watchMessage() {
  yield all([
    takeLatest(types.CREATE_MESSAGE, createMessage),
    takeLatest(types.DELETE_MESSAGE, deleteMessage),
    takeLatest(types.GET_LIST_MESSAGE, getListMessage),
    takeLatest(types.REACT_MESSAGE, reactMessage),
    takeLatest(types.PIN_MESSAGE, pinMessage),
    takeLatest(types.UNPIN_MESSAGE, unpinMessage),
    takeLatest(types.GET_PINED_MESSAGES, getPinedMessages),
    takeLatest(types.REPORT_MESSAGE, reportMessage),
  ]);
};

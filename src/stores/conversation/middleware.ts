import { AnyAction } from 'redux';
import { types } from '../types';
import { get, patch, post, put as update, remove } from '../saga';

import { all, put, takeLatest } from 'redux-saga/effects';
import { handleApiResponseError } from '../common/actions';
import { Conversation } from '@/shared/models/Conversation';
import { User } from '@/shared/models/User';
import { saveAllConversations } from './action';

function* getAllConversation({ resolve, reject }: AnyAction): any {
  try {
    const res = yield get(['v1', 'conversation', 'get-all-conversation']);
    const mappingData: Conversation[] = res.data.map((conversation: any) => {
      const conversationModel = new Conversation(conversation);
      return {
        ...conversationModel,
        members: conversationModel.members.map((member: any) => new User(member))
      }
    });
    yield put(saveAllConversations(mappingData));

    resolve(mappingData);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

function* getGroupConversation({ resolve, reject }: AnyAction): any {
  try {
    const res = yield get(['v1', 'conversation', 'get-group-conversation']);
    const mappingData: Conversation[] = res.data.map((conversation: any) => {
      const conversationModel = new Conversation(conversation);
      return {
        ...conversationModel,
        members: conversationModel.members.map((member: any) => new User(member))
      }
    });
    yield put(saveAllConversations(mappingData));

    resolve(mappingData);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

function* getInfoConversation({ payload, resolve, reject }: AnyAction): any {
  const query = {
    conversationId: payload,
  };
  try {
    const res = yield get(['v1', 'conversation', 'get-info'], { ...query });
    const conversation = new Conversation(res.data);
    resolve(conversation);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

function* createConversation({ payload, resolve, reject }: AnyAction): any {
  try {
    const res = yield post(['v1', 'conversation', 'create'], { data: payload });
    const newConversation = new Conversation(res.data);
    resolve(newConversation);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

function* updateConversation({ payload, resolve, reject }: AnyAction): any {
  try {
    const res = yield update(['v1', 'conversation', 'update', `${payload.conversationId}`], { data: payload });
    const newConversation = new Conversation(res.data);
    resolve(newConversation);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

function* leaveGroup({ payload, resolve, reject }: AnyAction): any {
  const { conversationId, userId } = payload;
  try {
    const res = yield patch(['v1', 'conversation', 'leave-group'], { data: { conversationId, userId } });
    const newConversation = new Conversation(res.data);
    resolve(newConversation);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

function* kickUser({ payload, resolve, reject }: AnyAction): any {
  const { conversationId, userId } = payload;
  try {
    const res = yield patch(['v1', 'conversation', 'kick-user'], { data: { conversationId, userId } });
    const newConversation = new Conversation(res.data);
    resolve(newConversation);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

function* addUser({ payload, resolve, reject }: AnyAction): any {
  const { conversationId, listUserId } = payload;
  try {
    const res = yield patch(['v1', 'conversation', 'add-user'], { data: { conversationId, listUserId } });
    const newConversation = new Conversation(res.data);
    resolve(newConversation);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

function* removeGroup({ payload, resolve, reject }: AnyAction): any {
  try {
    const res = yield remove(['v1', 'conversation', 'remove-group', `${payload.conversationId}`]);
    resolve(res);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

export function* watchConversation() {
  yield all([
    takeLatest(types.GET_ALL_CONVERSATION, getAllConversation),
    takeLatest(types.GET_GROUP_CONVERSATION, getGroupConversation),
    takeLatest(types.GET_INFO_CONVERSATION, getInfoConversation),
    takeLatest(types.CREATE_CONVERSATION, createConversation),
    takeLatest(types.UPDATE_CONVERSATION, updateConversation),
    takeLatest(types.LEAVE_GROUP, leaveGroup),
    takeLatest(types.KICK_USER, kickUser),
    takeLatest(types.ADD_USER, addUser),
    takeLatest(types.REMOVE_GROUP, removeGroup),
  ]);
};

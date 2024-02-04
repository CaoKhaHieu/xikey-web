import { AnyAction } from 'redux';
import { types } from '../types';
import { get } from '../saga';

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

function* getUserOfConversation({ payload, resolve, reject }: AnyAction): any {
  const query = {
    conversationId: payload,
  };
  try {
    const res = yield get(['v1', 'conversation', 'get-user'], { ...query });
    const user = new User(res.data);
    resolve(user);
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
}

export function* watchConversation() {
  yield all([
    takeLatest(types.GET_ALL_CONVERSATION, getAllConversation),
    takeLatest(types.GET_USER_OF_CONVERSATION, getUserOfConversation),
  ]);
};

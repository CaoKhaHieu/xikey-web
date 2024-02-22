import { combineReducers } from 'redux';
import { createReducer } from '../redux';
import { Conversation } from '@/shared/models/Conversation';
import { Message } from '@/shared/models/Message';

// conversation
const conversationInitialState = {
  allConversations: {},
};
const saveAllConversations = (state: any, payload: Conversation[]) => {
  const data: any = {};
  payload.forEach((conversation: Conversation) => {
    data[conversation.id] = conversation;
  });
  return {
    ...state,
    allConversations: data,
  };
};

const updateLastMessageConversation = (state: any, payload: Message) => {
  const data: any = { ...state.allConversations };
  data[payload.conversationId].lastMessage = payload;
  data[payload.conversationId].updatedAt = payload.createdAt;
  return {
    ...state,
    allConversations: { ...data },
  };
};

const updateInfoConversation = (state: any, payload: Conversation) => {
  const data: any = { ...state.allConversations };
  data[payload.id] = payload;
  return {
    ...state,
    allConversations: { ...data },
  };
};

const removeConversation = (state: any, payload: Conversation) => {
  const data: any = { ...state.allConversations };
  delete(data[payload.id]);
  return {
    ...state,
    allConversations: { ...data },
  };
};

const conversationStrategies = {
  SAVE_ALL_CONVERSATION: saveAllConversations,
  UPDATE_LAST_MESSAGE_CONVERSATION: updateLastMessageConversation,
  UPDATE_INFO_CONVERSATION: updateInfoConversation,
  REMOVE_CONVERSATION: removeConversation,
  __default__: (state: any) => state,
};

export const conversation = createReducer(conversationStrategies, conversationInitialState);

export const conversationReducer = combineReducers({
  conversation,
});

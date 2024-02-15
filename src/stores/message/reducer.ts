import { combineReducers } from 'redux';
import { createReducer } from '../redux';
import { Message } from '@/shared/models/Message';

// conversation
const messageInitialState = {
  messages: {},
  reply: {},
};
const saveListMessageByIdConversation = (state: any, payload: Message[]) => {
  const data: any = {};
  payload.forEach((message: Message) => {
    data[message.id] = { ...message };
  });
  return {
    ...state,
    messages: data,
  };
};
const saveNewMessageByIdConversation = (state: any, payload: Message) => {
  const data: any = { ...state.messages };
  data[payload.id] = payload;
  return {
    ...state,
    messages: data,
  };
};

const updateMessageByIdConversation = (state: any, payload: Message) => {
  const data: any = { ...state.messages };
  data[payload.id] = payload;
  return {
    ...state,
    messages: data,
  };
};

const saveReplyMessage = (state: any, payload: { conversationId: string, message: Message }) => {
  const data: any = { ...state.reply };
  data[payload.conversationId] = payload.message;
  return {
    ...state,
    reply: data,
  };
};

const clearReplyMessage = (state: any, payload: { conversationId: string }) => {
  const data: any = { ...state.reply };
  delete data[payload.conversationId]
  return {
    ...state,
    reply: data,
  };
};

const messageStrategies = {
  SAVE_LIST_MESSAGE: saveListMessageByIdConversation,
  SAVE_NEW_MESSAGE: saveNewMessageByIdConversation,
  UPDATE_MESSAGE: updateMessageByIdConversation,
  SAVE_REPLY_MESSAGE: saveReplyMessage,
  CLEAR_REPLY_MESSAGE: clearReplyMessage,
  __default__: (state: any) => state,
};

export const message = createReducer(messageStrategies, messageInitialState);

export const messageReducer = combineReducers({
  messageManagement: message,
});

import { combineReducers } from 'redux';
import { createReducer } from '../redux';
import { Message } from '@/shared/models/Message';

// conversation
const messageInitialState = {
  conversationId: '',
  messages: {},
  reply: {},
  triggerScroll: 1,
};
const saveListMessageByIdConversation = (state: any, payload: {
  messages: Message[],
  conversationId: string;
}) => {
  const { messages, conversationId } = payload;
  const data: any = { ...state.messages };
  const newListMessage: any = {};

  messages.forEach((message: Message) => {
    newListMessage[message.id] = { ...message };
  });

  const newListMessageState = (state.conversationId === conversationId || !state.conversationId) ?
    { ...newListMessage, ...data } :
    { ...newListMessage };
  
  return {
    ...state,
    conversationId,
    messages: newListMessageState,
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
  if (data[payload.id]) {
    data[payload.id] = payload;
  }
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

const scrollToEndListMessage = (state: any) => {
  let currentScroll = state.triggerScroll;
  currentScroll = currentScroll + 1;
  return {
    ...state,
    triggerScroll: currentScroll,
  };
};

const messageStrategies = {
  SAVE_LIST_MESSAGE: saveListMessageByIdConversation,
  SAVE_NEW_MESSAGE: saveNewMessageByIdConversation,
  UPDATE_MESSAGE: updateMessageByIdConversation,
  SAVE_REPLY_MESSAGE: saveReplyMessage,
  CLEAR_REPLY_MESSAGE: clearReplyMessage,
  SCROLL_TO_END_LIST_MESSAGE: scrollToEndListMessage,
  __default__: (state: any) => state,
};

export const message = createReducer(messageStrategies, messageInitialState);

export const messageReducer = combineReducers({
  messageManagement: message,
});

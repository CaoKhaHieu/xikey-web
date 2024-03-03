import { combineReducers } from 'redux';
import { createReducer } from '../redux';
import { Message } from '@/shared/models/Message';

// conversation
const messageInitialState = {
  conversationId: '',
  messages: {},
  reply: {},
  // use to trigger scroll to end list message
  triggerScroll: 1,
  // use to trigger show alert new message incase user not scroll to end list message
  alert: 0,
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

const alertNewMessage = (state: any, payload: { type: 'INCREASE' | 'RESET' }) => {
  const { type } = payload;
  let currentAlert = state.alert;
  if (type === 'INCREASE') {
    currentAlert = currentAlert + 1;
  } else {
    currentAlert = 0;
  }
  return {
    ...state,
    alert: currentAlert,
  };
};

const messageStrategies = {
  SAVE_LIST_MESSAGE: saveListMessageByIdConversation,
  SAVE_NEW_MESSAGE: saveNewMessageByIdConversation,
  UPDATE_MESSAGE: updateMessageByIdConversation,
  SAVE_REPLY_MESSAGE: saveReplyMessage,
  CLEAR_REPLY_MESSAGE: clearReplyMessage,
  SCROLL_TO_END_LIST_MESSAGE: scrollToEndListMessage,
  ALERT_NEW_MESSAGE: alertNewMessage,
  __default__: (state: any) => state,
};

export const message = createReducer(messageStrategies, messageInitialState);

export const messageReducer = combineReducers({
  messageManagement: message,
});

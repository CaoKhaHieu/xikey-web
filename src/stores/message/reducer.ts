import { combineReducers } from 'redux';
import { createReducer } from '../redux';
import { Message } from '@/shared/models/Message';

// conversation
const messageInitialState = {
  conversationId: '',
  messages: {},
  reply: {},
  // use to trigger scroll to end list message
  triggerScroll: 0,
  // use to trigger show alert new message incase user not scroll to end list message
  alert: 0,
  // use to trigger call api get pined message
  triggerGetPinedMessage: 0,
  editMessage: new Message({}),
  scrollMessage: new Message({}),
  // kiểm tra tin nhắn cuối cùng đã nằm trong list message hay chưa.
  // Ex: click reply message và scroll tới những tin nhắn đầu tiên thì không có tin nhắn cuối cùng
  isLastMessageLoaded: true,
};

const saveListMessageByIdConversation = (state: any, payload: {
  messages: Message[],
  conversationId: string;
  direction: string;
}) => {
  const { messages, conversationId, direction } = payload;
  const data: any = { ...state.messages };
  const newListMessage: any = {};

  messages.forEach((message: Message) => {
    newListMessage[message.id] = { ...message };
  });

  const newListMessageState = (state.conversationId === conversationId || !state.conversationId) ?
    (direction === 'UP' ? { ...newListMessage, ...data } : { ...data, ...newListMessage }) :
    { ...newListMessage };
  
  return {
    ...state,
    conversationId,
    messages: newListMessageState,
  };
};

const replaceListMessage = (state: any, payload: {
  messages: Message[],
  conversationId: string;
}) => {
  const { messages, conversationId } = payload;
  const newListMessage: any = {};

  messages.forEach((message: Message) => {
    newListMessage[message.id] = { ...message };
  });
  
  return {
    ...state,
    conversationId,
    messages: newListMessage,
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

const saveNewMessageByIdConversationWithVirtualId = (state: any, payload: Message) => {
  const data: any = { ...state.messages };
  data[payload.id] = payload;
  delete data[payload.virtualId];

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

const triggerGetPinedMessage = (state: any) => {
  return {
    ...state,
    triggerGetPinedMessage: state.triggerGetPinedMessage + 1,
  };
};

const saveEditMessage = (state: any, payload: Message) => {
  return {
    ...state,
    editMessage: payload,
  };
};

const clearEditMessage = (state: any) => {
  return {
    ...state,
    editMessage: new Message({}),
  };
};

const saveScrollMessage = (state: any, payload: Message) => {
  return {
    ...state,
    scrollMessage: payload,
  };
};

const clearScrollMessage = (state: any) => {
  return {
    ...state,
    scrollMessage: new Message({}),
  };
};

const saveLastMessageLoaded = (state: any, payload: boolean) => {
  return {
    ...state,
    isLastMessageLoaded: payload,
  };
};

const messageStrategies = {
  SAVE_LIST_MESSAGE: saveListMessageByIdConversation,
  REPLACE_LIST_MESSAGE: replaceListMessage,
  SAVE_NEW_MESSAGE: saveNewMessageByIdConversation,
  SAVE_NEW_MESSAGE_WITH_VIRTUAL_ID: saveNewMessageByIdConversationWithVirtualId,
  UPDATE_MESSAGE: updateMessageByIdConversation,
  SAVE_REPLY_MESSAGE: saveReplyMessage,
  CLEAR_REPLY_MESSAGE: clearReplyMessage,
  SCROLL_TO_END_LIST_MESSAGE: scrollToEndListMessage,
  ALERT_NEW_MESSAGE: alertNewMessage,
  TRIGGER_GET_PINED_MESSAGE: triggerGetPinedMessage,
  SAVE_EDIT_MESSAGE: saveEditMessage,
  CLEAR_EDIT_MESSAGE: clearEditMessage,
  SAVE_SCROLL_MESSAGE: saveScrollMessage,
  CLEAR_SCROLL_MESSAGE: clearScrollMessage,
  SAVE_LAST_MESSAGE_LOADED: saveLastMessageLoaded,
  __default__: (state: any) => state,
};

export const message = createReducer(messageStrategies, messageInitialState);

export const messageReducer = combineReducers({
  messageManagement: message,
});

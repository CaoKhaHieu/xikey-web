import { combineReducers } from 'redux';
import { createReducer } from '../redux';
import { Message } from '@/shared/models/Message';

// conversation
const messageInitialState = {
  messages: {},
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

const messageStrategies = {
  SAVE_LIST_MESSAGE: saveListMessageByIdConversation,
  SAVE_NEW_MESSAGE: saveNewMessageByIdConversation,
  __default__: (state: any) => state,
};

export const message = createReducer(messageStrategies, messageInitialState);

export const messageReducer = combineReducers({
  messageManagement: message,
});

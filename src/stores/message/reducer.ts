import { combineReducers } from 'redux';
import { createReducer } from '../redux';
import { Message } from '@/shared/models/Message';

// conversation
const messageInitialState = {
  messages: {},
};
const saveListMessageByIdConversation = (state: any, payload: Message[]) => {
  const data: any = { ...message };
  payload.forEach(message => {
    data[message.id] = { ...message };
  });
  return {
    ...state,
    messages: data,
  };
};

const messageStrategies = {
  SAVE_LIST_MESSAGE: saveListMessageByIdConversation,
  __default__: (state: any) => state,
};

export const message = createReducer(messageStrategies, messageInitialState);

export const messageReducer = combineReducers({
  messageManagement: message,
});

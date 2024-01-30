import { combineReducers } from 'redux';
import { createReducer } from '../redux';
import { Conversation } from '@/shared/models/Conversation';

// conversation
const conversationInitialState = {
  allConversations: [],
};
const saveAllConversations = (state: any, payload: Conversation[]) => {
  return {
    ...state,
    allConversations: [...payload],
  };
};

const conversationStrategies = {
  SAVE_ALL_CONVERSATION: saveAllConversations,
  __default__: (state: any) => state,
};

export const conversation = createReducer(conversationStrategies, conversationInitialState);

export const conversationReducer = combineReducers({
  conversation,
});

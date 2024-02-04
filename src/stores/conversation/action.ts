import { Conversation } from "@/shared/models/Conversation";
import { generateAPIAction } from "../redux";
import { types } from '../types';
import { Message } from "@/shared/models/Message";

export const getAllConversation = generateAPIAction(types.GET_ALL_CONVERSATION);
export const getUserOfConversation = generateAPIAction(types.GET_USER_OF_CONVERSATION);

export const saveAllConversations = (payload: Conversation[]) => ({
  type: types.SAVE_ALL_CONVERSATION,
  payload,
});

export const updateLastMessageConversation = (payload: Message) => ({
  type: types.UPDATE_LAST_MESSAGE_CONVERSATION,
  payload,
});

import { Conversation } from "@/shared/models/Conversation";
import { generateAPIAction } from "../redux";
import { types } from '../types';

export const getAllConversation = generateAPIAction(types.GET_ALL_CONVERSATION);

export const saveAllConversations = (payload: Conversation[]) => ({
  type: types.SAVE_ALL_CONVERSATION,
  payload,
});

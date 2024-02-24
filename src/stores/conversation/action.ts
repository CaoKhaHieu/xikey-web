import { Conversation } from "@/shared/models/Conversation";
import { generateAPIAction } from "../redux";
import { types } from '../types';
import { Message } from "@/shared/models/Message";

export const getAllConversation = generateAPIAction(types.GET_ALL_CONVERSATION);
export const getInfoConversation = generateAPIAction(types.GET_INFO_CONVERSATION);
export const createConversation = generateAPIAction(types.CREATE_CONVERSATION);
export const updateConversation = generateAPIAction(types.UPDATE_CONVERSATION);
export const leaveGroup = generateAPIAction(types.LEAVE_GROUP);
export const kickUser = generateAPIAction(types.KICK_USER);
export const addUser = generateAPIAction(types.ADD_USER);
export const getAllGroupConversation = generateAPIAction(types.GET_GROUP_CONVERSATION);

export const saveAllConversations = (payload: Conversation[]) => ({
  type: types.SAVE_ALL_CONVERSATION,
  payload,
});

export const updateLastMessageConversation = (payload: Message) => ({
  type: types.UPDATE_LAST_MESSAGE_CONVERSATION,
  payload,
});

export const updateInfoConversation = (payload: Conversation) => ({
  type: types.UPDATE_INFO_CONVERSATION,
  payload,
});

export const removeConversation = (payload: Conversation) => ({
  type: types.REMOVE_CONVERSATION,
  payload,
});

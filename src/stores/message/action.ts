import { generateAPIAction } from "../redux";
import { types } from '../types';
import { Message } from "@/shared/models/Message";

export const createMessage = generateAPIAction(types.CREATE_MESSAGE);
export const getListMessage = generateAPIAction(types.GET_LIST_MESSAGE);
export const reactMessage = generateAPIAction(types.REACT_MESSAGE);

export const saveListMessage = (payload: Message[]) => ({
  type: types.SAVE_LIST_MESSAGE,
  payload,
});

export const saveNewMessage = (payload: Message) => ({
  type: types.SAVE_NEW_MESSAGE,
  payload,
});

export const updateMessage = (payload: Message) => ({
  type: types.UPDATE_MESSAGE,
  payload,
});

export const saveReplyMessage = (payload: { conversationId: string, message: Message }) => ({
  type: types.SAVE_REPLY_MESSAGE,
  payload,
});

export const clearReplyMessage = (payload: { conversationId: string }) => ({
  type: types.CLEAR_REPLY_MESSAGE,
  payload,
});

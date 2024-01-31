import { generateAPIAction } from "../redux";
import { types } from '../types';
import { Message } from "@/shared/models/Message";

export const createMessage = generateAPIAction(types.CREATE_MESSAGE);
export const getListMessage = generateAPIAction(types.GET_LIST_MESSAGE);

export const saveListMessage = (payload: Message[]) => ({
  type: types.SAVE_LIST_MESSAGE,
  payload,
});

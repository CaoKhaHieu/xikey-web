import { generateAPIAction } from "../redux";
import { types } from '../types';
import { Message } from "@/shared/models/Message";

export const createMessage = generateAPIAction(types.CREATE_MESSAGE);
export const deleteMessage = generateAPIAction(types.DELETE_MESSAGE);
export const getListMessage = generateAPIAction(types.GET_LIST_MESSAGE);
export const reactMessage = generateAPIAction(types.REACT_MESSAGE);
export const pinMessage = generateAPIAction(types.PIN_MESSAGE);
export const unpinMessage = generateAPIAction(types.UNPIN_MESSAGE);
export const getPinedMessages = generateAPIAction(types.GET_PINED_MESSAGES);
export const reportMessage = generateAPIAction(types.REPORT_MESSAGE);
export const editMessageAction = generateAPIAction(types.EDIT_MESSAGE);

export const saveListMessage = (payload: {
  messages: Message[],
  conversationId: string,
  direction: string,
}) => ({
  type: types.SAVE_LIST_MESSAGE,
  payload,
});

export const replaceListMessage = (payload: {
  messages: Message[],
  conversationId: string,
}) => ({
  type: types.REPLACE_LIST_MESSAGE,
  payload,
});

export const saveNewMessage = (payload: Message) => ({
  type: types.SAVE_NEW_MESSAGE,
  payload,
});

export const saveNewMessageWithVirtualId = (payload: Message) => ({
  type: types.SAVE_NEW_MESSAGE_WITH_VIRTUAL_ID,
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

export const triggerScrollToEndListMessage = () => ({
  type: types.SCROLL_TO_END_LIST_MESSAGE,
});

export const triggerAlertNewMessage = (payload: { type: 'INCREASE' | 'RESET' }) => ({
  type: types.ALERT_NEW_MESSAGE,
  payload
});

export const triggerGetPinedMessage = () => ({
  type: types.TRIGGER_GET_PINED_MESSAGE,
});

export const saveEditMessage = (payload: Message) => ({
  type: types.SAVE_EDIT_MESSAGE,
  payload,
});

export const clearEditMessage = () => ({
  type: types.CLEAR_EDIT_MESSAGE,
});

export const saveScrollMessage = (payload: Message) => ({
  type: types.SAVE_SCROLL_MESSAGE,
  payload,
});

export const clearScrollMessage = () => ({
  type: types.CLEAR_SCROLL_MESSAGE,
});

export const saveLastMesssageLoaded = (payload: boolean) => ({
  type: types.SAVE_LAST_MESSAGE_LOADED,
  payload,
});

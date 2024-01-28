import { generateAPIAction } from "../redux";
import { types } from "../types";

export const saveApiResponseError = (error: any) => ({
  type: types.SAVE_API_RESPONSE_ERROR,
  payload: error,
});

export const handleApiResponseError = (error: any) => ({
  type: types.HANDLE_API_RESPONSE_ERROR,
  payload: error,
});

export const clearApiResponseError = () => ({
  type: types.CLEAR_API_RESPONSE_ERROR,
});

export const upload = generateAPIAction(types.UPLOAD);

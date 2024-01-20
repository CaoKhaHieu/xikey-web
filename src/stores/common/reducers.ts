import { combineReducers } from 'redux';
import { createReducer } from '../redux';

/* apiController */
const initialState = {
  statusCode: '',
  message: '',
  code: ''
};

const saveApiResponseError = (state: any, payload: any) => {
  return {
    ...state,
    statusCode: payload.data?.statusCode,
    message: payload?.data?.message,
    code: payload?.data?.code,
  };
};

const clearApiResponseError = () => ({
  statusCode: '',
  message: '',
  code: '',
});

const strategiesList = {
  SAVE_API_RESPONSE_ERROR: saveApiResponseError,
  CLEAR_API_RESPONSE_ERROR: clearApiResponseError,
  __default__: (state: any) => state,
};

const apiController = createReducer(strategiesList, initialState);

/* commonReducer */
export const commonReducer = combineReducers({
  apiController,
});

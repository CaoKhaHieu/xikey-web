import { combineReducers } from 'redux';
import { createReducer } from '../redux';

/* apiController */
const initialState = {
  statusCode: '',
  message: '',
  code: '',
  isOpenSidebarRight: false
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

const toggleSidebarRight = (state: any, payload: boolean) => {
  return {
    ...state,
    isOpenSidebarRight: payload
  };
};


const strategiesList = {
  SAVE_API_RESPONSE_ERROR: saveApiResponseError,
  CLEAR_API_RESPONSE_ERROR: clearApiResponseError,
  TOGGLE_SIDEBAR_RIGHT: toggleSidebarRight,
  __default__: (state: any) => state,
};

const apiController = createReducer(strategiesList, initialState);

/* commonReducer */
export const commonReducer = combineReducers({
  apiController,
});

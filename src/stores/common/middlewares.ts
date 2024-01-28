import axios from 'axios';
import { all, put, takeLatest } from 'redux-saga/effects';
import { saveApiResponseError } from '../common/actions';
import { types } from "../types";
import { createURL } from '../saga';
import { getToken } from '@/shared/utils/utils';
import { AnyAction } from 'redux';

const handleApiResponseError = function* ({ payload }: any): any {
  yield put(saveApiResponseError(payload));
};

const handleUpload = function* ({ payload, resolve, reject }: AnyAction): any {
  try {
    const baseURL = `http://localhost:4000/api/`;
    const url = createURL(['v1', 'upload'], '');
    const response = yield axios.post(baseURL + url, payload, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      }, 
    });
    resolve({
      url: response.data.data,
    });
  } catch (error: any) {
    reject(error);
    yield put(handleApiResponseError(error));
  }
};

export function* watchCommon() {
  yield all([
    takeLatest(types.HANDLE_API_RESPONSE_ERROR, handleApiResponseError),
    takeLatest(types.UPLOAD, handleUpload),
  ]);
}

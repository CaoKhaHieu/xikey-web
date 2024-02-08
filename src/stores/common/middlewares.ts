import axios from 'axios';
import { all, put, takeLatest } from 'redux-saga/effects';
import { saveApiResponseError } from '../common/actions';
import { types } from "../types";
import { createURL } from '../saga';
import { getToken } from '@/shared/utils/utils';
import { AnyAction } from 'redux';
import { API_DOMAIN } from '@/shared/constants';

const handleApiResponseError = function* ({ payload }: any): any {
  yield put(saveApiResponseError(payload));
};

const handleUpload = function* ({ payload, resolve, reject }: AnyAction): any {
  try {
    const url = createURL(['v1', 'upload'], '');
    const response = yield axios.post(API_DOMAIN + url, payload, {
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

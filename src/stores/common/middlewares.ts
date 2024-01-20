import { all, put, takeLatest } from 'redux-saga/effects';
import { saveApiResponseError } from '../common/actions';

const handleApiResponseError = function* ({ payload }: any): any {
  yield put(saveApiResponseError(payload));
};

export function* watchCommon() {
  yield all([takeLatest('HANDLE_API_RESPONSE_ERROR', handleApiResponseError)]);
}

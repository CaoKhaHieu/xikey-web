export const createReducer =
  (strategies: any, initialState: any) =>
    (state = initialState, { type, payload }: any) =>
      (strategies[type] ?? strategies.__default__)(state, payload);

export interface ApiActionRedux {
  payload: any;
  resolve: any;
  reject: any;
}

export const generateAPIAction = (name: string) => {
  return (
    payload: any = null,
    resolve: any = () => { },
    reject: any = () => { }) => (
    {
      type: name,
      payload,
      resolve,
      reject,
    }
  );
};

export enum API_PROCESS {
  UNFETCH = 0,
  LOADING = 1,
  SUCESS = 2,
  FAILED = 3,
}

export const initialAPIState = {
  process: API_PROCESS.UNFETCH,
  data: null,
  error: null,
};

export const callingApi = (state: any) => ({
  ...state,
  process: API_PROCESS.LOADING,
  data: null,
  error: null,
});

export const handleApiSuccess = (state: any, payload: any) => ({
  ...state,
  process: API_PROCESS.SUCESS,
  data: payload,
  error: null,
});

export const handleApiError = (state: any, payload: any) => ({
  ...state,
  process: API_PROCESS.FAILED,
  data: null,
  error: payload,
});

export const clearApiRes = () => ({
  ...initialAPIState,
});

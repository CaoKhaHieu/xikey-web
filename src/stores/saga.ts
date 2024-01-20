import qs from 'qs';
import { ApiService, ErrorMessage } from '@/shared/services/api';

function createURL(uri: string[], query: any) {
  const queryParams = qs.stringify(query, { skipNulls: true });
  let paramsUrl: any;
  let url: string;
  if (typeof uri[uri.length - 1] !== 'string') {
    paramsUrl = uri.pop();
    url = uri.join('/');
    Object.keys(paramsUrl).forEach((x) => {
      url = url.replace(`:${x}`, paramsUrl[x]);
    });
  } else {
    url = uri.join('/');
  }
  return queryParams ? `${url}?${queryParams}` : url;
}

const apiService = new ApiService();

export function* get(
  uri: string[],
  params = {},
  moreConfig = { timeout: 60000 }
): any {
  const url = createURL(uri, params);
  try {
    const res = yield apiService.makeRequest('GET', url, moreConfig);
    return res.data;
  } catch (e: any) {
    throw new ErrorMessage(e);
  }
}

export function* post(
  uri: string[],
  body = {},
  params = {},
  moreConfig = {}
): any {
  const url = createURL(uri, params);
  const config = {
    ...body,
    ...moreConfig
  };
  try {
    const res = yield apiService.makeRequest('POST', url, config);
    return res.data;
  } catch (e: any) {
    throw new ErrorMessage(e);
  }
}

export function* put(
  uri: string[],
  body = {},
  params = {},
  moreConfig = {}
): any {
  const url = createURL(uri, params);
  const config = {
    ...body,
    ...moreConfig
  };
  try {
    const res = yield apiService.makeRequest('PUT', url, config);
    return res.data;
  } catch (e) {
    throw new ErrorMessage(e);
  }
}

export function* remove(
  uri: string[],
  body = {},
  params = {},
  moreConfig = {}
): any {
  const url = createURL(uri, params);
  const config = {
    ...body,
    ...moreConfig
  };
  try {
    const res = yield apiService.makeRequest('DELETE', url, config);
    return res.data;
  } catch (e) {
    throw new ErrorMessage(e);
  }
}

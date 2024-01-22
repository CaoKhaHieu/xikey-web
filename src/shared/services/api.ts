import axios, { Method } from 'axios';
import { getToken } from '../utils/utils';

const API_DOMAIN = 'http://localhost:4000';
const REQUEST_TIMEOUT = 10000;

export class ErrorMessage {
  data = {
    statusCode: '',
    message: '',
    code: ''
  };

  constructor(e: any) {
    if (e.code === "ECONNABORTED") {
      this.data = {
        statusCode: '0',
        message: '0',
        code: '0',
      }
    } else {
      this.data = {
        statusCode: e?.response?.data?.statusCode,
        message: e?.response?.data?.message,
        code: e?.response?.data?.code,
      }
    }
  }
}

export class ApiService {
  axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: `${API_DOMAIN}/api/`,
      timeout: REQUEST_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.axiosInstance.interceptors.request.use((_config: any) => {
      const token = getToken();
      if (token) {
        _config.headers.Authorization = `Bearer ${token}`;
      }
      return _config;
    });
    this.axiosInstance.interceptors.response.use(
      async (response: any) => {
        return response;
      },
    );
  }

  makeRequest(method: Method, url: string, moreConfigs = {}) {
    return this.axiosInstance({
      method,
      url,
      ...moreConfigs,
    });
  }
}

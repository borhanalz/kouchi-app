import type { AxiosRequestConfig, AxiosResponse } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/global-config';

// -------------------------- Axios Interceptors ---------------------------------------
const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
export default axiosInstance;
// -------------------------- Get Request ---------------------------------------
export async function GetRequest<APIResponseType>(
  url: string,
  id?: string|null,
): Promise<APIResponseType> {
  const response = await axiosInstance.get<APIResponseType>(url + `${id ? `/${id}` : ''}`);
  if (response.status !== 200) {
    throw new Error('Error get');
  }
  return response.data;
}
// -------------------------- Edit\Create Request ---------------------------------------
export async function EditCreateRequest<APIBodyType, APIResponseType = any>(
  url: string,
  data: APIBodyType,
  id?: number
): Promise<APIResponseType> {
  let response: AxiosResponse<APIResponseType> | undefined = undefined;
  if (id !== undefined) {
    response = await axiosInstance.put<APIResponseType>(url, data);
  } else {
    response = await axiosInstance.post<APIResponseType>(url, data);
  }

  if (response.status !== 200) {
    throw new Error('Error add/edit');
  }

  return response.data;
}
// -------------------------- Delete Request ---------------------------------------
export async function DeleteRequest<T>(url: string, id: number): Promise<void> {
  let response: AxiosResponse<T> | undefined = undefined;
  response = await axiosInstance.delete<T>(url + `/${id}`);

  if (response.status !== 200) {
    throw new Error('Error delete');
  }
}
//-----------------------------------------------------------------------------------
export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    signIn: '/api/auth/sign-in',
    signUp: '/api/auth/sign-up',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};

import type { AxiosError, InternalAxiosRequestConfig } from "axios";
export interface RequestOptions {
  // 是否忽略取消重复请求
  ignoreCancelToken?: boolean;
  baseUrl?: string;
}

export interface CustomInterceptorRequestConfig extends InternalAxiosRequestConfig {
  requestOptions?: RequestOptions;
}

export interface Result<T = any> {
  code: number;
  type: "success" | "error" | "warning";
  message: string;
  result: T;
}

export enum RequestEnum {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}

export enum ContentTypeEnum {
  // json
  JSON = "application/json;charset=UTF-8",
  // form-data qs
  FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
  // form-data  upload
  FORM_DATA = "multipart/form-data;charset=UTF-8"
}
export interface CustomAxiosError extends AxiosError<Result> {
  config?: CustomInterceptorRequestConfig;
}

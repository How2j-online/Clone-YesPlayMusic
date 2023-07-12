import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios, { AxiosError } from "axios";
import { AxiosCanceler } from "@/utils/http/axiosCancel";
import qs from "qs";
import { ContentTypeEnum, CustomInterceptorRequestConfig, RequestEnum, RequestOptions, Result } from "@/utils/http/type";
import { CreateAxiosOptions } from "@/utils/http/axiosTransform";
import { deepClone, isFunction } from "@/utils";

export class CustomAxios {
  private axiosInstance: AxiosInstance; // axios实例
  private readonly options: CreateAxiosOptions; // axios配置

  // 构造函数 初始化 传入配置
  constructor(options: AxiosRequestConfig) {
    this.options = options;
    this.axiosInstance = axios.create(options);
    this.setupInterceptors();
  }

  private setupInterceptors() {
    const transform = this.getTransform();
    if (!transform) return;
    const { requestInterceptors, requestInterceptorsCatch, responseInterceptors, responseInterceptorsCatch } = transform;
    const axiosCanceler = new AxiosCanceler();

    // 对象上的拦截器
    this.axiosInstance.interceptors.request.use((config: CustomInterceptorRequestConfig) => {
      const { ignoreCancelToken } = config.requestOptions || {};
      const ignoreCancel = ignoreCancelToken !== undefined ? ignoreCancelToken : false;
      !ignoreCancel && axiosCanceler.addPending(config);
      // 请求拦截器处理
      if (requestInterceptors && isFunction(requestInterceptors)) {
        config = requestInterceptors(config, this.options);
      }
      return config;
    });

    // 请求拦截器错误处理
    requestInterceptorsCatch &&
      isFunction(requestInterceptorsCatch) &&
      this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch);

    // 响应拦截器处理
    this.axiosInstance.interceptors.response.use((res: AxiosResponse<Result>) => {
      res && axiosCanceler.removePending(res.config);
      if (responseInterceptors && isFunction(responseInterceptors)) {
        res = responseInterceptors(res);
      }
      return res;
    }, undefined);

    // 响应拦截器错误处理
    responseInterceptorsCatch &&
      isFunction(responseInterceptorsCatch) &&
      this.axiosInstance.interceptors.response.use(undefined, responseInterceptorsCatch);
  }

  private getTransform() {
    const { transform } = this.options;
    return transform;
  }

  supportFormData(config: AxiosRequestConfig) {
    const headers = config.headers || this.options.headers;
    const contentType = headers?.["Content-Type"] || headers?.["content-type"];

    if (
      contentType !== ContentTypeEnum.FORM_URLENCODED ||
      !Reflect.has(config, "data") ||
      config.method?.toUpperCase() === RequestEnum.GET
    ) {
      return config;
    }

    return {
      ...config,
      data: qs.stringify(config.data, { arrayFormat: "brackets" })
    };
  }

  request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    let singleReqConfig: CreateAxiosOptions = deepClone(config); // 深拷贝配置, 防止修改原始配置
    const transform = this.getTransform(); // 获取转换配置
    // cancelToken 如果被深拷贝，会导致最外层无法使用cancel方法来取消请求
    if (config.cancelToken) {
      singleReqConfig.cancelToken = config.cancelToken;
    }

    const { requestOptions } = this.options; // 获取全局配置
    // 合并全局配置和单次请求配置
    const mergeOption: RequestOptions = Object.assign({}, requestOptions, options);

    const { beforeRequestHook, requestCatchHook, transformResponseHook } = transform || {};

    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      singleReqConfig = beforeRequestHook(singleReqConfig, mergeOption);
    }
    // 将请求配置挂载到请求参数上
    singleReqConfig.requestOptions = mergeOption;

    singleReqConfig = this.supportFormData(singleReqConfig);

    return new Promise((resolve, reject) => {
      // 执行请求, 并处理响应数据
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(singleReqConfig)
        .then((res: AxiosResponse<Result>) => {
          if (transformResponseHook && isFunction(transformResponseHook)) {
            try {
              // @ts-ignore
              const ret = transformResponseHook(res, mergeOption);
              resolve(ret as T);
            } catch (err) {
              reject(err || new Error("request error!"));
            }
            return;
          }
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error | AxiosError) => {
          if (requestCatchHook && isFunction(requestCatchHook)) {
            reject(requestCatchHook(e, mergeOption));
            return;
          }
          if (axios.isAxiosError(e)) {
            // rewrite error message from axios in here
          }
          reject(e);
        });
    });
  }

  get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: "GET" }, options);
  }

  post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: "POST" }, options);
  }

  put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: "PUT" }, options);
  }

  delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: "DELETE" }, options);
  }
}

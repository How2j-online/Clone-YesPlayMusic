import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { RequestOptions, CustomInterceptorRequestConfig, Result, CustomAxiosError } from "@/utils/http/type";

export interface CreateAxiosOptions extends AxiosRequestConfig {
  authenticationsScheme?: string;
  transform?: AxiosTransform;
  requestOptions?: RequestOptions;
}

export abstract class AxiosTransform {
  /**
   * @description: 请求之前的数据处理
   */
  beforeRequestHook?: (config: AxiosRequestConfig, options: RequestOptions) => CreateAxiosOptions;

  /**
   * @description: 处理响应数据
   */
  transformResponseHook?: (res: AxiosResponse<Result>, options: RequestOptions) => Promise<any> | any;

  /**
   * @description: 请求失败处理
   */
  requestCatchHook?: (e: Error, options: RequestOptions) => Promise<any>;

  /**
   * @description: 请求之前的拦截器
   */
  requestInterceptors?: (config: CustomInterceptorRequestConfig, options: CreateAxiosOptions) => CustomInterceptorRequestConfig;

  /**
   * @description: 请求之后的拦截器
   */
  responseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>;

  /**
   * @description: 请求之前的拦截器错误处理
   */
  requestInterceptorsCatch?: (error: Error) => void;

  /**
   * @description: 请求之后的拦截器错误处理
   */
  responseInterceptorsCatch?: (error: CustomAxiosError) => Promise<any> | any;
}

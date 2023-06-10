import { CustomAxios } from "@/utils/http/customAxios";
import type { CreateAxiosOptions } from "@/utils/http/axiosTransform";
import { AxiosTransform } from "@/utils/http/axiosTransform";
import { AxiosResponse } from "axios";
import { CustomAxiosError, RequestOptions, Result } from "@/utils/http/type";
import { deepMerge } from "@/utils";

// @ts-ignore
const transform: AxiosTransform = {
  // 请求之前的拦截器，处理config
  beforeRequestHook(config, _) {
    return config;
  },

  // 请求拦截处理
  requestInterceptors: (config, _) => {
    return config;
  },

  // 响应数据的处理
  transformResponseHook: (res: AxiosResponse<Result>, _: RequestOptions) => {
    return res.data;
  },
  // 响应之前的拦截器，处理response
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res;
  },
  // 请求之后的拦截器错误处理
  responseInterceptorsCatch(error: CustomAxiosError) {
    return Promise.reject(error);
  }
};
// 创建axios实例
const createAxios = (options?: Partial<CreateAxiosOptions>) => {
  return new CustomAxios(
    deepMerge(
      {
        baseURL: "https://music.ikarts.cn/api/"
      } || options,
      { transform }
    )
  );
};

export const defHttp = createAxios();

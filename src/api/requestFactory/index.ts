/**
 * @file 基于 axios 的 request 工厂函数
 * Note:
 * 1. axios 的请求拦截器 以 栈的形式收集 即：先进后出 -> interceptors.request.use == [].unshift(f) -> [].forEach
 * 2. axios 的响应拦截器 以 队列的形式收集，即：先进先出 -> interceptors.response.use === [].push(f) -> [].forEach
 */

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

import handleMockInterceptor from '@/msw/handleMockInterceptor'

const DEFAULT_TIMEOUT = 600000

/**
 * Request Factory - 附带了公共的接口处理
 * @param namespace 命名空间，用于缩短api路径
 * @example
 *    const request = RequestFactory('/v1');
 *    request.get('/getUser') -> '/v1/getUser'
 * @returns
 */
export default function RequestFactory(namespace = '') {
  const instance = axios.create({
    baseURL: `/${namespace}`,
    timeout: DEFAULT_TIMEOUT,
  })

  // 请求拦截 - mock handle
  instance.interceptors.request.use(handleMockInterceptor)
  // 其它请求拦截, 如：添加 header 附带内容等
  instance.interceptors.request.use((config: AxiosRequestConfig) => {
    console.info('1. 其它请求拦截...........')
    return config
  })

  // 返回拦截
  instance.interceptors.response.use(responseInterceptors)

  return instance
}

// ---------------- 返回拦截 start ------------------------

// TODO
// 1. 确定 BaseResponse 数据结构
// 2. 确定 状态码 业务类型

interface BaseResponse {
  errorCode: number
  errorMessage: string
  data: unknown
}

/**
 * 处理接口的返回拦截
 * @param res
 * @returns
 */
function responseInterceptors(res: AxiosResponse<BaseResponse>) {
  if (res.status !== 200) {
    return console.error(`${res.status}: Network error`)
  }

  const { data } = res

  switch (data.errorCode) {
    // 返回成功状态码，则返回数据
    case 200:
      // return data.data;
      return data
    default:
      // 处理错误返回
      throw new Error(`${data.errorCode}: ${data.errorMessage}`)
  }
}

// ---------------- 返回拦截 end ------------------------

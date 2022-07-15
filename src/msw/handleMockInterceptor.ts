/**
 * @file 适用于 axios的 针对 mock 数据的拦截
 * 拦截场景：后台提供了10个接口，其中有两个接口未实现，但却给出了数据结构
 * 1. 判断是否开启mock数据的部分拦截机制（相关环境变量控制）
 * 2. 根据接口path附着的标识，修改并添加域名前缀，使 接口可以被 msw拦截
 */
import { AxiosRequestConfig } from 'axios'

import { API_PROXY_SUFFIX, MOCK_DOMAIN_PREFIX } from './constants'
import { ifStartPartMock } from './util'

/**
 * 对指定URL进行拦截并返回mock数据的处理 拦截器
 * 1. 项目开启了对部分api的拦截配置
 * 2. 自定义接口的mock数据返回
 * 3. 给 api 添加指定拦截的后缀 __mock, 如：/api/getUser?__mock
 * @param config
 * @returns
 */
export default function handleMockInterceptor(config: AxiosRequestConfig) {
  console.info('2. handleMockInterceptor....')
  const isMockPartProxy = ifStartPartMock()
  if (!isMockPartProxy) {
    return config
  }

  // 接口 api 添加了 __mock 标识 -> 拦截当前接口并返回 mock 数据
  const isApiPartProxy = config.url?.includes(API_PROXY_SUFFIX)
  if (!isApiPartProxy) {
    return config
  }

  // baseURL 添加域名前缀, 使 url 避开 vite的 proxy 拦截, 并被 MSW 拦截
  const baseURL = `${MOCK_DOMAIN_PREFIX}${config.baseURL}`
  console.info(
    `${config.baseURL}${config.url} 【is using mock path】-> ${baseURL}${config.url}`,
  )
  return Object.assign({}, config, {
    baseURL,
  })
}

import Mock from 'mockjs'

import { BaseResponse } from '@/types'

import { API_NAME_SPACE, MOCK_DOMAIN_PREFIX } from './constants'

/**
 * 收否开启 Mock 数据
 * @returns
 */
export function ifStarMock() {
  const MSW_MOCK = Number(import.meta.env.VITE_MSW_MOCK)
  return MSW_MOCK > 0
}

/**
 * 是否开启部分 Mock 数据
 * 单独制定某个接口是否返回mock数据
 * @returns
 */
export function ifStartPartMock() {
  const MSW_MOCK = Number(import.meta.env.VITE_MSW_MOCK)
  return MSW_MOCK === 2
}

// interface BaseResponse {
//   errorCode: number
//   errorMessage: string
//   data?: unknown
//   [key: string]: unknown
// }

const baseResponse: Pick<
  BaseResponse<unknown>,
  'errorCode' | 'errorMessage'
> = {
  errorCode: 200,
  errorMessage: 'OK',
}

// 转化 mockjs模版
export const Mocker = (template: Record<string, unknown>) => {
  return Object.assign({}, baseResponse, Mock.mock(template))
}

/**
 * 转化 url 的 参数占位
 * @example
 * convertPathParams('/getUser/:id') -> /getUser/[\d]+
 * @param path 接口路径
 * @returns
 */
const convertPathParams = (path: string) => {
  const idreg = /:\w+/g
  // 匹配id占位，如: /:id, 并转化为正则
  return path.replace(idreg, '[\\d]+')
}

/**
 * 转化接口URL到正则，用于 MSW 对 URL 的拦截
 * @example
 * parseUrl('/getUser/:id') -> /\/v1\/getUser\/[\d]+/
 * parseUrl('/getUser/:id') -> part proxy -> /https:\/\/demo.mock.com\/v1\/getUser\/[\d]+/
 * @param path 接口路径
 * @param namespace 命名空间, 通常如：api, 通常用于反向代理的标识
 * @returns {RegExp} 用于 MSW 对 URL 的拦截
 */
export const parseUrl = (path: string, namespace?: string) => {
  namespace = namespace ?? API_NAME_SPACE
  path = convertPathParams(path)
  return new RegExp(
    `${ifStartPartMock() ? MOCK_DOMAIN_PREFIX : ''}/${namespace}${path}`,
  )
}

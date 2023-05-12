/**
 * @file type 类型集合
 */

export interface BaseResponse<T> {
  errorCode: number
  errorMessage: string
  data: T
  [key: string]: unknown
}

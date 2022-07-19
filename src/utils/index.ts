/**
 * @file 工具函数集合
 */
export * as pubSub from './pubSub'
export { pubCore } from './subject'

/**
 * 判断类型是否是 Promise, 如果是Promise 返回 Promise包裹的类，否则返回原类型
 * @example
 * const Use = new Promise<number>(resolve => resolve(10)) -> Unpacked<typeof Use> -> number
   const Use = { apple: 10, } -> Unpacked<typeof Use> -> {apple: number}
   type UseType = Unpacked<typeof Use>
 */
type Unpacked<T> = T extends Promise<infer P> ? P : T

/**
 * 处理接口请求的高阶函数
 * 1. 请求合并 - 同一时间多次调用接口 -> 只发送一次请求
 * 2. 缓存成功请求的结果 一段时间
 * @param fn 返回Promise的函数
 * @param expires 过期时间(ms), 用来缓存 promise 请求成功后的结果
 * @param createKey 自定义生成key的方法
 * @returns
 */
export const fetchUnique = <T extends (...args: any) => Promise<any>>(
  fn: T,
  expires = 0,
  createKey?: (...args: Parameters<T>) => string,
) => {
  // 缓存正在请求的 promise
  const cahcePromise: Record<string, Promise<Unpacked<ReturnType<T>>>> = {}
  // 缓存 请求的初始时间
  const cahceTimes: Record<string, number | undefined> = {}

  return async function (
    ...args: Parameters<T>
  ): Promise<Unpacked<ReturnType<T>>> {
    // 根据请求参数生成唯一key值
    const cacheKey = createKey ? createKey(...args) : JSON.stringify(args)

    // 判断缓存结果是否过期
    if (expires > 0 && !!cahcePromise[cacheKey]) {
      const lastTime = cahceTimes[cacheKey] || 0
      if (Date.now() - lastTime >= expires) {
        delete cahcePromise[cacheKey]
        delete cahceTimes[cacheKey]
      }
    }

    let promise = cahcePromise[cacheKey]

    if (!promise) {
      promise = fn(...(args as any[]))
      cahcePromise[cacheKey] = promise

      if (expires > 0 && !cahceTimes[cacheKey]) {
        // 首次请求添加时间记录
        cahceTimes[cacheKey] = Date.now()
      }
    }

    try {
      return await promise
    } catch (e) {
      if (expires > 0) {
        // 请求错误的结果不缓存
        delete cahcePromise[cacheKey]
      }
      throw e
    } finally {
      if (expires <= 0) {
        // 非缓存模式，请求完成即删除
        delete cahcePromise[cacheKey]
      }
    }
  }
}

/**
 * @file 工具函数集合
 */

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

// 发布订阅 一次性事件标识
const eventOnceKey = Symbol('psub-event-once')

interface PubSubEvent {
  (...args: any[]): void
  [eventOnceKey]?: boolean
}

/**
 * 自定义发布订阅的实现
 */
export const pubSub = (() => {
  const eventMap: Record<string, PubSubEvent[]> = {}
  const eventEmitStore: Record<string, any[]> = {}

  const _pubSub = {}

  /**
   * 自定义事件订阅
   * storePrev > 0 时，会缓存 emits 参数 {storePrev} 次，再次绑定事件会立即触发上一次的结果
   * @param eventType 自定义事件类型
   * @param func 自定义事件处理函数
   * @param storePrev 自定义事件 emits 缓存次数
   * @example
   * pubSub.on('click', (count) => console.log('click', count), 1) // store the lastest emit args
   * pubSub.emit('click', 100); -> click, 100
   * pubSub.emit('click', 200); -> click, 200 // 200 is the lastest emit args
   * pubSub.on('click', (count) => console.log('another click', count)); -> another click, 200 // trigger immediate
   * @returns
   */
  const on = (eventType: string, func: PubSubEvent, storePrev = 0) => {
    if (!eventMap[eventType]) {
      eventMap[eventType] = []
    }

    // emits args store init cache array
    if (!eventMap[eventType].length && storePrev > 0) {
      eventEmitStore[eventType] = new Array(storePrev)
    }

    eventMap[eventType].push(func)

    // emits args apply for new event func
    if (!func[eventOnceKey] && Array.isArray(eventEmitStore[eventType])) {
      const emits = eventEmitStore[eventType].filter(
        args => args && args.length,
      )
      emits.forEach(args => {
        func(...args)
      })
    }
    return _pubSub
  }

  /**
   * 绑定自定义事件 - 只触发一次
   * @param eventType 自定义事件类型
   * @param func 自定义事件处理函数
   * @returns
   */
  const once = (eventType: string, func: PubSubEvent) => {
    func[eventOnceKey] = true
    return on(eventType, func)
  }

  /**
   * 解除自定义事件
   * @param eventType 自定义事件类型
   * @param func 要解除的函数
   */
  const off = (eventType: string, func?: PubSubEvent) => {
    const events = eventMap[eventType]
    if (Array.isArray(events)) {
      if (!func) {
        eventMap[eventType] = []
      } else {
        const index = events.findIndex(fn => fn === func)
        if (index > -1) {
          events.splice(index, 1)
        }
      }

      // emits args store reset
      if (!eventMap[eventType].length) {
        eventEmitStore[eventType] = []
      }
    }
    return _pubSub
  }

  /**
   * 发布事件
   * @param eventType 自定义事件类型
   * @param args 出发自定义事件的参数
   * @returns
   */
  const emit = (eventType: string, ...args: any[]) => {
    let events = eventMap[eventType]
    if (Array.isArray(events)) {
      if (events.length) {
        events = events.filter(fn => {
          fn(...args)
          return !fn[eventOnceKey]
        })
        eventMap[eventType] = events

        // emits args store
        if (events.length) {
          const emitStore = eventEmitStore[eventType]
          if (emitStore && emitStore.length) {
            emitStore.shift()
            emitStore.push(args)
          }
        }
      } else {
        console.warn(`${eventType} is once bind or had clear`)
      }
    } else {
      console.warn(`Not bind any fn for event: ${eventType}, or emit too early`)
    }
    return _pubSub
  }

  return Object.assign(_pubSub, {
    on: on,
    once,
    off,
    emit,
  })
})()

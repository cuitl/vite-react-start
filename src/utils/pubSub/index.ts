/**
 * @file 发布订阅的实现
 */

const pubSub = {
  initEvent,
  once,
  on,
  off,
  emit,
}

// 发布订阅 一次性事件标识
const eventOnceKey = Symbol('psub-event-once')

interface PubSubEvent {
  (...args: any[]): void
  [eventOnceKey]?: boolean
}

const eventMap: Record<string, PubSubEvent[]> = {}
const eventEmitStore: Record<string, any[]> = {}

/**
 * 初始化 自定义事件 的 emit 存储次数
 * @param eventType 自定义事件
 * @param storePrev 已经 emit 的信息的存储次数设置
 * @example
 * pubSub.initEvent('click', 1) // 存储最新的 emit 信息
 * pubSub.on('click', (count) => console.log('click 1', count))
 *
 * pubSub.emit('click', 100)
 * pubSub.emit('click', 200) // 200 is the lastest emit msg
 *
 * // this will bind a new click handler fun, && call immediate use 200
 * pubSub.on('click', (count) => console.log('click 2', count)) // click 2 200
 *
 * @returns
 */
export function initEvent(eventType: string, storePrev = 0) {
  eventEmitStore[eventType] = new Array(storePrev)
  return pubSub
}

/**
 * 绑定自定义事件 - 只触发一次
 * @param eventType 自定义事件类型
 * @param func 自定义事件处理函数
 * @returns
 */
export function once(eventType: string, func: PubSubEvent) {
  func[eventOnceKey] = true
  return on(eventType, func)
}

/**
 * 自定义事件订阅
 * @param eventType 自定义事件类型
 * @param func 自定义事件处理函数
 * @returns
 */
export function on(eventType: string, func: PubSubEvent) {
  if (!eventMap[eventType]) {
    eventMap[eventType] = []
  }

  eventMap[eventType].push(func)

  // emits args apply for new event func
  const emitsStore = eventEmitStore[eventType]
  if (!func[eventOnceKey] && Array.isArray(emitsStore) && emitsStore.length) {
    const emits = eventEmitStore[eventType].filter(args => args && args.length)
    emits.forEach(args => {
      func(...args)
    })
  }
  return pubSub
}

/**
 * 解除自定义事件
 * @param eventType 自定义事件类型
 * @param func 要解除的函数
 */
export function off(eventType: string, func?: PubSubEvent) {
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
  return pubSub
}

/**
 * 发布事件
 * @param eventType 自定义事件类型
 * @param args 出发自定义事件的参数
 * @returns
 */
export function emit(eventType: string, ...args: any[]) {
  let events = eventMap[eventType]
  if (Array.isArray(events)) {
    if (events.length) {
      events = events.filter(fn => {
        fn(...args)
        return !fn[eventOnceKey]
      })
      eventMap[eventType] = events

      // emits args store
      const emitStore = eventEmitStore[eventType]
      if (emitStore && emitStore.length && args.length) {
        emitStore.shift()
        emitStore.push(args)
      }
    } else {
      console.warn(`${eventType} is once bind or had clear`)
    }
  } else {
    console.warn(`Not bind any fn for event: ${eventType}, or emit too early`)
  }
  return pubSub
}

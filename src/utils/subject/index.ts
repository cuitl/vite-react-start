/**
 * @file 观察者模式的 发布订阅
 * 被观察者(Subject) --|-- 直接通知 --|--> 观察者(observer)
 * 发布者(Publisher) -> |-- 事件中心 --| -> 订阅者(subscribe)
 */

const observerOnceKey = Symbol('observer-once-key')

interface Observer {
  (...args: any[]): void
  [observerOnceKey]?: boolean
}

/**
 * 观察者模式的发布订阅: 发布者 -> 订阅者
 * 被观察者 - Subject ;
 * 观察者 - Observer(纯函数) ;
 * 被观察者.on(观察者) - 添加观察者 ;
 * 被观察者.emit() - 通知观察者
 */
export class Subject {
  observers: Observer[] = []
  emitsStore: any[] = []

  constructor(public eventType: string, storePrev = 0) {
    this.observers = []
    this.emitsStore = new Array(storePrev)
  }

  once(ob: Observer) {
    ob[observerOnceKey] = true
    return this.on(ob)
  }

  on(ob: Observer) {
    this.observers.push(ob)

    // emits args store init cache array
    if (!ob[observerOnceKey]) {
      const emitsArgs = this.emitsStore.filter(args => args && args.length > 0)
      if (emitsArgs.length) {
        emitsArgs.forEach(args => ob(...args))
      }
    }
    return this
  }

  off(ob?: Observer) {
    if (ob) {
      const index = this.observers.findIndex(f => f === ob)
      if (index > -1) {
        this.observers.splice(index, 1)
      }
    } else {
      this.observers = []
    }
    return this
  }

  emit(...args: any[]) {
    if (this.observers.length) {
      const observers = this.observers.filter(fn => {
        fn(...args)
        return !fn[observerOnceKey]
      })
      this.observers = observers
    } else {
      console.warn(`${this.eventType} is once bind or had clear`)
    }

    // emits args store
    if (this.emitsStore.length && args.length) {
      this.emitsStore.shift()
      this.emitsStore.push(args)
    }
    return this
  }
}

/**
 * 基于 Subject 的发布订阅
 * pubSub2 相当于调度中心
 * 发布者 -> pubSub2 -> 订阅者
 */
export const pubSub2 = (() => {
  const cacheSubject: Record<string, Subject> = {}
  return {
    initEvent(eventType: string, storePrev = 0) {
      if (!cacheSubject[eventType]) {
        cacheSubject[eventType] = new Subject(eventType, storePrev)
      }
      return this
    },
    once(eventType: string, fn: Observer) {
      this.initEvent(eventType)
      cacheSubject[eventType].once(fn)
      return this
    },
    on(eventType: string, fn: Observer) {
      this.initEvent(eventType)
      cacheSubject[eventType].on(fn)
      return this
    },
    off(eventType: string, fn: Observer) {
      if (cacheSubject[eventType]) {
        cacheSubject[eventType].off(fn)
      }
      return this
    },
    emit(eventType: string, ...args: any[]) {
      if (cacheSubject[eventType]) {
        cacheSubject[eventType].emit(...args)
      } else {
        console.warn(
          `Not bind any fn for event: ${eventType}, or emit too early`,
        )
      }
      return this
    },
  }
})()

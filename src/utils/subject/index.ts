/**
 * @file 观察者模式的 发布订阅
 * 被观察者(Subject) --|-- 直接通知 --|--> 观察者(observer)
 * 发布者(Publisher) -> |-- 事件中心 --| -> 订阅者(subscribe)
 */

import PublishSubject from './PublishSubject'

/**
 * 基于 PublishSubject（观察者模式）实现的发布订阅
 * 发布者：pubCore.emit -> pubCore(事件调度中心) -> 订阅者(use pubCore.on)
 */
export const pubCore = (() => {
  const cachePublishSubject: Record<string, PublishSubject> = {}

  return {
    /**
     * 初始化 自定义事件的 实例(被观察者), 并设置 emit 信息的存储
     * 当再次初始化, 观察者将被清空
     * @param eventType 事件类型
     * @param storePrev 存储 emit 的信息最近的次数
     * @example
     * pubCore.initEvent('click', 1) // 存储最新的 emit 信息
     * pubCore.on('click', (count) => console.log('click 1', count))
     *
     * pubCore.emit('click', 100)
     * pubCore.emit('click', 200) // 200 is the lastest emit msg
     *
     * // this will bind a new click handler fun, && call immediate use 200
     * pubCore.on('click', (count) => console.log('click 2', count)) // click 2 200
     */
    initEvent(eventType: string, storePrev = 0) {
      cachePublishSubject[eventType] = new PublishSubject(eventType, storePrev)
      return this
    },
    once(eventType: string, fn: (...args: any[]) => void) {
      if (!cachePublishSubject[eventType]) {
        this.initEvent(eventType)
      }
      cachePublishSubject[eventType].once(fn)
      return this
    },
    on(eventType: string, fn: (...args: any[]) => void) {
      if (!cachePublishSubject[eventType]) {
        this.initEvent(eventType)
      }
      cachePublishSubject[eventType].on(fn)
      return this
    },

    off(eventType: string, fn?: (...args: any[]) => void) {
      cachePublishSubject[eventType]?.off(fn)
      return this
    },

    emit(eventType: string, ...args: any[]) {
      if (cachePublishSubject[eventType]) {
        cachePublishSubject[eventType].emit(...args)
      } else {
        console.warn(
          `Not bind any fn for event: ${eventType}, or emit too early`,
        )
      }
      return this
    },
  }
})()

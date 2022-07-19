/**
 * @file 使用观察者模式的方式实现，自定义事件
 * @example
 * // create subject & store the lastest emit msg
 * const subject = new PublishSubject('click', 1);
 * subject.on((count) => console.log('click 1', count));
 *
 * subject.emit(100)
 * subject.emit(200) // 200 is the lastest msg
 *
 * // this will bind another click handle fun, & call immidiate, use the lastest msg
 * subject.on((count) => console.log('click 2', count));
 * // click 2 200
 */
import BaseObserver from './BaseObserver'
import BaseSubject from './BaseSubject'

interface Func {
  (...args: any[]): void
}

/**
 * 订阅者
 */
export class SubObserver extends BaseObserver {
  /**
   * 事件类型
   * @param eventType
   * @param fn 传入函数，用于处理 对 update 通知函数的处理
   * @param once 一次性标识，用来判断是否是一次性绑定
   */
  constructor(eventType: string, public fn: Func, public once = false) {
    super(eventType)
  }

  update(sub: PublishSubject, ...args: any[]) {
    this.fn(...args)
  }
}

// 发布订阅
export default class PublishSubject extends BaseSubject<SubObserver> {
  emitsStore: any[] = []

  /**
   * 创建某事件类型的 发布订阅
   * @param eventType 自定义事件类型
   * @param storePrev 存储曾经 emit 的信息的次数
   */
  constructor(eventType: string, storePrev = 0) {
    super(eventType)
    this.emitsStore = new Array(storePrev)
  }

  once(fn: Func) {
    const observer = new SubObserver(this.name, fn, true)
    this.addObserver(observer)
    return this
  }

  on(fn: Func) {
    // 根据传入函数创建观察者，并添加到 被观察者 PublishSubject 中
    const observer = new SubObserver(this.name, fn)
    this.addObserver(observer)

    // emits store trigger on bind immediate
    const emitsArgs = this.emitsStore.filter(args => args && args.length > 0)
    if (emitsArgs.length) {
      emitsArgs.forEach(args => fn(...args))
    }
    return this
  }

  off(fn?: Func) {
    if (fn) {
      const ob = this.observers.find(ob => ob.fn === fn)
      this.removeObserver(ob)
    } else {
      this.observers = []
    }
    return this
  }

  emit(...args: any[]) {
    // 通知所有观察者
    const observers = this.observers.filter(ob => {
      ob.update(this, ...args)
      return !ob.once
    })
    this.observers = observers

    // emits stores
    if (this.emitsStore.length && args.length) {
      this.emitsStore.shift()
      this.emitsStore.push(args)
    }
    return this
  }
}

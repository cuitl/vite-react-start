/**
 * @file 观察者模式 - 观察者
 */
import BaseSubject from './BaseSubject'

export default class BaseObserver {
  constructor(public name: string) {}

  update(sub: BaseSubject<any>, ...args: any[]) {
    // ready for rewrite by sub class extends this
    console.log(
      `观察者 ${this.name} 观测到 主题${sub.name} 发生了变化`,
      ...args,
    )
  }
}

/**
 * @file 观察者模式 - 主题（被观察者）
 * 观察者模式: 被观察者 -> 观察者, 观察者存储在被观察者之中，被观察者可以直接通知观察者
 * 发布订阅模式: 发布者 -> 调度中心 -> 订阅者, 发布者将事件和信息 发送到调度中心， 调度中心根据事件类型，找到相关订阅者， 最终由调度中心将信息传递到订阅者
 */
import BaseObserver from './BaseObserver'

export default class BaseSubject<T extends BaseObserver> {
  // 观察者列表集合
  protected observers: T[] = []
  constructor(public name: string) {}

  // 添加观察者
  addObserver(ob: T) {
    this.observers.push(ob)
  }

  // 移除观察者
  removeObserver(ob?: T) {
    if (ob) {
      const index = this.observers.findIndex(o => o === ob)
      if (index > -1) {
        this.observers.splice(index, 1)
        return true
      }
    }
    return false
  }

  logObservers(name?: string) {
    console.log(name, this.observers)
  }

  // 通知所有观察者
  emit(...args: any[]) {
    this.observers.forEach(ob => ob.update(this, ...args))
  }
}

// base use

// export const shopTestDemo = () => {
//   const subject = new BaseSubject('shop')
//   const john = new BaseObserver('john')
//   const lily = new BaseObserver('lily')

//   subject.addObserver(john)
//   subject.addObserver(lily)

//   subject.emit('店铺新品上架iphone 100, 快来买啊')

//   // 观察者 john 观测到 主题shop 发生了变化 店铺新品上架iphone 100, 快来买啊
//   // 观察者 lily 观测到 主题shop 发生了变化 店铺新品上架iphone 100, 快来买啊
// }

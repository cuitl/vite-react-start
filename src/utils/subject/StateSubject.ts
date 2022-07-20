/**
 * @file 数据状态 Subject
 * 观测数据变化
 *
 * 使用场景 1： 通过观察者模式创建数据 -> 在React组件渲染时添加观察者（强制刷新）-> 达到多组件数据共享
 */
import { useEffect, useState } from 'react'

import BaseObserver from './BaseObserver'
import BaseSubject from './BaseSubject'

let _id = 0

type SetState<S> = (prevState: S) => S

export default class StateSubject<State> extends BaseSubject<
  StateObserver<State>
> {
  uid = 0

  constructor(public state: State) {
    super(`StateSubject:${++_id}`)
    this.uid = _id
  }

  setState(state: State | SetState<State>) {
    const preState = this.state
    const newState =
      typeof state === 'function' ? (state as SetState<State>)(preState) : state

    if (!Object.is(preState, newState)) {
      this.state = newState
      this.emit(preState, newState)
    }
  }
}

interface Func {
  (...args: any[]): void
}

export class StateObserver<State> extends BaseObserver {
  constructor(name: string, public fn: Func) {
    super(name)
  }

  update(sub: StateSubject<State>, ...args: any[]) {
    this.fn(...args)
  }
}

/**
 * 使用共享数据的hook
 * 1. 创建全局状态 new StateSubject
 * 2. 在组件中使用该 hook 并传入全局状态（创建观察者并添加到全局状态中）
 * @param {StateSubject} globalState 创建的全局状态 new StateSubject
 * @example
 * const globalState = new StateSubject<number>(0)
 *
 * const demoTest = () => {
 *   const [num, setNum] = useObserverState(globalState);
 *   return <div>{num}</div>
 * }
 * @returns
 */
export const useObserverState = <State>(globalState: StateSubject<State>) => {
  const [, _forceUpdate] = useState([])

  useEffect(() => {
    // 创建观察者
    const ob = new StateObserver<State>(
      `StateObserver:${globalState.uid}`,
      (prev, state) => {
        console.info('数据变更从 ', prev, '到', state)
        // 数据变动后组件强制刷新
        _forceUpdate([])
      },
    )
    // 将观察者添加到全局状态 globalState 中，当状态改变时，通知每个观察者
    globalState.addObserver(ob)
    return () => {
      globalState.removeObserver(ob)
    }
  }, [])

  const { state, setState } = globalState
  return [state, setState.bind(globalState)] as [typeof state, typeof setState]
}

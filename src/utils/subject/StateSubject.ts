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

    if (this.compare(preState, newState)) {
      this.state = newState
      this.emit(preState, newState)
    }
  }

  // 比较数据变化
  compare(preState: State, newState: State) {
    // TODO 对象型数据深度对比，减少不必要更新
    return !Object.is(preState, newState)
  }
}

interface Func {
  (...args: any[]): void
}

export class StateObserver<State> extends BaseObserver {
  sub?: StateSubject<State>
  constructor(name: string, public fn: Func) {
    super(name)
  }

  update(sub: StateSubject<State>, ...args: any[]) {
    this.fn(...args)
    if (!this.sub) {
      this.sub = sub
    }
  }
}

/**
 * 使用共享数据的hook
 * 1. 创建全局状态 new StateSubject
 * 2. 在组件中使用该 hook 并传入全局状态（创建观察者并添加到全局状态中）
 * FIXED 使用 类似 hox deps 依赖数组控制组件更新
 * @param {StateSubject} globalState 创建的全局状态 new StateSubject
 * @param ifUpdate 手动判断数据变动是否更新组件
 * @example
 * const globalState = new StateSubject<number>(0)
 *
 * const demoTest = () => {
 *   const [num, setNum] = useObserverState(globalState);
 *   return <div>{num}</div>
 * }
 * @returns
 */
export const useObserverState = <State>(
  globalState: StateSubject<State>,
  ifUpdate?: (prevState: State, newstate: State) => boolean,
) => {
  const [, _forceUpdate] = useState([])

  useEffect(() => {
    // 创建观察者
    const ob = new StateObserver<State>(
      `StateObserver:${globalState.uid}`,
      (prev, state) => {
        // console.info('数据变更从 ', prev, '到', state)
        if (ifUpdate) {
          ifUpdate(prev, state) && _forceUpdate([])
        } else {
          // 数据变动后组件强制刷新
          _forceUpdate([])
        }
      },
    )
    // 将观察者添加到全局状态 globalState 中，当状态改变时，通知每个观察者
    globalState.addObserver(ob)
    return () => {
      globalState.removeObserver(ob)
    }
  }, [])

  const { state, setState } = globalState
  return [state, setState.bind(globalState)] as [State, typeof setState]
}

/**
 * 创建共享数据
 * 缩短创建步骤
 * @param state 数据
 * @returns
 */
export const createGlobalState = <S>(state: S) => {
  const globalState = new StateSubject<S>(state)

  const hook = (ifUpdate?: (prevState: S, newstate: S) => boolean) => {
    return useObserverState(globalState, ifUpdate)
  }

  hook.globalState = globalState

  return hook
}

// from react-use
export const createGlobalState2 = <S>(state: S) => {
  const setters: any[] = []

  const store = {
    state,
    setState(state: S | SetState<S>) {
      const preState = store.state
      const newState =
        typeof state === 'function' ? (state as SetState<S>)(preState) : state

      store.state = newState
      setters.forEach(setter => {
        console.info('数据变更从 ', preState, '到', newState)
        setter(newState)
      })
    },
  }

  const hook = () => {
    const [gState, stateSetter] = useState<S>(store.state)

    useEffect(() => {
      if (!setters.includes(stateSetter)) {
        setters.push(stateSetter)
      }
      return () => {
        const index = setters.findIndex(setter => setter === stateSetter)
        if (index > -1) {
          setters.splice(index, 1)
        }
      }
    }, [])

    return [gState, store.setState] as [S, typeof store.setState]
  }

  hook.globalState = store

  return hook
}

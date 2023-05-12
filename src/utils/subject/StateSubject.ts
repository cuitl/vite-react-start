/**
 * @file 数据状态 Subject
 * 观测数据变化
 *
 * 使用场景 1： 通过观察者模式创建数据 -> 在React组件渲染时添加观察者（强制刷新）-> 达到多组件数据共享
 */
import { useEffect, useRef, useState } from 'react'

import BaseObserver from './BaseObserver'
import BaseSubject from './BaseSubject'

let _id = 0
let _subId = 0

type SetState<S> = (prevState: S) => S

type Hook = 'onTrap' | 'onUnTrap'
interface HookFn {
  (): void
  hook?: Hook
}

export default class StateSubject<State> extends BaseSubject<
  StateObserver<State>
> {
  uid = 0
  hookFnList: HookFn[] = []

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

  addObserver(ob: StateObserver<State>): void {
    const prevLen = this.observers.length
    super.addObserver(ob)
    // 首次捕获到观察者
    if (prevLen === 0 && this.observers.length === 1) {
      this.hookFnList.forEach(fn => {
        if (fn.hook === 'onTrap') {
          fn()
        }
      })
    }
  }

  removeObserver(ob?: StateObserver<State> | undefined) {
    const hasRemove = super.removeObserver(ob)
    if (hasRemove && this.observers.length === 0) {
      // 观察者被清空
      this.hookFnList.forEach(fn => {
        if (fn.hook === 'onUnTrap') {
          fn()
        }
      })
    }
    return hasRemove
  }

  on(hook: Hook, fn: HookFn) {
    fn.hook = hook
    this.hookFnList.push(fn)
  }
}

interface Func {
  (...args: any[]): void
}

export class StateObserver<State> extends BaseObserver {
  uid = 0
  sub?: StateSubject<State>
  constructor(name: string, public fn: Func) {
    super(`${name}:${++_subId}`)
    this.uid = _subId
  }

  update(sub: StateSubject<State>, ...args: any[]) {
    this.fn(...args)
    if (!this.sub) {
      this.sub = sub
    }
  }
}

function compare(oldDeps: unknown[], newDeps: unknown[]) {
  if (oldDeps.length !== newDeps.length) {
    return true
  }
  for (const index in newDeps) {
    if (oldDeps[index] !== newDeps[index]) {
      return true
    }
  }
  return false
}

/**
 * React组件中使用共享数据的hook
 * @param globalState 全局状态 new StateSubject
 * @param depsFn 依赖生成函数控制 组件更新
 * @example
 * const globalState = new StateSubject({count: 0, num: 0})
 *
 * const demoTest = () => {
 *   const [state, setState] = useObserverState(globalState, (newState, prevState) => {
 *      // count 变化时才更新组件，即使 num 变化
 *      // first way, 手动判断前后数据变化
 *      // return newState.count !== prevState.count;
 *      // second way, 指定数据依赖，自动判断依赖项变化
 *      return [newState.count]
 *   });
 *   return <div>{num}</div>
 * }
 * @returns
 */
export const useObserverState = <S>(
  globalState: StateSubject<S>,
  depsFn?: (newState: S, preState: S) => boolean | any[],
  showLog = false,
) => {
  const [, _forceUpdate] = useState([])

  const depsFnRef = useRef(depsFn)
  depsFnRef.current = depsFn
  const depsRef = useRef<any[]>([])

  useEffect(() => {
    if (depsFnRef.current) {
      // 数组形式的依赖初始化
      const deps = depsFnRef.current(globalState.state, globalState.state)
      if (Array.isArray(deps)) {
        depsRef.current = deps
      }
    }

    // 创建观察者
    const ob = new StateObserver<S>(
      `Subject:${globalState.uid}-Observer`,
      (prev, state) => {
        if (showLog) {
          console.info('数据变更从 ', prev, '到', state)
        }

        if (depsFnRef.current) {
          const newDeps = depsFnRef.current(state, prev)
          // 若返回多个依赖项, 判断前后依赖数据变化，进而控制是否更新
          if (Array.isArray(newDeps)) {
            const oldDeps = depsRef.current
            if (compare(oldDeps, newDeps)) {
              _forceUpdate([])
            }
            depsRef.current = newDeps
          } else {
            // 手动判断前后数据变化，控制是否更新
            newDeps && _forceUpdate([])
            // if (depsRef.current.length) {
            //   depsRef.current = []
            // }
          }
          return
        }
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
  return [state, setState.bind(globalState)] as [S, typeof setState]
}

type ExposeProps<S> = Pick<StateSubject<S>, 'state' | 'setState'> & {
  /**
   * 数据开始被使用了 (首次捕获到有组件使用了数据) [] -> [{}]
   */
  onTrap: (fn: HookFn) => void
  /**
   * 数据从被人使用到无人使用 [{},...] -> []
   */
  onUnTrap: (fn: HookFn) => void
}

/**
 * 创建共享数据
 * 缩短创建步骤
 * @param state 数据
 * @param setup 数据创建完成
 * @returns
 */
export const createGlobalState = <S>(
  state: S,
  setup?: (state: ExposeProps<S>) => void,
) => {
  const globalState = new StateSubject<S>(state)

  const exposeProps = {} as ExposeProps<S>

  Object.defineProperty(exposeProps, 'state', {
    get() {
      return globalState.state
    },
    enumerable: true,
  })

  Object.defineProperty(exposeProps, 'setState', {
    get() {
      return globalState.setState.bind(globalState)
    },
    enumerable: true,
  })

  Object.defineProperty(exposeProps, 'onTrap', {
    get() {
      return globalState.on.bind(globalState, 'onTrap')
    },
    enumerable: true,
  })

  Object.defineProperty(exposeProps, 'onUnTrap', {
    get() {
      return globalState.on.bind(globalState, 'onUnTrap')
    },
    enumerable: true,
  })

  const hook = (
    depsFn?: (newState: S, preState: S) => boolean | any[],
    showLog = false,
  ) => {
    return useObserverState(globalState, depsFn, showLog)
  }

  Object.assign(hook, exposeProps)

  setup?.(exposeProps)

  return hook as typeof hook & ExposeProps<S>
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

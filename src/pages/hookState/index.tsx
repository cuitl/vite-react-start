/**
 * @file hookstate
 * hookstate 在 React.StrictMode 模式下 locale state 会有问题
 * https://github.com/avkonst/hookstate
 * examples: https://github.com/avkonst/hookstate/tree/hookstate-4/docs/index/src/examples
 */
import { createState, useHookstate } from '@hookstate/core'
import { useEffect, useId, useRef, useState } from 'react'

const globalState = createState(0)
setInterval(() => globalState.set(p => p + 1), 3000)

const GlobalStateComp = () => {
  const state = useHookstate(globalState)

  return (
    <>
      <b>Counter value: {state.get()}</b> (watch +1 every 3 seconds){' '}
      <button
        className="flex justify-center justify-items-center bg-blue-500 border hover:bg-blue-600 border-blue-600 rounded-md text-light-500 px-4 py-1"
        onClick={() => state.set(p => p + 1)}
      >
        Increment
      </button>
    </>
  )
}

const Counter = () => {
  const count = useHookstate(1)
  const increment = () => {
    // count.set(p => p + 1)
    count.set(p => p + 1)
  }

  return (
    <button
      className="flex justify-center justify-items-center bg-blue-500 border hover:bg-blue-600 border-blue-600 rounded-md text-light-500 px-4 py-1"
      onClick={increment}
    >
      + {count.get()}
    </button>
  )
}

const ExampleComponent = () => {
  const state = useHookstate(0)
  return (
    <>
      <b>Counter value: {state.get()} </b>
      <button onClick={() => state.set(p => p + 1)}>Increment</button>
    </>
  )
}

export default function HookStatePage() {
  return (
    <div>
      <GlobalStateComp />
      <hr className="divide-y my-4" />
      <Counter />
      <hr className="divide-y my-4" />

      <ExampleComponent />
    </div>
  )
}

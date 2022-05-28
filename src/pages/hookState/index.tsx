/**
 * @file hookstate
 * https://github.com/avkonst/hookstate
 * examples: https://github.com/avkonst/hookstate/tree/hookstate-4/docs/index/src/examples
 */
import { createState, useState } from '@hookstate/core'
import { useEffect } from 'react'

const globalState = createState(0)
setInterval(() => globalState.set(p => p + 1), 3000)

const GlobalStateComp = () => {
  const state = useState(globalState)

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
  const count = useState(1)

  return (
    <button
      className="flex justify-center justify-items-center bg-blue-500 border hover:bg-blue-600 border-blue-600 rounded-md text-light-500 px-4 py-1"
      onClick={() => count.set(p => p + 1)}
    >
      + {count.get()}
    </button>
  )
}

export default function HookStatePage() {
  return (
    <div>
      <GlobalStateComp />
      <hr className="divide-y my-4" />
      <Counter />
    </div>
  )
}

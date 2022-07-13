/**
 * @file hookstate
 * hookstate 在 React.StrictMode 模式下 locale state 会有问题
 * 从hookstate 4.0.0-rc12后 支持了React.StrictMode模式 -> https://github.com/avkonst/hookstate/commit/9a2784b729766db48460363210e34fca13a00e73
 * https://github.com/avkonst/hookstate
 * examples: https://github.com/avkonst/hookstate/tree/hookstate-4/docs/index/src/examples
 */
import { createState, useHookstate } from '@hookstate/core'

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

export default function HookStatePage() {
  return (
    <div>
      <h2>Global State</h2>
      <GlobalStateComp />
      <GlobalStateComp />
      <hr className="divide-y my-4" />

      <h2>Local State</h2>
      <Counter />
      <hr className="divide-y my-4" />
    </div>
  )
}

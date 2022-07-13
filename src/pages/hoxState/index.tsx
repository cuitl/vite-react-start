/**
 * @file hox state demo
 */

import { createModel } from 'hox'
import { useEffect, useState } from 'react'

function useCounter() {
  const [count, setCount] = useState(0)
  const decrement = () => setCount(count - 1)
  const increment = () => setCount(count + 1)

  // 制造额外的变量更新
  const [num, setNum] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => {
      setNum(p => p + 1)
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  return {
    count,
    num,
    decrement,
    increment,
  }
}

const useModelCounter = createModel(useCounter)

const Counter = () => {
  // const { count, increment, decrement } = useModelCounter()
  const { count, increment, decrement } = useModelCounter(model => [
    // 优化性能，只有 count改变时，才会使组件更新
    model.count,
  ])
  console.log(count, 'Counter...')

  return (
    <div className="flex justify-center justify-items-center">
      <button
        className="flex justify-center justify-items-center bg-blue-500 border hover:bg-blue-600 border-blue-600 rounded-md text-light-500 px-4 py-1"
        onClick={decrement}
      >
        -
      </button>
      <span className="flex justify-center justify-items-center p-2">
        {count}
      </span>
      <button
        className="flex justify-center justify-items-center bg-blue-500 border hover:bg-blue-600 border-blue-600 rounded-md text-light-500 px-4 py-1"
        onClick={increment}
      >
        +
      </button>
    </div>
  )
}

export default function HoxStatePage() {
  return (
    <div className="bg-gray-800 text-light-400 text-center py-5 h-100vh">
      <h1 className="text-center text-2xl">
        global hox state use in components
      </h1>
      <hr className="divide-y my-4" />
      <Counter></Counter>
      <hr className="divide-y my-4" />
      <Counter></Counter>
    </div>
  )
}

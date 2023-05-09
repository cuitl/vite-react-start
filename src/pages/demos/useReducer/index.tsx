/**
 * @file useReducer 的使用
 * useReducer只是将便于逻辑控制，并不能在多个组件之前共享数据
 */
import { useReducer } from 'react'

export default function UserReducerPage() {
  return (
    <div className="bg-gray-800 text-light-400 text-center h-100vh">
      <Counter></Counter>
      <Counter></Counter>
    </div>
  )
}

const initNum = 0

function Counter() {
  const [num, setNum] = useReducer(x => x + 1, initNum)

  return (
    <div>
      <button
        className="inline-flex justify-center justify-items-center bg-blue-500 border hover:bg-blue-600 border-blue-600 rounded-md text-light-500 px-4 py-1 my-4"
        onClick={setNum}
      >
        + {num}
      </button>
    </div>
  )
}

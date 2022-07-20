import StateSubject, {
  createGlobalState,
  createGlobalState2,
  StateObserver,
  useObserverState,
} from '@/utils/subject/StateSubject'

export default function Demos() {
  return (
    <div className="bg-gray-800 text-light-400 text-center h-100vh">
      <h1 className="border-b-1px border-b-blue-200 py-4">
        Share state for multi Counter
      </h1>
      <ShareCounter />
      <ShareCounter />

      <hr className="divide-y divide-dark-100 my-4" />
      <ShareCounter2 />
      <ShareCounter2 />
    </div>
  )
}

const globalState = new StateSubject(10)

setInterval(() => {
  // console.log(globalState.observers)
  globalState.setState(prev => prev + 1)
}, 3000)

function ShareCounter() {
  const [num, setNum] = useObserverState(globalState)

  const onIncrease = () => {
    setNum(prev => prev + 1)
  }

  return (
    <div>
      <button
        className="inline-flex justify-center justify-items-center bg-blue-500 border hover:bg-blue-600 border-blue-600 rounded-md text-light-500 px-4 py-1 my-4"
        onClick={onIncrease}
      >
        + {num}
      </button>
    </div>
  )
}

// const globalCountObj = new StateSubject({
//   count: 0,
// })

// const useGlobalCountObj = createGlobalState2({ count: 0 })
const useGlobalCountObj = createGlobalState({ count: 0, num: 0 })
// useGlobalCountObj.globalState.setState

// 制造 num 的更新
setInterval(() => {
  useGlobalCountObj.globalState.setState(prev => ({
    ...prev,
    num: prev.num + 1,
  }))
}, 3000)

function ShareCounter2() {
  // const [countObj, setCountObj] = useObserverState(globalCountObj)
  const [countObj, setCountObj] = useGlobalCountObj((prev, state) => {
    // 控制 只有 count 属性 变化时才会刷新组件
    // 适用于部分性能优化的场景
    return prev.count !== state.count
  })

  // const [countObj, setCountObj] = useGlobalCountObj()

  console.log(countObj.count, 'count')

  const onIncrease = () => {
    setCountObj(prev => ({ ...prev, count: prev.count + 1 }))
  }

  return (
    <div>
      <button
        className="inline-flex justify-center justify-items-center bg-blue-500 border hover:bg-blue-600 border-blue-600 rounded-md text-light-500 px-4 py-1 my-4"
        onClick={onIncrease}
      >
        + {countObj.count}
      </button>
    </div>
  )
}

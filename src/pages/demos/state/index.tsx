import { useState } from 'react'

import { fetchUnique } from '@/utils'
import StateSubject, {
  createGlobalState,
  useObserverState,
} from '@/utils/subject/StateSubject'

export default function StatePage() {
  const [render, setRender] = useState(3)

  const toggleRender = () => {
    const next = render >= 3 ? 0 : render + 1
    setRender(next)
  }

  return (
    <div className="bg-gray-800 text-light-400 text-center h-100vh">
      <h1 className="border-b-1px border-b-blue-200 py-4">
        Share state for multi Counter
      </h1>
      <ShareCounter />
      <ShareCounter />

      <hr className="divide-y divide-dark-100 my-4" />
      <button
        className="inline-flex justify-center justify-items-center bg-blue-100 border hover:bg-blue-200 border-blue-600 rounded-md text-dark-100 px-4 py-1 my-4"
        onClick={toggleRender}
      >
        Toggle Render
      </button>
      <br />

      {render > 0 && <ShareCounter3 />}
      {render > 1 && <ShareCounter2 />}
      {render > 2 && <ShareCounter2 />}
    </div>
  )
}

const globalState = new StateSubject(10)
const runLogObserver = fetchUnique(
  () =>
    new Promise(resolve =>
      setTimeout(() => {
        globalState.logObservers('globalState: ')
        resolve(0)
      }, 500),
    ),
)

globalState.on('onTrap', () => {
  runLogObserver()
})

setInterval(() => {
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

const useGlobalCountObj = createGlobalState(
  { count: 0, num: 0 },
  ({ setState, onTrap, onUnTrap }) => {
    console.log('setup: state has created')

    let timer: any = null

    // 当有组件使用了 该共享数据，开启定时器
    onTrap(() => {
      console.log('onTrap to run the interval for create num update')
      // 制造 num 的更新
      timer = setInterval(() => {
        console.log('interval to update num.....')
        setState(prev => ({
          ...prev,
          num: prev.num + 1,
        }))
      }, 5000)
    })
    // 当没有组件使用该共享数据时，停止定时器
    onUnTrap(() => {
      console.log('onUnTrap to clearInterval')
      timer && clearInterval(timer)
    })
  },
)

function ShareCounter2() {
  const [countObj, setCountObj] = useGlobalCountObj((state, prev) => {
    // 控制 只有 count 属性 变化时才会刷新组件
    // 适用于部分性能优化的场景
    return prev.count !== state.count
    // return state.count % 2 === 0
  }, true)

  // const [countObj, setCountObj] = useGlobalCountObj(
  //   // 返回依赖参数 自动识别组件是否更新
  //   // state.count 数值与之前数据不一致时，才更新
  //   state => [state.count],
  //   true,
  // )

  // const [countObj, setCountObj] = useGlobalCountObj()

  // 上方定义了更新逻辑，当 count 更新时该组件才会更新
  // 若 count 不变，即使 num 数据变动，该组件也不更新
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
        count: {countObj.count} | num: {countObj.num}
      </button>
    </div>
  )
}

function ShareCounter3() {
  const [countObj] = useGlobalCountObj(state => [state.num])

  return <span>num: {countObj.num}</span>
}

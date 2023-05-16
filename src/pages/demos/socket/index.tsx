/**
 * @file websocket demo
 *
 * run `yarn socket` first
 */
import { ButtonHTMLAttributes, useEffect, useRef, useState } from 'react'

import Socket from '@/utils/socket'

export default function SocketDemoPage() {
  const [time, setTime] = useState<number>()
  const [name, setName] = useState<string>('')
  const [paragraph, setParagraph] = useState<string>('')

  const socketRef = useRef<Socket>()

  useEffect(() => {
    socketRef.current = new Socket()

    socketRef.current.on<number>('time', function (data) {
      console.log(data, '**** get time *****')
      setTime(data)
    })

    socketRef.current.on<string>('name', function (data) {
      setName(data)
    })

    socketRef.current.on<string>('paragraph', function (data) {
      setParagraph(data)
    })

    return () => {
      socketRef.current?.destroy()
    }
  }, [])

  const onSend = (event = 'time') => {
    socketRef.current?.send({
      event,
    })
  }

  return (
    <div className="bg-gray-700 text-light-400 text-center h-100vh">
      <h1>Websocket demo</h1>
      <hr className="border-b-4px border-b-green-500 my-4" />
      <ul className="flex flex-col w-6/12 mx-auto">
        <li className="flex justify-between align-middle gap-4 border-b-1px border-b-blue-400 border-dashed py-1">
          <Button onClick={() => onSend()}>获取时间</Button>
          <div className="inline-flex items-center">
            {time ? new Date(time).toLocaleString() : '--'}
          </div>
        </li>

        <li className="flex justify-between align-middle gap-4 border-b-1px border-b-blue-400 border-dashed py-1">
          <Button onClick={() => onSend('name')}>随机姓名</Button>
          <div className="inline-flex items-center">{name}</div>
        </li>

        <li className="flex justify-between align-middle gap-4 border-b-1px border-b-blue-400 border-dashed py-1">
          <Button onClick={() => onSend('paragraph')}>生成段落</Button>
          <div className="inline-flex items-center">{paragraph}</div>
        </li>
      </ul>

      {/* <Client2 /> */}
    </div>
  )
}

function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, children, ...rest } = props
  return (
    <button
      className="inline-flex justify-center justify-items-center bg-blue-100 border hover:bg-blue-200 border-blue-600 rounded-md text-dark-100 px-4 py-1"
      {...rest}
    >
      {children}
    </button>
  )
}

// 模拟另一个客户端的连接
export function Client2() {
  const socketRef = useRef<Socket>()

  useEffect(() => {
    socketRef.current = new Socket()

    socketRef.current.on<number>('time', function (data) {
      console.log('client2 get serverTime', data)
    })

    socketRef.current?.send({
      event: 'time',
    })
    return () => {
      socketRef.current?.destroy()
    }
  }, [])
  return (
    <div className="border-t-1px border-green-100 my-4">
      <h1>Client2</h1>
    </div>
  )
}

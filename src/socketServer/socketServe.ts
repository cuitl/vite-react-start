/**
 * @file socket 服务
 */
import Mock from 'mockjs'
import { RawData, WebSocket, WebSocketServer } from 'ws'

const socket = new WebSocketServer({ noServer: true })

export default socket

socket.on('listening', function () {
  console.log('listening')
})

socket.on('connection', function (ws) {
  console.log('connection: 连接成功')
  onConnection(ws)
})

socket.on('error', function (e) {
  console.log('error: ', e)
})

socket.on('close', function () {
  console.log('close')
})

type Message = {
  event: string
  pingId?: number
  data?: any
}

// 多个客户端的 ws 实例
// Note -> 多个用户之间通信
//  1. 用户唯一id 与 ws实例对应， 如：ws.userId = xxx
//  2. 用户A发送消息(消息内容、接收人ID)给Server，Server 根据 接收人ID, 找到对应的ws实例进行 消息发送
// const clientWsSet = new Set<WebSocket>()

// 记录存活的 ws 连接实例
// const saveLiveWs = (ws: WebSocket) => {
//   clientWsSet.add(ws)
//   clientWsSet.forEach(w => {
//     console.log(w.readyState === w.OPEN, '--', w.readyState)
//     if (w.readyState !== w.OPEN) {
//       clientWsSet.delete(w)
//     }
//   })
//   console.log(clientWsSet.size, '***')
// }

function onConnection(ws: WebSocket) {
  // saveLiveWs(ws)

  ws.on('message', function (data) {
    const message = getJsonOrString(data)
    if (typeof message === 'string') {
      // stirng
    } else {
      // when json
      const { event, pingId = 0 } = message as Message

      switch (event) {
        case 'time':
          ws.send(
            JSON.stringify({
              event,
              data: Date.now(),
            }),
          )
          break
        case 'ping':
          // console.log('heart ping')
          // if (pingId > 10) {
          //   // 模拟心跳异常
          //   return
          // }
          ws.send(
            JSON.stringify({
              event: 'pong',
              pongId: pingId,
            }),
          )
          break
        case 'name':
          ws.send(
            JSON.stringify({
              event: 'name',
              data: Mock.mock('@cname'),
            }),
          )
          break

        case 'paragraph':
          ws.send(
            JSON.stringify({
              event: 'paragraph',
              data: Mock.mock('@cparagraph'),
            }),
          )
          break
        default:
          // ws.send(`unknow event: ${event}`)
          break
      }
    }
  })

  ws.on('pong', function () {
    console.log('pong')
  })
}

function getJsonOrString(data: RawData) {
  let result
  try {
    result = JSON.parse(data.toString())
  } catch {
    result = data.toString()
  }
  return result
}

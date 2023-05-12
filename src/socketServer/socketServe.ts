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

function onConnection(ws: WebSocket) {
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

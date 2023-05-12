/**
 * @file socket 封装
 *
 * 1. webscoket 连接
 * 2. websocket 重连
 * 3. 心跳检测
 * 4. 消息监听及消息发送
 */

type Message = {
  event: string
  pongId?: number
  data?: any
}

let _id = 0

export default class Socket {
  id = 0
  socket?: WebSocket

  isOpened = false
  destroyed = false
  connecting = false

  queueMsgs: any[] = []
  _retryTimes = 0

  pingId = 0
  pongId = 0

  // pingTimer: any = null
  pingTimer: Parameters<typeof clearTimeout>[0]

  events: Record<string, ((...args: any[]) => void)[]> = {}

  constructor(public retryTimes = 5) {
    this.id = ++_id
    this._retryTimes = retryTimes
    this.connect()
  }

  connect() {
    if (this.connecting || this.isOpened) {
      console.warn('is connecting or has opened')
      return
    }
    console.log('start connect')
    this.connecting = true
    const socket = new WebSocket('ws://localhost:9000/init')

    socket.onopen = ev => {
      this.connecting = false
      this.isOpened = true
      this.reset()
      console.log('连接已打开', ev)

      if (this.queueMsgs.length) {
        // msg who is send before socket opened to resend
        this.queueMsgs.forEach(msg => this.send(msg))
        this.queueMsgs = []
      }
      this.startPing()
    }

    socket.onclose = ev => {
      this.connecting = false
      this.isOpened = false
      console.log('连接关闭', ev)
      if (!this.destroyed) {
        this.reconnect()
      }
      this.stopPing()
    }

    socket.onerror = ev => {
      this.connecting = false
      console.log('连接错误', ev)
      this.isOpened = false

      // extra logic -> 触发 onerror 后 立即触发 onclose
      // if (!this.destroyed) {
      //   this.reconnect()
      // }
      // this.stopPing()
    }

    socket.onmessage = ev => {
      this.onMessage(ev)
    }

    this.socket = socket
  }

  async reconnect() {
    if (this._retryTimes > 0) {
      this.socket = undefined
      if (this._retryTimes !== this.retryTimes) {
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
      console.log('reconnect', this._retryTimes)
      this.connect()
      this._retryTimes--
    } else {
      // 重试连接超出上限
      console.warn('重连次数超出上限')
    }
  }

  destroy() {
    this.destroyed = true
    this.socket?.close()
    this.socket = undefined
    this.isOpened = false
  }

  reset() {
    // 重连后的数据重置
    // 心跳相关
    this.pingId = 0
    this.pongId = 0
    // 重试次数恢复
    this._retryTimes = this.retryTimes
    // 销毁状态恢复
    this.destroyed = false
  }

  startPing() {
    this.pingTimer = setTimeout(() => {
      this.ping()
      if (this.isOpened) {
        this.startPing()
      }
    }, 5000)
  }

  stopPing() {
    clearTimeout(this.pingTimer)
  }

  // 心跳监测
  ping() {
    if (this.pingId - this.pongId > 5) {
      // 丢包5次，关闭重连
      console.log('心跳异常，主动关闭', this.pingId, this.pongId)
      this.socket?.close()
      return
    }

    this.send(
      {
        event: 'ping',
        pingId: ++this.pingId,
      },
      false,
    )
  }

  onMessage(ev: MessageEvent) {
    const obj = getJsonOrString<string | Message>(ev.data)
    if (typeof obj !== 'string') {
      const { event, pongId = 0, data } = obj
      switch (event) {
        case 'pong':
          // console.log('heart pong', this.pingId, pongId)
          this.pongId = pongId
          break
        default:
          this.emits(event, data)
          break
      }
    } else {
      console.log('string data')
    }
  }

  on<T>(event: string, fn: (data: T) => void) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(fn)
  }

  off(event: string, fn?: (...args: any[]) => void) {
    const list = this.events[event]
    if (list && list.length) {
      const index = list.findIndex(f => f === fn)
      if (index > -1) {
        list.splice(index, 1)
      } else {
        this.events[event] = []
      }
    }
  }

  emits(event: string, ...args: any[]) {
    if (this.events[event]) {
      this.events[event].forEach(fn => {
        fn(...args)
      })
    }
  }

  send(msg: string | object, always = true) {
    if (this.isOpened) {
      const data = JSON.stringify(msg || '')
      this.socket?.send(data)
    } else if (always) {
      // socket 打开前，调用消息发送，缓存消息体
      // 在 socket open 后，统一发送
      this.queueMsgs.push(msg)
    }
  }
}

function getJsonOrString<T>(data = '') {
  let result = ''
  try {
    result = JSON.parse(data)
  } catch {
    result = data
  }
  return result as T
}

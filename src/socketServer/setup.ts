/**
 * @file socket server setup deps on ws
 *
 * Note:
 * [ts-node + tslib] + @types/node 三(2)个依赖使得 node 中直接运行 ts文件成为可能
 * 同时 package.json 中需要设置 type": "module",
 * 引入其他模块时，需要手动添加后缀 .js, 如： import socketServe from './socketServe.js'
 * 否则将会报错 找不到模块儿
 */

import { createServer } from 'http'
//                                    .js 后缀必须
import socketServe from './socketServe.js'

const server = createServer()

server.on('upgrade', function (req, socket, head) {
  const pathname = req.url || ''

  if (pathname.startsWith('/init')) {
    socketServe.handleUpgrade(req, socket, head, function done(ws) {
      socketServe.emit('connection', ws, req)
    })
  }
})

server.listen(9000)

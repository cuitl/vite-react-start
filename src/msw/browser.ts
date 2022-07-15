/**
 * @file 接口mock数据配置, 用于浏览器
 */

import { setupWorker } from 'msw'

import * as mockHandlers from './handlers'

const { default: defaultMock, ...handlers } = mockHandlers

export const worker = setupWorker(...Object.values(handlers), ...defaultMock)

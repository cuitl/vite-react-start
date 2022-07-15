/**
 * @file 处理接口mock数据
 */
import {
  ResponseComposition,
  rest,
  RestContext,
  RestHandler,
  RestRequest,
} from 'msw'

import { WALLET_ADDRESS_REG } from './constants'
import { Mocker, parseUrl } from './util'

export const getUser = rest.get(parseUrl('/getUser'), (req, res, ctx) => {
  return res(
    ctx.json(
      Mocker({
        'data|6-10': [
          {
            'id|+1': 1,
            address: WALLET_ADDRESS_REG,
            name: '@cname',
          },
        ],
      }),
    ),
  )
})

// ---------------------------- defualt interceptor ----------------------------------------

const _defaultMock = (
  req: RestRequest,
  res: ResponseComposition,
  ctx: RestContext,
) => {
  console.log('default get mocks')
  return res(
    ctx.json(
      Mocker({
        data: [],
      }),
    ),
  )
}

const defaultMock: RestHandler[] = [
  rest.get(parseUrl('/*'), _defaultMock),
  rest.post(parseUrl('/*'), _defaultMock),
  rest.put(parseUrl('/*'), _defaultMock),
  rest.delete(parseUrl('/*'), _defaultMock),
]

export default defaultMock

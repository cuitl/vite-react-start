import { API_PROXY_SUFFIX } from '@/msw/constants'
import { fetchUnique } from '@/utils'

import RequestFactory from './requestFactory'

const request = RequestFactory('/v1')

export interface UserItem {
  id: number
  name: string
  address: string
}

export const getUser = (isPartMock = false) => {
  const suffix = isPartMock ? `?${API_PROXY_SUFFIX}` : ''
  return request.get<UserItem[]>(`/getUser${suffix}`)
}

export const getUserUnique = fetchUnique(getUser)

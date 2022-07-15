import RequestFactory from './requestFactory'

const request = RequestFactory('/v1')

interface UserItem {
  id: number
  name: string
  address: string
}

export const getUser = () => {
  return request.get<UserItem[]>('/getUser')
}

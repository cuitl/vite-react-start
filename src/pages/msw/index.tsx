/**
 * @file msw mock demo
 */
import { useEffect, useState } from 'react'

import { getUser, getUserUnique, UserItem } from '@/api'

const MSW_MOCK = Number(import.meta.env.VITE_MSW_MOCK)

export default function MswPage() {
  const { userList, loading, refresh, checked, setChecked } = useGetUser()

  return (
    <div className="bg-gray-800 text-light-400 text-center py-5 h-100vh">
      <h1 className="font-bold">Mock Demo</h1>
      <div className="w-5xl mx-auto flex justify-between items-center text-purple-600">
        Mock: 获取用户数据
        <span className="flex items-center text-green-400">
          {MSW_MOCK === 0 ? (
            <em className="text-gray-400">未开启Mock数据</em>
          ) : MSW_MOCK === 2 ? (
            '开启部分接口的Mock数据'
          ) : (
            '全部接口开启Mock数据'
          )}

          {MSW_MOCK === 2 && (
            <label className="inline-flex items-center gap-2 ml-4 text-red-500">
              <input
                onChange={e => setChecked(e.target.checked)}
                className="accent-red-500"
                type="checkbox"
                checked={checked}
              />
              是否使用Mock数据
            </label>
          )}
        </span>
        <button
          className="flex justify-center items-center gap-2 bg-blue-500 border hover:bg-blue-600 border-blue-600 rounded-md text-light-500 px-6 py-1 my-4"
          onClick={() => refresh()}
        >
          {loading && (
            <i className="border-2px border-cool-gray-700 border-r-transparent rounded-full w-6 h-6 animate-spin"></i>
          )}
          刷新
        </button>
      </div>

      <ul className="w-5xl mx-auto divide-y divide-teal-800 divide-y shadow-lg p-4">
        {userList.map(user => (
          <li className="text-center py-2" key={user.id}>
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

function useGetUser() {
  const [userList, setUserList] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(true)

  const fetchUser = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      // const res = await getUser(checked)
      const res = await getUserUnique(checked)
      setUserList(res.data)
    } catch (e) {
      setUserList([])
      console.error(e, 'getUser failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return {
    userList,
    loading,
    refresh: fetchUser,
    checked,
    setChecked,
  }
}

import './App.css'

import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { getUser } from '@/api'

import logo from './logo.svg'

setTimeout(() => {
  getUser()
    .then(res => {
      console.log(res.data)
    })
    .catch(e => {
      console.error('error', e)
    })
}, 3000)

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log('App....')
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="my-10px">Hello Vite + React + ts !</p>

        <p>
          <button
            className="flex justify-center justify-items-center bg-blue-500 border hover:bg-blue-600 border-blue-600 rounded-md text-light-500 px-4 py-1"
            type="button"
            onClick={() => setCount(count => count + 1)}
          >
            count is: {count}
          </button>
        </p>
      </header>

      <main className="min-h-10 my-2 w-screen-md m-auto">
        <ul>
          <li className="border-b-blue-400 border-b-1px py-4 text-light-800">
            <NavLink className="text-cyan-400" to="/hookState">
              hookState
            </NavLink>
          </li>

          <li className="border-b-blue-400 border-b-1px py-4 text-light-800">
            <NavLink className="text-cyan-400" to="/hoxState">
              hoxState
            </NavLink>{' '}
          </li>
          <li className="border-b-blue-400 border-b-1px py-4 text-light-800">
            <NavLink className="text-cyan-400" to="/lang">
              国际化
            </NavLink>{' '}
          </li>
          <li className="border-b-blue-400 border-b-1px py-4 text-light-800">
            <NavLink className="text-cyan-400" to="/windi">
              windicss
            </NavLink>{' '}
          </li>
        </ul>
      </main>
    </div>
  )
}

export default App

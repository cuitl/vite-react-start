import { NavLink } from 'react-router-dom'

export default function Demos() {
  return (
    <div className="bg-gray-800 text-light-400 text-center h-100vh">
      <h1 className="border-b-1px border-b-blue-200 py-4">Demo Page</h1>
      <NavLink className="text-cyan-400" to="/demos/state">
        Custom Share State
      </NavLink>
    </div>
  )
}

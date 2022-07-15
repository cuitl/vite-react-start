import 'virtual:windi.css'
import 'virtual:windi-devtools'
import './index.css'

import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, useRoutes } from 'react-router-dom'

import Provideri18n from '@/components/i18n'
import { loadMswProxy } from '@/msw'
import routes from '~react-pages'

const App = () => {
  // prettier-ignore
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Provideri18n>
        {useRoutes(routes)}
      </Provideri18n>
    </Suspense>
  )
}

const rootNode = document.getElementById('root')
if (rootNode) {
  ReactDOM.createRoot(rootNode).render(
    <React.StrictMode>
      <Router>
        <App></App>
      </Router>
    </React.StrictMode>,
  )
}

loadMswProxy()

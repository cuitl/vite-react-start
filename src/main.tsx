import './index.css'

import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, useRoutes } from 'react-router-dom'

import Provider118n from '@/components/118n'
// eslint-disable-next-line import/no-unresolved
import routes from '~react-pages'

const App = () => {
  // prettier-ignore
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Provider118n>
        {useRoutes(routes)}
      </Provider118n>
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

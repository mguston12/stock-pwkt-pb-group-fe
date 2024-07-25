import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner } from '@coreui/react'
import './scss/style.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const storedTheme = useSelector((state) => state.theme)
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true'

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          {!isLoggedIn ? (
            <>
              <Route exact path="/login" name="Login Page" element={<Login />} />
              <Route exact path="/register" name="Register Page" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" />} />{' '}
            </>
          ) : (
            <>
              <Route path="*" name="Home" element={<DefaultLayout />} />
            </>
          )}
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App

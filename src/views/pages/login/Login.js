import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8082'

  const login = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error?.msg === 'Buat Password dulu') {
          toast.error('Please set your password first')
          navigate(`/set-password/${username}`)
        } else {
          toast.error(data.error?.msg || 'Login failed')
        }
        return
      }

      // Save JWT in localStorage
      localStorage.setItem('token', data.data.token)

      const payload = JSON.parse(atob(data.data.token.split('.')[1])) // Decode JWT
      localStorage.setItem('user', payload.username)
      localStorage.setItem('role', payload.role)
      localStorage.setItem('isLoggedIn', true)
      if (username === 'admin') {
        window.location.replace('/request')
      } else {
        window.location.replace('/dashboard')
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  // const login = async () => {
  //   setLoading(true) // Start loading
  //   try {
  // const response = await fetch('${apiUrl}/users/login', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ username, password }),
  // })

  // console.log(response)

  // const data = await response.json()

  // if (data.error.status === true) {
  //   if (data.error.msg === 'Buat Password dulu') {
  //     toast.error(data.error.msg, {
  //       position: 'top-right',
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //     })
  //     navigate('/set-password')
  //   } else {
  //     toast.error(data.error.msg || 'Gagal melakukan login', {
  //       position: 'top-right',
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //     })
  //   }
  // } else {
  // localStorage.setItem('isLoggedIn', true)
  // localStorage.setItem('user', username)
  // window.location.replace('/request') // Redirect to dashboard if login is successful
  // }
  //   } catch (error) {
  //     toast.error('Terjadi kesalahan, coba lagi.', {
  //       position: 'top-right',
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //     })
  //   } finally {
  //     setLoading(false) // End loading
  //   }
  // }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      login()
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <ToastContainer />
      <CContainer>
        <CRow className="justify-content-center">
          <CCardGroup style={{ width: '30rem' }}>
            <CCard className="p-4">
              <CCardBody>
                <CForm>
                  <h1 className="mb-4">Login</h1>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="ID Teknisi Anda"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      onKeyDown={handleKeyDown}
                    />
                  </CInputGroup>
                  <CRow style={{ alignContent: 'center' }}>
                    <CButton
                      color="primary"
                      className="px-4"
                      onClick={login}
                      disabled={loading} // Disable the button while loading
                    >
                      {loading ? 'Logging in...' : 'Login'} {/* Show loading text */}
                    </CButton>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login

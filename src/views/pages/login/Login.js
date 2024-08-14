import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
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

  const login = () => {
    if (username === 'sekre' && password === 'Sekre#2024') {
      sessionStorage.setItem('isLoggedIn', true)
      sessionStorage.setItem('user', 'sekre')
      window.location.replace('/dashboard')
    } else {
      toast.error('Gagal melakukan login', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      login()
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <ToastContainer></ToastContainer>
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
                      placeholder="Username"
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
                    <CButton color="primary" className="px-4" onClick={login}>
                      Login
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

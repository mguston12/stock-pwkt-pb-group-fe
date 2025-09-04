import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isTokenExpired } from '../utils/authUtils'

const AuthGuard = ({ children }) => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token || isTokenExpired(token)) {
      localStorage.clear()
      navigate('/login')
    }
  }, [navigate])

  return children
}

export default AuthGuard

import React from 'react'
import { useNavigate } from 'react-router-dom'

const CheckLoggedIn = ({ isLoggedIn }) => {
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true })
    }
  }, [isLoggedIn, navigate])

  return null
}

export default CheckLoggedIn

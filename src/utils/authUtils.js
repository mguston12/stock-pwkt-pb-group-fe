import { jwtDecode } from 'jwt-decode'

export function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000
    return decoded.exp < currentTime
  } catch (err) {
    return true
  }
}

export function getTokenPayload(token) {
  try {
    return jwtDecode(token)
  } catch {
    return null
  }
}

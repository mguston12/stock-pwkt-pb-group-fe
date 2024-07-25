import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilDescription, cilPeople, cilSpeedometer, cilHome } from '@coreui/icons'
import { CNavItem } from '@coreui/react'

function checkSessionStorage(name) {
  return sessionStorage.getItem(name)
}

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Contract',
    to: '/contract',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    hidden: !checkSessionStorage('PT'),
  },
  {
    component: CNavItem,
    name: 'Customer',
    to: '/customer',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    hidden: !checkSessionStorage('PT'),
  },
]

export default _nav

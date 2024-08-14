import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilDescription,
  cilPeople,
  cilSpeedometer,
  cilHome,
  cilBank,
  cilAvTimer,
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

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
    name: 'Bank',
    to: '/bank',
    icon: <CIcon icon={cilBank} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Customer',
    to: '/customer',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    hidden: !checkSessionStorage('PT'),
  },
  {
    component: CNavGroup,
    name: 'Contract Management',
    hidden: !checkSessionStorage('PT'),
    items: [
      {
        component: CNavItem,
        name: 'Semua Kontrak',
        to: '/contract',
        icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Kontrak Habis Dalam 30 Hari',
        to: '/customer',
        icon: <CIcon icon={cilAvTimer} customClassName="nav-icon" />,
        hidden: true,
      },
    ],
  },
]

export default _nav

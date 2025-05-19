import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilDescription,
  cilPeople,
  cilPrint,
  cilHome,
  cilPaintBucket,
  cilWalk,
  cilQrCode,
  cilTask,
  cilHeader,
  cilBasket,
  cilBellExclamation,
  cilMoodVeryGood,
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

function checkSessionStorage(name) {
  return sessionStorage.getItem(name)
}

function isAdmin() {
  const userRole = checkSessionStorage('user')
  return userRole === 'admin'
}

const _nav = [
  // {
  //   component: CNavItem,
  //   name: 'Dashboard',
  //   to: '/dashboard',
  //   icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  //   hidden: !isAdmin(),
  // },
  // {
  //   component: CNavItem,
  //   name: 'Barcode Scanner',
  //   to: '/barcodescanner',
  //   icon: <CIcon icon={cilQrCode} customClassName="nav-icon" />,
  // },
  {
    component: CNavItem,
    name: 'Mesin',
    to: '/machine',
    icon: <CIcon icon={cilPrint} customClassName="nav-icon" />,
    hidden: !isAdmin(),
  },
  {
    component: CNavItem,
    name: 'Sparepart',
    to: '/sparepart',
    icon: <CIcon icon={cilPaintBucket} customClassName="nav-icon" />,
    hidden: !isAdmin(),
  },
  {
    component: CNavItem,
    name: 'Penggunaan Sparepart',
    to: '/sparepart-usage',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
    hidden: isAdmin(),
  },
  {
    component: CNavItem,
    name: 'Retur Sparepart',
    to: '/sparepart-return',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
    hidden: isAdmin(),
  },
  {
    component: CNavItem,
    name: 'Admin Retur Sparepart',
    to: '/admin-sparepart-return',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
    hidden: !isAdmin(),
  },
  {
    component: CNavItem,
    name: 'History Penggunaan SP',
    to: '/sparepart-history',
    icon: <CIcon icon={cilHeader} customClassName="nav-icon" />,
    hidden: !isAdmin(),
  },
  {
    component: CNavItem,
    name: 'Teknisi',
    to: '/teknisi',
    icon: <CIcon icon={cilWalk} customClassName="nav-icon" />,
    hidden: !isAdmin(),
  },
  {
    component: CNavItem,
    name: 'Request',
    to: '/request',
    icon: <CIcon icon={cilBellExclamation} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Supplier',
    to: '/supplier',
    icon: <CIcon icon={cilMoodVeryGood} customClassName="nav-icon" />,
    hidden: !isAdmin(),
  },
  {
    component: CNavItem,
    name: 'Inventory',
    to: '/inventory',
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
    hidden: isAdmin(),
  },
  // {
  //   component: CNavItem,
  //   name: 'Customer',
  //   to: '/customer',
  //   icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  //   hidden: !checkSessionStorage('PT'),
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Contract Management',
  //   hidden: !checkSessionStorage('PT'),
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Semua Kontrak',
  //       to: '/contract',
  //       icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Kontrak Habis Bulan Depan',
  //       to: '/expiredsoon',
  //       icon: <CIcon icon={cilAvTimer} customClassName="nav-icon" />,
  //     },
  //   ],
  // },
]

export default _nav

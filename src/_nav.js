import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilDescription,
  cilPeople,
  cilPrint,
  cilPaintBucket,
  cilWalk,
  cilQrCode,
  cilTask,
  cilHandPointUp,
  cilHeader,
  cilBasket,
  cilBellExclamation,
  cilMoodVeryGood,
  cilHome,
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

// function checklocalStorage(name) {
//   return localStorage.getItem(name)
// }

// function isAdmin() {
//   const userRole = checklocalStorage('user')
//   return userRole === 'admin'
// }
function isAdmin() {
  const role = localStorage.getItem('role')
  return role === 'admin'
}

const _nav = [
  {
    component: CNavItem,
    name: 'Admin Retur Sparepart',
    to: '/admin-sparepart-return',
    icon: <CIcon icon={cilHandPointUp} customClassName="nav-icon" />,
    hidden: !isAdmin(),
  },
  {
    component: CNavItem,
    name: 'Barcode Scanner',
    to: '/barcodescanner',
    icon: <CIcon icon={cilQrCode} customClassName="nav-icon" />,
    hidden: isAdmin(),
  },
  {
    component: CNavItem,
    name: 'Halaman Awal',
    to: '/dashboard',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
    hidden: isAdmin(),
  },
  {
    component: CNavItem,
    name: 'Customer',
    to: '/customer',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
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
    name: 'Mesin',
    to: '/machine',
    icon: <CIcon icon={cilPrint} customClassName="nav-icon" />,
    hidden: !isAdmin(),
  },
  // {
  //   component: CNavItem,
  //   name: 'Penggunaan Sparepart',
  //   to: '/sparepart-usage',
  //   icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
  //   hidden: isAdmin(),
  // },
  {
    component: CNavItem,
    name: 'Persediaan',
    to: '/inventory',
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
    hidden: isAdmin(),
  },
  {
    component: CNavItem,
    name: 'Report',
    to: '/report',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
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
    name: 'Retur Sparepart',
    to: '/sparepart-return',
    icon: <CIcon icon={cilHandPointUp} customClassName="nav-icon" />,
    hidden: isAdmin(),
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
    name: 'Supplier',
    to: '/supplier',
    icon: <CIcon icon={cilMoodVeryGood} customClassName="nav-icon" />,
    hidden: !isAdmin(),
  },
  {
    component: CNavItem,
    name: 'Teknisi',
    to: '/teknisi',
    icon: <CIcon icon={cilWalk} customClassName="nav-icon" />,
    hidden: !isAdmin(),
  },
]

export default _nav

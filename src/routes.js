import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const Machine = React.lazy(() => import('./views/pages/machine/Machine'))
const DetailMachine = React.lazy(() => import('./views/pages/machine/DetailMachine'))

const Sparepart = React.lazy(() => import('./views/pages/sparepart/Sparepart'))

const Request = React.lazy(() => import('./views/pages/request/Request'))

const Teknisi = React.lazy(()=> import('./views/pages/teknisi/Teknisi'))
const DetailTeknisi = React.lazy(() => import('./views/pages/teknisi/DetailTeknisi'))

const Customer = React.lazy(() => import('./views/pages/customer/Customer'))
const CreateCustomer = React.lazy(() => import('./views/pages/customer/CreateCustomer'))

const BarcodeScanner = React.lazy(() => import('./views/pages/barcodescanner/barcodescanner'))

const SetPassword = React.lazy(()=> import('./views/pages/setpassword/SetPassword'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, exact: true },

  { path: '/machine', name: 'Machine', element: Machine, exact: true },
  {
    path: '/machine/detail/:id_machine',
    name: 'Detail Mesin',
    element: DetailMachine,
    exact: true,
  },
  { path: '/sparepart', name: 'Sparepart', element: Sparepart, exact: true },
  { path: '/request', name: 'Request', element: Request, exact: true },

  { path: '/customer', name: 'Customer', element: Customer, exact: true },
  { path: '/customer/create', name: 'Buat Customer Baru', element: CreateCustomer, exact: true },

  { path: '/teknisi', name: 'Teknisi', element: Teknisi, exact: true},
  {
    path: '/teknisi/detail/:id_teknisi',
    name: 'Detail Teknisi',
    element: DetailTeknisi,
    exact: true,
  },

  { path: '/barcodescanner', name: 'BarcodeScanner', element: BarcodeScanner, exact: true },
]

export default routes

import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const Contract = React.lazy(() => import('./views/pages/contract/Contract'))
const DetailContract = React.lazy(() => import('./views/pages/contract/DetailContract'))
const CreateContract = React.lazy(() => import('./views/pages/contract/CreateContract'))
const EditContract = React.lazy(() => import('./views/pages/contract/EditContract'))

const Customer = React.lazy(() => import('./views/pages/customer/Customer'))
const CreateCustomer = React.lazy(() => import('./views/pages/customer/CreateCustomer'))

const Bank = React.lazy(()=>import('./views/pages/bank/Bank'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, exact: true },

  { path: '/contract', name: 'Kontrak', element: Contract, exact: true },
  { path: '/contract/detail/:no_kontrak', name: 'Detail Kontrak', element: DetailContract, exact: true },
  { path: '/contract/edit/:no_kontrak', name: 'Ubah Kontrak', element: EditContract, exact: true },
  { path: '/contract/create', name: 'Buat Kontrak Baru', element: CreateContract, exact: true },

  { path: '/customer', name: 'Customer', element: Customer, exact: true },
  { path: '/customer/create', name: 'Buat Customer Baru', element: CreateCustomer, exact: true },

  { path: '/bank', name: 'Bank', element: Bank, exact: true },

]

export default routes

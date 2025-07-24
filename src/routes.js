import React from 'react'

// const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const Machine = React.lazy(() => import('./views/pages/machine/Machine'))
const DetailMachine = React.lazy(() => import('./views/pages/machine/DetailMachine'))

const Sparepart = React.lazy(() => import('./views/pages/sparepart/Sparepart'))
const SparepartUsage = React.lazy(() => import('./views/pages/sparepartusage/SparepartUsage'))
const SparepartUsageAfterScan = React.lazy(
  () => import('./views/pages/sparepartusage/SparepartUsageAfterScan'),
)
const SparepartHistory = React.lazy(() => import('./views/pages/spareparthistory/SparepartHistory'))
const SparepartPurchase = React.lazy(() => import('./views/pages/sparepart/HistoryPembelian'))
const SparepartReturn = React.lazy(() => import('./views/pages/sparepartreturn/SparepartReturn'))
const AdminReturSparepart = React.lazy(
  () => import('./views/pages/sparepartreturn/AdminReturSparepart'),
)

const Request = React.lazy(() => import('./views/pages/request/Request'))
const CreateRequest = React.lazy(() => import('./views/pages/request/CreateRequest'))

const Teknisi = React.lazy(() => import('./views/pages/teknisi/Teknisi'))
const DetailTeknisi = React.lazy(() => import('./views/pages/teknisi/DetailTeknisi'))

const Customer = React.lazy(() => import('./views/pages/customer/Customer'))
const CreateCustomer = React.lazy(() => import('./views/pages/customer/CreateCustomer'))

const BarcodeScanner = React.lazy(() => import('./views/pages/barcodescanner/barcodescanner'))

const SetPassword = React.lazy(() => import('./views/pages/setpassword/SetPassword'))

const Report = React.lazy(() => import('./views/pages/report/Report'))

const Inventory = React.lazy(() => import('./views/pages/inventory/Inventory'))

const Supplier = React.lazy(() => import('./views/pages/supplier/Supplier'))
const DetailSupplier = React.lazy(() => import('./views/pages/supplier/DetailSupplier'))

const Dashboard = React.lazy(() => import('./views/pages/dashboard/Dashboard'))

const routes = [
  { path: '/request', exact: true, name: 'Request' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, exact: true },

  { path: '/machine', name: 'Machine', element: Machine, exact: true },
  {
    path: '/machine/detail/:id_machine',
    name: 'Detail Mesin',
    element: DetailMachine,
    exact: true,
  },
  { path: '/sparepart', name: 'Sparepart', element: Sparepart, exact: true },
  {
    path: '/sparepart/purchase/:id_sparepart/:nama_sparepart',
    name: 'Sparepart Purchase',
    element: SparepartPurchase,
    exact: true,
  },
  {
    path: '/sparepart-usage',
    name: 'Penggunaan Sparepart',
    element: SparepartUsage,
    exact: true,
  },
  {
    path: '/sparepart-usage/:id_machine',
    name: 'Penggunaan Sparepart',
    element: SparepartUsageAfterScan,
    exact: true,
  },

  { path: '/sparepart-return', name: 'Retur Sparepart', element: SparepartReturn, exact: true },
  {
    path: '/admin-sparepart-return',
    name: 'Admin Retur Sparepart',
    element: AdminReturSparepart,
    exact: true,
  },

  {
    path: '/sparepart-history',
    name: 'History Penggunaan Sparepart',
    element: SparepartHistory,
    exact: true,
  },

  { path: '/request', name: 'Request', element: Request, exact: true },
  { path: '/request/create', name: 'Buat Request Baru', element: CreateRequest, exact: true },

  { path: '/customer', name: 'Customer', element: Customer, exact: true },
  { path: '/customer/create', name: 'Buat Customer Baru', element: CreateCustomer, exact: true },

  { path: '/teknisi', name: 'Teknisi', element: Teknisi, exact: true },

  { path: '/inventory', name: 'Persediaan', element: Inventory, exact: true },

  {
    path: '/setpassword/:usernames',
    element: SetPassword,
    exact: true,
  },

  { path: '/supplier', name: 'Supplier', element: Supplier, exact: true },
  {
    path: '/supplier/detail/:id_supplier',
    name: 'Detail Supplier',
    element: DetailSupplier,
    exact: true,
  },

  { path: '/report', name: 'Report', element: Report, exact: true },

  {
    path: '/teknisi/detail/:id_teknisi',
    name: 'Detail Teknisi',
    element: DetailTeknisi,
    exact: true,
  },

  { path: '/barcodescanner', name: 'BarcodeScanner', element: BarcodeScanner, exact: true },
]

export default routes

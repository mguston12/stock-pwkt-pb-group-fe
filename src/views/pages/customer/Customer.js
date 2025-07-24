import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CPaginationItem,
  CPagination,
} from '@coreui/react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilXCircle } from '@coreui/icons'
import ReactSelect from 'react-select'

const Customer = () => {
  const [listCustomer, setListCustomer] = useState([])
  const [listCompany, setListCompany] = useState([
    { id_company: 1, nama_company: 'PT. Purnama Bayu' },
    { id_company: 2, nama_company: 'PT. Purnama Bayu Max' },
    { id_company: 3, nama_company: 'PT. Mars Max Utama' },
  ])
  const [inputSearch, setInputSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false)
  const [singleData, setSingleData] = useState('')
  const userID = sessionStorage.getItem('user')

  const [isLoading, setIsLoading] = useState(false)
  const [modalResponseIsOpen, setModalResponseIsOpen] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [responseType, setResponseType] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const itemsPerPage = 5
  const maxVisiblePages = 3

  const token = sessionStorage.getItem('token')

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081'

  useEffect(() => {
    // if (selectedCompany.value === '' || selectedCompany.value === undefined) {
    //   setModalOpen(true)
    // } else {
    //  if (inputSearch.trim() === '') {
    //     GetCustomers()
    //   } else {
    SearchCustomer()
    // }
    // }
  }, [currentPage])

  // const GetCustomers = () => {
  //   setIsLoading(true)
  //   const url = `http://localhost:8080/customers?company=${selectedCompany.value}&page=${currentPage}&length=${itemsPerPage}`

  //   axios
  //     .get(url, {
  //     .then((response) => {
  //       setIsLoading(false)
  //       if (response.data.data !== null) {
  //         setListCustomer(response.data.data)
  //         setTotalPage(response.data.metadata)
  //       } else {
  //         setListCustomer([])
  //         setTotalPage(response.data.metadata)
  //       }
  //     })
  //     .catch((error) => {
  //       alert(error.message)
  //       setIsLoading(false)
  //       // Handle error state or message
  //     })
  // }

  const SearchCustomer = () => {
    setIsLoading(true)
    const url = `${apiUrl}/customers?keyword=${inputSearch}&page=${currentPage}&length=${itemsPerPage}`

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setIsLoading(false)
        if (response.data.data !== null) {
          setListCustomer(response.data.data)
          setTotalPage(response.data.metadata)
        } else {
          setListCustomer([])
          setTotalPage(response.data.metadata)
        }
      })
      .catch((error) => {
        alert(error.message)
        setIsLoading(false)
        setTotalPage(response.data.metadata)
      })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      SearchCustomer()
    }
  }

  const handleModalAdd = () => {
    setSingleData('')
    setModalOpen(true)
  }

  const handleModalEdit = (item) => {
    setSingleData(item)
    setModalEditIsOpen(true)
  }

  function updateCustomer() {
    setModalEditIsOpen(false)
    setIsLoading(true)
    var obj = {
      id_customer: singleData.id_customer,
      nama_customer: singleData.nama_customer,
      alamat: singleData.alamat,
      updated_by: userID,
    }
    var url = `${apiUrl}/customers/update`

    axios
      .put(url, obj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.error.status === true) {
          console.log('Gagal Update Customer Baru', response)
          setIsLoading(false)
          setResponseType(false)
          setResponseMessage(response.data.error.msg)
          setModalResponseIsOpen(true)
        } else {
          setIsLoading(false)
          console.log('Berhasil Update Customer Baru', response)
          setResponseType(true)
          setResponseMessage('Berhasil Update Customer Baru')
          setModalResponseIsOpen(true)
        }
      })
      .catch((error) => {
        setIsLoading(false)
        setModalResponseIsOpen(true)
        setResponseType(false)
        setResponseMessage(error.message)
      })
  }

  function createCustomer() {
    setModalEditIsOpen(false)
    setIsLoading(true)
    var obj = {
      company_id: parseInt(singleData.id_company),
      nama_customer: singleData.nama_customer,
      alamat: singleData.alamat,
      updated_by: userID,
    }
    var url = `${apiUrl}/customers/create`

    axios
      .post(url, obj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.error.status === true) {
          console.log('Gagal Update Customer Baru', response)
          setIsLoading(false)
          setResponseType(false)
          setResponseMessage(response.data.error.msg)
          setModalResponseIsOpen(true)
        } else {
          setIsLoading(false)
          console.log('Berhasil Update Customer Baru', response)
          setResponseType(true)
          setResponseMessage('Berhasil Update Customer Baru')
          setModalResponseIsOpen(true)
        }
      })
      .catch((error) => {
        setIsLoading(false)
        setModalResponseIsOpen(true)
        setResponseType(false)
        setResponseMessage(error.message)
      })
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPage) return // Prevent out-of-bounds page numbers
    setCurrentPage(newPage)
  }

  const renderPaginationItems = () => {
    const pages = []
    const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2)
    let startPage = Math.max(1, currentPage - halfMaxVisiblePages)
    let endPage = Math.min(totalPage, startPage + maxVisiblePages - 1)

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <CPaginationItem key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
          {i}
        </CPaginationItem>,
      )
    }

    return pages
  }

  return (
    <CCard style={{ width: '100%' }}>
      <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>
        <CRow>
          <CCol>List Customer</CCol>
          <CCol className="d-grid gap-2" md={2}>
            <CButton className="btn btn-block text-white" color="dark" onClick={handleModalAdd}>
              Tambah Customer
            </CButton>
          </CCol>
        </CRow>
        <CRow className="mt-3">
          <CCol md={10}>
            <CFormInput
              placeholder="Input ID Customer atau Nama Customer lalu Tekan Enter atau Tekan Cari"
              style={{ display: 'inline' }}
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </CCol>
          <CCol className="d-grid gap-2" md={2}>
            <CButton className="btn-block text-white" color="info" onClick={SearchCustomer}>
              Search
            </CButton>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        {listCustomer.length === 0 && (
          <CCol style={{ textAlign: 'center' }}>Maaf Data Tidak Ditemukan</CCol>
        )}
        {listCustomer.length !== 0 && (
          <CCol>
            <CTable striped bordered hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="text-center align-middle">ID Customer</CTableHeaderCell>
                  <CTableHeaderCell className="text-center align-middle">Nama Customer</CTableHeaderCell>
                  <CTableHeaderCell className="text-center align-middle" width="20%">
                    Alamat
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center align-middle">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {listCustomer.map((item, index) => (
                  <CTableRow key={index} className="text-center align-middle">
                    <CTableDataCell>{item.id_customer}</CTableDataCell>
                    <CTableDataCell>{item.nama_customer}</CTableDataCell>
                    <CTableDataCell>{item.alamat}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        className="btn btn-warning btn-sm text-white"
                        onClick={() => handleModalEdit(item)}
                      >
                        Ubah
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            {totalPage > 1 && (
              <CPagination align="center">
                <CPaginationItem
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </CPaginationItem>
                {renderPaginationItems()}

                <CPaginationItem
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPage}
                >
                  Next
                </CPaginationItem>
              </CPagination>
            )}
          </CCol>
        )}
      </CCardBody>
      <CModal size="lg" alignment="center" visible={modalOpen} backdrop="static">
        <CModalBody style={{ justifyContent: 'center' }}>
          <CFormLabel style={{ fontWeight: 'bold', fontSize: '20px', paddingTop: '8px' }}>
            Tambah Customer
          </CFormLabel>
          <hr />
          {/* <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  ID Customer
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={singleData.id_customer}
                onChange={(e) => setSingleData({ ...singleData, id_customer: e.target.value })}
              ></CFormInput>
            </CCol>
          </CRow> */}
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>Company</CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CCol>
                <ReactSelect
                  options={listCompany.map((company) => ({
                    value: company.id_company,
                    label: company.nama_company,
                  }))}
                  onChange={(selectedOption) =>
                    setSingleData({ ...singleData, id_company: selectedOption?.value })
                  }
                  isSearchable={true}
                  placeholder="Tekan dan Pilih Company..."
                />
              </CCol>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Nama Customer
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={singleData.nama_customer}
                onChange={(e) => setSingleData({ ...singleData, nama_customer: e.target.value })}
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>Alamat</CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormTextarea
                value={singleData.alamat}
                onChange={(e) => setSingleData({ ...singleData, alamat: e.target.value })}
              ></CFormTextarea>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter style={{ justifyContent: 'center' }}>
          <CButton color="success" className="text-white" onClick={() => createCustomer()}>
            Tambah
          </CButton>
          <CButton color="danger" className="text-white" onClick={() => setModalOpen(false)}>
            Batal
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal size="lg" alignment="center" visible={modalEditIsOpen} backdrop="static">
        <CModalBody style={{ justifyContent: 'center' }}>
          <CFormLabel style={{ fontWeight: 'bold', fontSize: '20px', paddingTop: '8px' }}>
            Ubah Data Customer
          </CFormLabel>
          <hr />
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Nama Customer
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={singleData.nama_customer}
                onChange={(e) => setSingleData({ ...singleData, nama_customer: e.target.value })}
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>Alamat</CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormTextarea
                value={singleData.alamat}
                onChange={(e) => setSingleData({ ...singleData, alamat: e.target.value })}
              ></CFormTextarea>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter style={{ justifyContent: 'center' }}>
          <CButton color="success" className="text-white" onClick={() => updateCustomer()}>
            Ubah
          </CButton>
          <CButton color="danger" className="text-white" onClick={() => setModalEditIsOpen(false)}>
            Batal
          </CButton>
        </CModalFooter>
      </CModal>
      {/* MODAL LOADING*/}
      <CModal size="xl" alignment="center" visible={isLoading} backdrop="static">
        <CModalBody
          style={{
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: '1px',
          }}
        >
          <CFormLabel
            style={{
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            Mohon Tunggu...
          </CFormLabel>
        </CModalBody>
        <CModalFooter
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '0px',
            paddingTop: '0px',
          }}
        >
          <CSpinner
            size="sm"
            color="success"
            style={{
              width: '4rem',
              height: '4rem',
            }}
          />
        </CModalFooter>
      </CModal>
      {/* MODAL LOADING */}
      {/* MODAL RESPONSE*/}
      <CModal size="md" alignment="center" visible={modalResponseIsOpen} backdrop="static">
        <CModalBody style={{ justifyContent: 'center', textAlign: 'center' }}>
          <CFormLabel style={{ fontWeight: 'bold', fontSize: '1rem' }}>
            {responseMessage}
          </CFormLabel>
          <br />
          {responseType && (
            <CIcon
              icon={cilCheckCircle}
              style={{ color: 'green', width: '5rem', height: '5rem' }}
            />
          )}
          {!responseType && (
            <CIcon icon={cilXCircle} style={{ color: 'red', width: '3rem', height: '3rem' }} />
          )}
        </CModalBody>
        <CModalFooter style={{ justifyContent: 'center' }}>
          <CButton color="success" className="text-white" onClick={() => window.location.reload()}>
            Tutup
          </CButton>
        </CModalFooter>
      </CModal>
      {/* MODAL RESPONSE */}
    </CCard>
  )
}

export default Customer

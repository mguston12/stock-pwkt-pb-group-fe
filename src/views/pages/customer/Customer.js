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

const Sekretariat = () => {
  const [listCustomer, setListCustomer] = useState([])
  const [inputSearch, setInputSearch] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('')
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

  useEffect(() => {
    setSelectedCompany(JSON.parse(decodeURIComponent(sessionStorage.getItem('PT'))))
  }, [])

  useEffect(() => {
    if (selectedCompany === '' || selectedCompany === undefined) {
      setModalOpen(true)
    } else {
      GetCustomers()
    }
  }, [selectedCompany])

  const GetCustomers = () => {
    setIsLoading(true)
    const url = `http://localhost:8080/customers?company=${selectedCompany.value}&page=${currentPage}&length=${itemsPerPage}`

    axios
      .get(url)
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
        // Handle error state or message
      })
  }

  const SearchCustomer = () => {
    setIsLoading(true)
    const url = `http://localhost:8080/customers?keyword=${inputSearch}&company=${selectedCompany.value}&page=${currentPage}&length=${itemsPerPage}`

    axios
      .get(url)
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
      alamat_customer: singleData.alamat_customer,
      pic: singleData.pic,
      penandatangan: singleData.penandatangan,
      jabatan: singleData.jabatan,
      no_telp: singleData.no_telp,
      updated_by: userID,
    }
    var url = `http://localhost:8080/customers/update`

    axios
      .put(url, obj)
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

  useEffect(() => {
    if (inputSearch.trim() !== '') {
      SearchCustomer()
    } else {
      GetCustomers()
    }
  }, [currentPage])

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
            <Link to={`/customer/create`} className="btn btn-block btn-success text-white">
              Tambah Customer
            </Link>
          </CCol>
        </CRow>
        <CRow className="mt-3">
          <CCol md={10}>
            <CFormInput
              placeholder="Input Nomor Kontrak atau Nama Customer lalu Tekan Enter atau Tekan Cari"
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
                  <CTableHeaderCell className="text-center">ID Customer</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Nama Customer</CTableHeaderCell>
                  <CTableHeaderCell className="text-center" width="20%">
                    Alamat
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">PIC</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Penandatangan</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Jabatan</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Contact</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {listCustomer.map((item, index) => (
                  <CTableRow key={index} className="text-center">
                    <CTableDataCell>{item.id_customer}</CTableDataCell>
                    <CTableDataCell>{item.nama_customer}</CTableDataCell>
                    <CTableDataCell>{item.alamat_customer}</CTableDataCell>
                    <CTableDataCell>{item.pic}</CTableDataCell>
                    <CTableDataCell>{item.penandatangan}</CTableDataCell>
                    <CTableDataCell>{item.jabatan}</CTableDataCell>
                    <CTableDataCell>{item.no_telp}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        className="btn btn-warning btn-sm text-white"
                        onClick={() => handleModalEdit(item)}
                      >
                        UBAH
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
                value={singleData.alamat_customer}
                onChange={(e) => setSingleData({ ...singleData, alamat_customer: e.target.value })}
              ></CFormTextarea>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>PIC</CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={singleData.pic}
                onChange={(e) => setSingleData({ ...singleData, pic: e.target.value })}
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Penandatangan
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={singleData.penandatangan}
                onChange={(e) => setSingleData({ ...singleData, penandatangan: e.target.value })}
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>Jabatan</CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={singleData.jabatan}
                onChange={(e) => setSingleData({ ...singleData, jabatan: e.target.value })}
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>Contact</CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={singleData.no_telp}
                onChange={(e) => setSingleData({ ...singleData, no_telp: e.target.value })}
              ></CFormInput>
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

export default Sekretariat

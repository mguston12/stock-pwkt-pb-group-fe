import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CPagination,
  CPaginationItem,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CForm,
} from '@coreui/react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Supplier = () => {
  const token = localStorage.getItem('token')
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8082'

  const [listSupplier, setListSupplier] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [inputSearch, setInputSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const itemsPerPage = 10
  const maxVisiblePages = 3

  const [type, setType] = useState('')
  const [inputSupplierName, setInputSupplierName] = useState('')
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const [modalResponseIsOpen, setModalResponseIsOpen] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [responseType, setResponseType] = useState(false)

  useEffect(() => {
    SearchSupplier()
  }, [currentPage])

  const SearchSupplier = () => {
    setIsLoading(true)
    const url = `${apiUrl}/suppliers?keyword=${inputSearch}&page=${currentPage}&length=${itemsPerPage}`

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const { data, metadata } = response.data
        setListSupplier(data || [])
        setTotalPage(metadata || 1)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error(error)
        alert('Error searching suppliers: ' + error.message)
        setIsLoading(false)
        setListSupplier([])
        setTotalPage(1)
      })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(1)
      SearchSupplier()
    }
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

  function createSupplier() {
    setIsLoading(true)
    var obj = {
      nama_supplier: inputSupplierName,
    }
    var url = `${apiUrl}/suppliers/create`

    axios
      .post(url, obj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        SearchSupplier()
        if (response.data.error.status === true) {
          setIsLoading(false)
          setResponseType(false)
          setResponseMessage(response.data.error.msg)
          setModalResponseIsOpen(true)
        } else {
          setIsLoading(false)
          setResponseType(true)
          setResponseMessage('Berhasil Membuat Supplier Baru')
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

  function updateSupplier() {
    setIsLoading(true)
    var obj = {
      id_supplier: supplierID,
      nama_supplier: inputSupplierName,
    }
    var url = `${apiUrl}/suppliers/update`

    axios
      .put(url, obj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        SearchSupplier()
        if (response.data.error.status === true) {
          console.log('Gagal Update Supplier', response)
          setIsLoading(false)
          setResponseType(false)
          setResponseMessage(response.data.error.msg)
          setModalResponseIsOpen(true)
        } else {
          setIsLoading(false)
          console.log('Berhasil Update Supplier', response)
          setResponseType(true)
          setResponseMessage('Berhasil Update Supplier')
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

  const handleModal = (tipe, data) => {
    if (tipe === 'Add') {
      setInputSupplierName('')
    } else if (tipe === 'Edit') {
      setInputSupplierName(data.nama_supplier)
    }
    setModalIsOpen(!modalIsOpen)
    setType(tipe)
  }

  const handleCreateOrEdit = (type) => {
    setModalIsOpen(!modalIsOpen)
    if (type === 'Add') {
      createSupplier()
    } else if (type === 'Edit') {
      updateSupplier()
    }
  }

  return (
    <CCard>
      <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>
        <CRow>
          <CCol>List Supplier</CCol>
          <CCol className="d-grid gap-2" md={2}>
            <CButton
              className="btn-block text-white"
              color="dark"
              onClick={() => handleModal('Add')}
            >
              Tambah Supplier
            </CButton>
          </CCol>
        </CRow>
        <CRow className="mt-3">
          <CCol md={10}>
            <CFormInput
              placeholder="Input Nama Supplier lalu Tekan Enter atau Tekan Cari"
              style={{ display: 'inline' }}
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </CCol>
          <CCol className="d-grid gap-2" md={2}>
            <CButton className="btn-block text-white" color="info" onClick={SearchSupplier}>
              Cari
            </CButton>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        {listSupplier.length === 0 && !isLoading && (
          <CCol style={{ textAlign: 'center' }}>Maaf Data Tidak Ditemukan</CCol>
        )}
        {listSupplier.length > 0 && (
          <CCol>
            <CTable striped bordered hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="text-center">ID Supplier</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Nama Supplier</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {listSupplier.map((item, index) => (
                  <CTableRow key={index} className="text-center">
                    <CTableDataCell>{item.id_supplier}</CTableDataCell>
                    <CTableDataCell>{item.nama_supplier}</CTableDataCell>
                    <CTableDataCell>
                      <Link
                        to={`/supplier/detail/${item.id_supplier}`}
                        className="btn btn-primary btn-sm text-white"
                      >
                        Detail
                      </Link>
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
      <CModal size="lg" alignment="center" visible={modalIsOpen} backdrop="static">
        <CModalBody style={{ justifyContent: 'center' }}>
          <CFormLabel style={{ fontWeight: 'bold', fontSize: '20px', paddingTop: '8px' }}>
            {type === 'Add' ? 'Tambah' : 'Ubah Data'} Supplier
          </CFormLabel>
          <hr />
          {type === 'Edit' && (
            <CRow className="mt-3">
              <CCol>
                <CForm>
                  <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                    ID Supplier
                  </CFormLabel>
                </CForm>
              </CCol>
              <CCol>
                <CFormInput
                  value={supplierID}
                  disabled={type !== 'Add'}
                  onChange={(e) => setSupplierID(e.target.value)}
                ></CFormInput>
              </CCol>
            </CRow>
          )}
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Nama Supplier
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={inputSupplierName}
                onChange={(e) => setInputSupplierName(e.target.value)}
              ></CFormInput>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter style={{ justifyContent: 'center' }}>
          <CButton
            color="success"
            className="text-white"
            disabled={inputSupplierName === ''}
            onClick={() => handleCreateOrEdit(type)}
          >
            {type === 'Add' ? 'Tambah Supplier' : 'Ubah Data Supplier'}
          </CButton>
          <CButton color="danger" className="text-white" onClick={() => setModalIsOpen(false)}>
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
    </CCard>
  )
}

export default Supplier

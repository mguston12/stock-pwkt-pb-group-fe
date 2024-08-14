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
} from '@coreui/react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Sekretariat = () => {
  const [listContract, setListContract] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [inputSearch, setInputSearch] = useState('')
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const itemsPerPage = 5
  const maxVisiblePages = 3

  useEffect(() => {
    const company = JSON.parse(decodeURIComponent(sessionStorage.getItem('PT')))
    setSelectedCompany(company)
  }, [])

  useEffect(() => {
    if (selectedCompany?.value) {
      GetContracts(1)
    }
  }, [selectedCompany])

  const GetContracts = (page) => {
    if (selectedCompany) {
      setIsLoading(true)
      const url = `http://192.168.88.250:8080/contracts?company=${selectedCompany.value}&page=${page}&length=${itemsPerPage}`

      axios
        .get(url)
        .then((response) => {
          setIsLoading(false)
          const { data, metadata } = response.data
          setListContract(data || [])
          setTotalPage(metadata || 1)
        })
        .catch((error) => {
          console.error(error)
          alert('Error fetching contracts: ' + error.message)
          setIsLoading(false)
          setListContract([])
          setTotalPage(1)
        })
    }
  }

  const SearchContract = () => {
    if (selectedCompany) {
      setIsLoading(true)
      const url = `http://192.168.88.250:8080/contracts?keyword=${inputSearch}&company=${selectedCompany.value}&page=${page}&length=${itemsPerPage}`

      axios
        .get(url)
        .then((response) => {
          const { data, metadata } = response.data
          setListContract(data || [])
          setTotalPage(metadata || 1)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error(error)
          alert('Error searching contracts: ' + error.message)
          setIsLoading(false)
          setListContract([])
          setTotalPage(1)
        })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      SearchContract()
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPage) return // Prevent out-of-bounds page numbers

    setCurrentPage(newPage)

    if (inputSearch.trim()) {
      SearchContract(newPage)
    } else {
      GetContracts(newPage)
    }
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
    <CCard>
      <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>
        <CRow>
          <CCol>List Kontrak</CCol>
          <CCol className="d-grid gap-2" md={2}>
            <Link to={`/contract/create`} className="btn btn-block btn-success text-white">
              Buat Kontrak Baru
            </Link>
          </CCol>
        </CRow>
        <CRow className="mt-3">
          <CCol md={10}>
            <CFormInput
              placeholder="Input Nama Perusahaan lalu Tekan Enter atau Tekan Cari"
              style={{ display: 'inline' }}
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </CCol>
          <CCol className="d-grid gap-2" md={2}>
            <CButton className="btn-block text-white" color="info" onClick={SearchContract}>
              Cari
            </CButton>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        {listContract.length === 0 && !isLoading && (
          <CCol style={{ textAlign: 'center' }}>Maaf Data Tidak Ditemukan</CCol>
        )}
        {listContract.length > 0 && (
          <CCol>
            <CTable striped bordered hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="text-center">No. Kontrak</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Customer</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Tanggal Buat</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {listContract.map((item, index) => (
                  <CTableRow key={index} className="text-center">
                    <CTableDataCell>{item.no_kontrak}</CTableDataCell>
                    <CTableDataCell>{item.nama_customer}</CTableDataCell>
                    <CTableDataCell>{item.tanggal_buat}</CTableDataCell>
                    <CTableDataCell>
                      <Link
                        to={`/contract/detail/${item.no_kontrak.replace(/\//g, '-')}`}
                        className="btn btn-warning btn-sm text-white"
                        disabled
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

export default Sekretariat

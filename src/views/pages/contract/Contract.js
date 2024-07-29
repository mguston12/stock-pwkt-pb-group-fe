import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CFormInput,
  CPagination,
  CPaginationItem,
  CRow,
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
  const [selectedCompany, setSelectedCompany] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const itemsPerPage = 5
  const maxVisiblePages = 3

  useEffect(() => {
    setSelectedCompany(JSON.parse(decodeURIComponent(sessionStorage.getItem('PT'))))
  }, [])

  useEffect(() => {
    if (selectedCompany !== '' || selectedCompany !== undefined) {
      GetContracts()
    }
  }, [selectedCompany, currentPage])

  useEffect(() => {
    console.log('total', totalPage)
  }, [totalPage])

  const GetContracts = () => {
    setIsLoading(true)
    const url = `http://http://192.168.88.70:8080:8080/contracts?company=${selectedCompany.value}&page=${currentPage}&length=${itemsPerPage}`

    axios
      .get(url)
      .then((response) => {
        console.log(response)
        setIsLoading(false)
        if (response.data.data !== null) {
          setListContract(response.data.data)
          setTotalPage(response.data.metadata)
        } else {
          setListContract([])
          setTotalPage(1)
        }
      })
      .catch((error) => {
        alert(error.message)
        setIsLoading(false)
        setTotalPage(1)
      })
  }

  const SearchContract = () => {
    setIsLoading(true)
    const url = `http://http://192.168.88.70:8080:8080/contracts?keyword=${inputSearch}&company=${selectedCompany.value}&page=${currentPage}&length=${itemsPerPage}`

    axios
      .get(url)
      .then((response) => {
        if (response.data.data !== null) {
          setListContract(response.data.data)
          setTotalPage(response.data.metadata)
        } else {
          setListContract([])
          setTotalPage(1)
        }
        setIsLoading(false)
      })
      .catch((error) => {
        alert(error.message)
        setTotalPage(1)
        setIsLoading(false)
      })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      SearchContract()
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPage) return // Prevent out-of-bounds page numbers

    setCurrentPage(newPage)

    if (inputSearch.trim() !== '') {
      SearchContract()
    } else {
      GetContracts()
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
        {listContract.length === 0 && (
          <CCol style={{ textAlign: 'center' }}>Maaf Data Tidak Ditemukan</CCol>
        )}
        {listContract.length !== 0 && (
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
    </CCard>
  )
}

export default Sekretariat

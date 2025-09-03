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
import { formatDateWIB } from '../../../utils/date'

const SparepartHistory = () => {
  const token = localStorage.getItem('token')
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081'

  const [listSparepartHistory, setListSparepartHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [inputTeknisi, setInputTeknisi] = useState('')
  const [inputMesin, setInputMesin] = useState('')
  const [inputSparepart, setInputSparepart] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const itemsPerPage = 10
  const maxVisiblePages = 3

  useEffect(() => {
    SearchSparepartHistory()
  }, [currentPage])

  const SearchSparepartHistory = () => {
    setIsLoading(true)
    const url = `${apiUrl}/histories?teknisi=${inputTeknisi}&mesin=${inputMesin}&sparepart=${inputSparepart}&page=${currentPage}&length=${itemsPerPage}`

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const { data, metadata } = response.data
        setListSparepartHistory(data || [])
        setTotalPage(metadata || 1)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error(error)
        alert('Error searching machines: ' + error.message)
        setIsLoading(false)
        setListSparepartHistory([])
        setTotalPage(1)
      })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(1)
      SearchSparepartHistory()
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

  // Fungsi untuk menampilkan angka dengan titik
  const formatRibuan = (angka) => {
    if (!angka) return ''
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  return (
    <CCard>
      <CCardHeader>
        <CRow>
          <CCol style={{ fontSize: '20px', fontWeight: 'bold' }}>
            List History Penggunaan Sparepart
          </CCol>
        </CRow>
        <CRow>
          <CCol md={4}>
            <CRow>
              <CCol className="mt-3" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                ID Mesin
              </CCol>
            </CRow>
            <CRow className="mt-2">
              <CCol>
                <CFormInput
                  placeholder="Input ID Mesin"
                  style={{ display: 'inline' }}
                  value={inputMesin}
                  onChange={(e) => setInputMesin(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </CCol>
            </CRow>
          </CCol>
          <CCol md={4}>
            <CRow>
              <CCol className="mt-3" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                ID Teknisi
              </CCol>
            </CRow>
            <CRow className="mt-2">
              <CCol>
                <CFormInput
                  placeholder="Input ID Teknisi"
                  style={{ display: 'inline' }}
                  value={inputTeknisi}
                  onChange={(e) => setInputTeknisi(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </CCol>
            </CRow>
          </CCol>
          <CCol md={3}>
            <CRow>
              <CCol className="mt-3" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                ID Sparepart
              </CCol>
            </CRow>
            <CRow className="mt-2">
              <CCol>
                <CFormInput
                  placeholder="Input ID Sparepart"
                  style={{ display: 'inline' }}
                  value={inputSparepart}
                  onChange={(e) => setInputSparepart(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </CCol>
            </CRow>
          </CCol>
          <CCol className="d-grid gap-2 mt-2" md={1}>
            <CRow></CRow>
            <CRow>
              <CButton
                className="btn-block text-white"
                color="info"
                onClick={SearchSparepartHistory}
              >
                Cari
              </CButton>
            </CRow>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        {listSparepartHistory.length === 0 && !isLoading && (
          <CCol style={{ textAlign: 'center' }}>Maaf Data Tidak Ditemukan</CCol>
        )}
        {listSparepartHistory.length > 0 && (
          <CCol>
            <CTable striped bordered hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="text-center">ID Mesin</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Nama Teknisi</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Sparepart</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Counter</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Tanggal Penggunaan</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {listSparepartHistory.map((item, index) => (
                  <CTableRow key={index} className="text-center">
                    <CTableDataCell>{item.id_machine}</CTableDataCell>
                    <CTableDataCell>
                      {item.id_teknisi} - {item.nama_teknisi}
                    </CTableDataCell>
                    <CTableDataCell>
                      {item.quantity} ({item.id_sparepart} - {item.nama_sparepart})
                    </CTableDataCell>
                    <CTableDataCell>{formatRibuan(item.counter)}</CTableDataCell>
                    <CTableDataCell>{formatDateWIB(item.updated_at)}</CTableDataCell>
                    <CTableDataCell>
                      {/* <Link
                        to={`/machine/detail/${item.id_machine}`}
                        className="btn btn-primary btn-sm text-white"
                      >
                        Detail
                      </Link> */}
                      <a
                        href={`/machine/detail/${item.id_machine}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm text-white"
                      >
                        Detail
                      </a>
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

export default SparepartHistory

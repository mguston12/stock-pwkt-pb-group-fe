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

const SparepartHistoryTeknisi = () => {
  const token = sessionStorage.getItem('token')
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

  const userID = sessionStorage.getItem('user')

  useEffect(() => {
    SearchSparepartHistory()
  }, [currentPage])

  const SearchSparepartHistory = () => {
    setIsLoading(true)
    const url = `${apiUrl}/histories?teknisi=${userID}&page=${currentPage}&length=${itemsPerPage}`

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
                  <CTableHeaderCell className="text-center">Nama Customer</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Sparepart</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Tanggal Penggunaan</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {listSparepartHistory.map((item, index) => (
                  <CTableRow key={index} className="text-center">
                    <CTableDataCell>{item.nama_customer}</CTableDataCell>
                    <CTableDataCell>
                      {item.quantity} - {item.nama_sparepart}
                    </CTableDataCell>
                    <CTableDataCell>{formatDateWIB(item.updated_at)}</CTableDataCell>
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

export default SparepartHistoryTeknisi

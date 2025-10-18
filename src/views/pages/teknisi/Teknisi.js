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

const Teknisi = () => {
  const token = localStorage.getItem('token')
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8082'

  const [listTeknisi, setListTeknisi] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [inputSearch, setInputSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const itemsPerPage = 5
  const maxVisiblePages = 3
  const [type, setType] = useState('')
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const [modalResponseIsOpen, setModalResponseIsOpen] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [responseType, setResponseType] = useState(false)
  const [inputTeknisiName, setInputTeknisiName] = useState('')
  const [inputIDTeknisi, setInputIDTeknisi] = useState('')

  useEffect(() => {
    GetTeknisi()
  }, [currentPage])

  const GetTeknisi = () => {
    setIsLoading(true)
    const url = `${apiUrl}/teknisi`

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setIsLoading(false)
        const { data, metadata } = response.data
        setListTeknisi(data || [])
        setTotalPage(metadata || 1)
      })
      .catch((error) => {
        console.error(error)
        alert('Error fetching teknisi: ' + error.message)
        setIsLoading(false)
        setListTeknisi([])
        setTotalPage(1)
      })
  }

  const SearchTeknisi = () => {
    setIsLoading(true)
    const url = `${apiUrl}/teknisi?keyword=${inputSearch}&page=${currentPage}&length=${itemsPerPage}`

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const { data, metadata } = response.data
        setListTeknisi(data || [])
        setTotalPage(metadata || 1)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error(error)
        alert('Error searching teknisi: ' + error.message)
        setIsLoading(false)
        setListTeknisi([])
        setTotalPage(1)
      })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(1)
      SearchTeknisi()
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

  function createTeknisi() {
    setIsLoading(true)
    var obj = {
      id_teknisi: inputIDTeknisi,
      nama_teknisi: inputTeknisiName,
      active_yn: 'Y',
    }
    var url = `${apiUrl}/teknisi/create`

    axios
      .post(url, obj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        SearchTeknisi()
        if (response.data.error.status === true) {
          setIsLoading(false)
          setResponseType(false)
          setResponseMessage(response.data.error.msg)
          setModalResponseIsOpen(true)
        } else {
          setIsLoading(false)
          setResponseType(true)
          setResponseMessage('Berhasil Membuat Teknisi Baru')
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

  function updateTeknisi() {
    setIsLoading(true)
    var obj = {
      id_teknisi: teknisiID,
      nama_teknisi: inputTeknisiName,
    }
    var url = `${apiUrl}/teknisi/update`

    axios
      .put(url, obj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        SearchTeknisi()
        if (response.data.error.status === true) {
          console.log('Gagal Update Teknisi', response)
          setIsLoading(false)
          setResponseType(false)
          setResponseMessage(response.data.error.msg)
          setModalResponseIsOpen(true)
        } else {
          setIsLoading(false)
          console.log('Berhasil Update Teknisi', response)
          setResponseType(true)
          setResponseMessage('Berhasil Update Teknisi')
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
      setInputTeknisiName('')
    } else if (tipe === 'Edit') {
      setInputTeknisiName(data.nama_teknisi)
    }
    setModalIsOpen(!modalIsOpen)
    setType(tipe)
  }

  const handleCreateOrEdit = (type) => {
    setModalIsOpen(!modalIsOpen)
    if (type === 'Add') {
      createTeknisi()
    } else if (type === 'Edit') {
      updateTeknisi()
    }
  }

  return (
    <CCard>
      <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>
        <CRow>
          <CCol>List Teknisi</CCol>
          <CCol className="d-grid gap-2" md={2}>
            <CButton
              className="btn-block text-white"
              color="dark"
              onClick={() => handleModal('Add')}
            >
              Tambah Teknisi
            </CButton>
          </CCol>
        </CRow>
        {/* <CRow className="mt-3">
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
            <CButton className="btn-block text-white" color="info" onClick={SearchTeknisi}>
              Cari
            </CButton>
          </CCol>
        </CRow> */}
      </CCardHeader>
      <CCardBody>
        {listTeknisi.length === 0 && !isLoading && (
          <CCol style={{ textAlign: 'center' }}>Maaf Data Tidak Ditemukan</CCol>
        )}
        {listTeknisi.length > 0 && (
          <CCol>
            <CTable striped bordered hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="text-center">ID Teknisi</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Nama Teknisi</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {listTeknisi.map((item, index) => (
                  <CTableRow key={index} className="text-center">
                    <CTableDataCell>{item.id_teknisi}</CTableDataCell>
                    <CTableDataCell>{item.nama_teknisi}</CTableDataCell>
                    <CTableDataCell>
                      <Link
                        to={`/teknisi/detail/${item.id_teknisi}`}
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
      <CModal size="lg" alignment="center" visible={modalIsOpen} backdrop="static">
        <CModalBody style={{ justifyContent: 'center' }}>
          <CFormLabel style={{ fontWeight: 'bold', fontSize: '20px', paddingTop: '8px' }}>
            {type === 'Add' ? 'Tambah' : 'Ubah Data'} Teknisi
          </CFormLabel>
          <hr />
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  ID Teknisi
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={inputIDTeknisi}
                onChange={(e) => setInputIDTeknisi(e.target.value)}
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Nama Teknisi
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={inputTeknisiName}
                onChange={(e) => setInputTeknisiName(e.target.value)}
              ></CFormInput>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter style={{ justifyContent: 'center' }}>
          <CButton
            color="success"
            className="text-white"
            disabled={inputTeknisiName === ''}
            onClick={() => handleCreateOrEdit(type)}
          >
            {type === 'Add' ? 'Tambah Teknisi' : 'Ubah Data Teknisi'}
          </CButton>
          <CButton color="danger" className="text-white" onClick={() => setModalIsOpen(false)}>
            Batal
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default Teknisi

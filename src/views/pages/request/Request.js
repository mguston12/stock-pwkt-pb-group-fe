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
  CModalHeader,
  CModalTitle,
  CNav,
  CNavItem,
  CNavLink,
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
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilXCircle } from '@coreui/icons'
import { Link } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'

const Request = () => {
  const [listRequest, setListRequest] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [inputSearch, setInputSearch] = useState('')
  const [type, setType] = useState('')
  //   const [selectedCompany, setSelectedCompany] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [status, setStatus] = useState('')
  const itemsPerPage = 10
  const maxVisiblePages = 3

  const userID = sessionStorage.getItem('user')

  const [data, setData] = useState({
    id_request: 0,
    id_teknisi: '',
    nama_teknisi: '',
    id_mesin: '',
    tipe_machine: '',
    id_sparepart: '',
    nama_sparepart: '',
    quantity: 0,
    status_request: '',
    tanggal_request: '',
    updated_by: '',
    updated_at: '',
    nama_customer: '',
  })

  const [modalResponseIsOpen, setModalResponseIsOpen] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [responseType, setResponseType] = useState(false)

  useEffect(() => {
    if (userID !== 'admin') {
      SearchRequest()
    } else {
      SearchRequestAdmin()
    }
  }, [currentPage, userID, status])

  const SearchRequestAdmin = () => {
    setIsLoading(true)

    const url = `http://192.168.88.250:8081/requests?status=${status}&page=${currentPage}&length=${itemsPerPage}`

    axios
      .get(url)
      .then((response) => {
        const { data, metadata } = response.data
        setListRequest(data || [])
        setTotalPage(metadata || 1)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error(error)
        alert('Error searching machines: ' + error.message)
        setIsLoading(false)
        setListRequest([])
        setTotalPage(1)
      })
  }

  const SearchRequest = () => {
    setIsLoading(true)

    const url = `http://192.168.88.250:8081/requests?keyword=${userID}&status=${status}&page=${currentPage}&length=${itemsPerPage}`

    axios
      .get(url)
      .then((response) => {
        const { data, metadata } = response.data
        setListRequest(data || [])
        setTotalPage(metadata || 1)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error(error)
        alert('Error searching machines: ' + error.message)
        setIsLoading(false)
        setListRequest([])
        setTotalPage(1)
      })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(1)
      SearchRequest()
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
        <CPaginationItem
          key={i}
          active={i === currentPage}
          style={{ cursor: 'pointer' }}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </CPaginationItem>,
      )
    }

    return pages
  }

  const handleModal = (tipe, data) => {
    setData(data)
    setType(tipe)
    setModalIsOpen(!modalIsOpen)
  }

  function updateRequest(status) {
    setIsLoading(true)
    var obj = {
      id_teknisi: data.id_teknisi,
      id_mesin: data.id_mesin,
      id_sparepart: data.id_sparepart,
      quantity: parseInt(data.quantity),
      status_request: status,
      updated_by: userID,
      id_request: parseInt(data.id_request),
    }
    var url = `http://192.168.88.250:8081/requests/update`

    axios
      .put(url, obj)
      .then((response) => {
        if (response.data.error.status === true) {
          console.log('Gagal Update Request', response)
          setIsLoading(false)
          setResponseType(false)
          setResponseMessage(response.data.error.msg)
          setModalResponseIsOpen(true)
        } else {
          setIsLoading(false)
          console.log('Berhasil Update Request', response)
          setResponseType(true)
          setResponseMessage('Berhasil Update Request')
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

  return (
    <CCard>
      <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>
        <CRow>
          <CCol>List Request</CCol>
          {userID !== 'admin' && (
            <CCol className="d-grid gap-2" sm={6} md={2}>
              <Link to={`/request/create`} className="btn btn-block btn-info text-white">
                Request Sparepart
              </Link>
            </CCol>
          )}
        </CRow>
        <CNav variant="tabs">
          <CNavItem>
            <CNavLink
              active={status === ''}
              onClick={() => setStatus('')}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f0f0f0'
                e.target.style.color = '#007bff'
                e.target.style.cursor = 'pointer'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = ''
                e.target.style.color = ''
                e.target.style.cursor = ''
              }}
            >
              Semua Request
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={status === 'Request'}
              onClick={() => setStatus('Request')}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f0f0f0'
                e.target.style.color = '#007bff'
                e.target.style.cursor = 'pointer'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = ''
                e.target.style.color = ''
                e.target.style.cursor = ''
              }}
            >
              Request
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={status === 'Disetujui'}
              onClick={() => setStatus('Disetujui')}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f0f0f0'
                e.target.style.color = '#007bff'
                e.target.style.cursor = 'pointer'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = ''
                e.target.style.color = ''
                e.target.style.cursor = ''
              }}
            >
              Disetujui
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={status === 'Ditolak'}
              onClick={() => setStatus('Ditolak')}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f0f0f0'
                e.target.style.color = '#007bff'
                e.target.style.cursor = 'pointer'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = ''
                e.target.style.color = ''
                e.target.style.cursor = ''
              }}
            >
              Ditolak
            </CNavLink>
          </CNavItem>
        </CNav>
      </CCardHeader>
      <CCardBody>
        {listRequest.length === 0 && !isLoading && (
          <CCol style={{ textAlign: 'center' }}>Maaf Data Tidak Ditemukan</CCol>
        )}
        {listRequest.length > 0 && (
          <CCol>
            <CTable striped bordered hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="text-center">Kode Request</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Request</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Untuk</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                  {userID === 'admin' && (
                    <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                  )}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {listRequest.map((item, index) => (
                  <CTableRow key={index} className="text-center">
                    <CTableDataCell>{item.id_request}</CTableDataCell>
                    <CTableDataCell>
                      {item.nama_teknisi} - {item.quantity} {item.nama_sparepart}
                    </CTableDataCell>
                    <CTableDataCell>
                      {item.nama_customer !== '' ? item.nama_customer : 'Persediaan'}
                    </CTableDataCell>
                    <CTableDataCell>
                      {item.status_request === 'Disetujui' && (
                        <CButton color="success" className="btn-sm text-white">
                          {item.status_request}
                        </CButton>
                      )}{' '}
                      {item.status_request === 'Request' && (
                        <CButton color="secondary" className="btn-sm text-white">
                          {item.status_request}
                        </CButton>
                      )}
                      {item.status_request === 'Ditolak' && (
                        <CButton color="danger" className="btn-sm text-white">
                          {item.status_request}
                        </CButton>
                      )}
                    </CTableDataCell>
                    {userID === 'admin' && (
                      <CTableDataCell>
                        {item.status_request === 'Request' && (
                          <CButton
                            className="btn btn-warning btn-sm text-white"
                            onClick={() => handleModal('Edit', item)}
                          >
                            Ubah
                          </CButton>
                        )}
                        {(item.status_request === 'Disetujui' ||
                          item.status_request === 'Ditolak') && (
                          <CButton
                            className="btn btn-info btn-sm text-white"
                            onClick={() => handleModal('Detail', item)}
                          >
                            Detail
                          </CButton>
                        )}
                      </CTableDataCell>
                    )}
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            {totalPage > 1 && (
              <CPagination align="center">
                <CPaginationItem
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{ cursor: 'pointer' }}
                >
                  Previous
                </CPaginationItem>
                {renderPaginationItems()}

                <CPaginationItem
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPage}
                  style={{ cursor: 'pointer' }}
                >
                  Next
                </CPaginationItem>
              </CPagination>
            )}
          </CCol>
        )}
      </CCardBody>
      {type === 'Edit' && (
        <CModal size="lg" alignment="center" visible={modalIsOpen} backdrop="static">
          <CModalHeader>
            <CModalTitle style={{ fontWeight: 'bold', fontSize: '20px', paddingTop: '8px' }}>
              Ubah Data Request
            </CModalTitle>
          </CModalHeader>
          <CModalBody style={{ justifyContent: 'center' }}>
            {/* <CFormLabel style={{ fontWeight: 'bold', fontSize: '20px', paddingTop: '8px' }}>
              Ubah Data Request
            </CFormLabel> */}
            <CRow className="mt-3">
              <CCol>
                <CForm>
                  <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                    ID Request
                  </CFormLabel>
                </CForm>
              </CCol>
              <CCol>
                <CFormInput value={data.id_request} disabled></CFormInput>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter style={{ justifyContent: 'center' }}>
            <CButton
              color="success"
              className="text-white"
              onClick={() => updateRequest('Disetujui')}
            >
              SETUJU
            </CButton>
            <CButton color="danger" className="text-white" onClick={() => updateRequest('Ditolak')}>
              TOLAK
            </CButton>
          </CModalFooter>
        </CModal>
      )}
      {type === 'Detail' && (
        <CModal size="lg" alignment="center" visible={modalIsOpen} backdrop="static">
          <CModalBody style={{ justifyContent: 'center' }}>
            <CFormLabel style={{ fontWeight: 'bold', fontSize: '20px', paddingTop: '8px' }}>
              Detail Request
            </CFormLabel>
            <hr />
            <CRow className="mt-3">
              <CCol>
                <CForm>
                  <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                    ID Request
                  </CFormLabel>
                </CForm>
              </CCol>
              <CCol>
                <CFormInput value={data.id_request} disabled></CFormInput>
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol>
                <CForm>
                  <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                    Kode & Nama Teknisi
                  </CFormLabel>
                </CForm>
              </CCol>
              <CCol>
                <CFormInput
                  value={`${data.id_teknisi} - ${data.nama_teknisi}`}
                  disabled
                ></CFormInput>
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol>
                <CForm>
                  <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                    Digunakan untuk
                  </CFormLabel>
                </CForm>
              </CCol>
              <CCol>
                <CFormInput
                  value={
                    data.id_mesin && data.tipe_machine
                      ? `${data.id_mesin} - ${data.tipe_machine}`
                      : `Persediaan`
                  }
                  disabled
                ></CFormInput>
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol>
                <CForm>
                  <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                    Sparepart
                  </CFormLabel>
                </CForm>
              </CCol>
              <CCol>
                <CFormInput value={`${data.quantity} ${data.nama_sparepart}`} disabled></CFormInput>
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol>
                <CForm>
                  <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>Status</CFormLabel>
                </CForm>
              </CCol>
              <CCol>
                <CFormInput value={`${data.status_request}`} disabled></CFormInput>
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol>
                <CForm>
                  <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                    Update Terakhir Tanggal
                  </CFormLabel>
                </CForm>
              </CCol>
              <CCol>
                <CFormInput
                  value={moment(data.updated_at).format('DD MMM YYYY')}
                  disabled
                ></CFormInput>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter style={{ justifyContent: 'center' }}>
            <CButton color="success" className="text-white" onClick={() => setModalIsOpen(false)}>
              Tutup
            </CButton>
          </CModalFooter>
        </CModal>
      )}

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

export default Request

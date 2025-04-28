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
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilXCircle } from '@coreui/icons'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Request = () => {
  const [listRequest, setListRequest] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [inputSearch, setInputSearch] = useState('')
  const [type, setType] = useState('')
  //   const [selectedCompany, setSelectedCompany] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const itemsPerPage = 10
  const maxVisiblePages = 3
  const [requestID, setRequestID] = useState('')
  const [requestName, setRequestName] = useState('')
  const [quantity, setQuantity] = useState(0)

  const [modalResponseIsOpen, setModalResponseIsOpen] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [responseType, setResponseType] = useState(false)

  useEffect(() => {
    SearchRequest()
  }, [currentPage])

  //   const GetRequests = () => {
  //     setIsLoading(true)
  //     const url = `http://192.168.88.250:8081/requests`

  //     axios
  //       .get(url)
  //       .then((response) => {
  //         setIsLoading(false)
  //         const { data, metadata } = response.data
  //         setListRequest(data || [])
  //         setTotalPage(metadata || 1)
  //       })
  //       .catch((error) => {
  //         console.error(error)
  //         alert('Error fetching machines: ' + error.message)
  //         setIsLoading(false)
  //         setListRequest([])
  //         setTotalPage(1)
  //       })
  //   }

  const SearchRequest = () => {
    setIsLoading(true)
    const url = `http://192.168.88.250:8081/requests?keyword=${inputSearch}&page=${currentPage}&length=${itemsPerPage}`

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
    if (tipe === 'Add') {
      setRequestID('')
      setRequestName('')
      setQuantity('')
    } else if (tipe === 'Edit') {
      setRequestID(data.id_request)
      setRequestName(data.nama_request)
      setQuantity(data.quantity)
    }

    setType(tipe)
    setModalIsOpen(!modalIsOpen)
  }

  function createRequest() {
    setIsLoading(true)
    var obj = {
      id_request: requestID,
      nama_request: requestName,
      quantity: parseInt(quantity),
    }
    var url = `http://192.168.88.250:8081/requests/create`

    axios
      .post(url, obj)
      .then((response) => {
        SearchRequest()
        if (response.data.error.status === true) {
          setIsLoading(false)
          setResponseType(false)
          setResponseMessage(response.data.error.msg)
          setModalResponseIsOpen(true)
        } else {
          setIsLoading(false)
          setResponseType(true)
          setResponseMessage('Berhasil Membuat Request Baru')
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

  function updateRequest() {
    setIsLoading(true)
    var obj = {
      id_request: requestID,
      nama_request: requestName,
      quantity: parseInt(quantity),
    }
    var url = `http://192.168.88.250:8081/requests/update`

    axios
      .put(url, obj)
      .then((response) => {
        SearchRequest()
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

  const handleCreateOrEdit = (type) => {
    setModalIsOpen(!modalIsOpen)
    if (type === 'Add') {
      createRequest()
    } else {
      updateRequest()
    }
  }

  return (
    <CCard>
      <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>
        <CRow>
          <CCol>List Request</CCol>
          <CCol className="d-grid gap-2" md={2}>
            {/* <Link to={`/machine/create`} className="btn btn-block btn-success text-white">
              Buat Kontrak Baru
            </Link> */}
          </CCol>
        </CRow>
        <CRow className="mt-3">
          <CCol md={10}>
            <CFormInput
              // placeholder="Input Nama Perusahaan lalu Tekan Enter atau Tekan Cari"
              style={{ display: 'inline' }}
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </CCol>
          <CCol className="d-grid gap-2" md={2}>
            <CButton className="btn-block text-white" color="info" onClick={SearchRequest}>
              Cari
            </CButton>
          </CCol>
        </CRow>
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
                  <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {listRequest.map((item, index) => (
                  <CTableRow key={index} className="text-center">
                    <CTableDataCell>{item.id_request}</CTableDataCell>
                    <CTableDataCell>
                      {item.nama_teknisi} - {item.quantity} {item.nama_sparepart}
                    </CTableDataCell>
                    <CTableDataCell>{item.nama_customer}</CTableDataCell>
                    <CTableDataCell>
                      <CButton color="success" className="btn-sm text-white">
                        {item.status_request}
                      </CButton>
                    </CTableDataCell>
                    <CTableDataCell>
                      {item.status_request !== 'Approved' && (
                        <CButton
                          className="btn btn-warning btn-sm text-white"
                          onClick={() => handleModal('Edit', item)}
                        >
                          UBAH
                        </CButton>
                      )}
                      {item.status_request === 'Approved' && (
                        <CButton
                          className="btn btn-warning btn-sm text-white"
                          onClick={() => handleModal('Edit', item)}
                        >
                          Detail
                        </CButton>
                      )}
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
      <CModal size="lg" alignment="center" visible={modalIsOpen} backdrop="static">
        <CModalBody style={{ justifyContent: 'center' }}>
          <CFormLabel style={{ fontWeight: 'bold', fontSize: '20px', paddingTop: '8px' }}>
            {type === 'Add' ? 'Tambah' : 'Ubah Data'} Request
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
              <CFormInput
                value={requestID}
                disabled
                onChange={(e) => setRequestID(e.target.value)}
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Nama Request
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={requestName}
                onChange={(e) => setRequestName(e.target.value)}
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>Quantity</CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              ></CFormInput>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter style={{ justifyContent: 'center' }}>
          <CButton color="success" className="text-white" onClick={() => handleCreateOrEdit(type)}>
            {type === 'Add' ? 'Tambah' : 'Ubah Data'}
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

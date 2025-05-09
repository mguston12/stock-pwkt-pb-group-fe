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

const Sparepart = () => {
  const [listSparepart, setListSparepart] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalPurchaseIsOpen, setModalPurchaseIsOpen] = useState(false)
  const [inputSearch, setInputSearch] = useState('')
  const [type, setType] = useState('')
  //   const [selectedCompany, setSelectedCompany] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const itemsPerPage = 10
  const maxVisiblePages = 3
  const [sparepartID, setSparepartID] = useState('')
  const [sparepartName, setSparepartName] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [pricePerUnit, setPricePerUnit] = useState(0)

  const [modalResponseIsOpen, setModalResponseIsOpen] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [responseType, setResponseType] = useState(false)

  useEffect(() => {
    SearchSparepart()
  }, [currentPage])

  //   const GetSpareparts = () => {
  //     setIsLoading(true)
  //     const url = `http://192.168.88.250:8081/spareparts`

  //     axios
  //       .get(url)
  //       .then((response) => {
  //         setIsLoading(false)
  //         const { data, metadata } = response.data
  //         setListSparepart(data || [])
  //         setTotalPage(metadata || 1)
  //       })
  //       .catch((error) => {
  //         console.error(error)
  //         alert('Error fetching machines: ' + error.message)
  //         setIsLoading(false)
  //         setListSparepart([])
  //         setTotalPage(1)
  //       })
  //   }

  const SearchSparepart = () => {
    setIsLoading(true)
    const url = `http://192.168.88.250:8081/spareparts?keyword=${inputSearch}&page=${currentPage}&length=${itemsPerPage}`

    axios
      .get(url)
      .then((response) => {
        const { data, metadata } = response.data
        setListSparepart(data || [])
        setTotalPage(metadata || 1)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error(error)
        alert('Error searching machines: ' + error.message)
        setIsLoading(false)
        setListSparepart([])
        setTotalPage(1)
      })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(1)
      SearchSparepart()
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
      setSparepartID('')
      setSparepartName('')
      setQuantity('')
      setModalIsOpen(!modalIsOpen)
    } else if (tipe === 'Edit') {
      setSparepartID(data.id_sparepart)
      setSparepartName(data.nama_sparepart)
      setQuantity(data.quantity)
      setModalIsOpen(!modalIsOpen)
    } else if (tipe === 'Purchase') {
      setSparepartID(data.id_sparepart)
      setSparepartName(data.nama_sparepart)
      setQuantity(1)
      setModalPurchaseIsOpen(!modalPurchaseIsOpen)
    }

    setType(tipe)
  }

  function createSparepart() {
    setIsLoading(true)
    var obj = {
      id_sparepart: sparepartID,
      nama_sparepart: sparepartName,
      quantity: parseInt(quantity),
    }
    var url = `http://192.168.88.250:8081/spareparts/create`

    axios
      .post(url, obj)
      .then((response) => {
        SearchSparepart()
        if (response.data.error.status === true) {
          setIsLoading(false)
          setResponseType(false)
          setResponseMessage(response.data.error.msg)
          setModalResponseIsOpen(true)
        } else {
          setIsLoading(false)
          setResponseType(true)
          setResponseMessage('Berhasil Membuat Sparepart Baru')
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

  function updateSparepart() {
    setIsLoading(true)
    var obj = {
      id_sparepart: sparepartID,
      nama_sparepart: sparepartName,
      quantity: parseInt(quantity),
    }
    var url = `http://192.168.88.250:8081/spareparts/update`

    axios
      .put(url, obj)
      .then((response) => {
        SearchSparepart()
        if (response.data.error.status === true) {
          console.log('Gagal Update Sparepart', response)
          setIsLoading(false)
          setResponseType(false)
          setResponseMessage(response.data.error.msg)
          setModalResponseIsOpen(true)
        } else {
          setIsLoading(false)
          console.log('Berhasil Update Sparepart', response)
          setResponseType(true)
          setResponseMessage('Berhasil Update Sparepart')
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

  function updateSparepart() {
    setIsLoading(true)
    var obj = {
      id_sparepart: sparepartID,
      nama_sparepart: sparepartName,
      quantity: parseInt(quantity),
    }
    var url = `http://192.168.88.250:8081/spareparts/update`

    axios
      .put(url, obj)
      .then((response) => {
        SearchSparepart()
        if (response.data.error.status === true) {
          console.log('Gagal Update Sparepart', response)
          setIsLoading(false)
          setResponseType(false)
          setResponseMessage(response.data.error.msg)
          setModalResponseIsOpen(true)
        } else {
          setIsLoading(false)
          console.log('Berhasil Update Sparepart', response)
          setResponseType(true)
          setResponseMessage('Berhasil Update Sparepart')
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

  function purchaseSparepart() {
    setIsLoading(true)
    var obj = {
      id_sparepart: sparepartID,
      quantity: parseInt(quantity),
      harga_per_unit: parseFloat(pricePerUnit),
    }
    var url = `http://192.168.88.250:8081/purchase/create`

    axios
      .post(url, obj)
      .then((response) => {
        SearchSparepart()
        if (response.data.error.status === true) {
          console.log('Gagal Pembelian Sparepart', response)
          setIsLoading(false)
          setResponseType(false)
          setResponseMessage(response.data.error.msg)
          setModalResponseIsOpen(true)
        } else {
          setIsLoading(false)
          console.log('Berhasil Pembelian Sparepart', response)
          setResponseType(true)
          setResponseMessage('Berhasil Pembelian Sparepart')
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
      createSparepart()
    } else if (type === 'Edit') {
      updateSparepart()
    }
  }

  return (
    <CCard>
      <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>
        <CRow>
          <CCol>List Sparepart</CCol>
          <CCol className="d-grid gap-2" md={2}>
            {/* <Link to={`/machine/create`} className="btn btn-block btn-success text-white">
              Buat Kontrak Baru
            </Link> */}
          </CCol>
        </CRow>
        <CRow className="mt-5">
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
            <CButton className="btn-block text-white" color="info" onClick={SearchSparepart}>
              Cari
            </CButton>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        {listSparepart.length === 0 && !isLoading && (
          <CCol style={{ textAlign: 'center' }}>Maaf Data Tidak Ditemukan</CCol>
        )}
        {listSparepart.length > 0 && (
          <CCol>
            <CTable striped bordered hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="text-center">Kode Sparepart</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Sparepart</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Quantity</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Average Cost</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {listSparepart.map((item, index) => (
                  <CTableRow key={index} className="text-center">
                    <CTableDataCell>{item.id_sparepart}</CTableDataCell>
                    <CTableDataCell>{item.nama_sparepart}</CTableDataCell>
                    <CTableDataCell>{item.quantity}</CTableDataCell>
                    <CTableDataCell>Rp {item.average_cost.toFixed(2)}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        className="btn btn-success btn-sm text-white"
                        onClick={() => handleModal('Purchase', item)}
                      >
                        Pembelian Sparepart
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
            {type === 'Add' ? 'Tambah' : 'Ubah Data'} Sparepart
          </CFormLabel>
          <hr />
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  ID Sparepart
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={sparepartID}
                disabled
                onChange={(e) => setSparepartID(e.target.value)}
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Nama Sparepart
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={sparepartName}
                onChange={(e) => setSparepartName(e.target.value)}
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

      <CModal size="lg" alignment="center" visible={modalPurchaseIsOpen} backdrop="static">
        <CModalBody style={{ justifyContent: 'center' }}>
          <CFormLabel style={{ fontWeight: 'bold', fontSize: '20px', paddingTop: '8px' }}>
            Pembelian Sparepart
          </CFormLabel>
          <hr />
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  ID Sparepart
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={sparepartID}
                disabled
                onChange={(e) => setSparepartID(e.target.value)}
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Nama Sparepart
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={sparepartName}
                disabled
                onChange={(e) => setSparepartName(e.target.value)}
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
                type="number"
                min={1}
                onChange={(e) => setQuantity(e.target.value)}
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Harga per Unit
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={pricePerUnit}
                type="number"
                onChange={(e) => setPricePerUnit(e.target.value)}
              ></CFormInput>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter style={{ justifyContent: 'center' }}>
          <CButton
            color="success"
            className="text-white"
            disabled={pricePerUnit === 0 || pricePerUnit === ''}
            onClick={() => purchaseSparepart()}
          >
            Input
          </CButton>
          <CButton
            color="danger"
            className="text-white"
            onClick={() => setModalPurchaseIsOpen(false)}
          >
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

export default Sparepart

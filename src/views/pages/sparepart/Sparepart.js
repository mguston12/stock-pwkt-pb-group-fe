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
import axios from 'axios'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { useNavigate } from 'react-router-dom'

const Sparepart = () => {
  const navigate = useNavigate()

  const [listSparepart, setListSparepart] = useState([])
  const [listAllSparepart, setListAllSparepart] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalPurchaseIsOpen, setModalPurchaseIsOpen] = useState(false)
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false)
  const [selectedSparepartForDelete, setSelectedSparepartForDelete] = useState({ id: '', nama: '' })

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

  useEffect(() => {
    ListAllSparepart()
  }, [])

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

  const ListAllSparepart = () => {
    setIsLoading(true)
    const url = `http://192.168.88.250:8081/spareparts`

    axios
      .get(url)
      .then((response) => {
        const { data, metadata } = response.data
        setListAllSparepart(data || [])
        setIsLoading(false)
      })
      .catch((error) => {
        console.error(error)
        alert('Error searching machines: ' + error.message)
        setIsLoading(false)
        setListAllSparepart([])
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
      quantity: 0,
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

  function deleteSparepart(id) {
    setIsLoading(true)

    var url = `http://192.168.88.250:8081/spareparts/delete?id=${id}`

    axios
      .delete(url)
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
          setResponseMessage('Berhasil Menghapus Sparepart')
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

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(listAllSparepart)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Spareparts')

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' })

    saveAs(data, 'List_Spareparts.xlsx')
  }

  const handleOpenDeleteModal = (id, nama) => {
    setSelectedSparepartForDelete({ id, nama })
    setModalDeleteIsOpen(true)
  }

  return (
    <CCard>
      <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>
        <CRow>
          <CCol>List Sparepart</CCol>
          <CCol className="d-grid gap-2" md={2}>
            <CButton
              className="btn-block text-white"
              color="dark"
              onClick={() => handleModal('Add')}
            >
              Tambah Sparepart
            </CButton>
          </CCol>
        </CRow>
        <CRow className="mt-2">
          <CCol></CCol>
          <CCol className="d-grid gap-2" md={2}>
            <CButton
              className="btn-block text-white"
              color="primary"
              onClick={exportToExcel}
              disabled={listSparepart.length === 0}
            >
              Export Excel
            </CButton>
          </CCol>
        </CRow>
        <CRow className="mt-2">
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
                        className="btn btn-warning btn-sm text-white"
                        style={{ marginRight: '5px' }}
                        onClick={() => handleModal('Edit', item)}
                      >
                        Edit
                      </CButton>
                      <CButton
                        className="btn btn-success btn-sm text-white"
                        style={{ marginRight: '5px' }}
                        onClick={() => handleModal('Purchase', item)}
                      >
                        Pembelian Sparepart
                      </CButton>
                      <CButton
                        className="btn btn-secondary btn-sm text-white"
                        style={{ marginRight: '5px' }}
                        onClick={() =>
                          navigate(
                            `/sparepart/purchase/${item.id_sparepart}/${item.nama_sparepart
                              .replaceAll(' ', '-')
                              .replaceAll('/', '-')}`,
                          )
                        }
                      >
                        History Pembelian
                      </CButton>
                      <CButton
                        className="btn btn-danger btn-sm text-white"
                        onClick={() =>
                          handleOpenDeleteModal(item.id_sparepart, item.nama_sparepart)
                        }
                      >
                        Hapus
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
                disabled={type !== 'Add'}
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
          {type !== 'Add' && (
            <CRow className="mt-3">
              <CCol>
                <CForm>
                  <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                    Quantity
                  </CFormLabel>
                </CForm>
              </CCol>
              <CCol>
                <CFormInput
                  disabled
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                ></CFormInput>
              </CCol>
            </CRow>
          )}
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

      <CModal
        size="md"
        alignment="center"
        visible={modalDeleteIsOpen}
        onClose={() => setModalDeleteIsOpen(false)}
      >
        <CModalBody style={{ textAlign: 'center' }}>
          <CFormLabel style={{ fontWeight: 'bold', fontSize: '1rem' }}>
            Apakah Anda yakin ingin menghapus sparepart berikut?
          </CFormLabel>
          <p style={{ fontSize: '1.1rem', marginTop: '10px', color: 'red' }}>
            {selectedSparepartForDelete.nama}
          </p>
        </CModalBody>
        <CModalFooter style={{ justifyContent: 'center' }}>
          <CButton
            color="danger"
            className="text-white"
            onClick={() => {
              deleteSparepart(selectedSparepartForDelete.id)
              setModalDeleteIsOpen(false)
            }}
          >
            Hapus
          </CButton>
          <CButton
            color="secondary"
            className="text-white"
            onClick={() => setModalDeleteIsOpen(false)}
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

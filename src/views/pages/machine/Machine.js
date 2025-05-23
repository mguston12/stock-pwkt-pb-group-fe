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
  CModalHeader,
  CModalTitle,
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
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilXCircle } from '@coreui/icons'

const Machine = () => {
  const [listMachine, setListMachine] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [inputSearch, setInputSearch] = useState('')
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [showReplaceModal, setShowReplaceModal] = useState(false)
  const [selectedMachineId, setSelectedMachineId] = useState(null)
  const [newMachineId, setNewMachineId] = useState('')
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const itemsPerPage = 5
  const maxVisiblePages = 3

  const [modalResponseIsOpen, setModalResponseIsOpen] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [responseType, setResponseType] = useState(false)

  useEffect(() => {
    GetMachines()
  }, [currentPage])

  const GetMachines = () => {
    setIsLoading(true)
    const url = `http://192.168.88.250:8081/machines`

    axios
      .get(url)
      .then((response) => {
        setIsLoading(false)
        const { data, metadata } = response.data
        setListMachine(data || [])
        setTotalPage(metadata || 1)
      })
      .catch((error) => {
        console.error(error)
        alert('Error fetching machines: ' + error.message)
        setIsLoading(false)
        setListMachine([])
        setTotalPage(1)
      })
  }

  const SearchMachine = () => {
    setIsLoading(true)
    const url = `http://192.168.88.250:8081/machines?keyword=${inputSearch}&page=${currentPage}&length=${itemsPerPage}`

    axios
      .get(url)
      .then((response) => {
        const { data, metadata } = response.data
        setListMachine(data || [])
        setTotalPage(metadata || 1)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error(error)
        alert('Error searching machines: ' + error.message)
        setIsLoading(false)
        setListMachine([])
        setTotalPage(1)
      })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(1)
      SearchMachine()
    }
  }

  const handleReplaceSubmit = () => {
    axios
      .post('http://192.168.88.250:8081/machines/replace', {
        old_machine_id: selectedMachineId,
        new_machine_id: newMachineId,
      })
      .then((response) => {
        // Tanggapi respons dari server
        setResponseType(true)
        setResponseMessage('Berhasil Tukar Mesin')
        setModalResponseIsOpen(true)
        setShowDeactivateModal(false)
        GetMachines() // Memuat ulang daftar mesin
      })
      .catch((error) => {
        setIsLoading(false)
        setModalResponseIsOpen(true)
        setResponseType(false)
        setResponseMessage(error.message)
      })
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

  const handleReplace = (machineId) => {
    // Tampilkan modal untuk mengganti mesin
    setSelectedMachineId(machineId)
    setShowReplaceModal(true)
  }
  const handleDeactivate = (machineId) => {
    // Tampilkan modal konfirmasi untuk menonaktifkan mesin
    setSelectedMachineId(machineId)
    setShowDeactivateModal(true)
  }

  const handleDeactivateSubmit = () => {
    axios
      .post('http://192.168.88.250:8081/machines/deactivate', {
        machine_id: selectedMachineId,
      })
      .then((response) => {
        // Tanggapi respons dari server

        setResponseType(true)
        setResponseMessage('Berhasil Membuat Request Baru')
        setModalResponseIsOpen(true)
        setShowDeactivateModal(false)
        GetMachines() // Memuat ulang daftar mesin
      })
      .catch((error) => {
        setIsLoading(false)
        setModalResponseIsOpen(true)
        setResponseType(false)
        setResponseMessage(error.message)
      })
  }

  function activateMachine() {
    setIsLoading(true)
    var obj = {
      id_machine: selectedMachineId,
      id_customer: selectedCustomer,
      tanggal_mulai: tanggalMulai,
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

  return (
    <CCard>
      <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>
        <CRow>
          <CCol>List Mesin</CCol>
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
            <CButton className="btn-block text-white" color="info" onClick={SearchMachine}>
              Cari
            </CButton>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        {listMachine.length === 0 && !isLoading && (
          <CCol style={{ textAlign: 'center' }}>Maaf Data Tidak Ditemukan</CCol>
        )}
        {listMachine.length > 0 && (
          <CCol>
            <CTable striped bordered hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="text-center">ID Mesin</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Tipe Mesin</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Customer</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {listMachine.map((item, index) => (
                  <CTableRow key={index} className="text-center">
                    <CTableDataCell>{item.id_machine}</CTableDataCell>
                    <CTableDataCell>{item.tipe_machine}</CTableDataCell>
                    <CTableDataCell>{item.id_customer}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        className="btn btn-danger btn-sm text-white"
                        style={{ marginRight: '5px' }}
                        onClick={() => handleDeactivate(item.id_machine)}
                      >
                        Nonaktifkan
                      </CButton>
                      <CButton
                        className="btn btn-warning btn-sm text-white"
                        style={{ marginRight: '5px' }}
                        onClick={() => handleReplace(item.id_machine)}
                      >
                        Ganti Mesin
                      </CButton>
                      <Link
                        to={`/machine/detail/${item.id_machine}`}
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
      <CModal
        visible={showReplaceModal}
        onClose={() => setShowReplaceModal(false)}
        size="lg"
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Ganti Mesin</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* Form untuk memilih mesin baru */}
          <CFormInput
            type="text"
            placeholder="ID Mesin Baru"
            value={newMachineId}
            onChange={(e) => setNewMachineId(e.target.value)}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowReplaceModal(false)}>
            Batal
          </CButton>
          <CButton color="primary" onClick={handleReplaceSubmit}>
            Ganti Mesin
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        size="sm"
        alignment="center"
        visible={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
      >
        <CModalBody>Apakah Anda yakin ingin menonaktifkan mesin ini?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeactivateModal(false)}>
            Batal
          </CButton>
          <CButton color="danger" onClick={handleDeactivateSubmit}>
            Nonaktifkan
          </CButton>
        </CModalFooter>
      </CModal>
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
          <Link to={`/request`} className="btn btn-block btn-info text-white">
            Kembali Ke Halaman Request
          </Link>
          <CButton color="success" className="text-white" onClick={() => window.location.reload()}>
            Tambah Request Lagi
          </CButton>
        </CModalFooter>
      </CModal>
      {/* MODAL RESPONSE */}
    </CCard>
  )
}

export default Machine

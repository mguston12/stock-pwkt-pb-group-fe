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
import ReactSelect from 'react-select'

const Machine = () => {
  const [listMachine, setListMachine] = useState([])
  const [listCustomer, setListCustomer] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [inputSearch, setInputSearch] = useState('')
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

  const [showActivateModal, setShowActivateModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [startDate, setStartDate] = useState('')
  const [singleData, setSingleData] = useState('')
  const userID = localStorage.getItem('user')
  const token = localStorage.getItem('token')

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8082'

  useEffect(() => {
    SearchMachine()
    GetListCustomers()
  }, [currentPage])

  // const GetMachines = () => {
  //   setIsLoading(true)
  //   const url = `${apiUrl}/machines`

  //   axios
  //     .get(url, {
  //     .then((response) => {
  //       setIsLoading(false)
  //       const { data, metadata } = response.data
  //       setListMachine(data || [])
  //       setTotalPage(metadata || 1)
  //     })
  //     .catch((error) => {
  //       console.error(error)
  //       alert('Error fetching machines: ' + error.message)
  //       setIsLoading(false)
  //       setListMachine([])
  //       setTotalPage(1)
  //     })
  // }

  const GetListCustomers = () => {
    setIsLoading(true)
    const url = `${apiUrl}/customers`

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const { data, metadata } = response.data
        setListCustomer(data || [])
        setIsLoading(false)
      })
      .catch((error) => {
        console.error(error)
        alert('Error searching machines: ' + error.message)
        setIsLoading(false)
        setListCustomer([])
      })
  }

  const SearchMachine = () => {
    setIsLoading(true)
    const url = `${apiUrl}/machines?keyword=${inputSearch}&page=${currentPage}&length=${itemsPerPage}`

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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
      .post(
        `${apiUrl}/machines/replace`,
        {
          old_machine_id: selectedMachineId,
          new_machine_id: newMachineId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        // Tanggapi respons dari server
        setResponseType(true)
        setResponseMessage('Berhasil Tukar Mesin')
        setModalResponseIsOpen(true)
        setShowDeactivateModal(false)
        SearchMachine() // Memuat ulang daftar mesin
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
    setSelectedMachineId(machineId)
    setShowReplaceModal(true)
  }
  const handleDeactivate = (machineId) => {
    setSelectedMachineId(machineId)
    setShowDeactivateModal(true)
  }

  const handleDeactivateSubmit = () => {
    axios
      .post(
        `${apiUrl}/machines/deactivate`,
        {
          machine_id: selectedMachineId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {

        setResponseType(true)
        setResponseMessage('Berhasil Membuat Non Aktif Mesin')
        setModalResponseIsOpen(true)
        setShowDeactivateModal(false)
        SearchMachine() 
      })
      .catch((error) => {
        setIsLoading(false)
        setModalResponseIsOpen(true)
        setResponseType(false)
        setResponseMessage(error.message)
      })
  }

  function handleActivateSubmit() {
    setIsLoading(true)
    var obj = {
      id_machine: selectedMachineId,
      id_customer: selectedCustomer.value.id_customer,
      tanggal_mulai_string: startDate,
      status: 'aktif',
    }
    var url = `${apiUrl}/machine-history/create`

    axios
      .post(url, obj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        SearchMachine()
        if (response.data.error.status === true) {
          console.log('Gagal Aktifkan Mesin', response)
          setIsLoading(false)
          setResponseType(false)
          setResponseMessage(response.data.error.msg)
          setModalResponseIsOpen(true)
        } else {
          setIsLoading(false)
          console.log('Berhasil Aktifkan Mesin', response)
          setResponseType(true)
          setResponseMessage('Berhasil Aktifkan Mesin')
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

  const handleActivate = (machineId) => {
    setSelectedMachineId(machineId)
    setShowActivateModal(true)
  }

  function createMachine() {
    setIsLoading(true)
    var obj = {
      id_machine: singleData.id_machine,
      tipe_machine: singleData.tipe_machine,
      serial_number: singleData.serial_number,
      updated_by: userID,
    }
    var url = `${apiUrl}/machines/create`

    axios
      .post(url, obj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.error.status === true) {
          console.log('Gagal Update Machine Baru', response)
          setIsLoading(false)
          setResponseType(false)
          setResponseMessage(response.data.error.msg)
          setModalResponseIsOpen(true)
        } else {
          setIsLoading(false)
          console.log('Berhasil Update Machine Baru', response)
          setResponseType(true)
          setResponseMessage('Berhasil Update Machine Baru')
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

  const handleModalAdd = () => {
    setSingleData('')
    setModalOpen(true)
  }

  return (
    <CCard>
      <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>
        <CRow>
          <CCol>List Mesin</CCol>
          <CCol className="d-grid gap-2" md={2}>
            <CButton
              className="btn-block text-white"
              color="dark"
              onClick={() => handleModalAdd('')}
            >
              Tambah Mesin
            </CButton>
          </CCol>
        </CRow>
        <CRow className="mt-3">
          <CCol md={10}>
            <CFormInput
              placeholder="Input ID Mesin atau Tipe Mesin atau Nama Customer lalu Tekan Enter atau Tekan Cari"
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
                  <CTableHeaderCell className="text-center">Serial Number</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {listMachine.map((item, index) => (
                  <CTableRow key={index} className="text-center">
                    <CTableDataCell>{item.id_machine}</CTableDataCell>
                    <CTableDataCell>{item.tipe_machine}</CTableDataCell>
                    <CTableDataCell>
                      {item.id_customer} - {item.nama_customer}
                    </CTableDataCell>
                    <CTableDataCell>{item.serial_number}</CTableDataCell>
                    <CTableDataCell>
                      {/* {item.id_customer === 'N/A' && (
                        <CButton
                          className="btn btn-success btn-sm text-white"
                          style={{ marginRight: '5px' }}
                          onClick={() => handleActivate(item.id_machine)}
                        >
                          Aktifkan
                        </CButton>
                      )} */}
                      {item.id_customer === '' && (
                        <CButton
                          className="btn btn-success btn-sm text-white"
                          style={{ marginRight: '5px' }}
                          onClick={() => handleActivate(item.id_machine)}
                        >
                          Aktifkan
                        </CButton>
                      )}
                      {item.id_customer !== 'N/A' && item.id_customer !== '' && (
                        <CButton
                          className="btn btn-danger btn-sm text-white"
                          style={{ marginRight: '5px' }}
                          onClick={() => handleDeactivate(item.id_machine)}
                        >
                          Nonaktifkan
                        </CButton>
                      )}
                      {/* {item.id_machine !== 'N/A' && (
                        <CButton
                          className="btn btn-warning btn-sm text-white"
                          style={{ marginRight: '5px' }}
                          onClick={() => handleReplace(item.id_machine)}
                        >
                          Ganti Mesin
                        </CButton>
                      )} */}
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

      <CModal size="lg" alignment="center" visible={modalOpen} backdrop="static">
        <CModalBody style={{ justifyContent: 'center' }}>
          <CFormLabel style={{ fontWeight: 'bold', fontSize: '20px', paddingTop: '8px' }}>
            Tambah Machine
          </CFormLabel>
          <hr />
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  ID Machine
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={singleData.id_machine}
                onChange={(e) => setSingleData({ ...singleData, id_machine: e.target.value })}
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Tipe Machine
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={singleData.tipe_machine}
                onChange={(e) => setSingleData({ ...singleData, tipe_machine: e.target.value })}
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Serial Number
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={singleData.serial_number}
                onChange={(e) => setSingleData({ ...singleData, serial_number: e.target.value })}
              ></CFormInput>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter style={{ justifyContent: 'center' }}>
          <CButton color="success" className="text-white" onClick={() => createMachine()}>
            Tambah
          </CButton>
          <CButton color="danger" className="text-white" onClick={() => setModalOpen(false)}>
            Batal
          </CButton>
        </CModalFooter>
      </CModal>
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
          <CButton
            color="danger"
            className="btn btn-danger btn-sm text-white"
            onClick={handleDeactivateSubmit}
          >
            Nonaktifkan
          </CButton>
        </CModalFooter>
      </CModal>
      {/* Activation Modal */}
      <CModal
        visible={showActivateModal}
        onClose={() => setShowActivateModal(false)}
        size="lg"
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Aktifkan Mesin</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CCol>
            <CRow>
              <CFormLabel style={{ fontWeight: 'bold' }}>Customer</CFormLabel>
              <ReactSelect
                options={listCustomer.map((customer) => ({
                  value: customer,
                  label: `${customer.nama_customer} - ${customer.alamat}`,
                }))}
                onChange={(e) => setSelectedCustomer(e)}
                isSearchable={true}
                placeholder="Tekan dan Pilih Machine..."
              />
            </CRow>
            <CRow className="mt-3">
              <CFormLabel style={{ fontWeight: 'bold' }}>Tanggal Mulai</CFormLabel>
              <CCol>
                <CFormInput
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  type="date"
                />
              </CCol>
            </CRow>
          </CCol>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowActivateModal(false)}>
            Batal
          </CButton>
          <CButton color="primary" onClick={handleActivateSubmit}>
            Aktifkan Mesin
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
          {/* <Link to={`/request`} className="btn btn-block btn-info text-white">
            Kembali Ke Halaman Request
          </Link> */}
          <CButton color="success" className="text-white" onClick={() => window.location.reload()}>
            Tutup
          </CButton>
        </CModalFooter>
      </CModal>
      {/* MODAL RESPONSE */}
    </CCard>
  )
}

export default Machine

import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModalHeader,
  CFormTextarea,
} from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import SignaturePadLib from '../../../components/SignaturePadLib'
import { useParams } from 'react-router-dom'

import { cilCheckCircle, cilPencil, cilTrash, cilXCircle, cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const Visit = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081'

  const [machineCode, setMachineCode] = useState('')
  const [machineVisits, setMachineVisits] = useState([])
  const [newVisitNote, setNewVisitNote] = useState('')
  const [editingVisit, setEditingVisit] = useState(0)

  const [isLoading, setIsLoading] = useState(false)
  const [modalResponseIsOpen, setModalResponseIsOpen] = useState(false)
  const [modalCreateIsOpen, setModalCreateIsOpen] = useState(false)
  const [modalConfirmDeleteIsOpen, setModalConfirmDeleteIsOpen] = useState(false)
  const [visitToDelete, setVisitToDelete] = useState(0)
  const [responseMessage, setResponseMessage] = useState('')
  const [responseType, setResponseType] = useState(false)

  const userID = localStorage.getItem('user')
  const { id_machine } = useParams()

  useEffect(() => {
    if (userID === 'ws') {
      setMachineCode('WS')
    }
    if (id_machine) {
      setMachineCode(id_machine)
    }
  }, [userID, id_machine])

  useEffect(() => {
    if (machineCode) {
      getMachineVisits()
    }
  }, [machineCode])

  const getMachineVisits = () => {
    setIsLoading(true)
    const url = `${apiUrl}/visits?id=${machineCode}`

    axios
      .get(url)
      .then((response) => {
        setIsLoading(false)
        const { data } = response.data
        setMachineVisits(data)
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false)
        setMachineVisits([])
        setResponseMessage('Error fetching visits: ' + error.message)
        setResponseType(false)
        setModalResponseIsOpen(true)
      })
  }

  const handleCreateOrUpdateVisit = () => {
    setIsLoading(true)
    const visitData = {
      id_machine: machineCode,
      desc_kunjungan: newVisitNote,
    }

    let request
    if (editingVisit) {
      visitData.id_kunjungan = editingVisit.id_kunjungan
      request = axios.put(`${apiUrl}/visits/update`, visitData)
    } else {
      request = axios.post(`${apiUrl}/visits/create`, visitData)
    }

    request
      .then((response) => {
        setIsLoading(false)
        setResponseMessage(
          editingVisit ? 'Kunjungan berhasil diperbarui!' : 'Kunjungan baru berhasil ditambahkan!',
        )
        setResponseType(true)
        setModalResponseIsOpen(true)
        setModalCreateIsOpen(false)
        setNewVisitNote('')
        setEditingVisit(null)
        getMachineVisits()
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false)
        setResponseMessage('Gagal menyimpan kunjungan: ' + error.message)
        setResponseType(false)
        setModalResponseIsOpen(true)
      })
  }

  const handleDeleteVisit = () => {
    if (!visitToDelete) return

    setIsLoading(true)
    axios
      .delete(`${apiUrl}/visits/delete?id=${visitToDelete.id_kunjungan}`)
      .then((response) => {
        setIsLoading(false)
        setResponseMessage('Kunjungan berhasil dihapus!')
        setResponseType(true)
        setModalResponseIsOpen(true)
        setModalConfirmDeleteIsOpen(false)
        setVisitToDelete(0)
        getMachineVisits()
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false)
        setResponseMessage('Gagal menghapus kunjungan: ' + error.message)
        setResponseType(false)
        setModalResponseIsOpen(true)
      })
  }

  const openEditModal = (visit) => {
    setEditingVisit(visit)
    setNewVisitNote(visit.desc_kunjungan)
    setModalCreateIsOpen(true)
  }

  const openCreateModal = () => {
    setEditingVisit(null)
    setNewVisitNote('')
    setModalCreateIsOpen(true)
  }

  const openDeleteConfirmModal = (visit) => {
    setVisitToDelete(visit)
    setModalConfirmDeleteIsOpen(true)
  }

  return (
    <>
      <CCard>
        <CCardHeader style={{ textAlign: 'center' }}>
          <CRow className="align-items-start">
            {/* Label */}
            <CCol xs="12" md="4" className="mb-2 mb-md-0">
              <h5 className="mb-0">Daftar Kunjungan Mesin:</h5>
            </CCol>

            {/* Machine Code */}
            <CCol xs="12" md="4" className="mb-2 mb-md-0">
              <h5 className="mb-0">{machineCode}</h5>
            </CCol>

            {/* Tombol */}
            <CCol xs="12" md="4" className="text-md-end">
              <CButton
                color="primary"
                className="w-100 w-md-auto text-white"
                onClick={openCreateModal}
              >
                <CIcon icon={cilPlus} className="me-2" />
                Tambah Kunjungan
              </CButton>
            </CCol>
          </CRow>
        </CCardHeader>

        <CCardBody>
          {isLoading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: '200px' }}
            >
              <CSpinner size="xl" color="primary" />
              <p className="ms-3 mb-0">Memuat data kunjungan...</p>
            </div>
          ) : machineVisits && machineVisits.length === 0 ? (
            <div className="text-center p-4">
              <h5 className="text-muted">Tidak ada data kunjungan untuk mesin ini.</h5>
            </div>
          ) : (
            <CTable bordered hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="text-center" scope="col">
                    Tanggal
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" scope="col" style={{ width: '35%' }}>
                    Catatan
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" scope="col">
                    Aksi
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {machineVisits &&
                  machineVisits.map((visit, index) => (
                    <CTableRow
                      key={visit.id_kunjungan}
                      style={{ textAlign: 'center', justifyContent: 'center' }}
                    >
                      <CTableDataCell>
                        {new Date(visit.tanggal_kunjungan).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </CTableDataCell>
                      <CTableDataCell>{visit.desc_kunjungan}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="info"
                          className="btn-sm me-2 text-white"
                          onClick={() => openEditModal(visit)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        {/* {userID === 'admin' && (
                          <CButton
                            color="danger"
                            className="text-white"
                            onClick={() => openDeleteConfirmModal(visit)}
                          >
                            <CIcon icon={cilTrash} />
                          </CButton>
                        )} */}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
              </CTableBody>
            </CTable>
          )}
          <div style={{ padding: '20px' }}>
            <SignaturePadLib />
          </div>
        </CCardBody>
      </CCard>

      {/* ... (Modal Components remain the same) ... */}

      {/* MODAL UNTUK TAMBAH/EDIT KUNJUNGAN */}
      <CModal
        alignment="center"
        visible={modalCreateIsOpen}
        onClose={() => setModalCreateIsOpen(false)}
      >
        <CModalHeader
          style={{ fontWeight: 'bold', fontSize: '20px', paddingTop: '8px', marginTop: '8px' }}
        >
          {editingVisit ? 'Edit Kunjungan' : 'Tambah Kunjungan Baru'}
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel style={{ fontWeight: 'bold' }}>Catatan Kunjungan</CFormLabel>
              <CFormTextarea
                type="text"
                value={newVisitNote}
                onChange={(e) => setNewVisitNote(e.target.value)}
                placeholder="Masukkan catatan kunjungan..."
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter style={{ justifyContent: 'center' }}>
          <CButton color="secondary" onClick={() => setModalCreateIsOpen(false)}>
            Batal
          </CButton>
          <CButton color="primary" onClick={handleCreateOrUpdateVisit}>
            {editingVisit ? 'Simpan Perubahan' : 'Simpan'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* MODAL KONFIRMASI HAPUS */}
      <CModal
        alignment="center"
        visible={modalConfirmDeleteIsOpen}
        onClose={() => setModalConfirmDeleteIsOpen(false)}
      >
        <CModalHeader>Konfirmasi Hapus</CModalHeader>
        <CModalBody>Apakah Anda yakin ingin menghapus kunjungan ini?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalConfirmDeleteIsOpen(false)}>
            Batal
          </CButton>
          <CButton color="danger" className="text-white" onClick={handleDeleteVisit}>
            Hapus
          </CButton>
        </CModalFooter>
      </CModal>

      {/* MODAL LOADING */}
      <CModal size="xl" alignment="center" visible={isLoading} backdrop="static">
        <CModalBody style={{ textAlign: 'center' }}>
          <CSpinner size="xl" color="primary" style={{ width: '4rem', height: '4rem' }} />
          <p className="mt-3">Mohon Tunggu...</p>
        </CModalBody>
      </CModal>

      {/* MODAL RESPONSE */}
      <CModal
        size="lg"
        alignment="center"
        visible={modalResponseIsOpen}
        onClose={() => {
          setModalResponseIsOpen(false)
          window.location.reload()
        }}
      >
        <CModalBody style={{ textAlign: 'center', justifyContent: 'center' }}>
          <CIcon
            icon={responseType ? cilCheckCircle : cilXCircle}
            style={{ color: responseType ? 'green' : 'red', width: '5rem', height: '5rem' }}
          />
          <br />

          <CFormLabel className="mt-3" style={{ fontWeight: 'bold', fontSize: '20px' }}>
            {responseMessage}
          </CFormLabel>
        </CModalBody>
        <CModalFooter style={{ justifyContent: 'center' }}>
          <CButton
            color="success"
            className="text-white"
            onClick={() => {
              setModalResponseIsOpen(false)
              window.location.reload()
            }}
          >
            Tutup
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Visit

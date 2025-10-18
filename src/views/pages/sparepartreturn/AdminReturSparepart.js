import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CFormLabel,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilXCircle } from '@coreui/icons'
import axios from 'axios'
import { formatDateWIB } from '../../../utils/date'

const AdminReturSparepart = () => {
  const token = localStorage.getItem('token')
  const [listRetur, setListRetur] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRetur, setSelectedRetur] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalResponse, setModalResponse] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [responseType, setResponseType] = useState(false)
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8082'

  useEffect(() => {
    fetchRetur()
  }, [])

  const fetchRetur = () => {
    setIsLoading(true)
    axios
      .get(`${apiUrl}/return-inventory`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const { data } = res.data
        setListRetur(data || [])
      })
      .catch((err) => {
        console.error(err)
        alert('Gagal mengambil data retur')
      })
      .finally(() => setIsLoading(false))
  }

  const handleAction = (status) => {
    setIsLoading(true)
    axios
      .post(
        `${apiUrl}/return-inventory/approve`,
        {
          id_return: selectedRetur.id_return,
          id_inventory: selectedRetur.id_inventory,
          id_sparepart: selectedRetur.id_sparepart,
          quantity: selectedRetur.quantity,
          status: status,
          approved_by: 'admin',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        if (res.data.error.status === true) {
          setResponseType(false)
          setResponseMessage(res.data.error.msg)
        } else {
          setResponseType(true)
          setResponseMessage(`Retur berhasil di${status.toLowerCase()}`)
        }
        setModalResponse(true)
      })
      .catch((err) => {
        setResponseType(false)
        setResponseMessage(err.message)
        setModalResponse(true)
      })
      .finally(() => {
        setIsLoading(false)
        setModalVisible(false)
      })
  }

  return (
    <>
      <CCard>
        <CCardHeader className="fw-bold fs-4">Daftar Retur Sparepart</CCardHeader>
        <CCardBody>
          {listRetur.length === 0 && <div className="text-center">Tidak ada data retur.</div>}
          {listRetur.length > 0 && (
            <CTable striped hover bordered responsive>
              <CTableHead>
                <CTableRow className="text-center">
                  <CTableHeaderCell>ID Retur</CTableHeaderCell>
                  <CTableHeaderCell>Teknisi</CTableHeaderCell>
                  <CTableHeaderCell>Sparepart</CTableHeaderCell>
                  <CTableHeaderCell>Jumlah</CTableHeaderCell>
                  <CTableHeaderCell>Tanggal Retur</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Aksi</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {listRetur.map((item, index) => (
                  <CTableRow key={index} className="text-center">
                    <CTableDataCell>{item.id_return}</CTableDataCell>
                    <CTableDataCell>{item.nama_teknisi}</CTableDataCell>
                    <CTableDataCell>{item.nama_sparepart}</CTableDataCell>
                    <CTableDataCell>{item.quantity}</CTableDataCell>
                    <CTableDataCell>{item.approved_at ? formatDateWIB(item.approved_at) : "-"}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        className="text-white"
                        size="sm"
                        color={
                          item.status === 'Disetujui'
                            ? 'success'
                            : item.status === 'Ditolak'
                              ? 'danger'
                              : 'secondary'
                        }
                      >
                        {item.status}
                      </CButton>
                    </CTableDataCell>
                    <CTableDataCell>
                      {item.status === 'Pending' ? (
                        <CButton
                          size="sm"
                          color="warning"
                          className="text-white"
                          onClick={() => {
                            setSelectedRetur(item)
                            setModalVisible(true)
                          }}
                        >
                          Proses
                        </CButton>
                      ) : (
                        <span>-</span>
                      )}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      {/* MODAL TINJAU */}
      {selectedRetur && (
        <CModal alignment="center" visible={modalVisible} onClose={() => setModalVisible(false)}>
          <CModalBody>
            <h5 className="fw-bold">Detail Retur</h5>
            <hr />
            <p>
              <strong>ID Retur:</strong> {selectedRetur.id_return}
            </p>
            <p>
              <strong>Teknisi:</strong> {selectedRetur.returned_by} - {selectedRetur.nama_teknisi}
            </p>
            <p>
              <strong>Sparepart:</strong> {selectedRetur.nama_sparepart}
            </p>
            <p>
              <strong>Jumlah:</strong> {selectedRetur.quantity}
            </p>
            <p>
              <strong>Status:</strong> {selectedRetur.status}
            </p>
            <p>
              <strong>Tanggal:</strong> {formatDateWIB(selectedRetur.returned_at)}
            </p>
          </CModalBody>
          <CModalFooter>
            <CButton
              className="text-white"
              color="success"
              onClick={() => handleAction('Disetujui')}
            >
              Setujui
            </CButton>
            <CButton className="text-white" color="danger" onClick={() => handleAction('Ditolak')}>
              Tolak
            </CButton>
            <CButton color="secondary" onClick={() => setModalVisible(false)}>
              Batal
            </CButton>
          </CModalFooter>
        </CModal>
      )}

      {/* MODAL RESPONSE */}
      <CModal alignment="center" visible={modalResponse} onClose={() => window.location.reload()}>
        <CModalBody className="text-center">
          <CFormLabel className="fw-bold fs-5">{responseMessage}</CFormLabel>
          <br />
          {responseType ? (
            <CIcon
              icon={cilCheckCircle}
              style={{ color: 'green', width: '4rem', height: '4rem' }}
            />
          ) : (
            <CIcon icon={cilXCircle} style={{ color: 'red', width: '3rem', height: '3rem' }} />
          )}
        </CModalBody>
        <CModalFooter className="justify-content-center">
          <CButton className="text-white" color="success" onClick={() => window.location.reload()}>
            Tutup
          </CButton>
        </CModalFooter>
      </CModal>

      {/* MODAL LOADING */}
      <CModal alignment="center" visible={isLoading} backdrop="static">
        <CModalBody className="text-center">
          <CFormLabel className="fw-bold">Mohon Tunggu...</CFormLabel>
        </CModalBody>
        <CModalFooter className="justify-content-center border-0">
          <CSpinner color="success" style={{ width: '4rem', height: '4rem' }} />
        </CModalFooter>
      </CModal>
    </>
  )
}

export default AdminReturSparepart

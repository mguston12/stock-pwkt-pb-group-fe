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
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilXCircle } from '@coreui/icons'
import ReactSelect from 'react-select'
import axios from 'axios'

const SparepartReturn = () => {
  const token = sessionStorage.getItem('token')
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081'

  const [listInventory, setListInventory] = useState([])
  const [selectedInventory, setSelectedInventory] = useState('')
  const [returnQty, setReturnQty] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [modalResponseIsOpen, setModalResponseIsOpen] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [responseType, setResponseType] = useState(false)

  const userID = sessionStorage.getItem('user')

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = () => {
    setIsLoading(true)
    axios
      .get(`${apiUrl}/inventory/detail?id=${userID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const { data } = response.data
        setListInventory(data || [])
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setIsLoading(false)
      })
  }

  const handleReturn = () => {
    setIsLoading(true)

    const body = {
      id_inventory: parseInt(selectedInventory.value.id_inventory),
      quantity: parseInt(returnQty),
      id_sparepart: selectedInventory.value.id_sparepart,
      returned_by: userID,
      status: 'Menunggu',
    }

    axios
      .post(`${apiUrl}/return-inventory/return`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.error.status === true) {
          setResponseType(false)
          setResponseMessage(res.data.error.msg)
        } else {
          setResponseType(true)
          setResponseMessage('Pengajuan retur berhasil dikirim!')
        }
        setModalResponseIsOpen(true)
        setIsLoading(false)
      })
      .catch((err) => {
        setResponseType(false)
        setResponseMessage(err.message)
        setModalResponseIsOpen(true)
        setIsLoading(false)
      })
  }

  return (
    <>
      <CRow>
        <CCol md={3}></CCol>
        <CCol md={6}>
          <CCard style={{ marginTop: '100px' }}>
            <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>
              Retur Sparepart
            </CCardHeader>
            <CCardBody>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>Pilih Sparepart</CFormLabel>
                <ReactSelect
                  options={listInventory.map((inv) => ({
                    value: inv,
                    label: inv.nama_sparepart,
                  }))}
                  onChange={(e) => setSelectedInventory(e)}
                  isSearchable
                  placeholder="Pilih sparepart dari inventory"
                />

                <CFormLabel className="mt-3" style={{ fontWeight: 'bold' }}>
                  Jumlah yang ingin diretur
                </CFormLabel>
                <CFormInput
                  type="number"
                  placeholder="Masukkan jumlah"
                  value={returnQty}
                  onChange={(e) => setReturnQty(e.target.value)}
                />
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CRow className="justify-content-center">
                <CCol xs="auto">
                  <CButton
                    color="warning"
                    className="text-white"
                    onClick={handleReturn}
                    disabled={!selectedInventory || returnQty <= 0}
                  >
                    Ajukan Retur
                  </CButton>
                </CCol>
              </CRow>
            </CCardFooter>
          </CCard>
        </CCol>
        <CCol md={3}></CCol>
      </CRow>

      {/* MODAL LOADING */}
      <CModal size="xl" alignment="center" visible={isLoading} backdrop="static">
        <CModalBody className="d-flex justify-content-center align-items-center">
          <CFormLabel className="fw-bold fs-5">Mohon Tunggu...</CFormLabel>
        </CModalBody>
        <CModalFooter className="justify-content-center border-0">
          <CSpinner color="success" style={{ width: '4rem', height: '4rem' }} />
        </CModalFooter>
      </CModal>

      {/* MODAL RESPONSE */}
      <CModal size="lg" alignment="center" visible={modalResponseIsOpen} backdrop="static">
        <CModalBody className="text-center">
          <CFormLabel className="fw-bold fs-4">{responseMessage}</CFormLabel>
          <br />
          {responseType ? (
            <CIcon
              icon={cilCheckCircle}
              style={{ color: 'green', width: '5rem', height: '5rem' }}
            />
          ) : (
            <CIcon icon={cilXCircle} style={{ color: 'red', width: '3rem', height: '3rem' }} />
          )}
        </CModalBody>
        <CModalFooter className="justify-content-center">
          <CButton color="success" className="text-white" onClick={() => window.location.reload()}>
            Tutup
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default SparepartReturn

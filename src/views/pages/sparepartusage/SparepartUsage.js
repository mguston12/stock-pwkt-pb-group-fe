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
import axios from 'axios'
import React, { useEffect, useState } from 'react'

import { cilCheckCircle, cilXCircle } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import ReactSelect from 'react-select'

const SparepartUsage = () => {
  const [machineCode, setMachineCode] = useState('')
  const [machineDetail, setMachineDetail] = useState('')
  const [listInventory, setListInventory] = useState([])
  const [selectedInventory, setSelectedInventory] = useState('')
  const [counter, setCounter] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [modalResponseIsOpen, setModalResponseIsOpen] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [responseType, setResponseType] = useState(false)

  const userID = sessionStorage.getItem('user')

  useEffect(() => {
    if (machineDetail !== '' || machineDetail !== undefined) {
      GetListInventory()
    }
  }, [machineDetail])

  useEffect(() => {
    if (userID === 'ws') {
      GetDataMachine()
      setMachineCode('WS')
      setCounter(0)
    }
  }, [userID])

  const GetDataMachine = () => {
    if (machineCode !== '') {
      setIsLoading(true)
      const url = `http://192.168.88.250:8081/machines/detail?id=${machineCode}`

      axios
        .get(url)
        .then((response) => {
          console.log(response)

          setIsLoading(false)
          const { data } = response.data
          setMachineDetail(data)
        })
        .catch((error) => {
          console.error(error)
          alert('Error fetching machines: ' + error.message)
          setIsLoading(false)
          setMachineDetail('')
        })
    }
  }

  const GetListInventory = () => {
    setIsLoading(true)
    const url = `http://192.168.88.250:8081/inventory/detail?id=${userID}`

    axios
      .get(url)
      .then((response) => {
        const { data, metadata } = response.data
        setListInventory(data || [])
        setIsLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false)
        setListInventory([])
      })
  }

  function UseSparepart() {
    setIsLoading(true)
    var obj = {
      id_inventory: selectedInventory.value.id_inventory,
      id_machine: machineDetail.id_machine,
      counter: parseInt(counter),
      updated_by: userID,
    }
    var url = `http://192.168.88.250:8081/inventory/usage`

    axios
      .post(url, obj)
      .then((response) => {
        if (response.data.error.status === true) {
          setIsLoading(false)
          setResponseType(false)
          setResponseMessage(response.data.error.msg)
          setModalResponseIsOpen(true)
        } else {
          setIsLoading(false)
          setResponseType(true)
          setResponseMessage('Berhasil Memakai Sparepart')
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
    <>
      <CRow>
        <CCol md={3}></CCol>
        <CCol md={6}>
          <CCard style={{ marginTop: '100px' }}>
            <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>
              Pakai Sparepart
            </CCardHeader>
            <CCardBody>
              <CCol>
                <CRow>
                  <CCol>
                    <CForm>
                      <CFormLabel style={{ fontWeight: 'bold' }}>Kode Mesin</CFormLabel>
                    </CForm>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormInput
                      placeholder="Masukkan kode mesin..."
                      value={machineCode}
                      onChange={(e) => setMachineCode(e.target.value)}
                    ></CFormInput>
                  </CCol>
                </CRow>
                {machineDetail && (
                  <CCol>
                    <CRow className="mt-3">
                      <CCol>
                        <CForm>
                          <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                            Tipe Mesin
                          </CFormLabel>
                        </CForm>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol>
                        <CFormInput disabled value={machineDetail.tipe_machine}></CFormInput>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol>
                        <CForm>
                          <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                            Counter
                          </CFormLabel>
                        </CForm>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol>
                        <CFormInput
                          type="number"
                          placeholder="Masukkan counter mesin..."
                          value={counter}
                          onChange={(e) => setCounter(e.target.value)}
                          disabled={userID === 'ws'}
                        ></CFormInput>
                      </CCol>
                    </CRow>
                    <CRow className="mt-3">
                      <CCol>
                        <CForm>
                          <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                            Sparepart yang digunakan
                          </CFormLabel>
                        </CForm>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol>
                        <ReactSelect
                          options={listInventory.map((inventory) => ({
                            value: inventory,
                            label: inventory.nama_sparepart,
                          }))}
                          onChange={(e) => setSelectedInventory(e)}
                          isSearchable={true}
                          placeholder="Tekan dan Pilih Sparepart..."
                        />
                      </CCol>
                    </CRow>
                  </CCol>
                )}
              </CCol>
            </CCardBody>
            <CCardFooter>
              <CRow className="justify-content-center">
                <CCol xs="auto">
                  <CButton
                    type="button"
                    color="info"
                    className="text-white"
                    onClick={() => GetDataMachine('search')}
                  >
                    Cari Mesin
                  </CButton>
                </CCol>
                {machineDetail && (
                  <CCol xs="auto">
                    <CButton
                      type="button"
                      color="success"
                      className="text-white"
                      onClick={() => UseSparepart()}
                      disabled={selectedInventory === '' || counter === ''}
                    >
                      Gunakan
                    </CButton>
                  </CCol>
                )}
              </CRow>
            </CCardFooter>
          </CCard>
        </CCol>
        <CCol md={3}></CCol>
      </CRow>
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
      <CModal size="lg" alignment="center" visible={modalResponseIsOpen} backdrop="static">
        <CModalBody style={{ justifyContent: 'center', textAlign: 'center' }}>
          <CFormLabel style={{ fontWeight: 'bold', fontSize: '20px' }}>
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
    </>
  )
}

export default SparepartUsage

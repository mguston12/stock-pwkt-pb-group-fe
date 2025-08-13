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
import { useParams } from 'react-router-dom'

const Visit = () => {
  const token = sessionStorage.getItem('token')
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081'

  const [machineCode, setMachineCode] = useState('')
  const [machineDetail, setMachineDetail] = useState('')
  const [listInventory, setListInventory] = useState([])
  const [selectedInventory, setSelectedInventory] = useState('')
  const [counter, setCounter] = useState('')
  const [counterColour, setCounterColour] = useState('')
  const [counterColourA3, setCounterColourA3] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [modalResponseIsOpen, setModalResponseIsOpen] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [responseType, setResponseType] = useState(false)

  const [usageList, setUsageList] = useState([])

  const userID = sessionStorage.getItem('user')
  let { id_machine } = useParams()

  const [quantity, setQuantity] = useState(1)
  const [quantityErrorModalOpen, setQuantityErrorModalOpen] = useState(false)
  const [quantityErrorMessage, setQuantityErrorMessage] = useState('')

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
    if (id_machine) {
      setMachineCode(id_machine)
    }
  }, [userID, id_machine])

  const GetDataMachine = () => {
    if (machineCode !== '') {
      setIsLoading(true)
      const url = `${apiUrl}/machines/detail?id=${machineCode}`

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
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
    const url = `${apiUrl}/inventory/detail?id=${userID}`

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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
      counter_colour: parseInt(counterColour),
      counter_colour_a3: parseInt(counterColourA3),
      updated_by: userID,
    }
    var url = `${apiUrl}/inventory/usage`

    axios
      .post(url, obj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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

  const addSparepartToUsageList = () => {
    if (!selectedInventory || quantity < 1) return

    const inventory = selectedInventory.value
    const existsIndex = usageList.findIndex((item) => item.id_inventory === inventory.id_inventory)

    if (existsIndex !== -1) {
      const existingItem = usageList[existsIndex]
      const total = existingItem.quantity + quantity

      if (total > inventory.quantity) {
        setQuantityErrorMessage('Jumlah melebihi persediaan yang tersedia di tas Anda.')
        setQuantityErrorModalOpen(true)

        return
      }

      const updatedList = [...usageList]
      updatedList[existsIndex].quantity = total
      setUsageList(updatedList)
    } else {
      const newItem = {
        id_inventory: inventory.id_inventory,
        id_machine: machineDetail.id_machine,
        id_sparepart: inventory.id_sparepart,
        nama_sparepart: inventory.nama_sparepart,
        quantity: quantity,
        counter: parseInt(counter) || 0,
        counter_colour: parseInt(counterColour) || 0,
        counter_colour_a3: parseInt(counterColourA3) || 0,
        updated_by: userID,
      }
      setUsageList((prev) => [...prev, newItem])
    }

    // Reset input
    setSelectedInventory('')
    setQuantity(1)
  }

  const removeSparepart = (indexToRemove) => {
    setUsageList((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  function UseSparepart() {
    if (usageList.length === 0) return

    setIsLoading(true)
    const url = `${apiUrl}/inventory/usage-batch` // pastikan endpoint sesuai

    axios
      .post(url, usageList, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setIsLoading(false)
        const { error } = response.data
        if (error?.status) {
          setResponseType(false)
          setResponseMessage(error.msg)
        } else {
          setResponseType(true)
          setResponseMessage('Berhasil Memakai Sparepart')
          setUsageList([])
        }
        setModalResponseIsOpen(true)
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
                    <CRow className="mt-1">
                      <CCol>
                        <CForm>
                          <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                            Nama Customer
                          </CFormLabel>
                        </CForm>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol>
                        <CFormInput disabled value={machineDetail.nama_customer}></CFormInput>
                      </CCol>
                    </CRow>
                    <CRow className="mt-1">
                      <CCol>
                        <CForm>
                          <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                            Alamat
                          </CFormLabel>
                        </CForm>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol>
                        <CFormInput disabled value={machineDetail.alamat}></CFormInput>
                      </CCol>
                    </CRow>
                    <CRow className="mt-1">
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
                            Counter BW
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
                    <CRow>
                      <CCol>
                        <CForm>
                          <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                            Counter Colour A4/F4
                            <span style={{ color: 'red', fontSize: '11px', marginLeft: '10px' }}>
                              (*jika mesin colour*)
                            </span>
                          </CFormLabel>
                        </CForm>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol>
                        <CFormInput
                          type="number"
                          placeholder="Masukkan counter colour mesin..."
                          value={counterColour}
                          onChange={(e) => setCounterColour(e.target.value)}
                          disabled={userID === 'ws'}
                        ></CFormInput>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol>
                        <CForm>
                          <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                            Counter Colour A3
                            <span style={{ color: 'red', fontSize: '11px', marginLeft: '10px' }}>
                              (*jika mesin colour*)
                            </span>
                          </CFormLabel>
                        </CForm>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol>
                        <CFormInput
                          type="number"
                          placeholder="Masukkan counter colour A3 mesin..."
                          value={counterColourA3}
                          onChange={(e) => setCounterColourA3(e.target.value)}
                          disabled={userID === 'ws'}
                        ></CFormInput>
                      </CCol>
                    </CRow>
                    <CRow className="mt-1">
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
                        {selectedInventory && (
                          <CRow className="mt-2">
                            <CCol>
                              <CFormLabel style={{ fontWeight: 'bold' }}>
                                Jumlah yang Dipakai
                              </CFormLabel>
                              <CFormInput
                                type="number"
                                min="1"
                                max={selectedInventory.value.quantity} // batasi sesuai stok
                                value={quantity}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value)
                                  if (val > selectedInventory.value.quantity) {
                                    alert('Jumlah melebihi stok tersedia')
                                    return
                                  }
                                  setQuantity(val)
                                }}
                              />
                              <p style={{ fontSize: '12px', color: 'gray' }}>
                                Maksimal tersedia: {selectedInventory.value.quantity}
                              </p>
                            </CCol>
                          </CRow>
                        )}
                      </CCol>
                    </CRow>
                    <CRow className="mt-2 text-center">
                      <CCol>
                        <CButton
                          color="primary"
                          className="text-white"
                          onClick={addSparepartToUsageList}
                          disabled={!selectedInventory}
                        >
                          Tambahkan ke Daftar
                        </CButton>
                      </CCol>
                    </CRow>
                    {usageList.length > 0 && (
                      <CRow className="mt-3">
                        <CCol>
                          <table className="text-center table table-bordered">
                            <thead>
                              <tr>
                                <th>Nama Sparepart</th>
                                <th>Jumlah</th>
                                <th>Aksi</th>
                              </tr>
                            </thead>
                            <tbody>
                              {usageList.map((item, index) => (
                                <tr key={index}>
                                  <td>{item.nama_sparepart}</td>
                                  <td>{item.quantity}</td>
                                  <td>
                                    <CButton
                                      className="text-white"
                                      color="danger"
                                      size="sm"
                                      onClick={() => removeSparepart(index)}
                                    >
                                      Hapus
                                    </CButton>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </CCol>
                      </CRow>
                    )}
                  </CCol>
                )}
              </CCol>
            </CCardBody>
            <CCardFooter>
              <CRow className="justify-content-center">
                {!machineDetail && (
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
                )}
                {machineDetail && (
                  <CCol xs="auto">
                    {/* <CButton
                      type="button"
                      color="success"
                      className="text-white"
                      onClick={() => UseSparepart()}
                      disabled={selectedInventory === '' || counter === ''}
                    >
                      Gunakan
                    </CButton> */}
                    <CButton
                      type="button"
                      color="success"
                      className="text-white"
                      onClick={() => UseSparepart()}
                      disabled={usageList.length === 0 || counter === ''}
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
      <CModal
        size="sm"
        alignment="center"
        visible={quantityErrorModalOpen}
        onClose={() => setQuantityErrorModalOpen(false)}
      >
        <CModalBody style={{ justifyContent: 'center', textAlign: 'center' }}>
          <CFormLabel style={{ fontWeight: 'bold', fontSize: '18px' }}>
            {quantityErrorMessage}
          </CFormLabel>
          <CIcon icon={cilXCircle} style={{ color: 'red', width: '3rem', height: '3rem' }} />
        </CModalBody>
        <CModalFooter style={{ justifyContent: 'center' }}>
          <CButton
            color="danger"
            className="text-white"
            onClick={() => setQuantityErrorModalOpen(false)}
          >
            Tutup
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Visit

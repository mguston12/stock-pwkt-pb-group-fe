import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CButton,
} from '@coreui/react'
import axios from 'axios'

const Bank = () => {
  const [listBank, setListBank] = useState([])
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [type, setType] = useState('')
  const [namaBank, setNamaBank] = useState('')
  const [nomorRekening, setNomorRekening] = useState('')
  const [atasNama, setAtasNama] = useState('')
  const [idBank, setIDBank] = useState('')

  useEffect(() => {
    GetBanks()
  }, [])

  const GetBanks = () => {
    setIsLoading(true)
    const url = `http://192.168.88.250:8080/banks`

    axios
      .get(url)
      .then((response) => {
        setIsLoading(false)
        if (response.data.data !== null) {
          setListBank(response.data.data)
        } else {
          setListBank([])
        }
      })
      .catch((error) => {
        alert(error.message)
        setIsLoading(false)
        // Handle error state or message
      })
  }

  const handleModal = (tipe, data) => {
    console.log(tipe);
    
    if (tipe === 'Add') {
      setNamaBank('')
      setNomorRekening('')
      setAtasNama('')
    } else if (tipe === 'Edit') {
      setIDBank(data.bank_id)
      setNamaBank(data.bank_name)
      setNomorRekening(data.nomor_rekening)
      setAtasNama(data.atas_nama)
    }

    setType(tipe)
    setModalIsOpen(!modalIsOpen)
  }

  function createBank() {
    setIsLoading(true)
    var obj = {
      bank_name: namaBank,
      nomor_rekening: nomorRekening,
      atas_nama: atasNama,
    }
    var url = `http://192.168.88.250:8080/banks/create`

    axios
      .post(url, obj)
      .then((response) => {
        GetBanks()
        if (response.data.error.status === true) {
          console.log('Gagal Membuat Bank', response)
          setIsLoading(false)
          setResponseType(false)
          setResponseMessage(response.data.error.msg)
          setModalResponseIsOpen(true)
        } else {
          setIsLoading(false)
          console.log('Berhasil Membuat Bank', response)
          setResponseType(true)
          setResponseMessage('Berhasil Membuat Bank')
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

  function updateBank() {
    setIsLoading(true)
    var obj = {
      bank_id: parseInt(idBank),
      bank_name: namaBank,
      nomor_rekening: nomorRekening,
      atas_nama: atasNama,
    }
    var url = `http://192.168.88.250:8080/banks/update`

    axios
      .put(url, obj)
      .then((response) => {
        GetBanks()
        if (response.data.error.status === true) {
          console.log('Gagal Update Bank', response)
          setIsLoading(false)
          setResponseType(false)
          setResponseMessage(response.data.error.msg)
          setModalResponseIsOpen(true)
        } else {
          setIsLoading(false)
          console.log('Berhasil Update Bank', response)
          setResponseType(true)
          setResponseMessage('Berhasil Update Bank')
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
      createBank()
    } else {
      updateBank()
    }
  }

  return (
    <CCard style={{ width: '100%' }}>
      <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>
        <CRow>
          <CCol>List Semua Bank</CCol>
          <CCol>
            <CButton
              style={{ float: 'right' }}
              className="btn btn-success text-white"
              onClick={() => handleModal('Add')}
            >
              Tambah Bank
            </CButton>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        {listBank.length === 0 && (
          <CCol style={{ textAlign: 'center' }}>Maaf Data Tidak Ditemukan</CCol>
        )}
        {listBank.length !== 0 && (
          <CCol>
            <CTable striped bordered hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="text-center">Nama Bank</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Nomor Rekening</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Atas Nama</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {listBank.map((item, index) => (
                  <CTableRow key={index} className="text-center">
                    <CTableDataCell>{item.bank_name}</CTableDataCell>
                    <CTableDataCell>{item.nomor_rekening}</CTableDataCell>
                    <CTableDataCell>{item.atas_nama}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        className="btn btn-warning btn-sm text-white"
                        onClick={() => handleModal('Edit', item)}
                      >
                        UBAH
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCol>
        )}
      </CCardBody>
      <CModal size="lg" alignment="center" visible={modalIsOpen} backdrop="static">
        <CModalBody style={{ justifyContent: 'center' }}>
          <CFormLabel style={{ fontWeight: 'bold', fontSize: '20px', paddingTop: '8px' }}>
            {type === 'Add' ? 'Tambah' : 'Ubah'} Bank
          </CFormLabel>
          <hr />
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>Nama Bank</CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={namaBank}
                onChange={(e) => setNamaBank(e.target.value)}
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Nomor Rekening
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={nomorRekening}
                onChange={(e) => setNomorRekening(e.target.value)}
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>Atas Nama</CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={atasNama}
                onChange={(e) => setAtasNama(e.target.value)}
              ></CFormInput>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter style={{ justifyContent: 'center' }}>
          <CButton color="success" className="text-white" onClick={() => handleCreateOrEdit(type)}>
            {type === 'Add' ? 'Tambah' : 'Ubah'}
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
    </CCard>
  )
}

export default Bank

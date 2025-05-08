import CIcon from '@coreui/icons-react'
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
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CRow,
  CSpinner,
} from '@coreui/react'
import { cilCheckCircle, cilXCircle } from '@coreui/icons'
import axios from 'axios'
import { useEffect, useState } from 'react'
import ReactSelect from 'react-select'
import { Link } from 'react-router-dom'

const CreateRequest = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [modalResponseIsOpen, setModalResponseIsOpen] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [responseType, setResponseType] = useState(false)
  const userID = sessionStorage.getItem('user')
  const [idTeknisi, setIdTeknisi] = useState("")
  const [idMesin, setIdMesin] = useState("")
  const [idSparepart, setIdSparepart] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [statusRequest, setStatusRequest] = useState("")
  const [counter, setCounter] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [listCustomer, setListCustomer] = useState([])
  const [listCustomerTransformed, setListCustomerTransformed] = useState([])

  const [selectedMachine, setSelectedMachine] = useState('')
  const [listMachine, setListMachine] = useState([])

  const [selectedSparepart, setSelectedSparepart] = useState('')
  const [listSparepart, setListSparepart] = useState([])

  useEffect(() => {
    GetListCustomer()
  }, [])

  useEffect(() => {
    if (listCustomer.length !== 0) {
      const transformedList = listCustomer.map((obj) => ({
        value: obj,
        label: `${obj.nama_customer} - ${obj.alamat}`,
      }))
      setListCustomerTransformed(transformedList)
    }
  }, [listCustomer])

  useEffect(() => {
    if (selectedCustomer !== '') {
      console.log(selectedCustomer)

      setIsLoading(true)
      const url = `http://192.168.88.250:8081/machines/customer?id=${selectedCustomer.value.id_customer}`

      axios
        .get(url)
        .then((response) => {
          const { data } = response.data
          setListMachine(data || [])
          setIsLoading(false)
        })
        .catch((error) => {
          console.error(error)
          alert('Error searching machines: ' + error.message)
          setIsLoading(false)
          setListMachine([])
        })
    }
  }, [selectedCustomer])

  useEffect(() => {
    if (
      (selectedCustomer && selectedCustomer.value.id_customer === 'Inventory') ||
      selectedMachine !== ''
    ) {
      setIsLoading(true)
      const url = `http://192.168.88.250:8081/spareparts`

      axios
        .get(url)
        .then((response) => {
          const { data } = response.data
          setListSparepart(data || [])
          setIsLoading(false)
        })
        .catch((error) => {
          console.error(error)
          alert('Error searching machines: ' + error.message)
          setIsLoading(false)
          setListSparepart([])
        })
    }
  }, [selectedCustomer, selectedMachine])

  const GetListCustomer = () => {
    setIsLoading(true)
    const url = `http://192.168.88.250:8081/customers`

    axios
      .get(url)
      .then((response) => {
        const { data } = response.data
        setListCustomer(data || [])
        setIsLoading(false)
      })
      .catch((error) => {
        console.error(error)
        alert('Error searching customers: ' + error.message)
        setIsLoading(false)
        setListSparepart([])
      })
  }

  function createRequest() {
    setIsLoading(true)
    console.log(selectedMachine)

    var obj = {
      id_teknisi: userID,
      id_mesin:
        selectedCustomer.value.id_customer === 'Inventory' ? '' : selectedMachine.value.id_machine,
      id_sparepart: selectedSparepart.value.id_sparepart,
      quantity: parseInt(quantity),
      status_request: 'Request',
      updated_by: userID,
    }
    var url = `http://192.168.88.250:8081/requests/create`

    axios
      .post(url, obj)
      .then((response) => {
        if (response.data.error.status === true) {
          console.log('Gagal Membuat Request Baru', response)
          setIsLoading(false)
          setResponseType(false)
          setResponseMessage(response.data.error.msg)
          setModalResponseIsOpen(true)
        } else {
          setIsLoading(false)
          console.log('Berhasil Membuat Request Baru', response)
          setResponseType(true)
          setResponseMessage('Berhasil Membuat Request Baru')
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
      <CCard>
        <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>
          Buat Request Baru
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>NAMA CUSTOMER</CFormLabel>
                <ReactSelect
                  options={listCustomerTransformed}
                  onChange={(e) => setSelectedCustomer(e)}
                  isSearchable={true}
                  placeholder="Tekan dan Pilih Customer..."
                />
                {/* <CFormInput value={selectedCompany.label} disabled /> */}
              </CForm>
            </CCol>
          </CRow>
          {listMachine.length !== 0 && (
            <CRow className="mt-3">
              <CCol>
                <CForm>
                  <CFormLabel style={{ fontWeight: 'bold' }}>MESIN</CFormLabel>

                  <ReactSelect
                    options={listMachine.map((machine) => ({
                      value: machine,
                      label: machine.tipe_machine,
                    }))}
                    onChange={(e) => setSelectedMachine(e)}
                    isSearchable={true}
                    placeholder="Tekan dan Pilih Mesin..."
                  />
                </CForm>
              </CCol>
            </CRow>
          )}
          {listSparepart.length !== 0 && (
            <CRow className="mt-3">
              <CCol>
                <CForm>
                  <CFormLabel style={{ fontWeight: 'bold' }}>SPAREPART</CFormLabel>
                  <ReactSelect
                    options={listSparepart.map((sparepart) => ({
                      value: sparepart,
                      label: sparepart.nama_sparepart,
                    }))}
                    onChange={(e) => setSelectedSparepart(e)}
                    isSearchable={true}
                    placeholder="Tekan dan Pilih Sparepart..."
                  />
                </CForm>
              </CCol>
            </CRow>
          )}
          {selectedSparepart.length !== 0 && (
            <CRow className="mt-3">
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>QUANTITY</CFormLabel>
                <CFormInput
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min={1}
                  type="number"
                ></CFormInput>
              </CForm>
            </CRow>
          )}
          {selectedSparepart.length !== 0 && selectedCustomer.value.id_customer !== 'Inventory' && (
            <CRow className="mt-3">
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>COUNTER (Saat Request atau Ganti Sparepart)</CFormLabel>
                <CFormInput
                  value={counter}
                  onChange={(e) => setCounter(e.target.value)}
                  min={1}
                  type="number"
                ></CFormInput>
              </CForm>
            </CRow>
          )}
        </CCardBody>
        <CCardFooter>
          <CRow>
            <CCol md={4}></CCol>
            <CCol md={4}>
              <CButton
                className="btn btn-success text-white"
                style={{ width: '100%', display: 'block' }}
                onClick={() => createRequest()}
                hidden={!selectedCustomer || !selectedSparepart}
              >
                Kirim Request
              </CButton>
            </CCol>
            <CCol md={4}></CCol>
          </CRow>
        </CCardFooter>
      </CCard>

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
          <Link to={`/request`} className="btn btn-block btn-info text-white">
            Kembali Ke Halaman Request
          </Link>
          <CButton color="success" className="text-white" onClick={() => window.location.reload()}>
            Tambah Request Lagi
          </CButton>
        </CModalFooter>
      </CModal>
      {/* MODAL RESPONSE */}
    </>
  )
}
export default CreateRequest

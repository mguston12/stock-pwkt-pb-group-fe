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
  const token = localStorage.getItem('token')
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081'

  const [isLoading, setIsLoading] = useState(false)
  const [modalResponseIsOpen, setModalResponseIsOpen] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [responseType, setResponseType] = useState(false)
  const userID = localStorage.getItem('user')
  const [idTeknisi, setIdTeknisi] = useState('')
  const [idMesin, setIdMesin] = useState('')
  const [idSparepart, setIdSparepart] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [statusRequest, setStatusRequest] = useState('')
  const [counter, setCounter] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [listCustomer, setListCustomer] = useState([])
  const [listCustomerTransformed, setListCustomerTransformed] = useState([])

  const [selectedMachine, setSelectedMachine] = useState('')
  const [listMachine, setListMachine] = useState([])

  const [selectedSparepart, setSelectedSparepart] = useState('')
  const [listSparepart, setListSparepart] = useState([])
  const [sparepartList, setSparepartList] = useState([])

  function addSparepartToList() {
    if (!selectedSparepart || quantity < 1) return

    const idSparepart = selectedSparepart.value.id_sparepart
    const namaSparepart = selectedSparepart.value.nama_sparepart
    const qtyToAdd = parseInt(quantity)

    setSparepartList((prevList) => {
      const index = prevList.findIndex((item) => item.id_sparepart === idSparepart)

      if (index !== -1) {
        // Jika sudah ada, tambahkan quantity
        const updatedList = [...prevList]
        updatedList[index].quantity += qtyToAdd
        return updatedList
      }

      // Jika belum ada, tambahkan sebagai item baru
      return [
        ...prevList,
        {
          id_sparepart: idSparepart,
          nama_sparepart: namaSparepart,
          quantity: qtyToAdd,
        },
      ]
    })

    setSelectedSparepart('')
    setQuantity(1)
  }

  function removeSparepart(index) {
    const newList = [...sparepartList]
    newList.splice(index, 1)
    setSparepartList(newList)
  }

  function submitAllRequests() {
    if (sparepartList.length === 0) {
      alert('Daftar sparepart kosong.')
      return
    }

    setIsLoading(true)

    const requests = sparepartList.map((item) => ({
      id_teknisi: userID,
      id_mesin: '', // bisa disesuaikan kalau mesin dipilih
      id_sparepart: item.id_sparepart,
      quantity: item.quantity,
      status_request: 'Request',
      updated_by: userID,
    }))

    axios
      .post(`${apiUrl}/requests/batch`, requests, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.error?.status) {
          setResponseType(false)
          setResponseMessage(response.data.error.msg)
        } else {
          setResponseType(true)
          setResponseMessage('Berhasil Mengirim Semua Request')
        }
        setIsLoading(false)
        setModalResponseIsOpen(true)
      })
      .catch((error) => {
        setIsLoading(false)
        setResponseType(false)
        setResponseMessage(error.message)
        setModalResponseIsOpen(true)
      })
  }

  // useEffect(() => {
  //   GetListCustomer()
  // }, [])

  // useEffect(() => {
  //   if (listCustomer.length !== 0) {
  //     const transformedList = listCustomer.map((obj) => ({
  //       value: obj,
  //       label: `${obj.nama_customer} - ${obj.alamat}`,
  //     }))
  //     setListCustomerTransformed(transformedList)
  //   }
  // }, [listCustomer])

  // useEffect(() => {
  //   if (selectedCustomer !== '') {
  //     console.log(selectedCustomer)

  //     setIsLoading(true)
  //     const url = `${apiUrl}/machines/customer?id=${selectedCustomer.value.id_customer}`

  //     axios
  //       .get(url, {

  //       .then((response) => {
  //         const { data } = response.data
  //         setListMachine(data || [])
  //         setIsLoading(false)
  //       })
  //       .catch((error) => {
  //         console.error(error)
  //         alert('Error searching machines: ' + error.message)
  //         setIsLoading(false)
  //         setListMachine([])
  //       })
  //   }
  // }, [selectedCustomer])

  useEffect(() => {
    // if (
    //   (selectedCustomer && selectedCustomer.value.id_customer === 'Inventory') ||
    //   selectedMachine !== ''
    // ) {
    setIsLoading(true)
    const url = `${apiUrl}/spareparts`

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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
    // }
  }, [])

  // const GetListCustomer = () => {
  //   setIsLoading(true)
  //   const url = `${apiUrl}/customers`

  //   axios
  //     .get(url, {

  //     .then((response) => {
  //       const { data } = response.data
  //       setListCustomer(data || [])
  //       setIsLoading(false)
  //     })
  //     .catch((error) => {
  //       console.error(error)
  //       alert('Error searching customers: ' + error.message)
  //       setIsLoading(false)
  //       setListSparepart([])
  //     })
  // }

  function createRequest() {
    setIsLoading(true)
    console.log(selectedMachine)

    var obj = {
      id_teknisi: userID,
      id_mesin: '',
      // selectedCustomer.value.id_customer === 'Inventory' ? '' : selectedMachine.value.id_machine,
      id_sparepart: selectedSparepart.value.id_sparepart,
      quantity: parseInt(quantity),
      status_request: 'Request',
      updated_by: userID,
    }
    var url = `${apiUrl}/requests/create`

    axios
      .post(url, obj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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
          {/* <CRow>
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>NAMA CUSTOMER</CFormLabel>
                <ReactSelect
                  options={listCustomerTransformed}
                  onChange={(e) => setSelectedCustomer(e)}
                  isSearchable={true}
                  placeholder="Tekan dan Pilih Customer..."
                />
                 <CFormInput value={selectedCompany.label} disabled /> 
              </CForm>
            </CCol>
          </CRow> */}
          {/* {listMachine.length !== 0 && (
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
          )} */}
          {listSparepart.length !== 0 && (
            <CRow>
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
                    filterOption={(option, inputValue) => {
                      const label = option.label.toLowerCase()
                      const terms = inputValue.toLowerCase().split(' ')

                      return terms.every((term) => label.includes(term))
                    }}
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
          <CRow className="mt-3 text-center">
            <CCol md={12}>
              <CButton
                className="text-white"
                color="info"
                onClick={addSparepartToList}
                disabled={!selectedSparepart}
              >
                Tambah ke Daftar
              </CButton>
            </CCol>
          </CRow>
          {sparepartList.length > 0 && (
            <CRow className="mt-4 text-center">
              <CCol>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama Sparepart</th>
                      <th>Jumlah</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sparepartList.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
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

          {/* {selectedSparepart.length !== 0 && selectedCustomer.value.id_customer !== 'Inventory' && (
            <CRow className="mt-3">
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>
                  COUNTER (Saat Request atau Ganti Sparepart)
                </CFormLabel>
                <CFormInput
                  value={counter}
                  onChange={(e) => setCounter(e.target.value)}
                  min={1}
                  type="number"
                ></CFormInput>
              </CForm>
            </CRow>
          )} */}
        </CCardBody>
        <CCardFooter>
          <CCol md={12}>
            <CButton
              className="btn btn-success text-white"
              style={{ width: '100%', display: 'block' }}
              onClick={submitAllRequests}
              hidden={sparepartList.length === 0}
            >
              Kirim Request
            </CButton>
          </CCol>

          {/* <CRow>
            <CCol md={4}></CCol>
            <CCol md={4}>
              <CButton
                className="btn btn-success text-white"
                style={{ width: '100%', display: 'block' }}
                onClick={() => createRequest()}
                hidden={!selectedSparepart}
              >
                Kirim Request
              </CButton>
            </CCol>
            <CCol md={4}></CCol>
          </CRow> */}
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

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
import { Link } from 'react-router-dom'

const CreateCustomer = () => {
  const [selectedCompany, setSelectedCompany] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [alamat, setAlamat] = useState('')
  const [pic, setPIC] = useState('')
  const [penandatangan, setPenandatangan] = useState('')
  const [jabatan, setJabatan] = useState('')
  const [nomorTelepon, setNomorTelepon] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [modalResponseIsOpen, setModalResponseIsOpen] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [responseType, setResponseType] = useState(false)
  const userID = localStorage.getItem('user')
  const token = localStorage.getItem('token')

  useEffect(() => {
    setSelectedCompany(JSON.parse(decodeURIComponent(localStorage.getItem('PT'))))
  }, [])

  function createCustomer() {
    setIsLoading(true)
    var obj = {
      company_id: parseInt(selectedCompany.value),
      nama_customer: customerName,
      alamat_customer: alamat,
      pic: pic,
      penandatangan: penandatangan,
      jabatan: jabatan,
      no_telp: nomorTelepon,
      updated_by: userID,
    }
    var url = import.meta.env.VITE_API_URL || 'http://localhost:8082'

    axios
      .post(url, obj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.error.status === true) {
          console.log('Gagal Membuat Customer Baru', response)
          setIsLoading(false)
          setResponseType(false)
          setResponseMessage(response.data.error.msg)
          setModalResponseIsOpen(true)
        } else {
          setIsLoading(false)
          console.log('Berhasil Membuat Customer Baru', response)
          setResponseType(true)
          setResponseMessage('Berhasil Membuat Customer Baru')
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
          Buat Customer Baru
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>COMPANY</CFormLabel>
                <CFormInput value={selectedCompany.label} disabled />
              </CForm>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>NAMA CUSTOMER</CFormLabel>
                <CFormInput onChange={(e) => setCustomerName(e.target.value)} />
              </CForm>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>ALAMAT</CFormLabel>
                <CFormTextarea onChange={(e) => setAlamat(e.target.value)} />
              </CForm>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>PIC</CFormLabel>
                <CFormInput onChange={(e) => setPIC(e.target.value)} />
              </CForm>
            </CCol>
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>
                  NOMOR TELEPON <span style={{ color: 'red', fontSize: '12px' }}>(PIC)</span>
                </CFormLabel>
                <CFormInput onChange={(e) => setNomorTelepon(e.target.value)} />
              </CForm>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>PENANDATANGAN</CFormLabel>
                <CFormInput onChange={(e) => setPenandatangan(e.target.value)} />
              </CForm>
            </CCol>
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>
                  JABATAN <span style={{ color: 'red', fontSize: '12px' }}>(PENANDATANGAN)</span>
                </CFormLabel>
                <CFormInput onChange={(e) => setJabatan(e.target.value)} />
              </CForm>
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          <CRow>
            <CCol md={4}></CCol>
            <CCol md={4}>
              <CButton
                className="btn btn-success text-white"
                style={{ width: '100%', display: 'block' }}
                onClick={() => createCustomer()}
                disabled={
                  customerName === '' ||
                  alamat === '' ||
                  pic === '' ||
                  penandatangan === '' ||
                  nomorTelepon === '' ||
                  jabatan === ''
                }
              >
                SIMPAN
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
          <Link to={`/customer`} className="btn btn-block btn-info text-white">
            Kembali Ke Halaman Customer
          </Link>
          <CButton color="success" className="text-white" onClick={() => window.location.reload()}>
            Tambah Customer Lagi
          </CButton>
        </CModalFooter>
      </CModal>
      {/* MODAL RESPONSE */}
    </>
  )
}
export default CreateCustomer

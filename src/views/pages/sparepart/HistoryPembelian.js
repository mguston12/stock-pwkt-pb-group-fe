import { cilCheckCircle, cilPlus, cilTrash, cilX, cilXCircle } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
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
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import ReactSelect from 'react-select'
import moment from 'moment'
import { Link, useParams } from 'react-router-dom'

const HistoryPembelian = () => {
  const token = sessionStorage.getItem('token')
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081'

  const [isLoading, setIsLoading] = useState(false)
  const [sparepartDetail, setSparepartDetail] = useState([])

  let { id_sparepart, nama_sparepart } = useParams()
  nama_sparepart = nama_sparepart.replaceAll('-', ' ')

  const [modalResponseIsOpen, setModalResponseIsOpen] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [responseType, setResponseType] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const url = `${apiUrl}/purchase/${id_sparepart}`

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
        setSparepartDetail(data)
      })
      .catch((error) => {
        console.error(error)
        alert('Error fetching machines: ' + error.message)
        setIsLoading(false)
        setSparepartDetail('')
      })
  }, [id_sparepart])

  // Fungsi untuk menampilkan angka dengan titik
  const formatRibuan = (angka) => {
    if (!angka) return ''
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  return (
    <>
      <CCard>
        <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>
          Detail Pembelian Sparepart
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>ID Sparepart</CFormLabel>
                <CFormInput value={id_sparepart} disabled />
              </CForm>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>Nama Sparepart</CFormLabel>
                <CFormInput value={nama_sparepart} disabled />
              </CForm>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <CCard style={{ marginTop: '20px' }}>
        <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>
          <CRow>
            <CCol>List History Pembelian Sparepart</CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          {!sparepartDetail && (
            <CCol style={{ textAlign: 'center' }}>Maaf Data Tidak Ditemukan</CCol>
          )}
          {sparepartDetail && sparepartDetail.length >= 1 && (
            <CCol>
              <CTable striped bordered hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell className="text-center">Tanggal Pembelian</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Quantity</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Harga per Unit</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Nama Supplier</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {sparepartDetail.map((item, index) => (
                    <CTableRow key={index} className="text-center">
                      <CTableDataCell>
                        {moment.utc(item.tanggal_pembelian).utcOffset('+07:00').format('DD-MMM-YYYY')}
                      </CTableDataCell>
                      <CTableDataCell>{item.quantity}</CTableDataCell>
                      <CTableDataCell>Rp {formatRibuan(item.harga_per_unit)}</CTableDataCell>
                      <CTableDataCell>{item.nama_supplier}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCol>
          )}
        </CCardBody>
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
          <CButton color="success" className="text-white" onClick={() => window.location.reload()}>
            Tutup
          </CButton>
        </CModalFooter>
      </CModal>
      {/* MODAL RESPONSE */}
    </>
  )
}
export default HistoryPembelian

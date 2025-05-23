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

const DetailSupplier = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [supplierDetail, setSupplierDetail] = useState([])

  let { id_supplier } = useParams()

  const [modalResponseIsOpen, setModalResponseIsOpen] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [responseType, setResponseType] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const url = `http://192.168.88.250:8081/purchase/supplier/${id_supplier}`

    axios
      .get(url)
      .then((response) => {
        console.log(response)

        setIsLoading(false)
        const { data } = response.data
        setSupplierDetail(data)
      })
      .catch((error) => {
        console.error(error)
        alert('Error fetching machines: ' + error.message)
        setIsLoading(false)
        setSupplierDetail('')
      })
  }, [id_supplier])

  return (
    <>
      {!supplierDetail && (
        <CCard>
          <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>
            Tidak ada data yang ditemukan
          </CCardHeader>
        </CCard>
      )}
      {supplierDetail.length !== 0 && (
        <>
          <CCard>
            <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>
              Detail Pembelian dari Supplier
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol>
                  <CForm>
                    <CFormLabel style={{ fontWeight: 'bold' }}>ID Supplier</CFormLabel>
                    <CFormInput value={supplierDetail[0].id_supplier} disabled />
                  </CForm>
                </CCol>
              </CRow>
              <CRow className="mt-3">
                <CCol>
                  <CForm>
                    <CFormLabel style={{ fontWeight: 'bold' }}>Nama Supplier</CFormLabel>
                    <CFormInput value={supplierDetail[0].nama_supplier} disabled />
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
              {!supplierDetail && (
                <CCol style={{ textAlign: 'center' }}>Maaf Data Tidak Ditemukan</CCol>
              )}
              {supplierDetail && supplierDetail.length >= 1 && (
                <CCol>
                  <CTable striped bordered hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell className="text-center">
                          Tanggal Pembelian
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Nama Sparepart</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Quantity</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Harga per Unit</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {supplierDetail.map((item, index) => (
                        <CTableRow key={index} className="text-center">
                          <CTableDataCell>
                            {moment(item.tanggal_pembelian).format('DD-MMM-YYYY')}
                          </CTableDataCell>
                          <CTableDataCell>{item.nama_sparepart}</CTableDataCell>
                          <CTableDataCell>{item.quantity}</CTableDataCell>
                          <CTableDataCell>{item.harga_per_unit}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCol>
              )}
            </CCardBody>
          </CCard>
        </>
      )}

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
export default DetailSupplier

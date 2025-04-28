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

const DetailMachine = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [machineDetail, setMachineDetail] = useState('')
  const [listHistory, setListHistory] = useState('')

  let { id_machine } = useParams()

  useEffect(() => {
    setIsLoading(true)
    const url = `http://192.168.88.250:8081/machines/detail?id=${id_machine}`

    axios
      .get(url)
      .then((response) => {
        console.log(response)

        setIsLoading(false)
        const { data } = response.data
        setMachineDetail(data)
        setListHistory(data.History)
      })
      .catch((error) => {
        console.error(error)
        alert('Error fetching machines: ' + error.message)
        setIsLoading(false)
        setMachineDetail('')
        setListHistory([])
      })
  }, [id_machine])

  return (
    <>
      <CCard>
        <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>Detail Mesin</CCardHeader>
        <CCardBody>
          <CRow>
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>ID Mesin</CFormLabel>
                <CFormInput value={machineDetail.id_machine} disabled />
              </CForm>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>Tipe Mesin</CFormLabel>
                <CFormInput value={machineDetail.tipe_machine} disabled />
              </CForm>
            </CCol>
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>Counter</CFormLabel>
                <CFormInput value={machineDetail.counter} disabled />
              </CForm>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <CCard style={{ marginTop: '20px' }}>
        <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>
          <CRow>
            <CCol>List History Sparepart</CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          {listHistory && listHistory.length === 0 && (
            <CCol style={{ textAlign: 'center' }}>Maaf Data Tidak Ditemukan</CCol>
          )}
          {listHistory && listHistory.length > 0 && (
            <CCol>
              <CTable striped bordered hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell className="text-center">ID Request</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Quantity</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Sparepart</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Teknisi</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Tanggal</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {listHistory.map((item, index) => (
                    <CTableRow key={index} className="text-center">
                      <CTableDataCell>{item.id_request}</CTableDataCell>
                      <CTableDataCell>{item.quantity}</CTableDataCell>
                      <CTableDataCell>{item.nama_sparepart}</CTableDataCell>
                      <CTableDataCell>{item.nama_teknisi}</CTableDataCell>
                      <CTableDataCell>
                        {moment(item.updated_at).format('DD-MMM-YYYY')}
                      </CTableDataCell>
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
    </>
  )
}
export default DetailMachine

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

const DetailTeknisi = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [teknisiDetail, setTeknisiDetail] = useState('')

  let { id_teknisi } = useParams()

  useEffect(() => {
    setIsLoading(true)
    const url = `http://192.168.88.250:8081/teknisi/detail?id=${id_teknisi}`

    axios
      .get(url)
      .then((response) => {
        console.log(response)

        setIsLoading(false)
        const { data } = response.data
        setTeknisiDetail(data)
      })
      .catch((error) => {
        console.error(error)
        alert('Error fetching teknisi: ' + error.message)
        setIsLoading(false)
        setTeknisiDetail('')
      })
  }, [id_teknisi])

  return (
    <>
      <CCard>
        <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>Detail Teknisi</CCardHeader>
        <CCardBody>
          <CRow>
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>ID Teknisi</CFormLabel>
                <CFormInput value={teknisiDetail.id_teknisi} disabled />
              </CForm>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>Nama Teknisi</CFormLabel>
                <CFormInput value={teknisiDetail.nama_teknisi} disabled />
              </CForm>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <CCard></CCard>

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
export default DetailTeknisi

import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CPagination,
  CPaginationItem,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'

const ExpiredSoon = () => {
  const [listContract, setListContract] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [inputSearch, setInputSearch] = useState('')
  const [selectedCompany, setSelectedCompany] = useState(null)

  useEffect(() => {
    const company = JSON.parse(decodeURIComponent(sessionStorage.getItem('PT')))
    setSelectedCompany(company)
  }, [])

  useEffect(() => {
    if (selectedCompany?.value) {
      GetContracts()
    }
  }, [selectedCompany])

  const GetContracts = () => {
    if (selectedCompany) {
      setIsLoading(true)
      const url = `http://192.168.88.250:8080/contracts/expiredsoon?company=${selectedCompany.value}`

      axios
        .get(url)
        .then((response) => {
          setIsLoading(false)
          const { data, metadata } = response.data
          setListContract(data || [])
        })
        .catch((error) => {
          console.error(error)
          alert('Error fetching contracts: ' + error.message)
          setIsLoading(false)
          setListContract([])
        })
    }
  }

  return (
    <CCard>
      <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>
        <CRow>
          <CCol>List Kontrak Expired Bulan Depan</CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        {listContract.length === 0 && !isLoading && (
          <CCol style={{ textAlign: 'center' }}>Maaf Data Tidak Ditemukan</CCol>
        )}
        {listContract.length > 0 && (
          <CCol>
            <CTable striped bordered hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="text-center">No. Kontrak</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Quantity</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Tipe Mesin</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Harga</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Periode Awal</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Periode Akhir</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {listContract.map((item, index) => (
                  <CTableRow key={index} className="text-center">
                    <CTableDataCell>{item.no_kontrak}</CTableDataCell>
                    <CTableDataCell>{item.quantity}</CTableDataCell>
                    <CTableDataCell>{item.tipe_mesin}</CTableDataCell>
                    <CTableDataCell>Rp {item.harga_sewa}</CTableDataCell>
                    <CTableDataCell>{moment(item.periode_awal).format("DD MMMM YYYY")}</CTableDataCell>
                    <CTableDataCell>{moment(item.periode_akhir).format("DD MMMM YYYY")}</CTableDataCell>
                    <CTableDataCell>
                      <Link
                        to={`/contract/detail/${item.no_kontrak.replace(/\//g, '-')}`}
                        className="btn btn-warning btn-sm text-white"
                        disabled
                      >
                        Detail
                      </Link>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCol>
        )}
      </CCardBody>
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

export default ExpiredSoon

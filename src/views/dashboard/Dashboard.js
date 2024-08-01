import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CFormLabel,
  CFormSelect,
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

const Dashboard = () => {
  const [listCompanies, setListCompanies] = useState([])
  const [listCompaniesTransformed, setListCompaniesTransformed] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState('')
  const [company, setCompany] = useState('')
  const [modalResponseIsOpen, setModalResponseIsOpen] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [responseType, setResponseType] = useState(false)

  const OpenFeatures = () => {
    sessionStorage.setItem('PT', JSON.stringify(selectedCompany))
    setResponseType(true)
    setResponseMessage('Berhasil Memilih PT')
    setModalResponseIsOpen(true)
  }

  useEffect(() => {
    if (sessionStorage.getItem('PT')) {
      setCompany(JSON.parse(decodeURIComponent(sessionStorage.getItem('PT'))))
    }
  }, [])

  useEffect(() => {
    if (listCompanies.length !== 0) {
      const transformedList = listCompanies.map((obj) => ({
        value: obj.company_id,
        label: obj.company_name,
      }))
      setListCompaniesTransformed(transformedList)
    }
  }, [listCompanies])

  useEffect(() => {
    setIsLoading(true)
    const url = `https://f9af-180-252-163-217.ngrok-free.app/companies`

    axios
      .get(url)
      .then((response) => {
        if (response.data.data.length !== 0) {
          setListCompanies(response.data.data)
          setIsLoading(false)
        } else {
          setListCompanies([])
          setIsLoading(false)
        }
      })
      .catch((error) => {
        alert(error.message)
        setIsLoading(false)
      })
  }, [])

  return (
    <>
      <CRow>
        <CCol md={3}></CCol>
        <CCol md={6}>
          <CCard style={{ marginTop: '100px' }}>
            <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>Pilih PT</CCardHeader>
            <CCardBody>
              <CCol>
                <ReactSelect
                  options={listCompaniesTransformed}
                  value={selectedCompany === '' ? company : selectedCompany}
                  onChange={(e) => setSelectedCompany(e)}
                  isSearchable={true} // This enables the search functionality
                  placeholder="Tekan dan Pilih PT..."
                />
              </CCol>
            </CCardBody>
            <CCardFooter>
              <CCol align="center">
                <CButton
                  className="btn-block"
                  color="dark"
                  onClick={() => OpenFeatures()}
                  disabled={selectedCompany === ''}
                >
                  {company === '' ? 'Buka Fitur' : 'Ganti PT'}
                </CButton>
              </CCol>
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
    </>
  )
}

export default Dashboard

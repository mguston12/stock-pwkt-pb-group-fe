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

const Report = () => {
  const token = sessionStorage.getItem('token')
  const [isLoading, setIsLoading] = useState(false)
  const [modalResponseIsOpen, setModalResponseIsOpen] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [responseType, setResponseType] = useState(false)
  const [listBulan, setListBulan] = useState([
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' },
  ])

  const currentYear = new Date().getFullYear()
  const [listTahun, setListTahun] = useState([
    { value: currentYear, label: `${currentYear}` },
    { value: currentYear - 1, label: `${currentYear - 1}` },
    { value: currentYear - 2, label: `${currentYear - 2}` },
  ])

  const [selectedMonth, setSelectedMonth] = useState(null)
  const [selectedYear, setSelectedYear] = useState(null)

  const handleDownloadExcel = async () => {
    if (!selectedMonth || !selectedYear) {
      setResponseMessage('Harap pilih bulan dan tahun terlebih dahulu!')
      setResponseType(false)
      setModalResponseIsOpen(true)
      return
    }

    setIsLoading(true)

    const url = `http://192.168.88.250:8081/histories/report?bulan=${selectedMonth.value}&tahun=${selectedYear.value}`

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      })

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = `Report-${selectedMonth.label}-${selectedYear.value}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setResponseMessage('Berhasil mengunduh laporan Excel.')
      setResponseType(true)
    } catch (error) {
      console.error(error)
      setResponseMessage('Gagal mengunduh laporan: ' + error.message)
      setResponseType(false)
    } finally {
      setIsLoading(false)
      setModalResponseIsOpen(true)
    }
  }

  return (
    <>
      <CRow>
        <CCol md={3}></CCol>
        <CCol md={6}>
          <CCard style={{ marginTop: '100px' }}>
            <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>Excel Report</CCardHeader>
            <CCardBody>
              <CFormLabel style={{ fontWeight: 'bold' }}>Bulan</CFormLabel>
              <CCol style={{ marginBottom: '20px' }}>
                <ReactSelect
                  options={listBulan}
                  value={selectedMonth}
                  onChange={setSelectedMonth}
                  isSearchable
                  placeholder="Pilih Bulan..."
                />
              </CCol>
              <CCol>
                <CFormLabel style={{ fontWeight: 'bold' }}>Tahun</CFormLabel>
                <ReactSelect
                  options={listTahun}
                  value={selectedYear}
                  onChange={setSelectedYear}
                  isSearchable
                  placeholder="Pilih Tahun..."
                />
              </CCol>
            </CCardBody>
            <CCardFooter>
              <CCol align="center">
                <CButton
                  className="btn-block btn-success text-white"
                  onClick={handleDownloadExcel}
                  disabled={!selectedMonth || !selectedYear}
                >
                  Unduh Laporan
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

export default Report

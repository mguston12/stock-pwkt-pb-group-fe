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

const DetailContract = () => {
  const [selectedCompany, setSelectedCompany] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [contractNumber, setContractNumber] = useState('')
  const [contractDetail, setContractDetail] = useState('')
  const [listMesin, setListMesin] = useState([])

  let { no_kontrak } = useParams()
  useEffect(() => {
    if (no_kontrak !== '') {
      var number = no_kontrak.split('-')

      setContractNumber(number[0])
    }
  }, [no_kontrak])

  useEffect(() => {
    setSelectedCompany(JSON.parse(decodeURIComponent(sessionStorage.getItem('PT'))))
  }, [])

  useEffect(() => {
    if (selectedCompany !== '') {
      GetContractDetailByID()
    }
  }, [selectedCompany])

  const GetContractDetailByID = () => {
    setIsLoading(true)
    const url = `http://192.168.88.250:8080/contracts/detail?company=${selectedCompany.value}&kontrak=${contractNumber}`

    axios
      .get(url)
      .then((response) => {
        setIsLoading(false)
        if (response.data.data !== null) {
          setContractDetail(response.data.data)
          setListMesin(response.data.data.details)
        } else {
          setContractDetail([])
        }
      })
      .catch((error) => {
        alert(error.message)
        setIsLoading(false)
      })
  }

  const printContract = () => {
    setIsLoading(true)
    const url = `http://192.168.88.250:8080/contracts/print?company=${selectedCompany.value}&kontrak=${contractDetail.no_kontrak}`

    axios
      .get(url, { responseType: 'blob' })
      .then((response) => {
        const urlblob = window.URL.createObjectURL(
          new Blob([response.data], { type: 'application/pdf' }),
        )
        const link = document.createElement('a')
        link.href = urlblob
        link.setAttribute(
          'download',
          `Kontrak_${contractDetail.no_kontrak}-${contractDetail.nama_customer}.pdf`,
        )
        document.body.appendChild(link)
        link.click()
        setIsLoading(false)
      })
      .catch((error) => {
        alert(error.message)
        setIsLoading(false)
      })
  }

  return (
    <>
      <CCard>
        <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>
          <CRow>
            <CCol>
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Buat Kontrak Baru</span>
            </CCol>

            <CCol>
              <CButton
                className="btn btn-block btn-info text-white"
                style={{ float: 'right' }}
                onClick={() => printContract()}
              >
                Buat PDF
              </CButton>
              <Link
                to={`/contract/edit/${no_kontrak}`}
                className="btn btn-block btn-warning text-white"
                style={{ float: 'right', marginRight: '10px' }}
              >
                Ubah
              </Link>
            </CCol>
          </CRow>
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
                <CFormLabel style={{ fontWeight: 'bold' }}>NOMOR KONTRAK</CFormLabel>
                <CFormInput value={contractDetail.no_kontrak} disabled />
              </CForm>
            </CCol>
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>TANGGAL BUAT</CFormLabel>
                <CFormInput value={contractDetail.tanggal_buat} disabled />
              </CForm>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <CCard className="mt-3">
        <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>Data Customer</CCardHeader>
        <CCardBody>
          <CRow>
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>CUSTOMER</CFormLabel>
                <CFormInput value={contractDetail.nama_customer} disabled />
              </CForm>
            </CCol>
          </CRow>
          <CCol>
            <CRow className="mt-3">
              <CCol>
                <CForm>
                  <CFormLabel style={{ fontWeight: 'bold' }}>Alamat</CFormLabel>
                  <CFormTextarea value={contractDetail.alamat_customer} disabled></CFormTextarea>
                </CForm>
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol>
                <CForm>
                  <CFormLabel style={{ fontWeight: 'bold' }}>PIC</CFormLabel>
                  <CFormInput value={contractDetail.pic} disabled></CFormInput>
                </CForm>
              </CCol>
              <CCol>
                <CForm>
                  <CFormLabel style={{ fontWeight: 'bold' }}>Penandatangan</CFormLabel>
                  <CFormInput value={contractDetail.penandatangan} disabled></CFormInput>
                </CForm>
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol>
                <CForm>
                  <CFormLabel style={{ fontWeight: 'bold' }}>Nomor Telepon</CFormLabel>
                  <CFormInput value={contractDetail.no_telp} disabled></CFormInput>
                </CForm>
              </CCol>
              <CCol>
                <CForm>
                  <CFormLabel style={{ fontWeight: 'bold' }}>Jabatan</CFormLabel>
                  <CFormInput value={contractDetail.jabatan} disabled></CFormInput>
                </CForm>
              </CCol>
            </CRow>
          </CCol>
        </CCardBody>
      </CCard>
      <CCard className="mt-3 ">
        <CCardHeader>
          <CRow>
            <CCol>
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Data Mesin</span>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol>
              <CTable striped bordered hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell className="text-center">Qty</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Tipe Mesin</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Speed</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Harga Sewa</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Free Copy</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Over Copy</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">FC Color</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">OC Color</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Periode Awal</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Periode Akhir</CTableHeaderCell>
                    <CTableHeaderCell className="text-center" width="20%">
                      Penempatan
                    </CTableHeaderCell>
                    {/* <CTableHeaderCell className="text-center">Status</CTableHeaderCell> */}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {listMesin.map((item, index) => (
                    <CTableRow key={index} className="text-center">
                      <CTableDataCell>{item.quantity}</CTableDataCell>
                      <CTableDataCell>{item.tipe_mesin}</CTableDataCell>
                      <CTableDataCell>{item.speed}</CTableDataCell>
                      <CTableDataCell>Rp {item.harga_sewa}</CTableDataCell>
                      <CTableDataCell>{item.free_copy}</CTableDataCell>
                      <CTableDataCell>Rp {item.over_copy}</CTableDataCell>
                      <CTableDataCell>{item.free_copy_color}</CTableDataCell>
                      <CTableDataCell>Rp {item.over_copy_color}</CTableDataCell>
                      <CTableDataCell>
                        {moment(item.periode_awal).format('DD MMM YYYY')}
                      </CTableDataCell>
                      <CTableDataCell>
                        {moment(item.periode_akhir).format('DD MMM YYYY')}
                      </CTableDataCell>
                      <CTableDataCell>{item.penempatan}</CTableDataCell>
                      {/* <CTableDataCell>
                        <CButton
                          className={
                            item.active_yn === 'Y'
                              ? 'btn btn-success btn-sm text-white'
                              : 'btn btn-danger btn-sm text-white'
                          }
                        >
                          {item.active_yn === 'Y' ? 'Aktif' : 'Tidak Aktif'}
                        </CButton>
                      </CTableDataCell> */}
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <CCard className="mt-3 mb-5">
        <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>Data Bank</CCardHeader>
        <CCardBody>
          <CRow>
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>BANK</CFormLabel>
                <CFormInput value={contractDetail.bank_name} disabled></CFormInput>
              </CForm>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>Nomor Rekening</CFormLabel>
                <CFormInput value={contractDetail.nomor_rekening} disabled></CFormInput>
              </CForm>
            </CCol>
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>Atas Nama</CFormLabel>
                <CFormInput value={contractDetail.atas_nama} disabled></CFormInput>
              </CForm>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <CCard className="mt-3 mb-5">
        <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>Data Lainnya</CCardHeader>
        <CCardBody>
          <CRow>
            <CCol>
              <CFormLabel style={{ fontWeight: 'bold', marginTop: '7px' }}>
                Deposit{' '}
                <span style={{ color: 'red', fontSize: '12px' }}>
                  [Jika tidak ada deposit, isi dengan 0]
                </span>
              </CFormLabel>
            </CCol>
            <CCol md={1} style={{ fontWeight: 'bold', textAlign: 'end', marginTop: '7px' }}>
              Rp.
            </CCol>
            <CCol md={6}>
              <CFormInput value={contractDetail.deposit} disabled></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CFormLabel style={{ fontWeight: 'bold', marginTop: '7px' }}>
                Denda 1% (Pasal 3)
                <span style={{ color: 'red', fontSize: '12px', marginLeft: '5px' }}>
                  [Pilih YA / TIDAK]
                </span>
              </CFormLabel>
            </CCol>
            <CCol md={6}>
              <CFormInput
                value={contractDetail.denda_satupersenyn === 'Y' ? 'YA' : 'TIDAK'}
                disabled
              ></CFormInput>
            </CCol>
          </CRow>
          <hr></hr>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', marginTop: '7px', fontSize: '20px' }}>
                  Cara Pembayaran
                </CFormLabel>
              </CForm>
            </CCol>
            {/* <CCol>
              <CForm>
                <CFormInput value={contractDetail.payment_id} disabled></CFormInput>
              </CForm>
            </CCol> */}
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', marginTop: '7px' }}>
                  Paling Lambat
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CForm>
                <CFormInput value={`${contractDetail.paling_lambat} Hari`} disabled></CFormInput>
              </CForm>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', marginTop: '7px' }}>
                  Melunasi Dalam Waktu
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CForm>
                <CFormInput value={`${contractDetail.melunasi} Hari`} disabled></CFormInput>
              </CForm>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', marginTop: '7px' }}>
                  Tertunda lebih dari
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CForm>
                <CFormInput value={`${contractDetail.tertunda} Hari`} disabled></CFormInput>
              </CForm>
            </CCol>
          </CRow>
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
export default DetailContract

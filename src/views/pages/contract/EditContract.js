import { cilCheckCircle, cilPencil, cilPlus, cilTrash, cilX, cilXCircle } from '@coreui/icons'
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

const EditContract = () => {
  const [selectedCompany, setSelectedCompany] = useState('')
  const [listCustomer, setListCustomer] = useState([])
  const [listCustomerTransformed, setListCustomerTransformed] = useState([])
  const [listBank, setListBank] = useState([])
  const [listBankTransformed, setListBankTransformed] = useState([])
  const [listPaymentMethod, setListPaymentMethod] = useState([])
  const [listPaymentMethodTransformed, setListPaymentMethodTransformed] = useState([])

  const [listMesin, setListMesin] = useState([])
  const [contractDetail, setContractDetail] = useState('')
  const [contractNumber, setContractNumber] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [modalResponseIsOpen, setModalResponseIsOpen] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [responseType, setResponseType] = useState(false)

  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [selectedBank, setSelectedBank] = useState('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false)
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false)
  const [indexToEdit, setIndexToEdit] = useState('')

  const [tanggalBuat, setTanggalBuat] = useState('')
  const [deposit, setDeposit] = useState(0)
  const [dendaSatuPersenYN, setDendaSatuPersenYN] = useState({
    value: 'Y',
    label: 'YA',
  })

  const [qtyMesin, setQtyMesin] = useState(1)
  const [tipeMesin, setTipeMesin] = useState('')
  const [speed, setSpeed] = useState('')
  const [hargaSewa, setHargaSewa] = useState(0)
  const [freeCopy, setFreeCopy] = useState('')
  const [overCopy, setOverCopy] = useState('')
  const [freeCopyColor, setFreeCopyColor] = useState('')
  const [overCopyColor, setOverCopyColor] = useState('')
  const [periodeAwal, setPeriodeAwal] = useState(new Date())
  const [periodeAkhir, setPeriodeAkhir] = useState(new Date())
  const [penempatan, setPenempatan] = useState('')
  const userID = sessionStorage.getItem('user')

  useEffect(() => {
    setSelectedCompany(JSON.parse(decodeURIComponent(sessionStorage.getItem('PT'))))
  }, [])

  let { no_kontrak } = useParams()
  useEffect(() => {
    if (no_kontrak !== '') {
      var number = no_kontrak.split('-')

      setContractNumber(number[0])
    }
  }, [no_kontrak])

  const GetContractDetailByID = () => {
    setIsLoading(true)
    const url = `http://192.168.88.250:8080/contracts/detail?company=${selectedCompany.value}&kontrak=${contractNumber}`

    axios
      .get(url)
      .then((response) => {
        setIsLoading(false)
        console.log(response)
        if (response.data.data !== null) {
          setContractDetail(response.data.data)
          setContractNumber(response.data.data.no_kontrak)
          setTanggalBuat(response.data.data.tanggal_buat)
          setDeposit(response.data.data.deposit)
          setSelectedCustomer({
            value: {
              id_customer: response.data.data.id_customer,
              nama_customer: response.data.data.nama_customer,
              alamat_customer: response.data.data.alamat_customer,
              pic: response.data.data.pic,
              penandatangan: response.data.data.penandatangan,
              no_telp: response.data.data.no_telp,
              jabatan: response.data.data.jabatan,
            },
            label: response.data.data.nama_customer,
          })
          setSelectedBank({
            value: {
              bank_id: response.data.data.bank_id,
              bank_name: response.data.data.bank_name,
              nomor_rekening: response.data.data.nomor_rekening,
              atas_nama: response.data.data.atas_nama,
            },
            label: response.data.data.bank_name,
          })
          setSelectedPaymentMethod({
            value: {
              payment_id: response.data.data.payment_id,
              paling_lambat: response.data.data.paling_lambat,
              melunasi: response.data.data.melunasi,
              tertunda: response.data.data.tertunda,
            },
            label: `Paling Lambat : ${response.data.data.paling_lambat} Hari - Melunasi : ${response.data.data.melunasi} Hari - Tertunda : ${response.data.data.tertunda} Hari`,
          })
          setListMesin(response.data.data.details || [])
        } else {
          setContractDetail([])
        }
      })
      .catch((error) => {
        alert(error.message)
        setIsLoading(false)
      })
  }

  useEffect(() => {
    if (listCustomer.length !== 0 && listBank.length !== 0 && listPaymentMethod.length !== 0) {
      const transformedList = listCustomer.map((obj) => ({
        value: obj,
        label: obj.nama_customer,
      }))
      setListCustomerTransformed(transformedList)

      const transformedList2 = listBank.map((obj) => ({
        value: obj,
        label: obj.bank_name,
      }))
      setListBankTransformed(transformedList2)

      const transformedList3 = listPaymentMethod.map((obj) => ({
        value: obj,
        label: `Paling Lambat : ${obj.paling_lambat} Hari - Melunasi : ${obj.melunasi} Hari - Tertunda : ${obj.tertunda} Hari`,
      }))
      setListPaymentMethodTransformed(transformedList3)
    }
  }, [listCustomer, listBank, listPaymentMethod])

  useEffect(() => {
    if (selectedCompany !== '') {
      GetListCustomersByCompany()
      GetListBanks()
      GetContractDetailByID()
      GetListPaymentMethod()
    }
  }, [selectedCompany])

  const GetListCustomersByCompany = () => {
    setIsLoading(true)
    const url = `http://192.168.88.250:8080/customers?company=${selectedCompany.value}`

    axios
      .get(url)
      .then((response) => {
        setIsLoading(false)
        if (response.data.data !== null) {
          setListCustomer(response.data.data)
        } else {
          setListCustomer([])
        }
      })
      .catch((error) => {
        alert(error.message)
        setIsLoading(false)
      })
  }

  const GetListBanks = () => {
    setIsLoading(true)
    const url = `http://192.168.88.250:8080/banks`

    axios
      .get(url)
      .then((response) => {
        setIsLoading(false)
        if (response.data.data !== null) {
          setListBank(response.data.data)
        } else {
          setListBank([])
        }
      })
      .catch((error) => {
        alert(error.message)
        setIsLoading(false)
      })
  }

  const GetListPaymentMethod = () => {
    const url = `http://192.168.88.250:8080/payment-method`

    axios
      .get(url)
      .then((response) => {
        setIsLoading(false)
        if (response.data.data !== null) {
          setListPaymentMethod(response.data.data)
        } else {
          setListPaymentMethod([])
        }
      })
      .catch((error) => {
        alert(error.message)
        setIsLoading(false)
      })
  }

  function EditContract() {
    setIsLoading(true)
    var obj = {
      no_kontrak: contractNumber,
      tanggal_buat: tanggalBuat,
      company_id: parseInt(selectedCompany.value),
      id_customer: selectedCustomer.value.id_customer,
      bank_id: selectedBank.value.bank_id,
      payment_id: selectedPaymentMethod.value.payment_id,
      deposit: parseFloat(deposit),
      active_yn: 'Y',
      updated_by: userID,
      details: listMesin,
    }
    var url = `http://192.168.88.250:8080/contracts/update`

    axios
      .post(url, obj)
      .then((response) => {
        if (response.data.error.status === true) {
          console.log('Gagal Membuat Kontrak Baru', response)
          setIsLoading(false)
          setResponseType(false)
          setResponseMessage(response.data.error.msg)
          setModalResponseIsOpen(true)
        } else {
          setIsLoading(false)
          console.log('Berhasil Membuat Kontrak Baru', response)
          setResponseType(true)
          setResponseMessage('Berhasil Membuat Kontrak Baru')
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

  const handleModal = () => {
    setModalAddIsOpen(true)
    setQtyMesin(1)
    setTipeMesin('')
    setSpeed('')
    setHargaSewa(0)
    setFreeCopy('')
    setOverCopy('')
    setFreeCopyColor('')
    setOverCopyColor('')
    setPeriodeAwal(new Date())
    setPeriodeAkhir(new Date())
  }

  const handleModalAdd = () => {
    var tempList = [...listMesin]
    var tempObj = {
      quantity: parseInt(qtyMesin),
      tipe_mesin: tipeMesin,
      speed: speed,
      harga_sewa: parseFloat(hargaSewa),
      free_copy: freeCopy,
      over_copy: overCopy,
      free_copy_color: freeCopyColor,
      over_copy_color: overCopyColor,
      periode_awal_string: moment(periodeAwal).format('YYYY-MM-DD'),
      periode_akhir_string: moment(periodeAkhir).format('YYYY-MM-DD'),
      penempatan: penempatan,
      active_yn: 'Y',
      updated_by: userID,
    }

    tempList.push(tempObj)

    setListMesin(tempList)
    setModalAddIsOpen(false)
  }

  const handleModalEdit = (data, type, index) => {
    setIndexToEdit(index)
    if (type === 'open') {
      setQtyMesin(data.quantity)
      setTipeMesin(data.tipe_mesin)
      setSpeed(data.speed)
      setHargaSewa(data.harga_sewa)
      setFreeCopy(data.free_copy)
      setOverCopy(data.over_copy)
      setFreeCopyColor(data.free_copy_color)
      setOverCopyColor(data.over_copy_color)
      if (data.periode_awal_string === '') {
        setPeriodeAwal(data.periode_awal)
      } else {
        setPeriodeAwal(data.periode_awal_string)
      }
      if (data.periode_akhir_string === '') {
        setPeriodeAkhir(data.periode_akhir)
      } else {
        setPeriodeAkhir(data.periode_akhir_string)
      }
      setPenempatan(data.penempatan)
    } else if (type === 'change') {
      var tempList = [...listMesin]
      var tempObj = {
        quantity: parseInt(qtyMesin),
        tipe_mesin: tipeMesin,
        speed: speed,
        harga_sewa: parseFloat(hargaSewa),
        free_copy: freeCopy,
        over_copy: overCopy,
        free_copy_color: freeCopyColor,
        over_copy_color: overCopyColor,
        periode_awal_string: moment(periodeAwal).format('YYYY-MM-DD'),
        periode_akhir_string: moment(periodeAkhir).format('YYYY-MM-DD'),
        penempatan: penempatan,
        active_yn: 'Y',
        updated_by: userID,
      }

      tempList[index] = tempObj

      setListMesin(tempList)
    }

    setModalEditIsOpen(!modalEditIsOpen)
  }

  const removeFromList = (indexToRemove) => {
    var tempList = [...listMesin]

    tempList.splice(indexToRemove, 1)

    setListMesin(tempList)
  }

  return (
    <>
      <CCard>
        <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>
          <CRow>
            <CCol>
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Ubah Kontrak</span>
            </CCol>
            <CCol>
              <CButton
                hidden={
                  tanggalBuat === '' ||
                  selectedCustomer === '' ||
                  selectedBank === '' ||
                  listMesin.length === 0
                }
                className="btn btn-block btn-info text-white"
                style={{ float: 'right' }}
                onClick={() => EditContract()}
              >
                Simpan
              </CButton>
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
                <CFormInput
                  value={contractNumber}
                  onChange={(e) => setContractNumber(e.target.value)}
                />
              </CForm>
            </CCol>
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>TANGGAL BUAT</CFormLabel>
                <CFormInput
                  value={tanggalBuat}
                  onChange={(e) => setTanggalBuat(e.target.value)}
                  placeholder="Input Tanggal Buat..."
                />
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
                <ReactSelect
                  options={listCustomerTransformed}
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e)}
                  isSearchable={true}
                  placeholder="Tekan dan Pilih Customer..."
                />
              </CForm>
            </CCol>
          </CRow>
          {selectedCustomer !== '' && (
            <CCol>
              <CRow className="mt-3">
                <CCol>
                  <CForm>
                    <CFormLabel style={{ fontWeight: 'bold' }}>Alamat</CFormLabel>
                    <CFormTextarea
                      value={selectedCustomer.value.alamat_customer}
                      disabled
                    ></CFormTextarea>
                  </CForm>
                </CCol>
              </CRow>
              <CRow className="mt-3">
                <CCol>
                  <CForm>
                    <CFormLabel style={{ fontWeight: 'bold' }}>PIC</CFormLabel>
                    <CFormInput value={selectedCustomer.value.pic} disabled></CFormInput>
                  </CForm>
                </CCol>
                <CCol>
                  <CForm>
                    <CFormLabel style={{ fontWeight: 'bold' }}>Penandatangan</CFormLabel>
                    <CFormInput value={selectedCustomer.value.penandatangan} disabled></CFormInput>
                  </CForm>
                </CCol>
              </CRow>
              <CRow className="mt-3">
                <CCol>
                  <CForm>
                    <CFormLabel style={{ fontWeight: 'bold' }}>Nomor Telepon</CFormLabel>
                    <CFormInput value={selectedCustomer.value.no_telp} disabled></CFormInput>
                  </CForm>
                </CCol>
                <CCol>
                  <CForm>
                    <CFormLabel style={{ fontWeight: 'bold' }}>Jabatan</CFormLabel>
                    <CFormInput value={selectedCustomer.value.jabatan} disabled></CFormInput>
                  </CForm>
                </CCol>
              </CRow>
            </CCol>
          )}
        </CCardBody>
      </CCard>
      <CCard className="mt-3 ">
        <CCardHeader>
          <CRow>
            <CCol>
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Data Mesin</span>
            </CCol>
            <CCol>
              <CButton
                className="btn btn-sm btn-block btn-success text-white"
                style={{ float: 'right' }}
                onClick={() => handleModal()}
              >
                <CIcon icon={cilPlus}></CIcon> Tambah Mesin
              </CButton>
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
                    <CTableHeaderCell className="text-center">Free Copy Color</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Over Copy Color</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Periode Awal</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Periode Akhir</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Penempatan</CTableHeaderCell>
                    <CTableHeaderCell className="text-center" width="10%">
                      Action
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {listMesin &&
                    listMesin.map((item, index) => (
                      <CTableRow key={index} className="text-center">
                        <CTableDataCell>{item.quantity}</CTableDataCell>
                        <CTableDataCell>{item.tipe_mesin}</CTableDataCell>
                        <CTableDataCell>{item.speed}</CTableDataCell>
                        <CTableDataCell>Rp {item.harga_sewa}</CTableDataCell>
                        <CTableDataCell>{item.free_copy}</CTableDataCell>
                        <CTableDataCell>{item.over_copy}</CTableDataCell>
                        <CTableDataCell>{item.free_copy_color}</CTableDataCell>
                        <CTableDataCell>{item.over_copy_color}</CTableDataCell>
                        {item.periode_akhir_string === '' ? (
                          <CTableDataCell>
                            {moment(item.periode_awal).format('DD MMM YYYY')}
                          </CTableDataCell>
                        ) : (
                          <CTableDataCell>
                            {moment(item.periode_awal_string).format('DD MMM YYYY')}
                          </CTableDataCell>
                        )}
                        {item.periode_akhir_string === '' ? (
                          <CTableDataCell>
                            {moment(item.periode_akhir).format('DD MMM YYYY')}
                          </CTableDataCell>
                        ) : (
                          <CTableDataCell>
                            {moment(item.periode_akhir_string).format('DD MMM YYYY')}
                          </CTableDataCell>
                        )}
                        <CTableDataCell>{item.penempatan}</CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            className={'btn-sm btn-warning '}
                            style={{ color: 'white' }}
                            onClick={() => handleModalEdit(item, 'open', index)}
                          >
                            <CIcon icon={cilPencil}></CIcon>
                          </CButton>
                          <CButton
                            className={'btn-sm btn-danger'}
                            style={{ color: 'white', marginLeft: '5px' }}
                            onClick={() => removeFromList(index)}
                          >
                            <CIcon icon={cilTrash}></CIcon>
                          </CButton>
                        </CTableDataCell>
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
                <ReactSelect
                  options={listBankTransformed}
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e)}
                  isSearchable={true}
                  placeholder="Tekan dan Pilih Customer..."
                />
              </CForm>
            </CCol>
          </CRow>
          {selectedBank !== '' && (
            <CRow className="mt-3">
              <CCol>
                <CForm>
                  <CFormLabel style={{ fontWeight: 'bold' }}>Nomor Rekening</CFormLabel>
                  <CFormInput value={selectedBank.value.nomor_rekening} disabled></CFormInput>
                </CForm>
              </CCol>
              <CCol>
                <CForm>
                  <CFormLabel style={{ fontWeight: 'bold' }}>Atas Nama</CFormLabel>
                  <CFormInput value={selectedBank.value.atas_nama} disabled></CFormInput>
                </CForm>
              </CCol>
            </CRow>
          )}
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
              <CFormInput
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                type="number"
              ></CFormInput>
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
              <ReactSelect
                placeholder="Tekan dan Pilih [YA / TIDAK]"
                value={dendaSatuPersenYN}
                options={[
                  {
                    value: 'Y',
                    label: 'YA',
                  },
                  {
                    value: 'N',
                    label: 'TIDAK',
                  },
                ]}
                onChange={(e) => setDendaSatuPersenYN(e)}
              />
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', marginTop: '7px' }}>
                  Cara Pembayaran
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CForm>
                <ReactSelect
                  options={listPaymentMethodTransformed}
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e)}
                  isSearchable={true}
                  placeholder="Tekan dan Pilih Cara Pembayaran..."
                />
              </CForm>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      {/* MODAL ADD LIST MESIN*/}
      <CModal size="lg" alignment="center" visible={modalAddIsOpen} backdrop="static">
        <CModalBody style={{ justifyContent: 'center' }}>
          <CFormLabel style={{ fontWeight: 'bold', fontSize: '20px', paddingTop: '8px' }}>
            Tambah Mesin
          </CFormLabel>
          <hr />
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>Quantity</CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={qtyMesin}
                onChange={(e) => setQtyMesin(e.target.value)}
                type="number"
                min={1}
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Tipe Mesin
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={tipeMesin}
                onChange={(e) => setTipeMesin(e.target.value)}
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>Speed</CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput value={speed} onChange={(e) => setSpeed(e.target.value)}></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol md={5}>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Harga Sewa
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol style={{ fontWeight: 'bold', paddingTop: '8px' }} md={1}>
              <span style={{ float: 'right' }}>Rp</span>
            </CCol>
            <CCol>
              <CFormInput
                value={hargaSewa}
                onChange={(e) => setHargaSewa(e.target.value)}
                min={0}
                type="number"
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Free Copy
                  <span style={{ color: 'red', fontSize: '11px', marginLeft: '10px' }}>
                    [contoh : 1.500 copy]
                  </span>
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={freeCopy}
                onChange={(e) => setFreeCopy(e.target.value)}
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol md={6}>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Over Copy{' '}
                  <span style={{ color: 'red', fontSize: '11px', marginLeft: '10px' }}>
                    [contoh : Rp 80/copy]
                  </span>
                </CFormLabel>
              </CForm>
            </CCol>
            {/* <CCol style={{ fontWeight: 'bold', paddingTop: '8px' }} md={1}>
              <span style={{ float: 'right' }}>Rp</span>
            </CCol> */}
            <CCol>
              <CFormInput
                value={overCopy}
                onChange={(e) => setOverCopy(e.target.value)}
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Free Copy Color
                  <span style={{ color: 'red', fontSize: '11px', marginLeft: '10px' }}>
                    [contoh : 1.500 copy]
                  </span>
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={freeCopyColor}
                onChange={(e) => setFreeCopyColor(e.target.value)}
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol md={6}>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Over Copy Color{' '}
                  <span style={{ color: 'red', fontSize: '11px', marginLeft: '10px' }}>
                    [contoh : Rp 80/copy]
                  </span>
                </CFormLabel>
              </CForm>
            </CCol>
            {/* <CCol style={{ fontWeight: 'bold', paddingTop: '8px' }} md={1}>
              <span style={{ float: 'right' }}>Rp</span>
            </CCol> */}
            <CCol>
              <CFormInput
                value={overCopyColor}
                onChange={(e) => setOverCopyColor(e.target.value)}
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Periode Awal
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={moment(periodeAwal).format('YYYY-MM-DD')}
                onChange={(e) => setPeriodeAwal(e.target.value)}
                type="date"
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Periode Akhir
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={moment(periodeAkhir).format('YYYY-MM-DD')}
                onChange={(e) => setPeriodeAkhir(e.target.value)}
                min={moment(periodeAwal).format('YYYY-MM-DD')}
                type="date"
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Penempatan
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormTextarea
                value={penempatan}
                onChange={(e) => setPenempatan(e.target.value)}
                min={0}
                type="number"
              ></CFormTextarea>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter style={{ justifyContent: 'center' }}>
          <CButton
            color="success"
            className="text-white"
            disabled={
              !tipeMesin ||
              !speed ||
              moment(periodeAwal).format('YYYY-MM-DD') ===
                moment(periodeAkhir).format('YYYY-MM-DD') ||
              !penempatan
            }
            onClick={() => handleModalAdd()}
          >
            Tambah
          </CButton>
          <CButton color="danger" className="text-white" onClick={() => setModalAddIsOpen(false)}>
            Batal
          </CButton>
        </CModalFooter>
      </CModal>
      {/* MODAL ADD LIST MESIN */}

      {/* MODAL EDIT LIST MESIN*/}
      <CModal size="lg" alignment="center" visible={modalEditIsOpen} backdrop="static">
        <CModalBody style={{ justifyContent: 'center' }}>
          <CFormLabel style={{ fontWeight: 'bold', fontSize: '20px', paddingTop: '8px' }}>
            Ubah Mesin
          </CFormLabel>
          <hr />
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>Quantity</CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={qtyMesin}
                onChange={(e) => setQtyMesin(e.target.value)}
                type="number"
                min={1}
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Tipe Mesin
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={tipeMesin}
                onChange={(e) => setTipeMesin(e.target.value)}
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>Speed</CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput value={speed} onChange={(e) => setSpeed(e.target.value)}></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol md={5}>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Harga Sewa
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol style={{ fontWeight: 'bold', paddingTop: '8px' }} md={1}>
              <span style={{ float: 'right' }}>Rp</span>
            </CCol>
            <CCol>
              <CFormInput
                value={hargaSewa}
                onChange={(e) => setHargaSewa(e.target.value)}
                min={0}
                type="number"
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Free Copy
                  <span style={{ color: 'red', fontSize: '11px', marginLeft: '10px' }}>
                    [contoh : 1.500 copy]
                  </span>
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={freeCopy}
                onChange={(e) => setFreeCopy(e.target.value)}
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol md={6}>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Over Copy{' '}
                  <span style={{ color: 'red', fontSize: '11px', marginLeft: '10px' }}>
                    [contoh : Rp 80/copy]
                  </span>
                </CFormLabel>
              </CForm>
            </CCol>
            {/* <CCol style={{ fontWeight: 'bold', paddingTop: '8px' }} md={1}>
              <span style={{ float: 'right' }}>Rp</span>
            </CCol> */}
            <CCol>
              <CFormInput
                value={overCopy}
                onChange={(e) => setOverCopy(e.target.value)}
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Free Copy Color
                  <span style={{ color: 'red', fontSize: '11px', marginLeft: '10px' }}>
                    [contoh : 1.500 copy]
                  </span>
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={freeCopyColor}
                onChange={(e) => setFreeCopyColor(e.target.value)}
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol md={6}>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Over Copy Color{' '}
                  <span style={{ color: 'red', fontSize: '11px', marginLeft: '10px' }}>
                    [contoh : Rp 80/copy]
                  </span>
                </CFormLabel>
              </CForm>
            </CCol>
            {/* <CCol style={{ fontWeight: 'bold', paddingTop: '8px' }} md={1}>
              <span style={{ float: 'right' }}>Rp</span>
            </CCol> */}
            <CCol>
              <CFormInput
                value={overCopyColor}
                onChange={(e) => setOverCopyColor(e.target.value)}
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Periode Awal
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={moment(periodeAwal).format('YYYY-MM-DD')}
                onChange={(e) => setPeriodeAwal(e.target.value)}
                type="date"
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Periode Akhir
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={moment(periodeAkhir).format('YYYY-MM-DD')}
                onChange={(e) => setPeriodeAkhir(e.target.value)}
                min={moment(periodeAwal).format('YYYY-MM-DD')}
                type="date"
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Penempatan
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormTextarea
                value={penempatan}
                onChange={(e) => setPenempatan(e.target.value)}
                min={0}
                type="number"
              ></CFormTextarea>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter style={{ justifyContent: 'center' }}>
          <CButton
            color="success"
            className="text-white"
            disabled={
              !tipeMesin ||
              !speed ||
              moment(periodeAwal).format('YYYY-MM-DD') ===
                moment(periodeAkhir).format('YYYY-MM-DD') ||
              !penempatan
            }
            onClick={() => handleModalEdit('', 'change', indexToEdit)}
          >
            Ubah
          </CButton>
          <CButton color="danger" className="text-white" onClick={() => setModalEditIsOpen(false)}>
            Batal
          </CButton>
        </CModalFooter>
      </CModal>
      {/* MODAL EDIT LIST MESIN */}
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
          <Link
            to={`/contract/detail/${contractNumber.replace(/\//g, '-')}`}
            className="btn btn-block btn-info text-white"
          >
            Lihat Detail
          </Link>
        </CModalFooter>
      </CModal>
      {/* MODAL RESPONSE */}
    </>
  )
}
export default EditContract

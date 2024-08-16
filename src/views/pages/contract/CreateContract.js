import { cilCheckCircle, cilPencil, cilPlus, cilTrash, cilXCircle } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
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
import { Link } from 'react-router-dom'

const CreateContract = () => {
  const [selectedCompany, setSelectedCompany] = useState('')
  const [listCustomer, setListCustomer] = useState([])
  const [listCustomerTransformed, setListCustomerTransformed] = useState([])
  const [listBank, setListBank] = useState([])
  const [listBankTransformed, setListBankTransformed] = useState([])
  const [listMesin, setListMesin] = useState([])
  const [listPaymentMethod, setListPaymentMethod] = useState([])
  const [listPaymentMethodTransformed, setListPaymentMethodTransformed] = useState([])

  const [isLoading, setIsLoading] = useState(false)
  const [modalResponseIsOpen, setModalResponseIsOpen] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [responseType, setResponseType] = useState(false)

  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [selectedBank, setSelectedBank] = useState('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [contractNumber, setContractNumber] = useState('')
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false)
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false)
  const [indexToEdit, setIndexToEdit] = useState('')

  const [tanggalBuat, setTanggalBuat] = useState('')
  const [deposit, setDeposit] = useState(0)
  const [dendaSatuPersenYN, setDendaSatuPersenYN] = useState({
    value: 'Y',
    label: 'YA',
  })

  const [checked, setChecked] = useState(false)

  const [qtyMesin, setQtyMesin] = useState(1)
  const [tipeMesin, setTipeMesin] = useState('')
  const [speed, setSpeed] = useState('')
  const [hargaSewa, setHargaSewa] = useState(0)
  const [freeCopy, setFreeCopy] = useState(0)
  const [overCopy, setOverCopy] = useState(0)
  const [freeCopyColor, setFreeCopyColor] = useState(0)
  const [overCopyColor, setOverCopyColor] = useState(0)
  const [periodeAwal, setPeriodeAwal] = useState(new Date())
  const [periodeAkhir, setPeriodeAkhir] = useState(new Date())
  const [penempatan, setPenempatan] = useState('')
  const userID = sessionStorage.getItem('user')

  useEffect(() => {
    setSelectedCompany(JSON.parse(decodeURIComponent(sessionStorage.getItem('PT'))))
  }, [])

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
    setIsLoading(true)

    if (selectedCompany !== '') {
      GetListCustomersByCompany()
      GetListBanks()
      GetContractNumber()
      GetListPaymentMethod()
    }
  }, [selectedCompany])

  const GetListCustomersByCompany = () => {
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

  const GetContractNumber = () => {
    const url = `http://192.168.88.250:8080/contracts/counter?company=${selectedCompany.value}`

    axios
      .get(url)
      .then((response) => {
        if (response.data.data !== null) {
          setContractNumber(response.data.data)
          setIsLoading(false)
        } else {
          setContractNumber([])
          setIsLoading(false)
        }
      })
      .catch((error) => {
        alert(error.message)
        setIsLoading(false)
      })
  }

  const GetListBanks = () => {
    const url = `http://192.168.88.250:8080/banks/filter?company=${selectedCompany.value}`

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

  function createContract() {
    setIsLoading(true)
    var obj = {
      no_kontrak: contractNumber,
      tanggal_buat: tanggalBuat,
      company_id: parseInt(selectedCompany.value),
      id_customer: selectedCustomer.value.id_customer,
      bank_id: selectedBank.value.bank_id,
      payment_id: parseInt(selectedPaymentMethod.value.payment_id),
      deposit: parseFloat(deposit),
      denda_satupersenyn: dendaSatuPersenYN.value,
      active_yn: 'Y',
      updated_by: userID,
      details: listMesin,
    }
    var url = `http://192.168.88.250:8080/contracts/create`

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
    setFreeCopy(0)
    setOverCopy(0)
    setFreeCopyColor(0)
    setOverCopyColor(0)
    setPeriodeAwal(new Date())
    setPeriodeAkhir(new Date().setDate(new Date().getDate() + 364))
    setChecked(false)
  }

  const handleModalAdd = () => {
    var tempList = [...listMesin]
    var tempObj = {
      quantity: qtyMesin,
      tipe_mesin: tipeMesin,
      speed: speed,
      harga_sewa: parseFloat(hargaSewa),
      free_copy: parseInt(freeCopy),
      over_copy: parseFloat(overCopy),
      free_copy_color: parseInt(freeCopyColor),
      over_copy_color: parseFloat(overCopyColor),
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
      setPeriodeAwal(data.periode_awal_string)
      setPeriodeAkhir(data.periode_akhir_string)
      setPenempatan(data.penempatan)
    } else if (type === 'change') {
      var tempList = [...listMesin]
      var tempObj = {
        quantity: parseInt(qtyMesin),
        tipe_mesin: tipeMesin,
        speed: speed,
        harga_sewa: parseFloat(hargaSewa),
        free_copy: parseInt(freeCopy),
        over_copy: parseFloat(overCopy),
        free_copy_color: parseInt(freeCopyColor),
        over_copy_color: parseFloat(overCopyColor),
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

  const handleCheck = (checked) => {
    setChecked(checked)
    if (checked === true && selectedCustomer !== '') {
      setPenempatan(selectedCustomer.value.alamat_customer)
    } else {
      setPenempatan('')
    }
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
                hidden={
                  tanggalBuat === '' ||
                  selectedCustomer === '' ||
                  selectedBank === '' ||
                  listMesin.length === 0 ||
                  selectedPaymentMethod === '' ||
                  dendaSatuPersenYN === ''
                }
                className="btn btn-block btn-info text-white"
                style={{ float: 'right' }}
                onClick={() => createContract()}
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
                <CFormInput value={contractNumber} disabled />
              </CForm>
            </CCol>
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>
                  TANGGAL BUAT{' '}
                  <span style={{ color: 'red', fontSize: '11px' }}>
                    [contoh : Rabu, Dua Januari Dua Ribu Sembilan Belas (02-01-2019)]
                  </span>
                </CFormLabel>
                <CFormInput
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
                    <CTableHeaderCell className="text-center" style={{ alignContent: 'center' }}>
                      Qty
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={{ alignContent: 'center' }}>
                      Tipe Mesin
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={{ alignContent: 'center' }}>
                      Speed
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={{ alignContent: 'center' }}>
                      Harga Sewa
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={{ alignContent: 'center' }}>
                      Free Copy
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={{ alignContent: 'center' }}>
                      Over Copy
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={{ alignContent: 'center' }}>
                      Free Copy Color
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={{ alignContent: 'center' }}>
                      Over Copy Color
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={{ alignContent: 'center' }}>
                      Periode Awal
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={{ alignContent: 'center' }}>
                      Periode Akhir
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={{ alignContent: 'center' }}>
                      Penempatan
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="text-center"
                      style={{ alignContent: 'center' }}
                      width="10%"
                    >
                      Action
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {listMesin.map((item, index) => (
                    <CTableRow
                      key={index}
                      className="text-center"
                      style={{ alignContent: 'center' }}
                    >
                      <CTableDataCell>{item.quantity}</CTableDataCell>
                      <CTableDataCell>{item.tipe_mesin}</CTableDataCell>
                      <CTableDataCell>{item.speed}</CTableDataCell>
                      <CTableDataCell>Rp {item.harga_sewa}</CTableDataCell>
                      <CTableDataCell>{item.free_copy}</CTableDataCell>
                      <CTableDataCell>Rp {item.over_copy}</CTableDataCell>
                      <CTableDataCell>{item.free_copy_color}</CTableDataCell>
                      <CTableDataCell>Rp {item.over_copy_color}</CTableDataCell>
                      <CTableDataCell>
                        {moment(item.periode_awal_string).format('DD MMM YYYY')}
                      </CTableDataCell>
                      <CTableDataCell>
                        {moment(item.periode_akhir_string).format('DD MMM YYYY')}
                      </CTableDataCell>
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
      <CCard className="mt-3">
        <CCardHeader style={{ fontSize: '20px', fontWeight: 'bold' }}>Data Bank</CCardHeader>
        <CCardBody>
          <CRow>
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold' }}>BANK</CFormLabel>
                <ReactSelect
                  options={listBankTransformed}
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
      {/* MODAL CREATE CONTRACT*/}
      <CModal size="lg" alignment="center" visible={modalAddIsOpen} backdrop="static">
        <CModalBody style={{ justifyContent: 'center' }}>
          <CFormLabel style={{ fontWeight: 'bold', fontSize: '20px', paddingTop: '8px' }}>
            Tambah Mesin
          </CFormLabel>
          <hr />
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Quantity <span style={{ color: 'red', fontSize: '11px' }}></span>
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={qtyMesin}
                min={1}
                type="number"
                onChange={(e) => setQtyMesin(e.target.value)}
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
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>Free Copy</CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={freeCopy}
                onChange={(e) => setFreeCopy(e.target.value)}
                min={0}
                type="number"
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol md={5}>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>Over Copy</CFormLabel>
              </CForm>
            </CCol>
            <CCol style={{ fontWeight: 'bold', paddingTop: '8px' }} md={1}>
              <span style={{ float: 'right' }}>Rp</span>
            </CCol>
            <CCol>
              <CFormInput
                value={overCopy}
                onChange={(e) => setOverCopy(e.target.value)}
                min={0}
                type="number"
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Free Copy Color
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={freeCopyColor}
                onChange={(e) => setFreeCopyColor(e.target.value)}
                min={0}
                type="number"
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol md={5}>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Over Copy Color
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol style={{ fontWeight: 'bold', paddingTop: '8px' }} md={1}>
              <span style={{ float: 'right' }}>Rp</span>
            </CCol>
            <CCol>
              <CFormInput
                value={overCopyColor}
                onChange={(e) => setOverCopyColor(e.target.value)}
                min={0}
                type="number"
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
              <CRow>
                <CForm>
                  <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                    Penempatan
                  </CFormLabel>
                </CForm>
              </CRow>
              <CRow>
                <CFormCheck
                  style={{
                    marginLeft: '5px',
                    height: '17px',
                    width: '17px',
                    marginRight: '10px',
                  }}
                  checked={checked}
                  onClick={() => handleCheck(!checked)}
                  label="Samakan Seperti Alamat Customer"
                />
              </CRow>
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
      {/* MODAL CREATE CONTRACT */}

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
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>Free Copy</CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={freeCopy}
                onChange={(e) => setFreeCopy(e.target.value)}
                min={0}
                type="number"
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol md={5}>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>Over Copy</CFormLabel>
              </CForm>
            </CCol>
            <CCol style={{ fontWeight: 'bold', paddingTop: '8px' }} md={1}>
              <span style={{ float: 'right' }}>Rp</span>
            </CCol>
            <CCol>
              <CFormInput
                value={overCopy}
                onChange={(e) => setOverCopy(e.target.value)}
                min={0}
                type="number"
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Free Copy Color
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol>
              <CFormInput
                value={freeCopyColor}
                onChange={(e) => setFreeCopyColor(e.target.value)}
                min={0}
                type="number"
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol md={5}>
              <CForm>
                <CFormLabel style={{ fontWeight: 'bold', paddingTop: '8px' }}>
                  Over Copy Color
                </CFormLabel>
              </CForm>
            </CCol>
            <CCol style={{ fontWeight: 'bold', paddingTop: '8px' }} md={1}>
              <span style={{ float: 'right' }}>Rp</span>
            </CCol>
            <CCol>
              <CFormInput
                value={overCopyColor}
                onChange={(e) => setOverCopyColor(e.target.value)}
                min={0}
                type="number"
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
export default CreateContract

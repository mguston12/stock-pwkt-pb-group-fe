import React from 'react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const userID = localStorage.getItem('user')

  const baseBoxStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: 'white',
    padding: '10px',
    textAlign: 'center',
    boxSizing: 'border-box',
    width: '100%',
  }

  const boxStyles = [
    { ...baseBoxStyle, backgroundColor: 'rgba(95,199,208,255)' }, //
    { ...baseBoxStyle, backgroundColor: '#544336' },
    { ...baseBoxStyle, backgroundColor: '#f38612ff' },
    { ...baseBoxStyle, backgroundColor: '#7350f1ff' },
    { ...baseBoxStyle, backgroundColor: '#47d574ff' },
    { ...baseBoxStyle, backgroundColor: '#e43e3eff' },
  ]

  const iconStyle = {
    width: '55px',
    height: '55px',
    marginBottom: '10px',
  }

  return (
    <div style={{ padding: '10px', textAlign: 'center' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Halaman Utama</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: '15px',
        }}
      >
        <Link to="/barcodescanner" style={boxStyles[0]}>
          <img src="/scan-barcode.jpg" alt="Scan Barcode" style={iconStyle} />
          Scan Barcode
          <br />
          (Ganti Sparepart)
        </Link>

        <Link to="/inventory" style={boxStyles[1]}>
          <img src="/Inventory.png" alt="Persediaan" style={iconStyle} />
          Persediaan
          <br />
          (Sparepart di Tas)
        </Link>

        <Link to="/request" style={boxStyles[2]}>
          <img src="/request.png" alt="Request" style={iconStyle} />
          Request
          <br />
          (Sparepart dari Gudang)
        </Link>

        <Link to="/sparepart-return" style={boxStyles[3]}>
          <img src="/retur.png" alt="Retur" style={iconStyle} />
          Retur / Pengembalian
          <br />
          (Sparepart)
        </Link>

        <Link to="/sparepart-history-teknisi" style={boxStyles[4]}>
          <img src="/history.png" alt="history" style={iconStyle} />
          History Penggunaan
          <br />
          (Sparepart)
        </Link>

        {userID === 'T-099' && (
          <Link to="/barcodescannervisit" style={boxStyles[5]}>
            <img src="/kunjungan.png" alt="kunjungan" style={iconStyle} />
            Notes <br /> Kunjungan
            <br />
            (Mesin)
          </Link>
        )}
      </div>
    </div>
  )
}

export default Dashboard

import React from 'react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const baseBoxStyle = {
    display: 'flex',
    flexDirection: 'column', // gambar di atas, teks di bawah
    alignItems: 'center',
    justifyContent: 'center',
    height: '150px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: 'white',
    padding: '10px',
    textAlign: 'center',
  }

  const boxStyles = [
    { ...baseBoxStyle, backgroundColor: 'rgba(95,199,208,255)' }, // 
    { ...baseBoxStyle, backgroundColor: '#544336' }, // 
    { ...baseBoxStyle, backgroundColor: '#f38612ff' }, // Merah
    { ...baseBoxStyle, backgroundColor: '#7350f1ff' }, // Biru tua
  ]

  const iconStyle = {
    width: '55px',
    height: '55px',
    marginBottom: '10px',
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Halaman Utama</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
        }}
      >
        <Link to="/barcodescanner" style={boxStyles[0]}>
          <img src="/scan-barcode.jpg" alt="Scan Barcode" style={iconStyle} />
          Scan Barcode<br />(Ganti Sparepart)
        </Link>

        <Link to="/inventory" style={boxStyles[1]}>
          <img src="/Inventory.png" alt="Persediaan" style={iconStyle} />
          Persediaan<br />(Sparepart di Tas)
        </Link>

        <Link to="/request" style={boxStyles[2]}>
          <img src="/request.png" alt="Request" style={iconStyle} />
          Request<br />(Sparepart dari Gudang)
        </Link>

        <Link to="/sparepart-return" style={boxStyles[3]}>
          <img src="/retur.png" alt="Retur" style={iconStyle} />
          Retur / Pengembalian<br />(Sparepart)
        </Link>
      </div>
    </div>
  )
}

export default Dashboard

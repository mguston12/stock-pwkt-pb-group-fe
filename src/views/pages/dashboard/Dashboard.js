import React from 'react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const baseBoxStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '150px',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: 'white',
  }

  const boxStyles = [
    { ...baseBoxStyle, backgroundColor: '#1d78b6ff' }, // Biru
    { ...baseBoxStyle, backgroundColor: '#27ae60' }, // Hijau
    { ...baseBoxStyle, backgroundColor: '#f31212ff' }, // Orange
    { ...baseBoxStyle, backgroundColor: '#0a07acff' }, // Abu
  ]

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
          Scan Barcode (Ganti Sparepart)
        </Link>

        <Link to="/inventory" style={boxStyles[1]}>
          Persediaan (Sparepart di Tas)
        </Link>

        <Link to="/request" style={boxStyles[2]}>
          Request (Sparepart dari Gudang)
        </Link>

         <Link to="/sparepart-return" style={boxStyles[3]}>
          Retur / Pengembalian (Sparepart)
        </Link>
      </div>
    </div>
  )
}

export default Dashboard

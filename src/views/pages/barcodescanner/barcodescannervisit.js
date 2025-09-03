import React, { useState, useEffect, useRef } from 'react'
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library'
import { Link } from 'react-router-dom'

const BarcodeScannerVisit = () => {
  const [barcodeData, setBarcodeData] = useState(null)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [facingMode, setFacingMode] = useState('environment') // Default to back camera
  const videoRef = useRef(null) // Reference for video element
  const [scanner, setScanner] = useState(null) // Barcode scanner instance
  const [isScanning, setIsScanning] = useState(false) // Flag to control scanning state
  const token = localStorage.getItem('token')

  // Handle successful scan
  const handleScan = (data) => {
    if (data) {
      setBarcodeData(data)
      setIsScanning(false)
      // Stop camera when barcode is detected
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop())
      }
      scanner.reset()
    }
  }

  // Handle errors during scanning
  const handleError = (error) => {
    // Ignore "not found" errors (no barcode detected in frame)
    if (!(error instanceof NotFoundException)) {
      console.error('Scan error:', error)
    }
  }

  // Request camera devices and set up camera stream
  const requestCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const cameraDevices = devices.filter((device) => device.kind === 'videoinput')
          if (cameraDevices.length > 0) {
            setIsCameraReady(true)
            setupCamera()
          } else {
            console.error('No camera device found.')
            alert('No camera device found on this device.')
          }
        })
        .catch((err) => {
          console.error('Error accessing media devices:', err)
          alert('Could not access media devices. Please check permissions.')
        })
    }
  }

  // Set up camera stream with facingMode constraints
  const setupCamera = () => {
    const constraints = {
      video: {
        facingMode: facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    }

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (videoRef.current) {
          // Stop any existing tracks before setting new stream
          if (videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach((track) => track.stop())
          }
          videoRef.current.srcObject = stream
          videoRef.current.play()
          setIsCameraReady(true)
        }
      })
      .catch((err) => {
        console.error('Error accessing camera:', err)
        alert('Error accessing camera. Please ensure the app has permission.')
        setIsCameraReady(false)
      })
  }

  // Initialize scanner on mount
  useEffect(() => {
    const barcodeScanner = new BrowserMultiFormatReader()
    setScanner(barcodeScanner)

    return () => {
      if (barcodeScanner) {
        barcodeScanner.reset()
      }
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Start or stop scanning when isScanning or cameraReady changes
  useEffect(() => {
    if (scanner && isCameraReady && videoRef.current) {
      if (isScanning) {
        scanner.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
          if (result) {
            handleScan(result.getText())
          } else if (err) {
            handleError(err)
          }
        })
      } else {
        scanner.reset()
      }
    }
  }, [scanner, isCameraReady, isScanning])

  // Start or stop scanning
  const toggleScanning = () => {
    setBarcodeData(null) // clear previous data when restarting scan
    setIsScanning((prev) => !prev)
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Scan Barcode</h1>
      {!isCameraReady && (
        <div>
          <p>No camera detected or permissions denied. Please check your camera settings.</p>
          <button onClick={requestCamera}>Request Camera Access</button>
        </div>
      )}

      {barcodeData ? (
        <div
          style={{
            padding: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            marginTop: '20px',
          }}
        >
          <h3>Scanned Data:</h3>
          <Link
            to={`/visit/${barcodeData}`}
            className="btn btn-warning btn-sm text-white"
          >
            {barcodeData}
          </Link>
        </div>
      ) : (
        <div>
          {isCameraReady ? (
            <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '300px',
                  maxWidth: '100%',
                  margin: '0 auto',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <button
                onClick={toggleScanning}
                style={{ marginTop: '10px', padding: '10px', fontSize: '16px' }}
              >
                {isScanning ? 'Stop Scanning' : 'Start Scanning'}
              </button>
            </div>
          ) : (
            <p>Loading Camera...</p>
          )}
        </div>
      )}
    </div>
  )
}

export default BarcodeScannerVisit

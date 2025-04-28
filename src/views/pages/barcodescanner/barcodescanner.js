import React, { useState, useEffect, useRef } from 'react'
import { BrowserMultiFormatReader } from '@zxing/library'
import { Link } from 'react-router-dom'

const BarcodeScanner = () => {
  const [barcodeData, setBarcodeData] = useState(null)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [facingMode, setFacingMode] = useState('environment') // Default to back camera
  const videoRef = useRef(null) // Reference for video element
  const [scanner, setScanner] = useState(null) // For holding the barcode scanner instance
  const [isScanning, setIsScanning] = useState(false) // Flag to control scanning state
  const [lastScanTime, setLastScanTime] = useState(0) // To throttle scan frequency

  // Handle successful scan
  const handleScan = (data) => {
    if (data) {
      setBarcodeData(data) // Save the barcode data
      setIsScanning(false) // Stop scanning once barcode is detected
    }
  }

  // Handle errors during scanning
  const handleError = (error) => {
    console.error('Scan error:', error)
  }

  // Request camera with facingMode constraint
  const requestCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const cameraDevices = devices.filter((device) => device.kind === 'videoinput')
          if (cameraDevices.length > 0) {
            setIsCameraReady(true)
          } else {
            console.error('No camera device found.')
          }
        })
        .catch((err) => {
          console.error('Error accessing media devices:', err)
        })
    }
  }

  // Use `getUserMedia` to set up camera with specific facingMode
  const setupCamera = () => {
    const constraints = {
      video: {
        facingMode: facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    }

    // Get camera stream with facingMode
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        videoRef.current.srcObject = stream
        setIsCameraReady(true)
      })
      .catch((err) => {
        console.error('Error accessing camera:', err)
        alert('Error accessing camera. Please ensure the app has permission.')
      })
  }

  // Initialize the scanner when the component mounts
  useEffect(() => {
    const barcodeScanner = new BrowserMultiFormatReader()
    setScanner(barcodeScanner)

    return () => {
      if (scanner) {
        scanner.reset() // Reset the scanner when the component is unmounted
      }
    }
  }, [])

  // Start scanning when the video stream is ready
  useEffect(() => {
    if (scanner && isCameraReady && videoRef.current) {
      const scanLoop = () => {
        if (videoRef.current && videoRef.current.readyState === 4) {
          const currentTime = Date.now()

          // Only scan every 500ms to prevent excessive scanning
          if (currentTime - lastScanTime >= 500) {
            setLastScanTime(currentTime) // Update last scan time

            if (isScanning) {
              scanner.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
                if (result) {
                  handleScan(result.getText())
                } else if (err) {
                  handleError(err)
                }
              })
            }
          }
        }

        // Continue scanning (call scanLoop recursively)
        requestAnimationFrame(scanLoop)
      }

      // Start scanning loop
      requestAnimationFrame(scanLoop)
    }
  }, [scanner, isCameraReady, isScanning, lastScanTime])

  // Check if camera permissions are granted and ready
  useEffect(() => {
    if (isCameraReady) {
      setupCamera()
    }
  }, [isCameraReady])

  // Toggle between front and back camera
  const toggleCamera = () => {
    setFacingMode(facingMode === 'environment' ? 'user' : 'environment')
  }

  // Start or stop scanning
  const toggleScanning = () => {
    setIsScanning(!isScanning)
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Scan Barcode</h1>
      {/* Show message if no camera is found */}
      {!isCameraReady && (
        <div>
          <p>No camera detected or permissions denied. Please check your camera settings.</p>
          <button onClick={requestCamera}>Request Camera Access</button>
        </div>
      )}

      {/* Show scanned data */}
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
          {/* <a href=''>{barcodeData}</a> */}
          <Link
            to={`/machine/detail/${barcodeData}`}
            className="btn btn-warning btn-sm text-white"
          >
            {barcodeData}
          </Link>
        </div>
      ) : (
        <div>
          {/* Display camera feed only if camera is ready */}
          {isCameraReady ? (
            <div>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '500px',
                  margin: '0 auto',
                  objectFit: 'contain',
                }}
              />
              {/* Toggle Camera button */}
              <button
                onClick={toggleCamera}
                style={{ marginTop: '10px', padding: '10px', fontSize: '16px' }}
              >
                Switch to {facingMode === 'environment' ? 'Front' : 'Back'} Camera
              </button>
              {/* Start/Stop Scanning Button */}
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

export default BarcodeScanner

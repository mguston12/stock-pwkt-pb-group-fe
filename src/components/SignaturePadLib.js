import React, { useRef, useEffect, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'

const SignaturePadLib = () => {
  const sigCanvas = useRef(null)
  const containerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 500, height: 200 })

  useEffect(() => {
    const resizeCanvas = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        setDimensions({ width, height: 200 })
      }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  const clear = () => sigCanvas.current.clear()

  const save = () => {
    const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png')
    console.log(dataURL)
  }

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <div style={{ border: '1px solid #000' }}>
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{
            width: dimensions.width,
            height: dimensions.height,
            style: {
              width: '100%',
              height: '200px',
              display: 'block',
            },
          }}
        />
      </div>
      <div className="mt-3 text-center">
        <button className="btn btn-secondary" onClick={clear}>
          Ulang
        </button>
      </div>
    </div>
  )
}

export default SignaturePadLib

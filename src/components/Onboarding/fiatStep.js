import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const FiatStep = () => {
  const location = useLocation()

  const [defaultAsset, setdefaultAsset] = useState(false)

  useEffect(() => {
    const assetParam1 = new URLSearchParams(location.search).get(`asset1`)
    if (assetParam1) {
      setdefaultAsset(assetParam1)
    }
  }, [location.search])

  return (
    <iframe
      src={`${process.env.REACT_APP_BCONNECT_URL}?merchantCode=${
        process.env.REACT_APP_BCONNECT
      }${
        defaultAsset ? `&cryptoCurrency=${defaultAsset}` : ''
      }&timestamp=${Date.now()}`}
      title="BinanceConnect Onboarding Module"
      width="100%"
      height="98%"
      style={{ borderRadius: '10px' }}
    />
  )
}

export default FiatStep

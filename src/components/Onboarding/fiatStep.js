import React from 'react'

const FiatStep = ({ defaultAsset }) => (
  <iframe
    src={`${process.env.REACT_APP_BCONNECT_URL}?merchantCode=${
      process.env.REACT_APP_BCONNECT
    }${
      defaultAsset && `&cryptoCurrency=${defaultAsset}`
    }&timestamp=${Date.now()}`}
    title="BinanceConnect Onboarding Module"
    width="100%"
    height="98%"
    style={{ borderRadius: '10px' }}
  />
)

export default FiatStep

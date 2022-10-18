import React from 'react'

const FiatStep = () => (
  <iframe
    src={`${process.env.REACT_APP_BCONNECT_URL}?merchantCode=${
      process.env.REACT_APP_BCONNECT
    }&timestamp=${Date.now()}`}
    title="BinanceConnect Onboarding Module"
    width="100%"
    height="98%"
    style={{ borderRadius: '20px' }}
  />
)

export default FiatStep

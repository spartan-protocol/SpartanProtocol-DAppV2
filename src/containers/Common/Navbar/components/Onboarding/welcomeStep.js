import React from 'react'
import Button from 'react-bootstrap/Button'
import { Icon } from '../../../../../components/Icons'

const WelcomeStep = ({ settype, setstep }) => {
  const nextStep = (type) => {
    settype(type)
    setstep((prev) => prev + 1)
  }

  return (
    <>
      <div>
        <h4>Fiat onboarding</h4>
        <Icon icon="visa" width="66px" className="me-2" />
        <Icon icon="mastercard" width="60px" />
        <p>
          Join millions of users from 30+ countries in choosing from 50+ crypto
          tokens to buy using a variety of payment methods including Visa &
          Mastercard.
        </p>
        <Button onClick={() => nextStep('fiat')}>Fiat Onboarding</Button>
      </div>
      <hr />
      <div className="mt-2">
        <h4>Crosschain onboarding</h4>
        <Icon icon="eth" width="30px" className="me-2" />
        <Icon icon="fantom" width="30px" className="me-2" />
        <Icon icon="matic" width="30px" className="me-2" />
        <Icon icon="avax" width="30px" className="me-2" />
        <Icon icon="optimism" width="30px" className="me-2" />
        <Icon icon="bnb" width="30px" className="me-2" />
        <p>
          Are you an existing DeFi user looking to try out BNBChain? No need to
          KYC or go through a CEX, just setup/connect a compatible wallet and
          buy BNBChain assets using your tokens from another chain!
        </p>
        <Button onClick={() => nextStep('crosschain')} disabled>
          Crosschain Onboarding (Coming Soon)
        </Button>
      </div>
    </>
  )
}

export default WelcomeStep

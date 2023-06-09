import React, { useRef, useState } from 'react'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Overlay from 'react-bootstrap/Overlay'
import Tooltip from 'react-bootstrap/Tooltip'

import { useAccount } from 'wagmi'
import { useTheme } from '../../providers/Theme'
import { formatShortString } from '../../utils/web3'

import FiatStep from './fiatStep'
import WalletStep from './walletStep.js'
import WelcomeStep from './welcomeStep'

const OnboardModal = ({ showModal, setshowModal, defaultAsset = null }) => {
  const { isDark } = useTheme()
  const { address } = useAccount()

  const [showTooltip, setShowTooltip] = useState(false)
  const [step, setstep] = useState(1)
  const [type, settype] = useState('fiat')

  const target = useRef(null)

  const handleTooltip = () => {
    navigator.clipboard.writeText(address)
    setShowTooltip(true)
    setTimeout(() => {
      setShowTooltip(false)
    }, 2000)
  }

  return (
    <>
      <Modal show={showModal} onHide={() => setshowModal(false)} centered>
        <Modal.Header
          closeButton
          closeVariant={isDark ? 'white' : undefined}
          className="pb-1"
          onClick={() => console.log(Date.now())}
        >
          Onboard to BNBChain
        </Modal.Header>
        <Modal.Body style={{ height: '500px' }}>
          {
            step === 1 && <WelcomeStep settype={settype} setstep={setstep} /> // Set the type here (fait or crosschain)
          }
          {
            step === 2 && <WalletStep setstep={setstep} /> // Setup/connect/copy wallet address here
          }
          {
            step === 3 && type === 'fiat' && (
              <FiatStep defaultAsset={defaultAsset} />
            ) // BinanceConnect iFrame (fiat onboarding)
          }
          {/* {
            step === 3 && type === 'crosschain' && <CrosschainStep /> // Crosschain portal (onboard to BSC from other chain)
          } */}
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={step === 1}
            onClick={() => setstep((prev) => prev - 1)}
          >
            Back
          </Button>
          <Button
            disabled={!address}
            onClick={() => handleTooltip()}
            ref={target}
          >
            {address
              ? `Copy: ${formatShortString(address)}`
              : 'No Wallet Connected'}
          </Button>
          <Overlay target={target.current} show={showTooltip} placement="top">
            <Tooltip id="overlay-example">
              Wallet address copied to clipboard
            </Tooltip>
          </Overlay>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export default OnboardModal

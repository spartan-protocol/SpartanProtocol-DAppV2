import React, { useEffect, useRef, useState } from 'react'
import { useWeb3React } from '@web3-react/core'

import Button from 'react-bootstrap/Button'
import Overlay from 'react-bootstrap/Overlay'
import Tooltip from 'react-bootstrap/Tooltip'

import { Icon } from '../../../../../components/Icons'
import WalletSelect from '../../../../../components/WalletSelect'
import { formatShortString } from '../../../../../utils/web3'

const WalletStep = ({ setstep }) => {
  const wallet = useWeb3React()

  const [walletModalShow, setWalletModalShow] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const target = useRef(null)

  useEffect(() => {
    if (walletModalShow && wallet.account) {
      setWalletModalShow(false)
    }
  }, [walletModalShow, wallet.account])

  const copyAndProceed = () => {
    setShowTooltip(true)
    navigator.clipboard.writeText(wallet.account)
    setTimeout(() => {
      setstep((prev) => prev + 1)
    }, 1000)
  }

  return (
    <>
      <div>
        <h4>Wallets on BNBChain</h4>
        <Icon icon="metamask" width="30px" className="me-2" />
        <Icon icon="trustwallet" width="30px" className="me-2" />
        <Icon icon="binanceChain" width="30px" className="me-2" />
        <Icon icon="onto" width="30px" className="me-2" />
        <Icon icon="walletconnect" width="30px" className="me-2" />
        <Icon icon="mathwallet" width="30px" className="me-2" />
        <p>
          BNB Smart Chain & this Spartan Protocol DApp support EVM web3 wallets.
          If you do not yet have one, follow the wallet guide to get started
        </p>
        <a
          href="https://docs.spartanprotocol.org/#/getting-started?id=choose-wallet"
          target="_blank"
          rel="noreferrer"
        >
          <Button>Wallet Guide</Button>
        </a>
        <hr />
        {wallet.account ? (
          <>
            <h4>Wallet connected!</h4>
            <p>
              <strong>Address:</strong> {formatShortString(wallet.account)}
            </p>
            <p>
              You have a wallet connected to the DApp, if you would like to use
              this wallet to receive the onboarded funds, paste it in the next
              step
            </p>
            <Button onClick={() => copyAndProceed()} ref={target}>
              Copy Wallet Address & Continue
            </Button>
            <Overlay target={target.current} show={showTooltip} placement="top">
              <Tooltip id="overlay-example">
                Wallet address copied to clipboard
              </Tooltip>
            </Overlay>
          </>
        ) : (
          <>
            <strong>Already have a BNBChain wallet?</strong>
            <p>
              If you already have a BNBChain wallet, connect it to the DApp, or
              skip this step and make sure you have the address ready to type
              into the next step
            </p>
            <WalletSelect
              show={walletModalShow}
              onHide={() => setWalletModalShow(false)}
            />
            <Button onClick={() => setWalletModalShow(true)} className="me-1">
              Connect Wallet
            </Button>
            <Button onClick={() => setstep((prev) => prev + 1)}>
              Skip Step
            </Button>
          </>
        )}
      </div>
      {/* <div className="mt-2">
        <h4>Links to suggested wallets</h4>
      </div> */}
    </>
  )
}

export default WalletStep

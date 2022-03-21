import React, { useRef, useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'react-i18next'
import Overlay from 'react-bootstrap/Overlay'
import Popover from 'react-bootstrap/Popover'
import WalletSelect from '../../../../components/WalletSelect/index'
import { Icon } from '../../../../components/Icons'

const AddressConn = () => {
  const wallet = useWeb3React()
  // const pool = usePool()
  const [walletModalShow, setWalletModalShow] = useState(false)
  const [showPopConnect, setShowPopConnect] = useState(false)
  // only trigger this once when hover or click on input
  const [triesAndNotConnected, setTriesAndNotConnected] = useState(false)
  const [showPopConnectHover, setShowPopConnectHover] = useState(false)
  const { t } = useTranslation()

  const target = useRef(null)
  const targetB = useRef(null)

  const btnClass = 'header-btn mx-2'

  useEffect(() => {
    async function listenAccountsChanged() {
      window.ethereum?.on('accountsChanged', async () => {
        document.location.reload(true)
      })
      window.BinanceChain?.on('accountsChanged', async () => {
        document.location.reload(true)
      })
    }
    async function listenNetworkChanged() {
      window.ethereum?.on('chainChanged', async () => {
        document.location.reload(true)
      })
      window.BinanceChain?.on('chainChanged', async () => {
        document.location.reload(true)
      })
    }
    listenAccountsChanged()
    listenNetworkChanged()
  }, [])

  // load only after initial render
  useEffect(() => {
    setTriesAndNotConnected(false)
    setTimeout(() => {
      setShowPopConnect(true)
      setTimeout(() => {
        setShowPopConnect(false)
      }, 5000)
    }, 2500)
  }, [])

  // if a user tries to do something and is not connected
  useEffect(() => {
    if (triesAndNotConnected) {
      setShowPopConnectHover(true)
      setTimeout(() => {
        setShowPopConnectHover(false)
      }, 3000)
    }
  }, [triesAndNotConnected])
  //
  //  tooltipConnected = () => {
  //    return ''
  //  }
  return (
    <>
      {(!wallet || !wallet?.active || wallet?.error) && (
        <>
          <div
            role="button"
            className={btnClass}
            onClick={() => setWalletModalShow(true)}
            onKeyPress={() => setWalletModalShow(true)}
            ref={target}
            aria-hidden="true"
          >
            <Icon icon="walletRed" size="27" />
          </div>
          <Overlay
            target={target.current}
            show={showPopConnect}
            placement="bottom"
            onHide={() => setShowPopConnect(false)}
            rootClose
          >
            <Popover>
              <Popover.Header />
              <Popover.Body>
                <b>{t('checkConnectWallet')}</b>
              </Popover.Body>
            </Popover>
          </Overlay>{' '}
        </>
      )}
      {wallet?.active && (
        <>
          <div
            role="button"
            className={btnClass}
            onClick={() => setWalletModalShow(true)}
            onKeyPress={() => setWalletModalShow(true)}
            ref={targetB}
            aria-hidden="true"
          >
            <Icon icon="walletGreen" size="27" />
          </div>
          <Overlay
            target={targetB.current}
            show={showPopConnectHover}
            placement="bottom"
            onHide={() => setShowPopConnectHover(false)}
            rootClose
          >
            <Popover>
              <Popover.Header />
              <Popover.Body>
                <b>{t('checkConnectWallet')}</b>
              </Popover.Body>
            </Popover>
          </Overlay>{' '}
        </>
      )}

      <WalletSelect
        show={walletModalShow}
        onHide={() => setWalletModalShow(false)}
      />
    </>
  )
}
export default AddressConn

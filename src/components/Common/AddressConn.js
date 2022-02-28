import React, { useRef, useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Button, Overlay, Popover } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import WalletSelect from '../WalletSelect/WalletSelect'
// import { usePool } from '../../store/pool/selector'
import { ReactComponent as WalletIconA } from '../../assets/icons/wallet-green.svg'
// import { ReactComponent as WalletIconB } from '../../assets/icons/wallet-yellow.svg'
import { ReactComponent as WalletIconC } from '../../assets/icons/wallet-red.svg'

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

  const btnClass = 'btn-round btn-icon btn-transparent align-self-center mx-2'

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
          <Button
            type="button"
            className={btnClass}
            onClick={() => setWalletModalShow(true)}
            onKeyPress={() => setWalletModalShow(true)}
            ref={target}
          >
            <WalletIconC fill="#aacdff" />
          </Button>
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
          <Button
            type="button"
            className={btnClass}
            onClick={() => setWalletModalShow(true)}
            onKeyPress={() => setWalletModalShow(true)}
            ref={targetB}
          >
            <WalletIconA fill="#aacdff" />
          </Button>
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

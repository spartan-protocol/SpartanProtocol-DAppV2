import React, { useRef, useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'react-i18next'
import Overlay from 'react-bootstrap/Overlay'
import Popover from 'react-bootstrap/Popover'
import WalletSelect from '../../../../components/WalletSelect/index'
import { Icon } from '../../../../components/Icons'

import styles from './styles.module.scss'
import { formatShortString } from '../../../../utils/web3'
import { useBreakpoint } from '../../../../providers/Breakpoint'

const AddressConn = () => {
  const wallet = useWeb3React()
  const { t } = useTranslation()
  const breakpoint = useBreakpoint()

  const [walletModalShow, setWalletModalShow] = useState(false)
  const [showPopConnect, setShowPopConnect] = useState(false)

  const target = useRef(null)

  useEffect(() => {
    const handleReload = async () => {
      document.location.reload(true)
    }
    const listenAccountsChanged = async () => {
      // window.ethereum?.on('accountsChanged', handleReload)
      window.BinanceChain?.on('accountsChanged', handleReload)
    }
    const listenNetworkChanged = async () => {
      // window.ethereum?.on('chainChanged', handleReload)
      window.BinanceChain?.on('chainChanged', handleReload)
    }
    listenAccountsChanged()
    listenNetworkChanged()
  }, [])

  useEffect(() => {
    setShowPopConnect(true)
    setTimeout(() => {
      setShowPopConnect(false)
    }, 3500)
  }, [])

  return (
    <>
      <WalletSelect
        show={walletModalShow}
        onHide={() => setWalletModalShow(false)}
      />
      <div
        role="button"
        className={`${styles.headerBtn} mx-2`}
        onClick={() => setWalletModalShow(true)}
        onKeyPress={() => setWalletModalShow(true)}
        ref={target}
        aria-hidden="true"
      >
        <Icon
          icon="bnbChainConnected"
          fill={wallet?.account ? 'green' : '#d80000'}
          size="24"
        />
        <span className={`${styles.btnText} ms-1`}>
          {wallet?.account
            ? formatShortString(wallet.account)
            : breakpoint.sm
            ? t('connectWallet')
            : t('wallet')}
        </span>
      </div>
      <Overlay
        target={target.current}
        show={showPopConnect}
        placement="bottom"
        onHide={() => setShowPopConnect(false)}
      >
        <Popover>
          <Popover.Header />
          <Popover.Body>
            <b>{t('checkConnectWallet')}</b>
          </Popover.Body>
        </Popover>
      </Overlay>
    </>
  )
}
export default AddressConn

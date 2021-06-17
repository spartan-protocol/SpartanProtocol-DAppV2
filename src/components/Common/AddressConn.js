import React, { useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Button } from 'react-bootstrap'
import WalletSelect from '../WalletSelect/WalletSelect'
import { usePool } from '../../store/pool/selector'
import { ReactComponent as WalletIconA } from '../../assets/icons/wallet-green.svg'
import { ReactComponent as WalletIconB } from '../../assets/icons/wallet-yellow.svg'
import { ReactComponent as WalletIconC } from '../../assets/icons/wallet-red.svg'

const AddressConn = () => {
  const wallet = useWallet()
  const pool = usePool()
  const [walletModalShow, setWalletModalShow] = useState(false)

  const btnClass = 'btn-round btn-icon btn-transparent align-self-center me-1'

  return (
    <>
      {!wallet && (
        <Button
          type="button"
          className={btnClass}
          onClick={() => setWalletModalShow(true)}
          onKeyPress={() => setWalletModalShow(true)}
        >
          <WalletIconC fill="#aacdff" />
        </Button>
      )}

      {wallet?.status === 'connecting' && (
        <Button
          type="button"
          className={btnClass}
          onClick={() => setWalletModalShow(true)}
          onKeyPress={() => setWalletModalShow(true)}
        >
          <WalletIconC fill="#aacdff" />
        </Button>
      )}

      {wallet?.status === 'disconnected' && (
        <Button
          type="button"
          className={btnClass}
          onClick={() => setWalletModalShow(true)}
          onKeyPress={() => setWalletModalShow(true)}
        >
          <WalletIconC fill="#aacdff" />
        </Button>
      )}

      {wallet?.status === 'error' && (
        <Button
          type="button"
          className={btnClass}
          onClick={() => setWalletModalShow(true)}
          onKeyPress={() => setWalletModalShow(true)}
        >
          <WalletIconC fill="#aacdff" />
        </Button>
      )}

      {pool.loadingFinal === true && wallet?.status === 'connected' && (
        <Button
          type="button"
          className={btnClass}
          onClick={() => setWalletModalShow(true)}
          onKeyPress={() => setWalletModalShow(true)}
        >
          <WalletIconB fill="#aacdff" />
        </Button>
      )}

      {pool.loadingFinal === false && wallet?.status === 'connected' && (
        <Button
          type="button"
          className={btnClass}
          onClick={() => setWalletModalShow(true)}
          onKeyPress={() => setWalletModalShow(true)}
        >
          <WalletIconA fill="#aacdff" />
        </Button>
      )}

      <WalletSelect
        show={walletModalShow}
        onHide={() => setWalletModalShow(false)}
      />
    </>
  )
}
export default AddressConn

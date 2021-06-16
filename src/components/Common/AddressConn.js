import React, { useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Button } from 'react-bootstrap'
import WalletSelect from '../WalletSelect/WalletSelect'
import { usePool } from '../../store/pool/selector'

const AddressConn = () => {
  const wallet = useWallet()
  const pool = usePool()
  const [walletModalShow, setWalletModalShow] = useState(false)

  const btnClass = 'btn-round btn-icon btn-transparent align-self-center me-1'
  const iconClass = 'icon-small icon-dark m-0'

  return (
    <>
      {!wallet && (
        <Button
          type="button"
          className={btnClass}
          onClick={() => setWalletModalShow(true)}
          onKeyPress={() => setWalletModalShow(true)}
        >
          <i className={`icon-wallet-red ${iconClass}`} />
        </Button>
      )}

      {wallet?.status === 'connecting' && (
        <Button
          type="button"
          className={btnClass}
          onClick={() => setWalletModalShow(true)}
          onKeyPress={() => setWalletModalShow(true)}
        >
          <i className={`icon-wallet-red ${iconClass}`} />
        </Button>
      )}

      {wallet?.status === 'disconnected' && (
        <Button
          type="button"
          className={btnClass}
          onClick={() => setWalletModalShow(true)}
          onKeyPress={() => setWalletModalShow(true)}
        >
          <i className={`icon-wallet-red ${iconClass}`} />
        </Button>
      )}

      {wallet?.status === 'error' && (
        <Button
          type="button"
          className={btnClass}
          onClick={() => setWalletModalShow(true)}
          onKeyPress={() => setWalletModalShow(true)}
        >
          <i className={`icon-wallet-red ${iconClass}`} />
        </Button>
      )}

      {pool.loadingFinal === true && wallet?.status === 'connected' && (
        <Button
          type="button"
          className={btnClass}
          onClick={() => setWalletModalShow(true)}
          onKeyPress={() => setWalletModalShow(true)}
        >
          <i className={`icon-wallet-yellow ${iconClass}`} />
        </Button>
      )}

      {pool.loadingFinal === false && wallet?.status === 'connected' && (
        <Button
          type="button"
          className={btnClass}
          onClick={() => setWalletModalShow(true)}
          onKeyPress={() => setWalletModalShow(true)}
        >
          <i className={`icon-wallet-green ${iconClass}`} />
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

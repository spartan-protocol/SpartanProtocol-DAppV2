import React, { useState } from 'react'
import { Button } from 'reactstrap'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import WalletSelect from '../WalletSelect/WalletSelect'
import { usePoolFactory } from '../../store/poolFactory/selector'
// import walletTypes from '../WalletSelect/walletTypes'

const AddressConn = () => {
  const wallet = useWallet()
  const poolFactory = usePoolFactory()
  const [walletModalShow, setWalletModalShow] = useState(false)
  // const [walletHeaderIcon] = useState(walletTypes[0].icon[0])

  const btnClass = 'btn-round btn-icon align-self-center mr-2'
  const iconClass = ' icon-small icon-dark m-0'

  return (
    <>
      {!wallet && (
        <Button
          type="button"
          className={btnClass}
          onClick={() => setWalletModalShow(true)}
          onKeyPress={() => setWalletModalShow(true)}
        >
          <i className={`icon-wallet-red${iconClass}`} />
        </Button>
      )}

      {wallet?.status === 'connecting' && (
        <Button
          type="button"
          className={btnClass}
          onClick={() => setWalletModalShow(true)}
          onKeyPress={() => setWalletModalShow(true)}
        >
          <i className={`icon-wallet-red${iconClass}`} />
        </Button>
      )}

      {wallet?.status === 'disconnected' && (
        <Button
          type="button"
          className={btnClass}
          onClick={() => setWalletModalShow(true)}
          onKeyPress={() => setWalletModalShow(true)}
        >
          <i className={`icon-wallet-red${iconClass}`} />
        </Button>
      )}

      {wallet?.status === 'error' && (
        <Button
          type="button"
          className={btnClass}
          onClick={() => setWalletModalShow(true)}
          onKeyPress={() => setWalletModalShow(true)}
        >
          <i className={`icon-wallet-red${iconClass}`} />
        </Button>
      )}

      {poolFactory.loadingFinal === true && wallet?.status === 'connected' && (
        <Button
          type="button"
          className={btnClass}
          onClick={() => setWalletModalShow(true)}
          onKeyPress={() => setWalletModalShow(true)}
        >
          <i className={`icon-wallet-yellow${iconClass}`} />
        </Button>
      )}

      {poolFactory.loadingFinal === false && wallet?.status === 'connected' && (
        <Button
          type="button"
          className={btnClass}
          onClick={() => setWalletModalShow(true)}
          onKeyPress={() => setWalletModalShow(true)}
        >
          <i className={`icon-wallet-green${iconClass}`} />
        </Button>
      )}

      <WalletSelect
        show={walletModalShow}
        onHide={() => setWalletModalShow(false)}
        // setWalletHeaderIcon={setWalletHeaderIcon}
      />
    </>
  )
}
export default AddressConn

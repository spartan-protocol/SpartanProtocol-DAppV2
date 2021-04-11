import React, { useState } from 'react'
import { Button } from 'reactstrap'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import WalletSelect from '../WalletSelect/WalletSelect'
// import walletTypes from '../WalletSelect/walletTypes'

const AddressConn = () => {
  const wallet = useWallet()
  const [walletModalShow, setWalletModalShow] = useState(false)
  // const [walletHeaderIcon] = useState(walletTypes[0].icon[0])

  return (
    <>
      {wallet?.status === 'disconnected' && (
        <>
          <Button
            type="button"
            className="btn-round btn-icon mt-2 mr-n1"
            onClick={() => setWalletModalShow(true)}
            onKeyPress={() => setWalletModalShow(true)}
          >
            <i className="icon-small icon-wallet-red icon-dark mt-1" />
          </Button>
        </>
      )}

      {wallet?.status === 'error' && (
        <>
          <Button
            type="button"
            className="btn-round btn-icon mt-2 mr-n1"
            onClick={() => setWalletModalShow(true)}
            onKeyPress={() => setWalletModalShow(true)}
          >
            <i className="icon-small icon-wallet-red icon-dark mt-1" />
          </Button>
        </>
      )}

      {wallet?.status === 'connecting' && (
        <>
          <Button
            type="button"
            className="btn-round btn-icon mt-2 mr-n1"
            onClick={() => setWalletModalShow(true)}
            onKeyPress={() => setWalletModalShow(true)}
          >
            <i className="icon-small icon-wallet-yellow icon-dark mt-1" />
          </Button>
        </>
      )}

      {wallet?.status === 'connected' && (
        <>
          <Button
            type="button"
            className="btn-round btn-icon mt-2 mr-n1"
            onClick={() => setWalletModalShow(true)}
            onKeyPress={() => setWalletModalShow(true)}
          >
            <i className="icon-small icon-wallet-green icon-dark mt-1" />
          </Button>
        </>
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

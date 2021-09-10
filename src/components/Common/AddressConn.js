import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Button } from 'react-bootstrap'
import WalletSelect from '../WalletSelect/WalletSelect'
import { usePool } from '../../store/pool/selector'
import { ReactComponent as WalletIconA } from '../../assets/icons/wallet-green.svg'
import { ReactComponent as WalletIconB } from '../../assets/icons/wallet-yellow.svg'
import { ReactComponent as WalletIconC } from '../../assets/icons/wallet-red.svg'

const AddressConn = () => {
  const wallet = useWeb3React()
  const pool = usePool()
  const [walletModalShow, setWalletModalShow] = useState(false)

  const btnClass = 'btn-round btn-icon btn-transparent align-self-center mx-2'

  useEffect(() => {
    async function listenAccountsChanged() {
      window.ethereum.on('accountsChanged', async () => {
        document.location.reload()
      })
    }
    async function listenNetworkChanged() {
      window.ethereum.on('chainChanged', async () => {
        document.location.reload()
      })
    }
    listenAccountsChanged()
    listenNetworkChanged()
  }, [])

  return (
    <>
      {(!wallet || !wallet?.active || wallet?.error) && (
        <Button
          type="button"
          className={btnClass}
          onClick={() => setWalletModalShow(true)}
          onKeyPress={() => setWalletModalShow(true)}
        >
          <WalletIconC fill="#aacdff" />
        </Button>
      )}

      {pool.loadingFinal === true && wallet?.active && (
        <Button
          type="button"
          className={btnClass}
          onClick={() => setWalletModalShow(true)}
          onKeyPress={() => setWalletModalShow(true)}
        >
          <WalletIconB fill="#aacdff" />
        </Button>
      )}

      {pool.loadingFinal === false && wallet?.active && (
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

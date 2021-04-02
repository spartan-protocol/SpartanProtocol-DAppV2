import React, { useState } from 'react'
import WalletSelect from '../WalletSelect/WalletSelect'
import walletTypes from '../WalletSelect/walletTypes'

const AddressConn = () => {
  const [walletModalShow, setWalletModalShow] = useState(false)
  const [walletHeaderIcon] = useState(walletTypes[0].icon[0])

  return (
    <>
      <>
        <div
          onClick={() => setWalletModalShow(true)}
          onKeyPress={() => setWalletModalShow(true)}
          role="button"
          tabIndex="0"
          className="align-self-center"
        >
          <img
            src={walletHeaderIcon}
            alt="Spartan Protocol SpartanIcons"
            className="logo text-center icon-medium"
          />
        </div>
        <WalletSelect
          show={walletModalShow}
          onHide={() => setWalletModalShow(false)}
          // setWalletHeaderIcon={setWalletHeaderIcon}
        />
      </>
    </>
  )
}
export default AddressConn

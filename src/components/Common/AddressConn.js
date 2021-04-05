/* eslint-disable*/


import React, { useState } from "react"
import WalletSelect from "../WalletSelect/WalletSelect"
import walletTypes from "../WalletSelect/walletTypes"
import {
  Button
} from "reactstrap"

const AddressConn = () => {
  const [walletModalShow, setWalletModalShow] = useState(false)
  // const [walletHeaderIcon] = useState(walletTypes[0].icon[0])

  return (
    <>
      <>
        <Button
          type="button"
          className="btn-round btn-icon mt-2 ml-n4"
          onClick={() => setWalletModalShow(true)}
          onKeyPress={() => setWalletModalShow(true)}>
          <i className="icon-small icon-wallet icon-dark mt-1" />
        </Button>
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

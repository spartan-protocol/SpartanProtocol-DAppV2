import React, { useState } from 'react'
import WalletSelect from '../WalletSelect/WalletSelect'
import walletTypes from '../WalletSelect/walletTypes'

const AddressConn = (props) => {
    const [walletModalShow, setWalletModalShow] = useState(false)
    const [walletHeaderIcon, setWalletHeaderIcon] = useState(walletTypes[0].icon)

    return (
        <>
            <>
                <div className="btn ml-1" onClick={() => setWalletModalShow(true)}>
                    <img src={walletHeaderIcon} alt='Spartan Protocol SpartanIcons' className='logo text-center icon-medium' />
                </div>
                <WalletSelect
                    show={walletModalShow}
                    onHide={() => setWalletModalShow(false)}
                    setWalletHeaderIcon={setWalletHeaderIcon}
                />
            </>
        </>
    )
}
export default AddressConn

import React, { useEffect, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { ethers } from "ethers"
import walletTypes from './walletTypes'
import { removeLiquidity } from '../../../utils/web3Router'

const WalletSelect = (props) => {
    const wallet = useWallet()
    const [walletIcon, setWalletIcon] = useState('')

    useEffect(() => {
        const checkWallet = () => {
            console.log('Wallet Status:', wallet)
            if (wallet.status === 'connected') {
                window.localStorage.setItem("walletConnected", "1")
                removeLiquidity(1, '0x27c6487C9B115c184Bb04A1Cf549b670a22D2870', true, wallet.account)
            }
            else {window.localStorage.removeItem("walletConnected")}
        }

        checkWallet()
    }, [wallet])

    const connectWallet = (props, x) => {
        wallet.reset()
        if (x.inject === '') {wallet.connect()}
        else {wallet.connect(x.inject)}
        window.localStorage.setItem("lastWallet", x.id)
        setWalletIcon(x.icon)
        props.setWalletHeaderIcon(x.icon)
    }

    return (
        <>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Manage Wallets</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        {wallet.status === 'connected' ? (
                            <div>
                                <Image src={walletIcon} className='wallet-modal-icon' roundedCircle />
                                <div>Wallet: {window.localStorage.getItem("lastWallet")}</div>
                                <div>Chain ID: {wallet.chainId}</div>
                                <div>Account: {wallet.account}</div>
                                <div>BNB Balance: {ethers.utils.formatEther(wallet.balance)}</div>
                                <Button variant="primary" onClick={() => navigator.clipboard.writeText(wallet.account)}>
                                    Copy Address
                                </Button>
                                <Button variant="primary" href={'https://testnet.bscscan.com/address/' + wallet.account} target='_blank'>
                                    View on BscScan
                                </Button>
                                <Button variant="secondary" onClick={() => {wallet.reset()}}>
                                    Disconnect
                                </Button>
                            </div>
                        ) : (
                            <div>
                                {walletTypes.map(x => (
                                    <div key={x.id}>
                                        <Button variant="primary" className='wallet-modal-button' onClick={() => connectWallet(props, x)}>
                                            <Row>
                                                <Col xs='8'>
                                                    <h5>{x.title}</h5>
                                                </Col>
                                                <Col xs='4' className='px-1'>
                                                    <Image src={x.icon} className='wallet-modal-icon' roundedCircle />
                                                </Col>
                                            </Row>
                                        </Button><br />
                                    </div>
                                ))}
                                {wallet.status === 'error' &&
                                    <p>Wallet connection failed! Please check that the RPC is set to BSC mainnet and that you have selected the correct wallet type!</p>
                                }
                            </div>
                        )}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default WalletSelect
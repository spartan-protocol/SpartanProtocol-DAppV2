import React, { useEffect, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { ethers } from "ethers"

import walletTypes from './walletTypes'
import { getExplorerWallet } from '../../utils/extCalls'
import { SPARTA_ADDR, watchAsset } from '../../utils/web3'

const WalletSelect = (props) => {
    const wallet = useWallet()
    const [walletIcon, setWalletIcon] = useState('')

    useEffect(() => {
        const checkWallet = () => {
            console.log('Wallet Status:', wallet.status)
            if (wallet.status === 'connected') {
                window.sessionStorage.setItem("walletConnected", "1")
            }
            if (wallet.status === 'disconnected') {
                window.sessionStorage.removeItem("walletConnected")
                window.sessionStorage.removeItem("lastWallet")
            }
            if (wallet.status === 'error') {
                window.sessionStorage.removeItem("walletConnected")
                window.sessionStorage.removeItem("lastWallet")
            }
        }

        checkWallet()
    }, [wallet.status])

    const connectWallet = (props, x) => {
        wallet.reset()
        console.log('reset')
        if (x.inject === '') {wallet.connect()}
        else {wallet.connect(x.inject)}
        window.sessionStorage.setItem("lastWallet", x.id)
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
                        {wallet.status === 'error' &&
                            <p className='text-center'>
                                Wallet connection failed!<br/>
                                Check the network is set to BSC MainNet!<br/>
                                Have you selected the correct wallet type?
                            </p>
                        }
                        {wallet.status === 'connected' ? (
                            <div>
                                <Image src={walletIcon} className='wallet-modal-icon' roundedCircle />
                                <div>Wallet: {window.sessionStorage.getItem("lastWallet")}</div>
                                <div>Chain ID: {wallet.chainId}</div>
                                <div>Account: {wallet.account}</div>
                                <div>BNB Balance: {ethers.utils.formatEther(wallet.balance)}</div>
                                <Button variant="primary" onClick={() => navigator.clipboard.writeText(wallet.account)}>
                                    Copy Address
                                </Button>
                                <Button variant="primary" onClick={() => {watchAsset(SPARTA_ADDR, 'SPARTA', 18)}}> 
                                    Add to Wallet
                                </Button>
                                <Button variant="primary" href={getExplorerWallet(wallet.account)} target='_blank'>
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
import React from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const WalletSelect = (props) => {
    const wallet = useWallet()
    const rpcUrl = process.env.REACT_APP_RPC

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
                                <div>Account: {wallet.account}</div>
                                <div>Balance: {wallet.balance}</div>
                                <button onClick={() => wallet.reset()}>disconnect</button>
                            </div>
                        ) : (
                            <div>
                                Connect Wallet: <br />
                                <Button 
                                    fullWidth
                                    variant="primary"
                                    onClick={() => {
                                        wallet.connect();
                                        window.localStorage.setItem("walletConnected", "1");
                                        props.onHide();
                                    }}
                                    >
                                    MetaMask *ICON*
                                </Button><br />
                                <Button 
                                    variant="primary"
                                    onClick={() => {
                                        wallet.connect();
                                        window.localStorage.setItem("walletConnected", "1");
                                        props.onHide();
                                    }}
                                    >
                                    MetaMask *ICON*
                                </Button>
                                <button onClick={() => wallet.connect()}>MetaMask</button>
                                <button onClick={() => wallet.connect('bsc')}>BSC</button>
                                <button onClick={() => wallet.connect('walletconnect:' + { rpcUrl })}>WalletConnect</button>
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
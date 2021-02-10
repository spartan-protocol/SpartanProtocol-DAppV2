import React, {useEffect} from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const WalletSelect = (props) => {
    const wallet = useWallet()
    const rpcUrl = process.env.REACT_APP_RPC

    useEffect(() => {
        const checkWallet = () => {
            console.log(wallet.status)
            if (wallet.status === 'connected') {
                window.localStorage.setItem("walletConnected", "1")
            }
            else {window.localStorage.removeItem("walletConnected")}
        }

        checkWallet()
    }, [wallet.status])

    const connectWallet = (props) => {
        wallet.reset()
        wallet.connect(props)
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
                                <div>Account: {wallet.account}</div>
                                <div>Balance: {wallet.balance}</div>
                                <Button variant="secondary" onClick={() => {wallet.reset()}}>
                                    Disconnect
                                </Button>
                            </div>
                        ) : (
                            <div>
                                <Button variant="primary" onClick={() => connectWallet('bsc')}>
                                    Binance Chain Wallet *ICON*
                                </Button><br />
                                <Button variant="primary" onClick={() => connectWallet()}>
                                    MetaMask *ICON*
                                </Button><br />
                                <Button variant="primary" onClick={() => connectWallet('walletconnect:' + { rpcUrl })}>
                                    WalletConnect *ICON*
                                </Button><br />
                                <Button variant="primary" onClick={() => connectWallet('injected')}>
                                    TrustWallet *ICON*
                                </Button><br />
                                <Button variant="primary" onClick={() => connectWallet('injected')}>
                                    MathWallet *ICON*
                                </Button><br />
                                <Button variant="primary" onClick={() => connectWallet('injected')}>
                                    Try Other (Injected) *ICON*
                                </Button>
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
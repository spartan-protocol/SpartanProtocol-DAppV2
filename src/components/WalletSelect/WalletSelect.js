/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Col from 'react-bootstrap/Col'
import { ethers } from 'ethers'

import { Alert } from 'reactstrap'
import { useDispatch } from 'react-redux'
import walletTypes from './walletTypes'
import { getExplorerWallet } from '../../utils/extCalls'
import { changeNetwork, getNetwork, SPARTA_ADDR } from '../../utils/web3'
import { watchAsset } from '../../store/web3'

const WalletSelect = (props) => {
  const dispatch = useDispatch()
  const wallet = useWallet()
  const [walletIcon, setWalletIcon] = useState('')
  const [network, setNetwork] = useState(getNetwork)

  const _changeNetwork = (net) => {
    setNetwork(changeNetwork(net))
  }

  //   const [modalMini, setModalMini] = React.useState(false)
  //   const [modalClassic, setModalClassic] = React.useState(false)
  //   const [modalNotice, setModalNotice] = React.useState(false)
  //   const notificationAlertRef = React.useRef(null)
  //   const toggleModalClassic = () => {
  //     setModalClassic(!modalClassic)
  //   }
  //   const toggleModalNotice = () => {
  //     setModalNotice(!modalNotice)
  //   }
  //   const toggleModalMini = () => {
  //     setModalMini(!modalMini)
  //   }

  useEffect(() => {
    const checkWallet = () => {
      console.log('Wallet Status:', wallet.status)
      if (wallet.status === 'connected') {
        window.sessionStorage.setItem('walletConnected', '1')
      }
      if (wallet.status === 'disconnected') {
        window.sessionStorage.removeItem('walletConnected')
        window.sessionStorage.removeItem('lastWallet')
      }
      if (wallet.status === 'error') {
        window.sessionStorage.removeItem('walletConnected')
        window.sessionStorage.removeItem('lastWallet')
      }
    }

    checkWallet()
  }, [wallet.status])

  const connectWallet = (x) => {
    wallet.reset()
    console.log('reset')
    if (x.inject === '') {
      wallet.connect()
    } else {
      wallet.connect(x.inject)
    }
    window.sessionStorage.setItem('lastWallet', x.id)
    setWalletIcon(x.icon)
    props.setWalletHeaderIcon(x.icon)
  }

  return (
    <>
      <Modal {...props}>
        <div className="modal-header ">
          <button
            aria-hidden
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={props.onHide}
          >
            <i className="bd-icons icon-simple-remove" />
          </button>
          <h2 className="modal-title text-center" id="myModalLabel">
            Connect to a wallet - Network: {network.net}
          </h2>
        </div>

        <Modal.Body className="center-text">
          {wallet.status === 'error' && (
            <Alert color="warning">
              <span>
                {' '}
                Wallet connection failed! Check the network is set to BSC
                MainNet! Have you selected the correct wallet type?
              </span>
            </Alert>
          )}

          <div>
            <button
              type="button"
              className="btn btn-success w-50 mx-0 px-1"
              onClick={() => _changeNetwork('mainnet')}
            >
              <Col>
                <div className="">Mainnet</div>
              </Col>
            </button>
            <button
              type="button"
              className="btn btn-success w-50 mx-0 px-1"
              onClick={() => _changeNetwork('testnet')}
            >
              <Col>
                <div className="">Testnet</div>
              </Col>
            </button>
          </div>

          {wallet.status === 'connected' ? (
            <div>
              <Image
                src={walletIcon}
                className="wallet-modal-icon"
                roundedCircle
              />
              <div>Wallet: {window.sessionStorage.getItem('lastWallet')}</div>
              <div>Chain ID: {wallet.chainId}</div>
              <div>Account: {wallet.account}</div>
              <div>BNB Balance: {ethers.utils.formatEther(wallet.balance)}</div>
              <Button
                variant="primary"
                onClick={() => navigator.clipboard.writeText(wallet.account)}
              >
                Copy Address
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  dispatch(watchAsset(SPARTA_ADDR, 'SPARTA', 18))
                }}
              >
                Add to Wallet
              </Button>
              <Button
                variant="primary"
                href={getExplorerWallet(wallet.account)}
                target="_blank"
              >
                View on BscScan
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  wallet.reset()
                }}
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <div>
              {walletTypes.map((x) => (
                <div key={x.id}>
                  <button
                    size="lg"
                    color="success"
                    type="button"
                    className="btn btn-warning btn-block"
                    onClick={() => connectWallet(props, x)}
                  >
                    <Col>
                      <div className="float-left mt-2 ">{x.title}</div>
                      <div className="float-right">
                        <Image src={x.icon} className="px-1 wallet-icons" />
                      </div>
                    </Col>
                  </button>
                  <br />
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <div className="modal-footer justify-content-center">
          <Button
            className="btn-round"
            color="info"
            data-dismiss="modal"
            type="button"
            onClick={props.onHide}
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default WalletSelect

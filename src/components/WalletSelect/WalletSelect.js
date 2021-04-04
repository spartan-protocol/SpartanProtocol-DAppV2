/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'

import { useDispatch } from 'react-redux'
import { Alert, Form, Row, Modal, Button, Image, Col } from 'react-bootstrap'
import walletTypes from './walletTypes'
import { getExplorerWallet } from '../../utils/extCalls'
import { changeNetwork, getNetwork, getAddresses } from '../../utils/web3'
import { addNetworkMM, addNetworkBC, watchAsset } from '../../store/web3'
import { usePoolFactory } from '../../store/poolFactory/selector'
import HelmetLoading from '../Loaders/HelmetLoading'

const addr = getAddresses()

const WalletSelect = (props) => {
  const poolFactory = usePoolFactory()
  const dispatch = useDispatch()
  const wallet = useWallet()
  const [network, setNetwork] = useState(getNetwork)

  const onChangeNetwork = async (net) => {
    if (net.target.checked === true) {
      setNetwork(changeNetwork('mainnet'))
    }
    if (net.target.checked === false) {
      setNetwork(changeNetwork('testnet'))
    } else {
      setNetwork(changeNetwork(net))
    }
    await dispatch(addNetworkMM())
    dispatch(addNetworkBC())
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

  const connectWallet = async (x) => {
    // wallet.reset()
    console.log('reset')
    if (x.inject === '') {
      console.log('no inject')
      wallet.connect()
    } else if (x.inject === 'walletconnect') {
      wallet.connectors.walletconnect.rpcUrl = network.rpc
      await wallet.connect(x.inject)
    } else {
      wallet.connect(x.inject)
    }
    window.sessionStorage.setItem('lastWallet', x.id)
    // props.setWalletHeaderIcon(x.icon[0])
  }

  return (
    <>
      <Modal {...props}>
        <div className="modal-header ">
          {/* <button */}
          {/*  aria-hidden */}
          {/*  className="close" */}
          {/*  data-dismiss="modal" */}
          {/*  type="button" */}
          {/*  onClick={props.onHide} */}
          {/* > */}
          {/*  <i className="bd-icons icon-simple-remove" /> */}
          {/* </button> */}
          {wallet.status !== 'connected' && (
            <Col>
              <div className="small-4 medium-4 large-4 columns text-center">
                <i className="icon-large icon-wallet icon-dark text-center " />
              </div>
              <h1 className="modal-title text-center" id="myModalLabel">
                Connect to wallet
              </h1>
            </Col>
          )}
        </div>

        {poolFactory.loading && <HelmetLoading height="300px" width="300px" />}

        {!poolFactory.loading && (
          <Modal.Body className="center-text">
            {wallet.status === 'error' && (
              <Alert color="warning">
                <span>
                  {' '}
                  Wallet connection failed! Check the network in your wallet
                  matches the selection in the DApp.
                </span>
              </Alert>
            )}
            {wallet.status !== 'connected' && (
              <>
                <Row className="align-middle mb-3">
                  <Col xs={5} className="text-right">
                    TestNet
                  </Col>
                  <Col xs={2}>
                    <Form>
                      <Form.Check
                        type="switch"
                        id="custom-switch"
                        checked={network?.net === 'mainnet'}
                        onChange={(value) => onChangeNetwork(value)}
                        style={{ top: '-10px' }}
                      />
                    </Form>
                  </Col>
                  <Col xs={5} className="text-left">
                    MainNet
                  </Col>
                </Row>
                <br />
              </>
            )}

            {wallet.status === 'connected' ? (
              <div>
                <Row>
                  <Col xs="11">
                    <h2>Wallet</h2>
                  </Col>
                  <Col xs="1">
                    <Button
                      onClick={props.onHide}
                      className="btn btn-transparent"
                    >
                      <i className="icon-medium icon-close" />
                    </Button>
                  </Col>
                </Row>
                {wallet.account && (
                  <Row>
                    <Col xl="5">
                      <span className="description">
                        View on BSC Scan{' '}
                        <a
                          href={getExplorerWallet(wallet.account)}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            marginLeft: '2px',
                          }}
                        >
                          <i className="icon-extra-small icon-scan" />
                        </a>
                      </span>
                      <span className="title">
                        {wallet.account.substr(0, 5)}...
                        {wallet.account.slice(-5)}
                      </span>
                    </Col>
                  </Row>
                )}
                <Button
                  variant="danger"
                  onClick={() => navigator.clipboard.writeText(wallet.account)}
                >
                  Copy Address
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    dispatch(watchAsset(addr.sparta, 'SPARTA', 18))
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
                      className="btn btn-danger btn-block mt-n3"
                      onClick={() => connectWallet(x)}
                    >
                      <Col>
                        <div className="float-left mt-2 ">{x.title}</div>
                        <div className="float-right">
                          {x.icon.map((i) => (
                            <Image
                              key={`${x.id}icon${i}`}
                              src={i}
                              className="px-1 wallet-icons"
                            />
                          ))}
                        </div>
                      </Col>
                    </button>
                    <br />
                  </div>
                ))}
              </div>
            )}
          </Modal.Body>
        )}
        <div className="ml-4 mr-4 mb-3">
          <Button
            className="btn-round btn-block "
            color="info"
            data-dismiss="modal"
            type="button"
            size="lg"
            onClick={props.onHide}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default WalletSelect

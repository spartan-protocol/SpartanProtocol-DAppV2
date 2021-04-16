/* eslint-disable*/
import React, { useEffect, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'

import { useDispatch } from 'react-redux'
import { Alert, Form, Row, Modal, Button, Image, Col } from 'react-bootstrap'
import { Nav, NavLink, NavItem, TabContent, TabPane } from 'reactstrap'
import Card from 'react-bootstrap/Card'
import CardHeader from 'reactstrap/es/CardHeader'
import CardTitle from 'reactstrap/es/CardTitle'
import walletTypes from './walletTypes'
import { getExplorerWallet } from '../../utils/extCalls'
import { changeNetwork, getNetwork } from '../../utils/web3'
import { addNetworkMM, addNetworkBC, watchAsset } from '../../store/web3'
import { usePoolFactory } from '../../store/poolFactory/selector'
import ShareLink from '../Share/ShareLink'
import { formatFromWei } from '../../utils/bigNumber'
import MetaMask from '../../assets/icons/MetaMask.svg'
import spartaIcon from '../../assets/img/spartan_red_small.svg'
import spartaIconAlt from '../../assets/img/spartan_white_small.svg'

const WalletSelect = (props) => {
  const poolFactory = usePoolFactory()
  const dispatch = useDispatch()
  const wallet = useWallet()
  const [network, setNetwork] = useState(getNetwork)
  const [horizontalTabs, sethorizontalTabs] = useState('assets')

  const changeActiveTab = (e, tabState, tabName) => {
    e.preventDefault()
    sethorizontalTabs(tabName)
  }

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
      }
      if (wallet.status === 'error') {
        window.sessionStorage.removeItem('walletConnected')
      }
    }

    checkWallet()
  }, [wallet.status])

  const connectWallet = async (x) => {
    wallet.reset()
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
    window.localStorage.setItem('lastWallet', x.id)
    // props.setWalletHeaderIcon(x.icon[0])
  }

  useEffect(() => {
    async function sleep() {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      if (window.localStorage.getItem('lastWallet') === 'BC') {
        connectWallet(walletTypes.filter((x) => x.id === 'BC')[0])
      } else if (window.localStorage.getItem('lastWallet') === 'MM') {
        connectWallet(walletTypes.filter((x) => x.id === 'MM')[0])
      } else if (window.localStorage.getItem('lastWallet') === 'WC') {
        connectWallet(walletTypes.filter((x) => x.id === 'WC')[0])
      } else if (window.localStorage.getItem('lastWallet') === 'OOT') {
        connectWallet(walletTypes.filter((x) => x.id === 'OOT')[0])
      }
    }

    sleep()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Modal {...props}>
        <Card className="card-body">
          {wallet.status !== 'connected' && (
            <CardHeader>
              <CardTitle tag="h2" />
              <Row>
                <Col>
                  <div className="small-4 medium-4 large-4 columns text-center">
                    <i className="icon-large icon-wallet icon-dark text-center " />
                  </div>
                  <h1 className="text-center" id="myModalLabel">
                    Connect to wallet
                  </h1>
                </Col>
              </Row>
            </CardHeader>
          )}

          {wallet.status === 'error' && (
            <Alert color="warning">
              <span>
                {' '}
                Check if the network in your wallet matches the selection in the
                DApp.
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

          {/* Wallet overview */}
          {wallet.status === 'connected' ? (
            <div>
              <Row>
                <Col xs="10">
                  <h2>Wallet</h2>
                </Col>
                <Col xs="2">
                  <Button
                    style={{
                      right: '16px',
                    }}
                    onClick={props.onHide}
                    className="btn btn-transparent"
                  >
                    <i className="icon-small icon-close" />
                  </Button>
                </Col>
              </Row>

              {wallet.status === 'connected' && (
                <>
                      <Row>
                        <Col xs={6}>
                          <div className="output-wallet-description">View on BSC Scan  <a
                            href={getExplorerWallet(wallet.account)}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              marginLeft: '2px',
                            }}
                          >
                            <i className="icon-extra-small icon-scan" />
                          </a>
                          </div>
                          <span className="title">
                            {wallet.account?.substr(0, 5)}...
                            {wallet.account?.slice(-5)}<ShareLink
                            url={wallet.account}
                            notificationLocation="tc"
                          >
                            <i className="icon-small icon-copy" />
                          </ShareLink>
                          </span>
                        </Col>
                          <Col xs={6}>
                            <Button
                            className="mx-1 btn-sm btn-danger btn-round d-block d-sm-none"
                            onClick={() => {
                              wallet.reset()
                            }}
                          >
                            Change wallet
                          </Button>

                            <Button
                              className="float-right mx-1 btn-md btn-danger btn-round d-none d-sm-block"
                              onClick={() => {
                                wallet.reset()
                              }}
                            >
                              Change wallet
                            </Button>
                          </Col>
                  </Row>
                  <br />
                  <br />
                  <Row className="card-body">
                    <Nav pills className="nav-tabs-custom">
                      <NavItem>
                        <NavLink
                          data-toggle="tab"
                          href="#"
                          className={
                            horizontalTabs === 'assets' ? 'active' : ''
                          }
                          onClick={(e) =>
                            changeActiveTab(e, 'horizontalTabs', 'assets')
                          }
                        >
                          Assets
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          data-toggle="tab"
                          href="#"
                          className={horizontalTabs === 'lp' ? 'active' : ''}
                          onClick={(e) =>
                            changeActiveTab(e, 'horizontalTabs', 'lp')
                          }
                        >
                          Lp Shares
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          data-toggle="tab"
                          href="#"
                          className={
                            horizontalTabs === 'synths' ? 'active' : ''
                          }
                          onClick={(e) =>
                            changeActiveTab(e, 'horizontalTabs', 'synths')
                          }
                        >
                          Synths
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Row>

                  {/* Asset tabs */}
                  <TabContent className="tab-space" activeTab={horizontalTabs}>
                    <TabPane tabId="assets">
                      <Row className="mt-3 mb-3">
                        <Col xs="7">
                          <p className="text-card">Asset</p>
                        </Col>
                        <Col xs="5">
                          <p className="text-card float-right">Balance</p>
                        </Col>
                      </Row>
                      {poolFactory.detailedArray
                        ?.filter((asset) => asset.balanceTokens > 0)
                        .map((asset) => (
                          <Row
                            key={`${asset.tokenAddress}-asset`}
                            className="align-items-center mb-3 output-card"
                          >
                            <Col xs="7" className="d-flex align-items-center">
                              <img
                                height="35px"
                                src={asset.symbolUrl}
                                alt={asset.name}
                                className="mr-1"
                              />
                              {asset.symbol}
                              <ShareLink
                                url={asset.tokenAddress}
                                notificationLocation="tc"
                              >
                                <i
                                  role="button"
                                  className="icon-small icon-copy ml-2 align-middle"
                                />
                              </ShareLink>
                              <div
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === 32) {
                                    dispatch(
                                      watchAsset(
                                        asset.tokenAddress,
                                        asset.symbol,
                                        '18',
                                        asset.symbolUrl,
                                      ),
                                    )
                                  }
                                }}
                                onClick={() => {
                                  dispatch(
                                    watchAsset(
                                      asset.tokenAddress,
                                      asset.symbol,
                                      '18',
                                      asset.symbolUrl,
                                    ),
                                  )
                                }}
                              >
                                <img
                                  src={MetaMask}
                                  alt="add asset to metamask"
                                  height="24px"
                                />
                              </div>
                            </Col>
                            <Col xs="5" className="text-right">
                              <span className="amount">
                                {formatFromWei(asset.balanceTokens)}
                              </span>
                            </Col>
                          </Row>
                        ))}
                    </TabPane>
                    <TabPane tabId="lp">
                      {poolFactory.finalLpArray?.filter(
                        (asset) => asset.lockedLPs > 0,
                      ).length > 0 && (
                        <Row className="h6 mt-3 mb-3 output-card">
                          <Col xs="7" className="pl-4">
                            LP Asset
                          </Col>
                          <Col xs="5" className="text-right">
                            Locked in DAO
                          </Col>
                        </Row>
                      )}
                      {poolFactory.finalLpArray
                        ?.filter((asset) => asset.lockedLPs > 0)
                        .map((asset) => (
                          <Row
                            key={`${asset.tokenAddress}-lp`}
                            className="align-items-center mb-3"
                          >
                            <Col xs="7" className="d-flex align-items-center">
                              <img
                                height="35px"
                                src={asset.symbolUrl}
                                alt={asset.name}
                                className="mr-n3"
                              />
                              <img
                                height="27px"
                                src={spartaIcon}
                                alt="SPARTA"
                                className="mr-2"
                              />
                              {`${asset.symbol}-SPP`}
                              <ShareLink
                                url={asset.poolAddress}
                                notificationLocation="tc"
                              >
                                <i
                                  role="button"
                                  className="icon-small icon-copy ml-2 align-middle"
                                />
                              </ShareLink>
                              <div
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === 32) {
                                    dispatch(
                                      watchAsset(
                                        asset.poolAddress,
                                        `${asset.symbol}-SPP`,
                                        '18',
                                        asset.symbolUrl,
                                      ),
                                    )
                                  }
                                }}
                                onClick={() => {
                                  dispatch(
                                    watchAsset(
                                      asset.poolAddress,
                                      `${asset.symbol}-SPP`,
                                      '18',
                                      asset.symbolUrl,
                                    ),
                                  )
                                }}
                              >
                                <img
                                  src={MetaMask}
                                  alt="add asset to metamask"
                                  height="24px"
                                />
                              </div>
                            </Col>
                            <Col xs="5" className="text-right">
                              <span className="amount">
                                {formatFromWei(asset.lockedLPs)}
                              </span>
                            </Col>
                          </Row>
                        ))}
                      <Row className="mt-3 mb-3">
                        <Col xs="7">
                          <p className="text-card">Asset</p>
                        </Col>
                        <Col xs="5">
                          <p className="text-card float-right">Balance</p>
                        </Col>
                      </Row>
                      {poolFactory.finalLpArray
                        ?.filter((asset) => asset.balanceLPs > 0)
                        .map((asset) => (
                          <Row
                            key={`${asset.tokenAddress}-lp`}
                            className="align-items-center mb-3 output-card"
                          >
                            <Col xs="7" className="d-flex align-items-center">
                              <img
                                height="35px"
                                src={asset.symbolUrl}
                                alt={asset.name}
                                className="mr-n3"
                              />
                              <img
                                height="27px"
                                src={spartaIcon}
                                alt="SPARTA"
                                className="mr-2"
                              />
                              {`${asset.symbol}-SPP`}
                              <ShareLink
                                url={asset.poolAddress}
                                notificationLocation="tc"
                              >
                                <i
                                  role="button"
                                  className="icon-small icon-copy ml-2 align-middle"
                                />
                              </ShareLink>
                              <div
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === 32) {
                                    dispatch(
                                      watchAsset(
                                        asset.poolAddress,
                                        `${asset.symbol}-SPP`,
                                        '18',
                                        asset.symbolUrl,
                                      ),
                                    )
                                  }
                                }}
                                onClick={() => {
                                  dispatch(
                                    watchAsset(
                                      asset.poolAddress,
                                      `${asset.symbol}-SPP`,
                                      '18',
                                      asset.symbolUrl,
                                    ),
                                  )
                                }}
                              >
                                <img
                                  src={MetaMask}
                                  alt="add asset to metamask"
                                  height="24px"
                                />
                              </div>
                            </Col>
                            <Col xs="5" className="text-right">
                              <span className="amount">
                                {formatFromWei(asset.balanceLPs)}
                              </span>
                            </Col>
                          </Row>
                        ))}
                    </TabPane>
                    <TabPane tabId="synths">
                      <Row className="mt-3 mb-3">
                        <Col xs="7">
                          <p className="text-card">Asset</p>
                        </Col>
                        <Col xs="5">
                          <p className="text-card float-right">Balance</p>
                        </Col>
                      </Row>
                      {poolFactory.finalLpArray
                        ?.filter((asset) => asset.balanceSynths > 0)
                        .map((asset) => (
                          <Row
                            key={`${asset.tokenAddress}-synth`}
                            className="align-items-center mb-3"
                          >
                            <Col xs="7" className="d-flex align-items-center">
                              <img
                                height="35px"
                                src={asset.symbolUrl}
                                alt={asset.name}
                                className="mr-n3"
                              />
                              <img
                                height="27px"
                                src={spartaIconAlt}
                                alt="SPARTA"
                                className="mr-2"
                              />
                              <span>{`${asset.symbol}-SPS`}</span>
                              <ShareLink
                                url={asset.synthAddress}
                                notificationLocation="tc"
                              >
                                <i
                                  role="button"
                                  className="icon-small icon-copy ml-2 align-middle"
                                />
                              </ShareLink>
                              <div
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === 32) {
                                    dispatch(
                                      watchAsset(
                                        asset.synthAddress,
                                        `${asset.symbol}-SPS`,
                                        '18',
                                        asset.symbolUrl,
                                      ),
                                    )
                                  }
                                }}
                                onClick={() => {
                                  dispatch(
                                    watchAsset(
                                      asset.synthAddress,
                                      `${asset.symbol}-SPS`,
                                      '18',
                                      asset.symbolUrl,
                                    ),
                                  )
                                }}
                              >
                                <img
                                  src={MetaMask}
                                  alt="add asset to metamask"
                                  height="24px"
                                />
                              </div>
                            </Col>
                            <Col xs="5" className="text-right">
                              <span className="amount">
                                {formatFromWei(asset.balanceSynths)}
                              </span>
                            </Col>
                          </Row>
                        ))}
                    </TabPane>
                  </TabContent>
                </>
              )}
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
        </Card>
      </Modal>
    </>
  )
}

export default WalletSelect

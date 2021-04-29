import React, { useEffect, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'

import { useDispatch } from 'react-redux'
import { Alert, Form, Row, Modal, Button, Image, Col } from 'react-bootstrap'
import { Nav, NavLink, NavItem, TabContent, TabPane } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import CardHeader from 'reactstrap/es/CardHeader'
import CardTitle from 'reactstrap/es/CardTitle'
import walletTypes from './walletTypes'
import { getExplorerWallet } from '../../utils/extCalls'
import { changeNetwork, getNetwork } from '../../utils/web3'
import { addNetworkMM, addNetworkBC, watchAsset } from '../../store/web3'
import { usePool } from '../../store/pool/selector'
import ShareLink from '../Share/ShareLink'
import { formatFromWei } from '../../utils/bigNumber'
import spartaIcon from '../../assets/img/spartan_lp.svg'
import spartaIconAlt from '../../assets/img/spartan_synth.svg'
import { useSynth } from '../../store/synth/selector'

const WalletSelect = (props) => {
  const synth = useSynth()
  const pool = usePool()
  const dispatch = useDispatch()
  const wallet = useWallet()
  const [network, setNetwork] = useState(getNetwork)
  const [horizontalTabs, sethorizontalTabs] = useState('assets')
  const { t } = useTranslation()

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

  useEffect(() => {
    const checkWallet = () => {
      console.log('Wallet Status:', wallet.status)
      if (wallet.status === 'connected') {
        if (wallet.account === null) {
          wallet.connect()
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.status])

  const connectWallet = async (x) => {
    wallet.reset()
    console.log('Wallet Status: cleared')
    if (x.inject === '') {
      wallet.connect()
    } else if (x.inject === 'walletconnect') {
      wallet.connectors.walletconnect.rpcUrl = network.rpc
      await wallet.connect(x.inject)
    } else {
      wallet.connect(x.inject)
    }
    window.localStorage.setItem('lastWallet', x.id)
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

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  return (
    <>
      <Modal show={props.show} onHide={props.onHide}>
        <div className="card-body">
          {wallet.status !== 'connected' && (
            <CardHeader style={{ backgroundColor: '#1D171F' }}>
              <CardTitle tag="h2" />
              <Row>
                <Col>
                  <div className="small-4 medium-4 large-4 columns text-center">
                    <i className="icon-large icon-wallet icon-dark text-center " />
                  </div>
                  <h1 className="text-center" id="myModalLabel">
                    {t('wallet')}
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
            <div className="ml-2 mt-n3">
              <Row className="card-body">
                <Col xs="10">
                  <h3 className="ml-n4 modal-title">{t('wallet')}</h3>
                </Col>
                <Col xs="2">
                  <Button
                    onClick={props.onHide}
                    className="btn btn-transparent"
                  >
                    <i className="icon-small icon-close mt-3" />
                  </Button>
                </Col>
              </Row>

              {wallet.status === 'connected' && (
                <>
                  <Row>
                    <Col xs={6} className="ml-n1">
                      <div className="output-wallet-description ">
                        {t('viewBscScan')}{' '}
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
                      </div>
                      <span className="title">
                        {wallet.account?.substr(0, 5)}...
                        {wallet.account?.slice(-5)}
                        <ShareLink
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
                        {t('changeWallet')}
                      </Button>

                      <Button
                        className="float-right mx-1 btn-md btn-danger btn-round d-none d-sm-block"
                        onClick={() => {
                          wallet.reset()
                        }}
                      >
                        {t('changeWallet')}
                      </Button>
                    </Col>
                  </Row>
                  <br />
                  {/* wallet navigation tabs */}
                  <div className="modal-body ml-n3 mb-4">
                    <Row>
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
                            {t('assets')}
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
                            {t('lpTokens')}
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
                            {t('synths')}
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </Row>

                    {/* Asset tabs */}
                    <TabContent
                      className="tab-space"
                      activeTab={horizontalTabs}
                    >
                      <TabPane tabId="assets" className="ml-n2">
                        <Row className="mt-3 mb-3">
                          <Col xs="9" md="9" className="ml-n1">
                            <div className="text-card">{t('wallet')}</div>
                          </Col>
                          <Col xs="3" md="3">
                            <div className="text-card float-right mr-1">
                              {t('actions')}
                            </div>
                          </Col>
                        </Row>
                        {pool.tokenDetails
                          ?.filter((asset) => asset.balance > 0)
                          .map((asset) => (
                            <Row
                              key={`${asset.address}-asset`}
                              className="mb-3 output-card mr-2"
                            >
                              <Col xs="4" sm="2" className="p-0 pl-2">
                                <img
                                  height="35px"
                                  src={asset.symbolUrl}
                                  alt={asset.name}
                                  className="mr-1"
                                />
                              </Col>
                              <Col
                                xs="5"
                                sm="7"
                                className="align-items-center p-0 pl-sm-3"
                              >
                                <Row>
                                  <Col xs="12" className="float-left ml-n4">
                                    {asset.symbol}
                                    <div className="description">
                                      {formatFromWei(asset.balance)}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>

                              <Col
                                xs="3"
                                md="3"
                                className="text-right p-0 pr-2"
                              >
                                <Row>
                                  <Col xs="6" className="mt-1">
                                    <ShareLink
                                      url={asset.address}
                                      notificationLocation="tc"
                                    >
                                      <i
                                        role="button"
                                        className="icon-small icon-copy ml-2 align-middle"
                                      />
                                    </ShareLink>
                                  </Col>
                                  <Col xs="6" className="mt-1">
                                    <div
                                      role="button"
                                      tabIndex={0}
                                      onKeyDown={(e) => {
                                        if (e.key === 32) {
                                          dispatch(
                                            watchAsset(
                                              asset.address,
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
                                            asset.address,
                                            asset.symbol,
                                            '18',
                                            asset.symbolUrl,
                                          ),
                                        )
                                      }}
                                    >
                                      <i className="icon-small icon-metamask icon-light ml-2" />
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          ))}
                      </TabPane>
                      <TabPane tabId="lp" className="ml-n2">
                        <Row className="my-3">
                          <Col xs="9" md="9" className="ml-n1">
                            <div className="text-card">{t('wallet')}</div>
                          </Col>
                          <Col xs="3" md="3">
                            <div className="text-card float-right mr-1">
                              {t('actions')}
                            </div>
                          </Col>
                        </Row>

                        {pool.poolDetails
                          ?.filter((asset) => asset.balance > 0)
                          .map((asset) => (
                            <Row
                              key={`${asset.address}-lp`}
                              className="mb-3 output-card mr-2"
                            >
                              <Col xs="4" sm="2" className="p-0 pl-2">
                                <img
                                  height="35px"
                                  src={getToken(asset.tokenAddress)?.symbolUrl}
                                  alt={getToken(asset.tokenAddress)?.name}
                                  className="mr-n3"
                                />
                                <img
                                  height="20px"
                                  src={spartaIcon}
                                  alt="SPARTA"
                                  className="mr-2 mt-3"
                                />
                              </Col>
                              <Col
                                xs="5"
                                sm="7"
                                className="align-items-center p-0 pl-sm-3"
                              >
                                <Row>
                                  <Col xs="12" className="float-left ml-n4">
                                    {`${getToken(asset.tokenAddress)?.symbol}p`}
                                    <div className="description">
                                      {formatFromWei(asset.balance)}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>

                              <Col
                                xs="3"
                                md="3"
                                className="text-right p-0 pr-2"
                              >
                                <Row>
                                  <Col xs="6" className="mt-1">
                                    <ShareLink
                                      url={asset.address}
                                      notificationLocation="tc"
                                    >
                                      <i
                                        role="button"
                                        className="icon-small icon-copy ml-2 align-middle"
                                      />
                                    </ShareLink>
                                  </Col>
                                  <Col xs="6" className="mt-1">
                                    <div
                                      role="button"
                                      tabIndex={0}
                                      onKeyDown={(e) => {
                                        if (e.key === 32) {
                                          dispatch(
                                            watchAsset(
                                              asset.address,
                                              `${
                                                getToken(asset.tokenAddress)
                                                  ?.symbol
                                              }p`,
                                              '18',
                                              getToken(asset.tokenAddress)
                                                ?.symbolUrl,
                                            ),
                                          )
                                        }
                                      }}
                                      onClick={() => {
                                        dispatch(
                                          watchAsset(
                                            asset.address,
                                            `${
                                              getToken(asset.tokenAddress)
                                                ?.symbol
                                            }p`,
                                            '18',
                                            getToken(asset.tokenAddress)
                                              ?.symbolUrl,
                                          ),
                                        )
                                      }}
                                    >
                                      <i className="icon-small icon-metamask icon-light ml-2" />
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          ))}

                        {pool.poolDetails?.filter((asset) => asset.staked > 0)
                          .length > 0 && (
                          <Row className="my-3">
                            <Col xs="9" md="9">
                              <div className="ml-n1">Staked</div>
                            </Col>
                            <Col xs="3" md="3">
                              <div className="text-card float-right mr-1">
                                Actions
                              </div>
                            </Col>
                          </Row>
                        )}
                        {pool.poolDetails
                          ?.filter((asset) => asset.staked > 0)
                          .map((asset) => (
                            <Row
                              key={`${asset.address}-lpdao`}
                              className="mb-3 output-card mr-2"
                            >
                              <Col xs="4" sm="2" className="p-0 pl-2">
                                <img
                                  height="35px"
                                  src={getToken(asset.tokenAddress)?.symbolUrl}
                                  alt={getToken(asset.tokenAddress)?.name}
                                  className="mr-n3"
                                />
                                <img
                                  height="20px"
                                  src={spartaIcon}
                                  alt="SPARTA"
                                  className="mr-2 mt-3"
                                />
                              </Col>
                              <Col
                                xs="5"
                                sm="7"
                                className="align-items-center p-0 pl-sm-3"
                              >
                                <Row>
                                  <Col xs="12" className="float-left ml-n4">
                                    {`${getToken(asset.tokenAddress)?.symbol}p`}
                                    <div className="description">
                                      {formatFromWei(asset.staked)}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>

                              <Col
                                xs="3"
                                md="3"
                                className="text-right p-0 pr-2"
                              >
                                <Row>
                                  <Col xs="6" className="mt-1">
                                    <ShareLink
                                      url={asset.address}
                                      notificationLocation="tc"
                                    >
                                      <i
                                        role="button"
                                        className="icon-small icon-copy ml-2 align-middle"
                                      />
                                    </ShareLink>
                                  </Col>
                                  <Col xs="6" className="mt-1">
                                    <div
                                      role="button"
                                      tabIndex={0}
                                      onKeyDown={(e) => {
                                        if (e.key === 32) {
                                          dispatch(
                                            watchAsset(
                                              asset.address,
                                              `${
                                                getToken(asset.tokenAddress)
                                                  ?.symbol
                                              }p`,
                                              '18',
                                              getToken(asset.tokenAddress)
                                                ?.symbolUrl,
                                            ),
                                          )
                                        }
                                      }}
                                      onClick={() => {
                                        dispatch(
                                          watchAsset(
                                            asset.address,
                                            `${
                                              getToken(asset.tokenAddress)
                                                ?.symbol
                                            }p`,
                                            '18',
                                            getToken(asset.tokenAddress)
                                              ?.symbolUrl,
                                          ),
                                        )
                                      }}
                                    >
                                      <i className="icon-small icon-metamask icon-light ml-2" />
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          ))}

                        {pool.poolDetails?.filter((asset) => asset.bonded > 0)
                          .length > 0 && (
                          <Row className="my-3">
                            <Col xs="9" md="9">
                              <div className="text-card">Bonded</div>
                            </Col>
                            <Col xs="3" md="3">
                              <div className="text-card float-right mr-1">
                                Actions
                              </div>
                            </Col>
                          </Row>
                        )}
                        {pool.poolDetails
                          ?.filter((asset) => asset.bonded > 0)
                          .map((asset) => (
                            <Row
                              key={`${asset.address}-lpbond`}
                              className="mb-3 output-card mr-2"
                            >
                              <Col xs="4" sm="2" className="p-0 pl-2">
                                <img
                                  height="35px"
                                  src={getToken(asset.tokenAddress)?.symbolUrl}
                                  alt={getToken(asset.tokenAddress)?.name}
                                  className="mr-n3"
                                />
                                <img
                                  height="20px"
                                  src={spartaIcon}
                                  alt="SPARTA"
                                  className="mr-2 mt-3"
                                />
                              </Col>
                              <Col
                                xs="5"
                                sm="7"
                                className="align-items-center p-0 pl-sm-3"
                              >
                                <Row>
                                  <Col xs="12" className="float-left ml-n4">
                                    {`${getToken(asset.tokenAddress)?.symbol}p`}
                                    <div className="description">
                                      {formatFromWei(asset.bonded)}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>

                              <Col
                                xs="3"
                                md="3"
                                className="text-right p-0 pr-2"
                              >
                                <Row>
                                  <Col xs="6" className="mt-1">
                                    <ShareLink
                                      url={asset.address}
                                      notificationLocation="tc"
                                    >
                                      <i
                                        role="button"
                                        className="icon-small icon-copy ml-2 align-middle"
                                      />
                                    </ShareLink>
                                  </Col>
                                  <Col xs="6" className="mt-1">
                                    <div
                                      role="button"
                                      tabIndex={0}
                                      onKeyDown={(e) => {
                                        if (e.key === 32) {
                                          dispatch(
                                            watchAsset(
                                              asset.address,
                                              `${
                                                getToken(asset.tokenAddress)
                                                  ?.symbol
                                              }p`,
                                              '18',
                                              getToken(asset.tokenAddress)
                                                ?.symbolUrl,
                                            ),
                                          )
                                        }
                                      }}
                                      onClick={() => {
                                        dispatch(
                                          watchAsset(
                                            asset.address,
                                            `${
                                              getToken(asset.tokenAddress)
                                                ?.symbol
                                            }p`,
                                            '18',
                                            getToken(asset.tokenAddress)
                                              ?.symbolUrl,
                                          ),
                                        )
                                      }}
                                    >
                                      <i className="icon-small icon-metamask icon-light ml-2" />
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          ))}
                      </TabPane>
                      <TabPane tabId="synths" className="ml-n2">
                        <Row className="my-3">
                          <Col xs="9" md="9" className="ml-n1">
                            <div className="text-card">{t('wallet')}</div>
                          </Col>
                          <Col xs="3" md="3">
                            <div className="text-card float-right mr-1">
                              {t('actions')}
                            </div>
                          </Col>
                        </Row>
                        {synth.synthDetails
                          ?.filter((asset) => asset.balance > 0)
                          .map((asset) => (
                            <Row
                              key={`${asset.address}-synth`}
                              className="mb-3 output-card mr-2"
                            >
                              <Col xs="4" sm="2" className="p-0 pl-2">
                                <img
                                  height="35px"
                                  src={getToken(asset.tokenAddress)?.symbolUrl}
                                  alt={getToken(asset.tokenAddress)?.name}
                                  className="mr-n3"
                                />
                                <img
                                  height="20px"
                                  src={spartaIconAlt}
                                  alt="SPARTA"
                                  className="mr-2 mt-3"
                                />
                              </Col>

                              <Col
                                xs="5"
                                sm="7"
                                className="align-items-center p-0 pl-sm-3"
                              >
                                <Row>
                                  <Col xs="12" className="float-left ml-n4">
                                    {`${getToken(asset.tokenAddress)?.symbol}s`}
                                    <div className="description">
                                      {formatFromWei(asset.balance)}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>

                              <Col
                                xs="3"
                                md="3"
                                className="text-right p-0 pr-2"
                              >
                                <Row>
                                  <Col xs="6" className="mt-1">
                                    <ShareLink
                                      url={asset.address}
                                      notificationLocation="tc"
                                    >
                                      <i
                                        role="button"
                                        className="icon-small icon-copy ml-2 align-middle"
                                      />
                                    </ShareLink>
                                  </Col>
                                  <Col xs="6" className="mt-1">
                                    <div
                                      role="button"
                                      tabIndex={0}
                                      onKeyDown={(e) => {
                                        if (e.key === 32) {
                                          dispatch(
                                            watchAsset(
                                              asset.address,
                                              `${
                                                getToken(asset.tokenAddress)
                                                  ?.symbol
                                              }s`,
                                              '18',
                                              getToken(asset.tokenAddress)
                                                ?.symbolUrl,
                                            ),
                                          )
                                        }
                                      }}
                                      onClick={() => {
                                        dispatch(
                                          watchAsset(
                                            asset.address,
                                            `${
                                              getToken(asset.tokenAddress)
                                                ?.symbol
                                            }s`,
                                            '18',
                                            getToken(asset.tokenAddress)
                                              ?.symbolUrl,
                                          ),
                                        )
                                      }}
                                    >
                                      <i className="icon-small icon-metamask icon-light ml-2" />
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          ))}
                        {synth.synthDetails?.filter((asset) => asset.staked > 0)
                          .length > 0 && (
                          <Row className="my-3">
                            <Col xs="9" md="9">
                              <div className="text-card">Staked</div>
                            </Col>
                            <Col xs="3" md="3">
                              <div className="text-card float-right mr-1">
                                Actions
                              </div>
                            </Col>
                          </Row>
                        )}
                        {synth.synthDetails
                          ?.filter((asset) => asset.staked > 0)
                          .map((asset) => (
                            <Row
                              key={`${asset.address}-synthstake`}
                              className="mb-3 output-card mr-2"
                            >
                              <Col xs="4" sm="2" className="p-0 pl-2">
                                <img
                                  height="35px"
                                  src={getToken(asset.tokenAddress)?.symbolUrl}
                                  alt={getToken(asset.tokenAddress)?.name}
                                  className="mr-n3"
                                />
                                <img
                                  height="20px"
                                  src={spartaIconAlt}
                                  alt="SPARTA"
                                  className="mr-2 mt-3"
                                />
                              </Col>
                              <Col
                                xs="5"
                                sm="7"
                                className="align-items-center p-0 pl-sm-3"
                              >
                                <Row>
                                  <Col xs="12" className="float-left ml-n4">
                                    {`${getToken(asset.tokenAddress)?.symbol}s`}
                                    <div className="description">
                                      {formatFromWei(asset.staked)}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>

                              <Col
                                xs="3"
                                md="3"
                                className="text-right p-0 pr-2"
                              >
                                <Row>
                                  <Col xs="6" className="mt-1">
                                    <ShareLink
                                      url={asset.address}
                                      notificationLocation="tc"
                                    >
                                      <i
                                        role="button"
                                        className="icon-small icon-copy ml-2 align-middle"
                                      />
                                    </ShareLink>
                                  </Col>
                                  <Col xs="6" className="mt-1">
                                    <div
                                      role="button"
                                      tabIndex={0}
                                      onKeyDown={(e) => {
                                        if (e.key === 32) {
                                          dispatch(
                                            watchAsset(
                                              asset.address,
                                              `${
                                                getToken(asset.tokenAddress)
                                                  ?.symbol
                                              }s`,
                                              '18',
                                              getToken(asset.tokenAddress)
                                                ?.symbolUrl,
                                            ),
                                          )
                                        }
                                      }}
                                      onClick={() => {
                                        dispatch(
                                          watchAsset(
                                            asset.address,
                                            `${
                                              getToken(asset.tokenAddress)
                                                ?.symbol
                                            }s`,
                                            '18',
                                            getToken(asset.tokenAddress)
                                              ?.symbolUrl,
                                          ),
                                        )
                                      }}
                                    >
                                      <i className="icon-small icon-metamask icon-light ml-2" />
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          ))}
                      </TabPane>
                    </TabContent>
                  </div>
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
                      <div className="float-left mt-2 ">
                        {x.title === 'Others' ? t('others') : x.title}
                      </div>
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
        </div>
      </Modal>
    </>
  )
}

export default WalletSelect

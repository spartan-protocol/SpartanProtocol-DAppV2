import React, { useEffect, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'

import {
  Alert,
  Form,
  Row,
  Modal,
  Button,
  Col,
  Tabs,
  Tab,
} from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import walletTypes from './walletTypes'
import { getExplorerWallet } from '../../utils/extCalls'
import {
  changeNetworkLsOnly,
  formatShortString,
  getNetwork,
} from '../../utils/web3'
import ShareLink from '../Share/ShareLink'
import { isAppleDevice } from '../../utils/helpers'
import iosIcon from '../../assets/icons/apple-ios.svg'
import Assets from './Assets'
import LPs from './LPs'
import Synths from './Synths'

const WalletSelect = (props) => {
  const wallet = useWallet()
  const [network, setNetwork] = useState(getNetwork)
  const { t } = useTranslation()

  const onChangeNetwork = async (net) => {
    if (net.target.checked === true) {
      setNetwork(changeNetworkLsOnly(56))
    }
    if (net.target.checked === false) {
      setNetwork(changeNetworkLsOnly(97))
    } else {
      setNetwork(changeNetworkLsOnly(net))
    }
    window.location.reload()
  }

  useEffect(() => {
    const checkWallet = () => {
      // console.log('Wallet Status:', wallet.status)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.status])

  const resetWallet = async () => {
    wallet.reset()
    // console.log('Wallet Status: cleared')
  }

  const connectWallet = async (x) => {
    window.localStorage.removeItem('disableWallet')
    if (wallet) {
      resetWallet()
    }
    if (x) {
      await wallet.connect(x?.inject)
    }
    window.localStorage.setItem('lastWallet', x?.id)
  }

  const onWalletDisconnect = async () => {
    props.onHide()
    window.localStorage.setItem('disableWallet', '1')
    resetWallet()
    window.location.reload()
  }

  const [trigger0, settrigger0] = useState(0)
  /**
   * Check wallet-loop
   */
  const checkWallets = async () => {
    if (
      window.localStorage.getItem('disableWallet') !== '1' &&
      wallet.account === null &&
      wallet.status !== 'connecting' &&
      wallet.status !== 'error'
    ) {
      if (window.localStorage.getItem('lastWallet') === 'BC') {
        connectWallet(walletTypes.filter((x) => x.id === 'BC')[0])
      } else if (window.localStorage.getItem('lastWallet') === 'MM') {
        connectWallet(walletTypes.filter((x) => x.id === 'MM')[0])
      } else if (window.localStorage.getItem('lastWallet') === 'TW') {
        connectWallet(walletTypes.filter((x) => x.id === 'TW')[0])
      }
      // else if (window.localStorage.getItem('lastWallet') === 'WC') {
      //   connectWallet(walletTypes.filter((x) => x.id === 'WC')[0])
      // }
      else {
        connectWallet(walletTypes.filter((x) => x.id === 'OOT')[0]) // Fallback to 'injected'
      }
    }
  }
  useEffect(() => {
    if (trigger0 === 0) {
      checkWallets()
      settrigger0(trigger0 + 1)
    }
    const timer = setTimeout(() => {
      checkWallets()
      settrigger0(trigger0 + 1)
    }, 500)
    return () => {
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    trigger0,
    wallet.account,
    wallet.status,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('lastWallet'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('disableWallet'),
  ])

  return (
    <>
      <Modal show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>
            {t('wallet')}
            {network.chainId === 97 ? ' - Testnet' : ' - Mainnet'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {wallet.status === 'error' && (
            <Alert variant="primary">
              You have selected{' '}
              {network.chainId === 97 ? 'BSC Testnet' : 'BSC Mainnet'} in the
              DApp.
              <br /> Make sure you have selected{' '}
              {network.chainId === 97 ? 'BSC Testnet' : 'BSC Mainnet'} in your
              wallet too!
            </Alert>
          )}

          <Row>
            <Col xs={5} className="text-end">
              TestNet
            </Col>
            <Col xs={2} className="text-center">
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  checked={network?.chainId === 56}
                  onChange={(value) => {
                    onChangeNetwork(value)
                  }}
                />
              </Form>
            </Col>
            <Col xs={5} className="text-start">
              MainNet
            </Col>
          </Row>

          {/* Wallet overview */}
          {wallet.account === null ? (
            <Row>
              {walletTypes.map((x) => (
                <Col key={x.id} xs="12" sm="6">
                  <Button
                    key={x.id}
                    variant="dark"
                    className="w-100"
                    onClick={() => {
                      connectWallet(x)
                    }}
                    href={
                      x.id === 'TW'
                        ? `trust://open_url?coin_id=20000714&url=${window.location.origin}`
                        : '#section'
                    }
                  >
                    <Row>
                      <Col xs="3">
                        <div className="float-end">
                          {x.icon.map((i) => (
                            <img
                              key={`${x.id}icon${i}`}
                              src={i}
                              height="35"
                              alt={`${x.id}-wallet-icon`}
                            />
                          ))}
                        </div>
                      </Col>
                      <Col xs="9">
                        <div className="float-start mt-1">
                          {x.title === 'Others' ? t('others') : x.title}
                        </div>
                      </Col>
                    </Row>
                  </Button>
                </Col>
              ))}
              {isAppleDevice() && (
                <Col>
                  <Button
                    href="trust://browser_enable"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Row>
                      <Col xs="2" className="float-right">
                        <img src={iosIcon} height="40" alt="apple icon" />
                      </Col>
                      <Col xs="10" className="float-left">
                        Apple iOS devices click here to enable the TrustWallet
                        in-app browser
                      </Col>
                    </Row>
                  </Button>
                </Col>
              )}
            </Row>
          ) : (
            <>
              <Row>
                <Col xs={6} className="text-center">
                  <div className="output-wallet-description">
                    {t('viewBscScan')}{' '}
                    <a
                      href={getExplorerWallet(wallet.account)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <i className="icon-extra-small icon-scan" />
                    </a>
                  </div>
                  <div className="title">
                    {formatShortString(wallet.account)}
                    <ShareLink url={wallet.account} notificationLocation="tc">
                      <i className="icon-small icon-copy" />
                    </ShareLink>
                  </div>
                </Col>
                <Col xs={6}>
                  <Button
                    className="mx-1 btn-sm btn-info d-block d-sm-none"
                    onClick={() => {
                      onWalletDisconnect()
                    }}
                  >
                    Disconnect Wallet
                  </Button>

                  <Button
                    className="float-right mx-1 btn-md btn-info d-none d-sm-block"
                    onClick={() => {
                      onWalletDisconnect()
                    }}
                  >
                    Disconnect Wallet
                  </Button>
                </Col>
              </Row>
              {/* wallet navigation tabs */}
              {network.chainId === 97 || network.chainId === 56 ? (
                <>
                  <Row>
                    <Tabs
                      defaultActiveKey="assets"
                      id="uncontrolled-tab-example"
                      className="flex-row px-2 mt-3"
                      fill
                    >
                      <Tab eventKey="assets" title={t('assets')}>
                        <Assets />
                      </Tab>
                      <Tab eventKey="lps" title={t('lpTokens')}>
                        <LPs />
                      </Tab>
                      <Tab eventKey="synths" title={t('synths')}>
                        <Synths />
                      </Tab>
                    </Tabs>
                  </Row>
                </>
              ) : (
                'Wrong Network'
              )}
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}

export default WalletSelect

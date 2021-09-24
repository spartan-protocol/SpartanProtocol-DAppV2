import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import {
  Alert,
  Form,
  Row,
  Modal,
  Button,
  Col,
  Tabs,
  Tab,
  OverlayTrigger,
} from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import walletTypes from './walletTypes'
import { getExplorerWallet } from '../../utils/extCalls'
import {
  changeNetworkLsOnly,
  formatShortString,
  getAddresses,
  getNetwork,
  liveChains,
  tempChains,
} from '../../utils/web3'
import ShareLink from '../Share/ShareLink'
import { isAppleDevice } from '../../utils/helpers'
import Assets from './Assets'
import LPs from './LPs'
import Synths from './Synths'
import { Icon } from '../Icons/icons'
import { Tooltip } from '../Tooltip/tooltip'
import { getSynthDetails, useSynth } from '../../store/synth'
import { usePool } from '../../store/pool'
import { convertFromWei } from '../../utils/bigNumber'
import { connectorsByName } from '../../utils/web3React'
import { getLPWeights, getSynthWeights } from '../../utils/math/nonContract'
import { getToken } from '../../utils/math/utils'
import { getDaoDetails, useDao } from '../../store/dao'
import { getBondDetails, useBond } from '../../store/bond'

export const spartanRanks = [
  {
    id: 'Polemistis',
    weight: 10,
  },
  {
    id: 'Psiloi',
    weight: 100,
  },
  {
    id: 'Toxotai',
    weight: 500,
  },
  {
    id: 'Hoplite',
    weight: 1000,
  },
  {
    id: 'Lochagos',
    weight: 5000,
  },
  {
    id: 'Igetis Tagmatos',
    weight: 10000,
  },
  {
    id: 'Syntagmatarchis',
    weight: 25000,
  },
  {
    id: 'Taxiarchos',
    weight: 50000,
  },
  {
    id: 'Stratigos',
    weight: 100000,
  },
  {
    id: 'Polemarchos',
    weight: 300000,
  },
  {
    id: 'Cynisca',
    weight: 500000,
  },
  {
    id: 'Pausanius',
    weight: 700000,
  },
  {
    id: 'Agis III',
    weight: 1000000,
  },
  {
    id: 'Gorgo',
    weight: 2000000,
  },
  {
    id: 'Leonidas I',
    weight: 3000000,
  },
]

const WalletSelect = (props) => {
  const { activate, deactivate, active, error, connector, account } =
    useWeb3React()
  const synth = useSynth()
  const pool = usePool()
  const dao = useDao()
  const bond = useBond()
  const addr = getAddresses()
  const wallet = useWeb3React()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [network, setNetwork] = useState(getNetwork)
  const [activeTab, setactiveTab] = useState('tokens')

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

  const [activatingConnector, setActivatingConnector] = useState()
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  const onWalletDisconnect = async () => {
    props.onHide()
    deactivate()
    window.localStorage.removeItem('walletconnect')
    window.localStorage.setItem('disableWallet', '1')
    window.location.reload()
  }

  const onWalletConnect = async (x) => {
    window.localStorage.removeItem('disableWallet')
    window.localStorage.setItem('lastWallet', x?.id)
    setActivatingConnector(connectorsByName(x.connector))
    activate(connectorsByName(x.connector))
  }

  const checkWallet = () => {
    if (
      window.localStorage.getItem('disableWallet') !== '1' &&
      !account &&
      !active &&
      !error
    ) {
      // *** ADD IN LEDGER FOR TESTING ***
      if (window.localStorage.getItem('lastWallet') === 'BC') {
        onWalletConnect(walletTypes.filter((x) => x.id === 'BC')[0])
      } else if (window.localStorage.getItem('lastWallet') === 'MM') {
        onWalletConnect(walletTypes.filter((x) => x.id === 'MM')[0])
      } else if (window.localStorage.getItem('lastWallet') === 'TW') {
        onWalletConnect(walletTypes.filter((x) => x.id === 'TW')[0])
      } else if (
        window.localStorage.getItem('lastWallet') === 'WC' &&
        network?.chainId === 56 // WalletConnect does not support testnet
      ) {
        onWalletConnect(walletTypes.filter((x) => x.id === 'WC')[0])
      } else {
        onWalletConnect(walletTypes.filter((x) => x.id === 'OOT')[0]) // Fallback to 'injected'
      }
    }
  }

  useEffect(() => {
    checkWallet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tryParse = (data) => {
    try {
      return JSON.parse(data)
    } catch (e) {
      return getNetwork()
    }
  }

  useEffect(() => {
    const checkDetails = () => {
      if (
        tempChains.includes(
          tryParse(window.localStorage.getItem('network'))?.chainId,
        )
      ) {
        if (pool.listedPools?.length > 0) {
          dispatch(getBondDetails(pool.listedPools, wallet))
          dispatch(getDaoDetails(pool.listedPools, wallet))
        }
        if (synth.synthArray?.length > 0 && pool.listedPools?.length > 0) {
          dispatch(getSynthDetails(synth.synthArray, wallet))
        }
      }
    }
    checkDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.listedPools])

  // ------------------------------------------------------------------------

  const rankLoading = () => {
    if (
      !pool.tokenDetails ||
      !pool.poolDetails ||
      !dao.daoDetails ||
      !bond.bondDetails ||
      !synth.synthDetails
    ) {
      return true
    }
    return false
  }

  const getWeight = () => {
    if (account && pool.poolDetails.length > 1) {
      const lpWeight = getLPWeights(
        pool.poolDetails,
        dao.daoDetails,
        bond.bondDetails,
      )
      const synthWeight = getSynthWeights(synth.synthDetails, pool.poolDetails)
      const spartaWeight = getToken(addr.spartav2, pool.tokenDetails).balance
      return convertFromWei(lpWeight.plus(synthWeight).plus(spartaWeight))
    }
    return '0'
  }

  const [rank, setrank] = useState('Loading')
  const getRank = () => {
    if (props.show && !rankLoading()) {
      const weight = getWeight()
      const ranksArray = spartanRanks.filter((i) => i.weight < weight)
      const { length } = ranksArray
      if (length > 0) {
        setrank(ranksArray[length - 1].id)
      } else {
        setrank('Peasant')
      }
    }
  }

  const [trigger1, settrigger1] = useState(0)
  useEffect(() => {
    const timer = setTimeout(() => {
      getRank()
      settrigger1(trigger1 + 1)
    }, 3000)
    return () => {
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger1, props.show])

  return (
    <>
      <Modal show={props.show} onHide={props.onHide} centered>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>
            <Row>
              <Col xs="12">
                {account ? (
                  <>
                    {t('wallet')}:{' '}
                    <span className="output-card">
                      {formatShortString(account)}
                      <div className="d-inline-block">
                        <ShareLink url={account}>
                          <Icon
                            icon="copy"
                            className="ms-2 mb-1"
                            size="18"
                            role="button"
                          />
                        </ShareLink>
                      </div>
                    </span>
                  </>
                ) : (
                  t('connectWallet')
                )}
              </Col>
              <Col xs="12">
                <Form className="mb-1">
                  <span className="output-card">
                    {t('network')}:{' '}
                    {network.chainId === 97 ? ' Testnet' : ' Mainnet'}
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      className="ms-2 d-inline-flex"
                      checked={network?.chainId === 56}
                      onChange={(value) => {
                        onChangeNetwork(value)
                      }}
                    />
                  </span>
                </Form>
              </Col>
              <Col xs="12">
                <Form className="mb-0">
                  <span className="output-card">
                    Rank: {rank}
                    <OverlayTrigger
                      placement="auto"
                      overlay={Tooltip(t, 'rank')}
                    >
                      <span role="button">
                        <Icon
                          icon="info"
                          className="ms-1"
                          size="17"
                          fill="white"
                        />
                      </span>
                    </OverlayTrigger>
                  </span>
                </Form>
              </Col>
            </Row>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && (
            <Alert variant="primary">
              {t('wrongNetwork', {
                network: network.chainId === 97 ? 'BSC Testnet' : 'BSC Mainnet',
              })}
            </Alert>
          )}

          {/* Wallet overview */}
          {!account ? (
            <Row>
              {walletTypes.map((x) => (
                <Col key={x.id} xs="12" sm="6">
                  <Button
                    key={x.id}
                    disabled={x.id === 'WC' && network.chainId !== 56}
                    variant="info"
                    className="w-100 my-1"
                    onClick={() => {
                      onWalletConnect(x)
                    }}
                    href={
                      x.id === 'TW'
                        ? `trust://open_url?coin_id=20000714&url=${window.location.origin}`
                        : '#section'
                    }
                  >
                    <Row>
                      <Col xs="auto" className="pe-0">
                        <div>{x.icon}</div>
                      </Col>
                      <Col>
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
                        <Icon icon="apple" size="40" />
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
              {/* wallet navigation tabs */}
              {liveChains.includes(network.chainId) ? (
                <>
                  <Row>
                    <Tabs
                      activeKey={activeTab}
                      onSelect={(tab) => setactiveTab(tab)}
                      id="wallet-tabs"
                      className="flex-row px-2 mb-3"
                      fill
                    >
                      <Tab eventKey="tokens" title={t('tokens')}>
                        {activeTab === 'tokens' && <Assets />}
                      </Tab>
                      <Tab eventKey="lps" title={t('lps')}>
                        {activeTab === 'lps' && <LPs />}
                      </Tab>
                      <Tab eventKey="synths" title={t('synths')}>
                        {activeTab === 'synths' && <Synths />}
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
        {active && (
          <Modal.Footer className="justify-content-center">
            <Button
              href={getExplorerWallet(account)}
              target="_blank"
              rel="noreferrer"
              size="sm"
              variant="primary"
            >
              {t('viewBscScan')}{' '}
              <Icon icon="scan" size="16" fill="white" className="mb-1" />
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                onWalletDisconnect()
              }}
            >
              {t('disconnect')}
              <Icon icon="walletRed" size="17" fill="white" className="mb-1" />
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </>
  )
}

export default WalletSelect

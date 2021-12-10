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
  Badge,
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
import Assets from './Assets'
import LPs from './LPs'
import Synths from './Synths'
import Txns from './Txns'
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
import { addNetworkBC, addNetworkMM, useWeb3 } from '../../store/web3'

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
  const isLightMode = window.localStorage.getItem('theme')
  const synth = useSynth()
  const pool = usePool()
  const dao = useDao()
  const bond = useBond()
  const addr = getAddresses()
  const web3 = useWeb3()
  const wallet = useWeb3React()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [network, setNetwork] = useState(getNetwork)
  const [activeTab, setactiveTab] = useState('tokens')
  const [wcConnector, setWcConnector] = useState(false)

  const onChangeNetwork = async (net) => {
    if (net.target.checked === true) {
      setNetwork(changeNetworkLsOnly(56, web3.rpcs))
    }
    if (net.target.checked === false) {
      setNetwork(changeNetworkLsOnly(97, web3.rpcs))
    } else {
      setNetwork(changeNetworkLsOnly(net, web3.rpcs))
    }
    window.location.reload()
  }

  const onWalletDisconnect = async () => {
    props.onHide()
    wallet.deactivate()
    window.localStorage.removeItem('walletconnect')
    window.localStorage.setItem('disableWallet', '1')
    window.location.reload()
  }

  const onWalletConnect = async (x) => {
    if (x.id === 'BC') {
      await dispatch(addNetworkBC())
    } else if (x.id === 'MM') {
      await dispatch(addNetworkMM())
    }
    window.localStorage.removeItem('disableWallet')
    window.localStorage.setItem('lastWallet', x.id)
    wallet.deactivate()
    const connector = connectorsByName(x.connector, web3.rpcs)
    if (x.id === 'WC') {
      setWcConnector(connector)
    }
    setTimeout(() => {
      wallet.activate(connector)
    }, 50)
  }

  useEffect(() => {
    if (wcConnector?.walletConnectProvider?.connected && !wallet.account) {
      wallet.activate(wcConnector)
      setWcConnector(false)
    }
  }, [wallet, wcConnector])

  const checkWallet = async () => {
    if (
      window.localStorage.getItem('disableWallet') !== '1' &&
      !wallet.account &&
      !wallet.active &&
      !wallet.error
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
    if (!wallet.account && web3.rpcs.length > 0) {
      checkWallet()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3.rpcs])

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
          dispatch(getBondDetails(pool.listedPools, wallet, web3.rpcs))
          dispatch(getDaoDetails(pool.listedPools, wallet, web3.rpcs))
        }
        if (synth.synthArray?.length > 0 && pool.listedPools?.length > 0) {
          dispatch(getSynthDetails(synth.synthArray, wallet, web3.rpcs))
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
    if (wallet.account && pool.poolDetails.length > 1) {
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
    if (!tempChains.includes(wallet.chainId)) {
      setrank('Check Network First')
    }
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

  const getTokenCount = () => {
    if (
      tempChains.includes(
        tryParse(window.localStorage.getItem('network'))?.chainId,
      )
    ) {
      if (!pool.tokenDetails || !pool.poolDetails) {
        return <Icon icon="cycle" size="15" className="anim-spin" />
      }
    }
    if (!pool.tokenDetails) {
      return <Icon icon="cycle" size="15" className="anim-spin" />
    }
    return pool.tokenDetails?.filter((asset) => asset.balance > 0).length
  }

  const getLpsCount = () => {
    if (
      !pool.tokenDetails ||
      !pool.poolDetails ||
      !bond.bondDetails ||
      !dao.daoDetails
    ) {
      return <Icon icon="cycle" size="15" className="anim-spin" />
    }
    let count = pool.poolDetails.filter((asset) => asset.balance > 0).length
    count += dao.daoDetails.filter((asset) => asset.staked > 0).length
    count += bond.bondDetails.filter((asset) => asset.staked > 0).length
    return count
  }

  const getSynthsCount = () => {
    if (!pool.tokenDetails || !pool.poolDetails || !synth.synthDetails) {
      return <Icon icon="cycle" size="15" className="anim-spin" />
    }
    if (synth.synthDetails.length > 0) {
      let count = synth.synthDetails.filter((asset) => asset.balance > 0).length
      count += synth.synthDetails.filter((asset) => asset.staked > 0).length
      return count
    }
    return 0
  }

  return (
    <>
      <Modal show={props.show} onHide={props.onHide} centered>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>
            <Row>
              <Col xs="12">
                {wallet.account ? (
                  <>
                    {t('wallet')}:{' '}
                    <span className="output-card">
                      {formatShortString(wallet.account)}
                      <div className="d-inline-block">
                        <ShareLink url={wallet.account}>
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
                    {t('rank')}: {rank}
                    <OverlayTrigger
                      placement="auto"
                      overlay={Tooltip(t, 'rank')}
                    >
                      <span role="button">
                        <Icon
                          icon="info"
                          className="ms-1"
                          size="17"
                          fill={isLightMode ? 'black' : 'white'}
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
          {wallet.error && (
            <Alert variant="primary">
              {t('wrongNetwork', {
                network: network.chainId === 97 ? 'BSC Testnet' : 'BSC Mainnet',
              })}
            </Alert>
          )}

          {/* Wallet overview */}
          {!wallet.account ? (
            <Row>
              {walletTypes.map((x) => (
                <Col key={x.id} xs="12" sm="6">
                  <Button
                    key={x.id}
                    disabled={
                      (x.id === 'WC' && network.chainId !== 56) ||
                      (x.id === 'BC' && !window.BinanceChain) ||
                      (!['WC', 'BC'].includes(x.id) && !window.ethereum)
                    }
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
                      <Tab
                        eventKey="tokens"
                        title={
                          <>
                            {t('tokens')} <Badge>{getTokenCount()}</Badge>
                          </>
                        }
                      >
                        {activeTab === 'tokens' && props.show && <Assets />}
                      </Tab>
                      <Tab
                        eventKey="lps"
                        title={
                          <>
                            {t('lps')}{' '}
                            <Badge>
                              {tempChains.includes(wallet.chainId) &&
                                getLpsCount()}
                            </Badge>
                          </>
                        }
                      >
                        {tempChains.includes(wallet.chainId) &&
                          activeTab === 'lps' && <LPs />}
                      </Tab>
                      <Tab
                        eventKey="synths"
                        title={
                          <>
                            {t('synths')}{' '}
                            <Badge>
                              {tempChains.includes(wallet.chainId) &&
                                getSynthsCount()}
                            </Badge>
                          </>
                        }
                      >
                        {tempChains.includes(wallet.chainId) &&
                          activeTab === 'synths' && <Synths />}
                      </Tab>
                      <Tab
                        eventKey="txns"
                        title={
                          <>
                            <Icon
                              icon="txnsHistory"
                              size="18"
                              fill={isLightMode ? 'black' : 'white'}
                            />
                          </>
                        }
                      >
                        {tempChains.includes(wallet.chainId) &&
                          activeTab === 'txns' && <Txns />}
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
        {wallet.active ? (
          <Modal.Footer className="justify-content-center">
            <Button
              href={getExplorerWallet(wallet.account)}
              target="_blank"
              rel="noreferrer"
              size="sm"
              variant="primary"
            >
              {t('viewBscScan')}{' '}
              <Icon
                icon="scan"
                size="16"
                fill={isLightMode ? 'black' : 'white'}
                className="mb-1"
              />
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                onWalletDisconnect()
              }}
            >
              {t('disconnect')}
              <Icon
                icon="walletRed"
                size="17"
                fill={isLightMode ? 'black' : 'white'}
                className="mb-1"
              />
            </Button>
          </Modal.Footer>
        ) : (
          <Modal.Footer className="justify-content-center">
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                onWalletDisconnect()
              }}
            >
              {t('clearWallet')}
              <Icon
                icon="walletRed"
                size="17"
                fill={isLightMode ? 'black' : 'white'}
                className="mb-1 ms-1"
              />
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </>
  )
}

export default WalletSelect

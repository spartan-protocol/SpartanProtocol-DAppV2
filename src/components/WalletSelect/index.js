import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Modal from 'react-bootstrap/Modal'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Badge from 'react-bootstrap/Badge'
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
import Assets from './tabs/Assets'
import LPs from './tabs/LPs'
import Synths from './tabs/Synths'
import Txns from './tabs/Txns'
import { Icon } from '../Icons/index'
import { Tooltip } from '../Tooltip/index'
import { getSynthDetails, useSynth } from '../../store/synth'
import { usePool } from '../../store/pool'
import { convertFromWei } from '../../utils/bigNumber'
import { connectorsByName } from '../../utils/web3React'
import { getLPWeights, getSynthWeights } from '../../utils/math/nonContract'
import { getToken } from '../../utils/math/utils'
import { getDaoDetails, useDao } from '../../store/dao'
import { getBondDetails, useBond } from '../../store/bond'
import { addNetworkBC, addNetworkMM, useWeb3 } from '../../store/web3'
import { useTheme } from '../../providers/Theme'

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
  const synth = useSynth()
  const pool = usePool()
  const dao = useDao()
  const bond = useBond()
  const addr = getAddresses()
  const web3 = useWeb3()
  const wallet = useWeb3React()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { isDark } = useTheme()

  const [network, setNetwork] = useState(getNetwork)
  const [activeTab, setactiveTab] = useState('tokens')
  // const [wcConnector, setWcConnector] = useState(false)
  const [pending, setPending] = useState(false)
  // const [wlConnector, setWlConnector] = useState(false)

  const onChangeNetwork = async (net) => {
    if (net.target.checked === true) {
      setNetwork(changeNetworkLsOnly(56))
    }
    if (net.target.checked === false) {
      setNetwork(changeNetworkLsOnly(97))
    } else {
      setNetwork(changeNetworkLsOnly(net))
    }
    window.location.reload(true)
  }

  const onWalletDisconnect = async () => {
    props.onHide()
    wallet.deactivate()
    window.localStorage.removeItem('walletconnect')
    window.localStorage.setItem('disableWallet', '1')
    window.location.reload(true)
  }

  const onWalletConnect = async (x) => {
    setPending(true)
    if (x.id === 'BC') {
      await dispatch(addNetworkBC())
    } else if (x.id === 'MM') {
      await dispatch(addNetworkMM())
    }
    window.localStorage.removeItem('disableWallet')
    window.localStorage.setItem('lastWallet', x.id)
    wallet.deactivate()
    const connector = await connectorsByName(x.connector, web3.rpcs) // This 'await' is important despite common sense :) Pls don't remove!
    await wallet.activate(connector)
    if (!wallet.account) {
      await wallet.activate(connector)
    }
    setPending(false)
  }

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
      } else if (window.localStorage.getItem('lastWallet') === 'ON') {
        onWalletConnect(walletTypes.filter((x) => x.id === 'ON')[0])
      } else if (window.localStorage.getItem('lastWallet') === 'CB') {
        onWalletConnect(walletTypes.filter((x) => x.id === 'CB')[0])
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
    if (!wallet.account && web3.rpcs.length > 0 && !pending) {
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
        dispatch(getBondDetails(wallet.account))
        dispatch(getDaoDetails(wallet.account))
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
      return convertFromWei(
        lpWeight.times(2).plus(synthWeight).plus(spartaWeight),
      )
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
        <Modal.Header
          closeButton
          closeVariant={isDark ? 'white' : undefined}
          className="pb-1"
        >
          <Row className="ms-auto">
            <Col xs="12">
              {wallet.account ? (
                <Col>
                  <h4>{t('wallet')}</h4>
                  <span className="output-card">
                    {formatShortString(wallet.account)}
                    <div className="d-inline-block">
                      <ShareLink url={wallet.account}>
                        <Icon
                          icon="copy"
                          className="ms-2 mb-1"
                          size="15"
                          role="button"
                        />
                      </ShareLink>
                    </div>
                  </span>
                </Col>
              ) : (
                t('connectWallet')
              )}
            </Col>
            <Col xs="12">
              <Form className="mb-1">
                <span className="output-card">
                  <strong>{t('network')}:</strong>{' '}
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
                  <strong>{t('rank')}:</strong> {rank}
                  <OverlayTrigger placement="auto" overlay={Tooltip(t, 'rank')}>
                    <span role="button">
                      <Icon icon="info" className="ms-1" size="17" />
                    </span>
                  </OverlayTrigger>
                </span>
              </Form>
            </Col>
            <hr className="mt-3" />
            <Col className="text-center mb-2">
              <Nav
                variant="pills"
                activeKey={activeTab}
                onSelect={(e) => setactiveTab(e)}
                className="justify-content-center"
              >
                <Nav.Item>
                  <Nav.Link
                    eventKey="tokens"
                    className="btn-sm btn-outline-primary"
                  >
                    {t('tokens')}{' '}
                    <Badge bg="secondary">
                      {tempChains.includes(wallet.chainId) && getTokenCount()}
                    </Badge>
                  </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link bg="secondary" eventKey="lps" className="btn-sm">
                    {t('lps')}{' '}
                    <Badge bg="secondary">
                      {tempChains.includes(wallet.chainId) && getLpsCount()}
                    </Badge>
                  </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link eventKey="synths" className="btn-sm">
                    {t('synths')}{' '}
                    <Badge bg="secondary">
                      {tempChains.includes(wallet.chainId) && getSynthsCount()}
                    </Badge>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="hide-i5">
                  <Nav.Link eventKey="txns" className="btn-sm">
                    <Icon icon="txnsHistory" size="20" />
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
          </Row>
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
                      (!['WC', 'BC'].includes(x.id) && !window.ethereum) ||
                      (x.id === 'ON' && !window.ethereum?.isONTO)
                    }
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
              {/* wallet content */}
              {liveChains.includes(network.chainId) ? (
                <>
                  <Row>
                    <Col>
                      {activeTab === 'tokens' && props.show && <Assets />}
                      {tempChains.includes(wallet.chainId) &&
                        activeTab === 'lps' && <LPs />}
                      {tempChains.includes(wallet.chainId) &&
                        activeTab === 'synths' && <Synths />}
                      {tempChains.includes(wallet.chainId) &&
                        activeTab === 'txns' && <Txns />}
                    </Col>
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
              <Icon icon="scan" size="14" className="mb-1 ms-1" />
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                onWalletDisconnect()
              }}
            >
              {t('disconnect')}
              <Icon icon="walletRed" size="17" className="mb-1 ms-1" />
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
                fill="white"
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

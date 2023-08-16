import React, { useCallback, useEffect, useState } from 'react'
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
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi'
import walletTypes from './walletTypes'
import { getExplorerWallet } from '../../utils/extCalls'
import { formatShortString, liveChains, tempChains } from '../../utils/web3'
import ShareLink from '../Share/ShareLink'
import Assets from './tabs/Assets'
import LPs from './tabs/LPs'
import Synths from './tabs/Synths'
import Txns from './tabs/Txns'
import { Icon } from '../Icons/index'
import { Tooltip } from '../Tooltip/index'
import { useSynth } from '../../store/synth'
import { usePool } from '../../store/pool'
import { convertFromWei } from '../../utils/bigNumber'
import { connectorsByName } from '../../utils/web3config'
import { getLPWeights, getSynthWeights } from '../../utils/math/nonContract'
import { getToken } from '../../utils/math/utils'
import { useDao } from '../../store/dao'
import { useBond } from '../../store/bond'
import { addNetworkBC, addNetworkMM } from '../../store/web3'
import { useTheme } from '../../providers/Theme'
import { appChainId, useApp } from '../../store/app'

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
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { isDark } = useTheme()
  const { connectAsync, connectors, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()

  const { chainId, addresses } = useApp()
  const bond = useBond()
  const dao = useDao()
  const pool = usePool()
  const synth = useSynth()

  const [activeTab, setactiveTab] = useState('tokens')
  // const [wcConnector, setWcConnector] = useState(false)
  const [pending, setPending] = useState(false)
  // const [wlConnector, setWlConnector] = useState(false)
  const [triedOnce, setTriedOnce] = useState(false)

  const onChangeNetwork = async () => {
    dispatch(appChainId(chainId === 97 ? 56 : 97))
    window.location.reload(true)
  }

  const onWalletDisconnect = async () => {
    props.onHide()
    await disconnect()
    window.localStorage.setItem('disableWallet', '1')
    window.location.reload(true)
  }

  const onWalletConnect = useCallback(
    async (x) => {
      setPending(true)
      setTriedOnce(true)
      window.localStorage.removeItem('lastWallet')
      if (x.id === 'BW') {
        await dispatch(addNetworkBC())
      } else if (['MM', 'BRAVE', 'TW'].includes(x.id)) {
        await dispatch(addNetworkMM())
      }
      if (address) {
        disconnect()
      }
      const connector = await connectorsByName(x.connector, connectors) // This 'await' is important despite common sense :) Pls don't remove!
      await connectAsync({ connector })
      window.localStorage.removeItem('disableWallet')
      window.localStorage.setItem('lastWallet', x.id)
      setPending(false)
    },
    [address, connectors, connectAsync, dispatch, disconnect],
  )

  useEffect(() => {
    if (
      window &&
      !pending &&
      !triedOnce &&
      window.localStorage.getItem('disableWallet') !== '1' &&
      !address &&
      !isConnected &&
      !error
      // web3.rpcs.length > 0
    ) {
      // *** ADD IN LEDGER FOR TESTING ***
      if (window.localStorage.getItem('lastWallet') === 'BW') {
        onWalletConnect(walletTypes.filter((x) => x.id === 'BW')[0])
      } else if (window.localStorage.getItem('lastWallet') === 'MM') {
        onWalletConnect(walletTypes.filter((x) => x.id === 'MM')[0])
      } else if (window.localStorage.getItem('lastWallet') === 'TW') {
        onWalletConnect(walletTypes.filter((x) => x.id === 'TW')[0])
      } else if (window.localStorage.getItem('lastWallet') === 'BRAVE') {
        onWalletConnect(walletTypes.filter((x) => x.id === 'BRAVE')[0])
      } else if (window.localStorage.getItem('lastWallet') === 'ON') {
        onWalletConnect(walletTypes.filter((x) => x.id === 'ON')[0])
      } else if (window.localStorage.getItem('lastWallet') === 'CB') {
        onWalletConnect(walletTypes.filter((x) => x.id === 'CB')[0])
      } else if (
        window.localStorage.getItem('lastWallet') === 'WC' &&
        chainId === 56 // WalletConnect does not support testnet
      ) {
        onWalletConnect(walletTypes.filter((x) => x.id === 'WC')[0])
      } else {
        onWalletConnect(walletTypes.filter((x) => x.id === 'OOT')[0]) // Fallback to 'injected'
      }
    }
  }, [
    chainId,
    onWalletConnect,
    pending,
    triedOnce,
    address,
    isConnected,
    error,
  ])

  // ------------------------------------------------------------------------

  const [rank, setrank] = useState('Loading')
  useEffect(() => {
    const getWeight = () => {
      if (address && pool.poolDetails.length > 0) {
        const lpWeight = getLPWeights(
          pool.poolDetails,
          dao.daoDetails,
          bond.bondDetails,
        )
        const synthWeight = getSynthWeights(
          synth.synthDetails,
          pool.poolDetails,
        )
        const spartaWeight = getToken(
          addresses.spartav2,
          pool.tokenDetails,
        ).balance
        return convertFromWei(
          lpWeight.times(2).plus(synthWeight).plus(spartaWeight),
        )
      }
      return '0'
    }
    const getRank = () => {
      // console.log(chain)
      // if (!tempChains.includes(chain.id)) {
      //   setrank('Check Network')
      // }
      if (
        props.show &&
        pool.tokenDetails &&
        pool.poolDetails &&
        dao.daoDetails &&
        bond.bondDetails &&
        synth.synthDetails
      ) {
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
    getRank() // Run on load
    const interval = setInterval(() => {
      getRank() // Run on interval
    }, 3000)
    return () => {
      clearInterval(interval)
    }
  }, [
    addresses.spartav2,
    bond.bondDetails,
    dao.daoDetails,
    dispatch,
    pool.poolDetails,
    pool.tokenDetails,
    props.show,
    synth.synthDetails,
    address,
    // chain.id,
  ])

  const getTokenCount = () => {
    if (tempChains.includes(chainId)) {
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
              {address ? (
                <Col>
                  <h4>{t('wallet')}</h4>
                  <span className="output-card">
                    {formatShortString(address)}
                    <div className="d-inline-block">
                      <ShareLink url={address}>
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
                  {chainId === 97 ? ' Testnet' : ' Mainnet'}
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    className="ms-2 d-inline-flex"
                    checked={chainId === 56}
                    onChange={() => onChangeNetwork()}
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
            {address && (
              <>
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
                          {tempChains.includes(chain.id) && getTokenCount()}
                        </Badge>
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item>
                      <Nav.Link
                        bg="secondary"
                        eventKey="lps"
                        className="btn-sm"
                      >
                        {t('lps')}{' '}
                        <Badge bg="secondary">
                          {tempChains.includes(chain.id) && getLpsCount()}
                        </Badge>
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item>
                      <Nav.Link eventKey="synths" className="btn-sm">
                        {t('synths')}{' '}
                        <Badge bg="secondary">
                          {tempChains.includes(chain.id) && getSynthsCount()}
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
              </>
            )}
          </Row>
        </Modal.Header>

        <Modal.Body>
          {error &&
            (error.message ===
            'closeTransport called before connection was established' ? (
              <Alert variant="primary">
                Trouble connecting with WalletConnect, please make sure your VPN
                is switched off
              </Alert>
            ) : (
              <Alert variant="primary">
                {t('wrongNetwork', {
                  network: chainId === 97 ? 'BSC Testnet' : 'BSC Mainnet',
                })}
              </Alert>
            ))}

          {/* Wallet overview */}
          {!address ? (
            <Row>
              {walletTypes.map((x) => (
                <Col key={x.id} xs="12" sm="6">
                  <Button
                    key={x.id}
                    disabled={
                      (x.id === 'BW' && !window.BinanceChain) ||
                      (x.id === 'MM' && !window.ethereum?.isMetaMask) ||
                      (x.id === 'WC' && chainId !== 56) ||
                      (x.id === 'BRAVE' && !window.ethereum?.isBraveWallet) ||
                      (x.id === 'ON' && !window.ethereum?.isONTO) ||
                      (!['WC', 'BW', 'TW', 'CB'].includes(x.id) &&
                        !window.ethereum)
                    }
                    className="w-100 my-1"
                    onClick={() => {
                      onWalletConnect(x)
                    }}
                    href={
                      x.id === 'TW' && !window.ethereum?.isTrust
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
              {liveChains.includes(chainId) ? (
                <>
                  <Row>
                    <Col>
                      {activeTab === 'tokens' && props.show && <Assets />}
                      {tempChains.includes(chain.id) && activeTab === 'lps' && (
                        <LPs />
                      )}
                      {tempChains.includes(chain.id) &&
                        activeTab === 'synths' && <Synths />}
                      {tempChains.includes(chain.id) &&
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
        {isConnected ? (
          <Modal.Footer className="justify-content-center">
            <Button
              href={getExplorerWallet(address)}
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

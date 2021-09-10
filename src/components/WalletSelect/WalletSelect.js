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
import walletTypes from './walletTypes'
import { getExplorerWallet } from '../../utils/extCalls'
import {
  changeNetworkLsOnly,
  formatShortString,
  getAddresses,
  getNetwork,
} from '../../utils/web3'
import ShareLink from '../Share/ShareLink'
import { isAppleDevice } from '../../utils/helpers'
import Assets from './Assets'
import LPs from './LPs'
import Synths from './Synths'
import { Icon } from '../Icons/icons'
import { Tooltip } from '../Tooltip/tooltip'
import { useBond } from '../../store/bond/selector'
import { useDao } from '../../store/dao/selector'
import { useSynth } from '../../store/synth'
import { usePool } from '../../store/pool'
import { BN, convertFromWei } from '../../utils/bigNumber'
import { connectorsByName } from '../../utils/web3React'

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
  const wallet = useWeb3React()
  const bond = useBond()
  const dao = useDao()
  const synth = useSynth()
  const pool = usePool()
  const addr = getAddresses()
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
      if (wallet.active) {
        window.sessionStorage.setItem('walletConnected', '1')
      }
      if (!wallet.active) {
        window.sessionStorage.removeItem('walletConnected')
      }
      if (wallet.error) {
        window.sessionStorage.removeItem('walletConnected')
      }
    }
    checkWallet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.active, wallet.error])

  const connectWallet = async (x) => {
    window.localStorage.removeItem('disableWallet')
    if (x) {
      await wallet.activate(connectorsByName(x?.connector))
    }
    window.localStorage.setItem('lastWallet', x?.id)
  }

  const onWalletDisconnect = async () => {
    props.onHide()
    window.localStorage.setItem('disableWallet', '1')
    window.location.reload()
  }

  // *** ADD IN LEDGER FOR TESTING ***
  const [trigger0, settrigger0] = useState(0)
  const checkWallets = async () => {
    if (
      window.localStorage.getItem('disableWallet') !== '1' &&
      !wallet.account &&
      !wallet.active &&
      !wallet.error
    ) {
      if (window.localStorage.getItem('lastWallet') === 'BC') {
        connectWallet(walletTypes.filter((x) => x.id === 'BC')[0])
      } else if (window.localStorage.getItem('lastWallet') === 'MM') {
        connectWallet(walletTypes.filter((x) => x.id === 'MM')[0])
      } else if (window.localStorage.getItem('lastWallet') === 'TW') {
        connectWallet(walletTypes.filter((x) => x.id === 'TW')[0])
      } else if (window.localStorage.getItem('lastWallet') === 'WC') {
        connectWallet(walletTypes.filter((x) => x.id === 'WC')[0])
      } else {
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
    wallet.active,
    wallet.error,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('lastWallet'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('disableWallet'),
  ])

  const getWeight = () => {
    if (wallet.account && pool.tokenDetails.length > 1) {
      const validate = (value) => (value > 0 ? BN(value) : BN('0'))
      const getPoolWeight = () => {
        let weight = BN('0')
        for (let i = 0; i < pool.poolDetails.length; i++) {
          const thePool = pool.poolDetails[i]
          if (thePool.address !== '') {
            weight = weight.plus(
              BN(thePool.balance)
                .div(BN(thePool.poolUnits))
                .times(BN(thePool.baseAmount)),
            )
          }
        }
        return validate(weight)
      }
      const getSynthWeight = () => {
        let weight = BN('0')
        for (let i = 0; i < synth.synthDetails.length; i++) {
          const theSynth = synth.synthDetails[i]
          const thePool = pool.poolDetails.filter(
            (pewl) => pewl.tokenAddress === theSynth.tokenAddress,
          )[0]
          if (theSynth.balance > 0) {
            weight = weight.plus(
              BN(theSynth.balance).times(
                BN(thePool.baseAmount).div(BN(thePool.tokenAmount)),
              ),
            )
          }
        }
        return validate(weight)
      }

      const bondWeight = validate(bond.member.weight)
      const daoWeight = validate(dao.member.weight)
      const synthVaultWeight = validate(synth.memberDetails.totalWeight)
      const spartaWeight = validate(
        pool.tokenDetails.filter((token) => token.address === addr.spartav2)[0]
          .balance,
      )
      const poolWeight = getPoolWeight()
      const synthWeight = getSynthWeight()

      return convertFromWei(
        bondWeight
          .plus(daoWeight)
          .plus(synthVaultWeight)
          .plus(spartaWeight)
          .plus(poolWeight)
          .plus(synthWeight),
      )
    }
    return '0'
  }

  const [rank, setrank] = useState('0')
  const getRank = () => {
    const weight = getWeight()
    const ranksArray = spartanRanks.filter((i) => i.weight < weight)
    const { length } = ranksArray
    if (length > 0) {
      setrank(ranksArray[length - 1].id)
    } else {
      setrank('Peasant')
    }
  }

  const [trigger1, settrigger1] = useState(0)
  useEffect(() => {
    if (trigger1 === 0) {
      getRank()
      settrigger1(trigger1 + 1)
    }
    const timer = setTimeout(() => {
      getRank()
      settrigger1(trigger1 + 1)
    }, 3000)
    return () => {
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger1])

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
                    variant="info"
                    className="w-100 my-1"
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
              {network.chainId === 97 || network.chainId === 56 ? (
                <>
                  <Row>
                    <Tabs
                      defaultActiveKey="assets"
                      id="uncontrolled-tab-example"
                      className="flex-row px-2 mb-3"
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
        <Modal.Footer className="justify-content-center">
          <Button
            href={getExplorerWallet(wallet.account)}
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
      </Modal>
    </>
  )
}

export default WalletSelect

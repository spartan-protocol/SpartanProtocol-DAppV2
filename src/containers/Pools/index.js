import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import {
  Badge,
  Card,
  Col,
  Form,
  Nav,
  OverlayTrigger,
  Row,
} from 'react-bootstrap'
import PoolItem from './PoolItem'
import { usePool } from '../../store/pool'
import { getNetwork, tempChains } from '../../utils/web3'
import { convertToWei, BN } from '../../utils/bigNumber'
import HelmetLoading from '../../components/Spinner/index'
import { useBond, bondVaultWeight } from '../../store/bond'
import WrongNetwork from '../../components/WrongNetwork/index'
import SummaryItem from './SummaryItem'
import { Icon } from '../../components/Icons/index'
import { Tooltip } from '../../components/Tooltip/index'
import { useWeb3 } from '../../store/web3'
import { calcDaoAPY, calcSynthAPY } from '../../utils/math/nonContract'
import { useDao, daoVaultWeight } from '../../store/dao'
import SynthItem from './SynthItem'
import { useSynth } from '../../store/synth'

const Overview = () => {
  const isLightMode = window.localStorage.getItem('theme')

  const synth = useSynth()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const pool = usePool()
  const web3 = useWeb3()
  const bond = useBond()
  const dao = useDao()

  const [activeTab, setActiveTab] = useState('1')
  const [showBabies, setShowBabies] = useState(false)
  const [showSynths, setShowSynths] = useState(false)
  const [network, setnetwork] = useState(getNetwork())
  const [daoApy, setDaoApy] = useState('0')
  const [synthApy, setSynthApy] = useState('0')

  const [trigger0, settrigger0] = useState(0)

  const getData = () => {
    setnetwork(getNetwork())
  }
  useEffect(() => {
    if (trigger0 === 0) {
      getData()
    }
    const timer = setTimeout(() => {
      getData()
      settrigger0(trigger0 + 1)
    }, 2000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger0])

  useEffect(() => {
    const checkWeight = () => {
      if (pool.poolDetails?.length > 1) {
        dispatch(daoVaultWeight(pool.poolDetails, web3.rpcs))
        dispatch(bondVaultWeight(pool.poolDetails, web3.rpcs))
      }
    }
    checkWeight()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.poolDetails])

  const isLoading = () => {
    if (!pool.poolDetails) {
      return true
    }
    return false
  }

  const getPools = () =>
    pool.poolDetails
      .filter((asset) =>
        asset.baseAmount > 0 && showBabies
          ? BN(asset.baseAmount).isGreaterThanOrEqualTo(1) && !asset.newPool
          : BN(asset.baseAmount).isGreaterThanOrEqualTo(
              convertToWei('10000'),
            ) && !asset.newPool,
      )
      .sort((a, b) => b.baseAmount - a.baseAmount)

  const getNewPools = () =>
    pool?.poolDetails
      .filter((asset) => asset.baseAmount > 0 && asset.newPool === true)
      .sort((a, b) => b.baseAmount - a.baseAmount)

  const [firstLoad, setFirstLoad] = useState(true)
  useEffect(() => {
    if (
      firstLoad &&
      pool.poolDetails &&
      pool.poolDetails.filter((x) => x.newPool === false && x.baseAmount > 0)
        .length === 0
    ) {
      setFirstLoad(false)
      setActiveTab('2')
    }
  }, [pool.poolDetails, firstLoad])

  const getTotalDaoWeight = () => {
    const _amount = BN(bond.totalWeight).plus(dao.totalWeight)
    if (_amount > 0) {
      return _amount
    }
    return '0.00'
  }

  const getDaoApy = () => {
    let revenue = BN(web3.metrics.global[0].daoVault30Day)
    revenue = revenue.toString()
    const baseAmount = getTotalDaoWeight().toString()
    const apy = calcDaoAPY(revenue, baseAmount)
    return apy.toFixed(2).toString()
  }

  const isDaoVaultLoading = () => {
    if (!web3.metrics.global || !bond.totalWeight || !dao.totalWeight) {
      return true
    }
    return false
  }

  useEffect(() => {
    if (!isDaoVaultLoading()) {
      setDaoApy(getDaoApy())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3.metrics.global, bond.totalWeight, dao.totalWeight])

  const isSynthVaultLoading = () => {
    if (!synth.totalWeight || !web3.metrics.global) {
      return true
    }
    return false
  }

  const getSynthApy = () => {
    let revenue = BN(web3.metrics.global[0].synthVault30Day)
    revenue = revenue.toString()
    const baseAmount = synth.totalWeight.toString()
    const apy = calcSynthAPY(revenue, baseAmount)
    return apy.toFixed(2).toString()
  }

  useEffect(() => {
    if (!isSynthVaultLoading()) {
      setSynthApy(getSynthApy())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3.metrics.global, synth.totalWeight])

  return (
    <>
      <div className="content">
        {tempChains.includes(network.chainId) && (
          <>
            <Row className="row-480">
              <Col xs="12">
                <SummaryItem activeTab={activeTab} />
                <Card>
                  <Card.Header className="p-0 border-0 mb-2 rounded-pill-top-left">
                    <Nav activeKey={activeTab} fill>
                      <Nav.Item key="1" className="rounded-pill-top-left">
                        <Nav.Link
                          eventKey="1"
                          className="rounded-pill-top-left"
                          onClick={() => {
                            setActiveTab('1')
                          }}
                        >
                          {t('pools')}
                          <Badge bg="info" className="ms-2">
                            {!isLoading() ? (
                              getPools().length
                            ) : (
                              <Icon
                                icon="cycle"
                                size="15"
                                className="anim-spin"
                              />
                            )}
                          </Badge>
                        </Nav.Link>
                      </Nav.Item>

                      <Nav.Item key="2" className="rounded-pill-top-right">
                        <Nav.Link
                          className="rounded-pill-top-right"
                          eventKey="2"
                          onClick={() => {
                            setActiveTab('2')
                          }}
                        >
                          {t('new')}
                          <Badge bg="info" className="ms-2">
                            {!isLoading() ? (
                              getNewPools().length
                            ) : (
                              <Icon
                                icon="cycle"
                                size="15"
                                className="anim-spin"
                              />
                            )}
                          </Badge>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Card.Header>
                  {!isLoading() ? (
                    <Card.Body>
                      <Row>
                        {activeTab === '1' && (
                          <>
                            <Form className="">
                              <span className="output-card">
                                {t('showHidden')}
                                <OverlayTrigger
                                  placement="auto"
                                  overlay={Tooltip(t, 'hiddenPools')}
                                >
                                  <span role="button">
                                    <Icon
                                      icon="info"
                                      className="ms-1 mb-1"
                                      size="15"
                                      fill={isLightMode ? 'black' : 'white'}
                                    />
                                  </span>
                                </OverlayTrigger>
                                <Form.Check
                                  type="switch"
                                  id="custom-switch"
                                  className="ms-2 d-inline-flex"
                                  checked={showBabies}
                                  onChange={() => {
                                    setShowBabies(!showBabies)
                                  }}
                                />
                              </span>
                              <span className="output-card">
                                {t('synthView')}
                                <OverlayTrigger
                                  placement="auto"
                                  overlay={Tooltip(t, 'synthView')}
                                >
                                  <span role="button">
                                    <Icon
                                      icon="info"
                                      className="ms-1 mb-1"
                                      size="15"
                                      fill={isLightMode ? 'black' : 'white'}
                                    />
                                  </span>
                                </OverlayTrigger>
                                <Form.Check
                                  type="switch"
                                  id="custom-switch"
                                  className="ms-2 d-inline-flex"
                                  checked={showSynths}
                                  onChange={() => {
                                    setShowSynths(!showSynths)
                                  }}
                                />
                              </span>
                            </Form>
                            {getPools().length > 0 ? (
                              getPools()
                                .filter((x) => !x.newPool)
                                .map((asset) =>
                                  !showSynths ? (
                                    <PoolItem
                                      key={asset.address}
                                      asset={asset}
                                      daoApy={daoApy}
                                    />
                                  ) : (
                                    asset.curated && (
                                      <SynthItem
                                        key={asset.address}
                                        asset={asset}
                                        synthApy={synthApy}
                                      />
                                    )
                                  ),
                                )
                            ) : (
                              <Col>
                                There are no initialised pools with more than 7
                                days of existence yet; check the New tab
                              </Col>
                            )}
                          </>
                        )}
                        {activeTab === '2' && (
                          <>
                            {getNewPools().length > 0 ? (
                              getNewPools().map((asset) => (
                                <PoolItem
                                  key={asset.address}
                                  asset={asset}
                                  daoApy={daoApy}
                                />
                              ))
                            ) : (
                              <Col>There are no new/initializing pools</Col>
                            )}
                          </>
                        )}
                      </Row>
                    </Card.Body>
                  ) : (
                    <Col className="card-480">
                      <HelmetLoading height={300} width={300} />
                    </Col>
                  )}
                </Card>
              </Col>
            </Row>
          </>
        )}
        {!tempChains.includes(network.chainId) && <WrongNetwork />}
      </div>
    </>
  )
}

export default Overview

/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import Badge from 'react-bootstrap/Badge'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Row from 'react-bootstrap/Row'
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
  const synth = useSynth()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const pool = usePool()
  const web3 = useWeb3()
  const bond = useBond()
  const dao = useDao()

  const [activeTab, setActiveTab] = useState('pools')
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
      .filter(
        (asset) =>
          BN(asset.baseAmount).isGreaterThanOrEqualTo(convertToWei('10000')) &&
          !asset.newPool,
      )
      .sort((a, b) => b.baseAmount - a.baseAmount)

  const getNewPools = () =>
    pool?.poolDetails
      .filter((asset) => asset.baseAmount > 0 && asset.newPool === true)
      .sort((a, b) => b.baseAmount - a.baseAmount)

  const getBabies = () =>
    pool.poolDetails
      .filter(
        (asset) =>
          asset.baseAmount > 0 &&
          BN(asset.baseAmount).isLessThan(convertToWei('10000')) &&
          !asset.newPool,
      )
      .sort((a, b) => b.baseAmount - a.baseAmount)

  const getSynths = () =>
    pool.poolDetails
      .filter(
        (asset) =>
          BN(asset.baseAmount).isGreaterThanOrEqualTo(convertToWei('10000')) &&
          !asset.newPool &&
          asset.curated,
      )
      .sort((a, b) => b.baseAmount - a.baseAmount)

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
                <Row>
                  <SummaryItem />
                  {/* NEW FILTER SECTION */}
                  <Col xs="12">
                    <Button>{t('createPool')}</Button>
                  </Col>
                  <Col xs="12">
                    <Button
                      variant={activeTab === 'pools' ? 'primary' : 'secondary'}
                      onClick={() => setActiveTab('pools')}
                    >
                      {t('pools')}
                      <Badge className="ms-2">
                        {!isLoading() ? (
                          getPools().length
                        ) : (
                          <Icon icon="cycle" size="15" className="anim-spin" />
                        )}
                      </Badge>
                    </Button>
                    <Button
                      variant={activeTab === 'new' ? 'primary' : 'secondary'}
                      onClick={() => setActiveTab('new')}
                    >
                      {t('new')}
                      <Badge className="ms-2">
                        {!isLoading() ? (
                          getNewPools().length
                        ) : (
                          <Icon icon="cycle" size="15" className="anim-spin" />
                        )}
                      </Badge>
                    </Button>
                    <Button
                      variant={activeTab === 'babies' ? 'primary' : 'secondary'}
                      onClick={() => setActiveTab('babies')}
                    >
                      {t('< 10K')}
                      <Badge className="ms-2">
                        {!isLoading() ? (
                          getBabies().length
                        ) : (
                          <Icon icon="cycle" size="15" className="anim-spin" />
                        )}
                      </Badge>
                    </Button>
                    <OverlayTrigger
                      placement="auto"
                      overlay={Tooltip(t, 'hiddenPools')}
                    >
                      <span role="button">
                        <Icon icon="info" className="" size="15" />
                      </span>
                    </OverlayTrigger>
                    <Button
                      variant={activeTab === 'synths' ? 'primary' : 'secondary'}
                      onClick={() => setActiveTab('synths')}
                    >
                      {t('synths')}
                      <Badge className="ms-2">
                        {!isLoading() ? (
                          getSynths().length
                        ) : (
                          <Icon icon="cycle" size="15" className="anim-spin" />
                        )}
                      </Badge>
                    </Button>
                    <OverlayTrigger
                      placement="auto"
                      overlay={Tooltip(t, 'synthView')}
                    >
                      <span role="button">
                        <Icon icon="info" className="" size="15" />
                      </span>
                    </OverlayTrigger>
                  </Col>
                </Row>
                <Card>
                  {!isLoading() ? (
                    <Card.Body>
                      <Row>
                        {activeTab === 'pools' &&
                          getPools().map((asset) => (
                            <PoolItem
                              key={asset.address}
                              asset={asset}
                              daoApy={daoApy}
                            />
                          ))}

                        {activeTab === 'new' && (
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

                        {activeTab === 'babies' && (
                          <>
                            {getBabies().length > 0 ? (
                              getBabies().map((asset) => (
                                <PoolItem
                                  key={asset.address}
                                  asset={asset}
                                  daoApy={daoApy}
                                />
                              ))
                            ) : (
                              <Col>
                                There are no pools below the minimum liquidity
                                threshold
                              </Col>
                            )}
                          </>
                        )}

                        {activeTab === 'synths' &&
                          getSynths().map((asset) => (
                            <SynthItem
                              key={asset.address}
                              asset={asset}
                              synthApy={synthApy}
                            />
                          ))}
                      </Row>
                    </Card.Body>
                  ) : (
                    <Col className="card-480">
                      <HelmetLoading height={150} width={150} />
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

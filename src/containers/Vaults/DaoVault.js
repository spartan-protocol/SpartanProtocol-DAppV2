import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Card, Col, OverlayTrigger, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import { usePool } from '../../store/pool'
import { BN, formatFromUnits, formatFromWei } from '../../utils/bigNumber'
import {
  useDao,
  daoHarvest,
  daoGlobalDetails,
  daoMemberDetails,
  daoVaultWeight,
  daoDepositTimes,
  getDaoDetails,
} from '../../store/dao'
import { useWeb3 } from '../../store/web3'
import { useReserve } from '../../store/reserve'
import { useSparta } from '../../store/sparta'
import { bondVaultWeight, getBondDetails, useBond } from '../../store/bond'
import { Icon } from '../../components/Icons/index'
import {
  calcDaoAPY,
  getTimeSince,
  getVaultWeights,
} from '../../utils/math/nonContract'
import { getPool, getToken } from '../../utils/math/utils'
import { calcCurrentRewardDao } from '../../utils/math/dao'
import HelmetLoading from '../../components/Spinner/index'
import DaoVaultItem from './DaoVaultItem'
import { getAddresses } from '../../utils/web3'
import { Tooltip } from '../../components/Tooltip/index'

const DaoVault = () => {
  const isLightMode = window.localStorage.getItem('theme')
  const reserve = useReserve()
  const wallet = useWeb3React()
  const dao = useDao()
  const bond = useBond()
  const pool = usePool()
  const sparta = useSparta()
  const addr = getAddresses()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const web3 = useWeb3()

  const [txnLoading, setTxnLoading] = useState(false)
  const [trigger0, settrigger0] = useState(0)
  const [showUsd, setShowUsd] = useState(false)

  const handleChangeShow = () => {
    setShowUsd(!showUsd)
  }

  const getData = () => {
    dispatch(daoGlobalDetails(web3.rpcs))
    dispatch(daoMemberDetails(wallet, web3.rpcs))
  }

  useEffect(() => {
    if (trigger0 === 0) {
      getData()
    }
    const timer = setTimeout(() => {
      getData()
      settrigger0(trigger0 + 1)
    }, 7500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger0])

  useEffect(() => {
    const checkDetails = () => {
      if (pool.listedPools?.length > 1) {
        dispatch(getDaoDetails(pool.listedPools, wallet, web3.rpcs))
        dispatch(getBondDetails(pool.listedPools, wallet, web3.rpcs))
      }
    }
    checkDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.listedPools])

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

  useEffect(() => {
    const checkWeight = () => {
      if (dao.daoDetails?.length > 1) {
        dispatch(daoDepositTimes(dao.daoDetails, wallet, web3.rpcs))
      }
    }
    checkWeight()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dao.daoDetails])

  const getTotalWeight = () => {
    const _amount = BN(bond.totalWeight).plus(dao.totalWeight)
    if (_amount > 0) {
      return _amount
    }
    return '0.00'
  }

  const getUSDFromSparta = () => {
    if (getTotalWeight() > 0)
      return formatFromWei(BN(getTotalWeight()).times(web3.spartaPrice))
    return '0.00'
  }

  const getOwnWeight = () => {
    const _weight = getVaultWeights(
      pool.poolDetails,
      dao.daoDetails,
      bond.bondDetails,
    )
    if (_weight > 0) {
      return _weight
    }
    return '0.00'
  }

  const getUSDFromSpartaOwnWeight = () => {
    const _weight = getOwnWeight()
    if (_weight > 0) {
      return formatFromWei(BN(_weight).times(web3.spartaPrice))
    }
    return '0.00'
  }

  const getWeightPercent = () => {
    const _weight = getOwnWeight()
    const _totalWeight = getTotalWeight()
    if (_weight > 0) {
      return BN(_weight).div(_totalWeight).times(100).toFixed(2)
    }
    return '0.00'
  }

  const getClaimable = () => {
    const reward = calcCurrentRewardDao(
      pool.poolDetails,
      bond,
      dao,
      sparta.globalDetails.secondsPerEra,
      reserve.globalDetails.spartaBalance,
    )
    if (reward > 0) {
      return reward
    }
    return '0.00'
  }

  const isLoading = () => {
    if (
      bond.bondDetails.length > 1 &&
      dao.daoDetails.length > 1 &&
      pool.poolDetails.length > 1
    ) {
      return false
    }
    return true
  }

  const handleHarvest = async () => {
    setTxnLoading(true)
    await dispatch(daoHarvest(wallet, web3.rpcs))
    setTxnLoading(false)
  }

  // 0.0023 === 0.0012
  const estMaxGas = '1500000000000000'
  const enoughGas = () => {
    const bal = getToken(addr.bnb, pool.tokenDetails).balance
    if (BN(bal).isLessThan(estMaxGas)) {
      return false
    }
    return true
  }

  const isLoadingApy = () => {
    if (!bond.totalWeight || !dao.totalWeight || !web3.metrics.global) {
      return true
    }
    return false
  }

  const APY = () => {
    let revenue = BN(web3.metrics.global[0].daoVault30Day)
    revenue = revenue.toString()
    const baseAmount = getTotalWeight().toString()
    return formatFromUnits(calcDaoAPY(revenue, baseAmount), 2)
  }

  const checkValid = () => {
    if (!wallet.account) {
      return [false, t('checkWallet')]
    }
    if (!reserve.globalDetails.emissions) {
      return [false, t('incentivesDisabled')]
    }
    if (reserve.globalDetails.globalFreeze) {
      return [false, t('globalFreeze')]
    }
    if (getClaimable() <= 0) {
      return [false, t('noClaim')]
    }
    if (!enoughGas()) {
      return [false, t('checkBnbGas')]
    }
    return [true, t('harvestAll')]
  }

  return (
    <Row>
      <Col xs="auto" className="">
        <Card xs="auto" className="card-320" style={{ minHeight: '202' }}>
          <Card.Header className="">
            <Row>
              <Col>{t('daoVault')}</Col>
              <Col xs="auto" className="text-center m-auto">
                <p className="text-sm-label d-inline-block">APY</p>
                <OverlayTrigger
                  placement="auto"
                  overlay={Tooltip(t, 'apySynth')}
                >
                  <span role="button">
                    <Icon
                      icon="info"
                      className="ms-1 mt-1"
                      size="17"
                      fill={isLightMode ? 'black' : 'white'}
                    />
                  </span>
                </OverlayTrigger>
                <p className="output-card d-inline-block ms-2">
                  {!isLoadingApy() ? `${APY()}%` : 'Loading...'}
                </p>
              </Col>
            </Row>
          </Card.Header>
          {!isLoading() ? (
            <Card.Body>
              <Row className="my-1">
                <Col xs="auto" className="text-card">
                  {t('totalWeight')}
                  <OverlayTrigger
                    placement="auto"
                    overlay={Tooltip(t, 'daoVaultWeight')}
                  >
                    <span role="button">
                      <Icon
                        icon="info"
                        className="ms-1 mb-1"
                        size="15"
                        // fill={isLightMode ? 'black' : 'white'}
                      />
                    </span>
                  </OverlayTrigger>
                </Col>
                <Col
                  className="text-end output-card"
                  onClick={() => handleChangeShow()}
                  role="button"
                >
                  {!showUsd
                    ? formatFromWei(getTotalWeight(), 0)
                    : getUSDFromSparta()}
                  <Icon
                    icon={showUsd ? 'usd' : 'spartav2'}
                    size="20"
                    className="mb-1 ms-1"
                  />
                </Col>
              </Row>
              <Row className="my-1">
                <Col xs="auto" className="text-card">
                  {t('lockupPeriod')}
                </Col>
                <Col className="text-end output-card">24 {t('hours')}</Col>
              </Row>
            </Card.Body>
          ) : (
            <HelmetLoading />
          )}

          <Card.Footer>
            <Link to="/pools/liquidity">
              <Button className="w-100">{t('joinPools')}</Button>
            </Link>
          </Card.Footer>
        </Card>
      </Col>

      <Col xs="auto">
        <Card className="card-320" style={{ minHeight: '202' }}>
          <Card.Header>{t('memberDetails')}</Card.Header>
          {!isLoading() ? (
            <>
              <Card.Body className="pb-1">
                <Row className="my-1">
                  <Col xs="auto" className="text-card">
                    {t('yourWeight')}
                    <OverlayTrigger
                      placement="auto"
                      overlay={Tooltip(t, 'daoVaultWeight')}
                    >
                      <span role="button">
                        <Icon
                          icon="info"
                          className="ms-1 mb-1"
                          size="15"
                          // fill={isLightMode ? 'black' : 'white'}
                        />
                      </span>
                    </OverlayTrigger>
                  </Col>

                  <Col
                    className="text-end output-card"
                    onClick={() => handleChangeShow()}
                    role="button"
                  >
                    {!wallet.account ? (
                      t('connectWallet')
                    ) : (
                      <>
                        {!showUsd
                          ? formatFromWei(
                              getVaultWeights(
                                pool.poolDetails,
                                dao.daoDetails,
                                bond.bondDetails,
                              ),
                              0,
                            )
                          : getUSDFromSpartaOwnWeight()}{' '}
                        ({getWeightPercent()}%)
                        <Icon
                          icon={showUsd ? 'usd' : 'spartav2'}
                          size="20"
                          className="mb-1 ms-1"
                        />
                      </>
                    )}
                  </Col>
                </Row>

                <Row className="my-1">
                  <Col xs="auto" className="text-card">
                    {t('harvestable')}
                    <OverlayTrigger
                      placement="auto"
                      overlay={Tooltip(t, 'daoHarvestable')}
                    >
                      <span role="button">
                        <Icon
                          icon="info"
                          className="ms-1 mb-1"
                          size="15"
                          // fill={isLightMode ? 'black' : 'white'}
                        />
                      </span>
                    </OverlayTrigger>
                  </Col>
                  <Col className="text-end output-card">
                    {reserve.globalDetails.emissions
                      ? !wallet.account
                        ? t('connectWallet')
                        : `${formatFromWei(getClaimable())} SPARTA`
                      : t('incentivesDisabled')}
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col xs="auto" className="text-card">
                    {t('lastHarvest')}
                  </Col>

                  <Col className="text-end output-card">
                    {!wallet.account ? (
                      t('connectWallet')
                    ) : (
                      <>
                        {dao.member.lastHarvest > 0
                          ? `${
                              getTimeSince(dao.member.lastHarvest, t)[0] +
                              getTimeSince(dao.member.lastHarvest, t)[1]
                            } ${t('ago')}`
                          : t('never')}
                      </>
                    )}
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <Button
                  className="w-100"
                  onClick={() => handleHarvest()}
                  disabled={!checkValid()[0]}
                >
                  {checkValid()[1]}
                  {txnLoading && (
                    <Icon icon="cycle" size="20" className="anim-spin ms-1" />
                  )}
                </Button>
              </Card.Footer>
            </>
          ) : (
            <HelmetLoading />
          )}
        </Card>
      </Col>

      {!isLoading() &&
        dao.daoDetails
          .filter(
            (i) =>
              i.staked > 0 || getPool(i.tokenAddress, pool.poolDetails).curated,
          )
          .map((i) => (
            <DaoVaultItem key={i.address} i={i} claimable={getClaimable()} />
          ))}
    </Row>
  )
}

export default DaoVault

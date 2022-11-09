import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
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
  daoDepositTimes,
  getDaoDetails,
} from '../../store/dao'
import { useWeb3 } from '../../store/web3'
import { useReserve } from '../../store/reserve'
import { useSparta } from '../../store/sparta'
import { getBondDetails, useBond } from '../../store/bond'
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
import { Tooltip } from '../../components/Tooltip/index'
import { useApp } from '../../store/app'

const DaoVault = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const wallet = useWeb3React()

  const { addresses } = useApp()
  const bond = useBond()
  const dao = useDao()
  const pool = usePool()
  const reserve = useReserve()
  const sparta = useSparta()
  const web3 = useWeb3()

  const [txnLoading, setTxnLoading] = useState(false)
  const [showUsd, setShowUsd] = useState(false)
  const [spartaPrice, setspartaPrice] = useState(0)

  useEffect(() => {
    if (web3.spartaPrice > 0) {
      setspartaPrice(web3.spartaPrice)
    } else if (web3.spartaPriceInternal > 0) {
      setspartaPrice(web3.spartaPriceInternal)
    }
  }, [web3.spartaPrice, web3.spartaPriceInternal])

  const handleChangeShow = () => {
    setShowUsd(!showUsd)
  }

  useEffect(() => {
    const getData = () => {
      dispatch(daoGlobalDetails())
      dispatch(daoMemberDetails(wallet.account))
    }
    getData() // Run on load
    const interval = setInterval(() => {
      getData() // Run on interval
    }, 7500)
    return () => {
      clearInterval(interval)
    }
  }, [dispatch, wallet])

  useEffect(() => {
    dispatch(getDaoDetails(wallet.account))
    dispatch(getBondDetails(wallet.account))
  }, [dispatch, pool.listedPools, wallet.account])

  useEffect(() => {
    dispatch(daoDepositTimes(wallet.account))
  }, [dao.daoDetails, dispatch, wallet.account])

  const getTotalWeight = () => {
    const _amount = BN(bond.totalWeight).plus(dao.totalWeight)
    if (_amount > 0) {
      return _amount
    }
    return '0.00'
  }

  const getUSDFromSparta = () => {
    if (getTotalWeight() > 0)
      return formatFromWei(BN(getTotalWeight()).times(spartaPrice))
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
      return formatFromWei(BN(_weight).times(spartaPrice))
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
      bond.bondDetails.length > 0 &&
      dao.daoDetails.length > 0 &&
      pool.poolDetails.length > 0
    ) {
      return false
    }
    return true
  }

  const handleHarvest = async () => {
    setTxnLoading(true)
    await dispatch(daoHarvest(wallet))
    setTxnLoading(false)
  }

  // 0.0023 === 0.0012
  const estMaxGas = '1500000000000000'
  const enoughGas = () => {
    const bal = getToken(addresses.bnb, pool.tokenDetails).balance
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
      <Col className="mb-4" xs="12" sm="6" lg="4">
        <Card style={{ minHeight: '185px' }}>
          <Card.Header>
            <Row>
              <Col xs="auto" className="mt-2 h4">
                {t('daoVault')}
              </Col>
              <Col className="text-end m-auto d-flex justify-content-end">
                <Row>
                  <Col xs="12">
                    <span>APY</span>
                    <OverlayTrigger
                      placement="auto"
                      overlay={Tooltip(t, 'apyVault')}
                    >
                      <span role="button">
                        <Icon icon="info" className="ms-1" size="17" />
                      </span>
                    </OverlayTrigger>
                  </Col>
                  <Col xs="12">
                    <div className="ms-2">
                      {!isLoadingApy() ? `${APY()}%` : 'Loading...'}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Header>
          {!isLoading() ? (
            <Card.Body>
              <Row className="my-1">
                <Col>
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
                        //
                      />
                    </span>
                  </OverlayTrigger>
                </Col>
                <Col
                  xs="auto"
                  className="text-end"
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
                <Col>{t('lockupPeriod')}</Col>
                <Col xs="auto" className="text-end">
                  24 {t('hours')}
                </Col>
              </Row>
            </Card.Body>
          ) : (
            <HelmetLoading height={150} width={150} />
          )}

          <Card.Footer>
            <Link to="/pools/liquidity">
              <Button className="w-100 btn-sm">{t('joinPools')}</Button>
            </Link>
          </Card.Footer>
        </Card>
      </Col>

      <Col className="mb-2" xs="12" sm="6" lg="4">
        <Card style={{ minHeight: '185px' }}>
          <Card.Header>
            <Col className="mt-2 h4">{t('memberDetails')}</Col>
          </Card.Header>
          {!isLoading() ? (
            <>
              <Card.Body className="pb-1">
                <Row className="my-1">
                  <Col>
                    {t('yourWeight')}
                    <OverlayTrigger
                      placement="auto"
                      overlay={Tooltip(t, 'daoVaultWeight')}
                    >
                      <span role="button">
                        <Icon icon="info" className="ms-1 mb-1" size="15" />
                      </span>
                    </OverlayTrigger>
                  </Col>

                  <Col
                    xs="auto"
                    className="text-end"
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
                  <Col>
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
                          //
                        />
                      </span>
                    </OverlayTrigger>
                  </Col>
                  <Col xs="auto">
                    {reserve.globalDetails.emissions
                      ? !wallet.account
                        ? t('connectWallet')
                        : `${formatFromWei(getClaimable())} SPARTA`
                      : t('incentivesDisabled')}
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col>{t('lastHarvest')}</Col>

                  <Col xs="auto" className="text-end">
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
                  className="w-100 btn-sm"
                  onClick={() => handleHarvest()}
                  disabled={!checkValid()[0]}
                >
                  {checkValid()[1]}
                  {txnLoading && (
                    <Icon
                      fill="white"
                      icon="cycle"
                      size="20"
                      className="anim-spin ms-1"
                    />
                  )}
                </Button>
              </Card.Footer>
            </>
          ) : (
            <HelmetLoading height={150} width={150} />
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

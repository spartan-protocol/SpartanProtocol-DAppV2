import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import spartaIcon from '../../../assets/tokens/sparta-lp.svg'
import { usePool } from '../../../store/pool'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import { useDao } from '../../../store/dao/selector'
import {
  daoHarvest,
  daoWithdraw,
  daoGlobalDetails,
  daoMemberDetails,
  daoVaultWeight,
  daoDepositTimes,
  getDaoDetails,
} from '../../../store/dao/actions'
import { useReserve } from '../../../store/reserve/selector'
import DaoDepositModal from './Components/DaoDepositModal'
import { useSparta } from '../../../store/sparta'
import { bondVaultWeight, getBondDetails, useBond } from '../../../store/bond'
import { Icon } from '../../../components/Icons/icons'
import { getTimeUntil, getVaultWeights } from '../../../utils/math/nonContract'
import { getPool } from '../../../utils/math/utils'
import { calcCurrentRewardDao } from '../../../utils/math/dao'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'

const DaoVault = () => {
  const reserve = useReserve()
  const wallet = useWeb3React()
  const dao = useDao()
  const bond = useBond()
  const pool = usePool()
  const sparta = useSparta()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const isLightMode = window.localStorage.getItem('theme')

  const getToken = (_tokenAddr) =>
    pool.tokenDetails.filter((i) => i.address === _tokenAddr)[0]

  const [trigger0, settrigger0] = useState(0)
  const getData = () => {
    dispatch(daoGlobalDetails(wallet))
    dispatch(daoMemberDetails(wallet))
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
        dispatch(getDaoDetails(pool.listedPools, wallet))
        dispatch(getBondDetails(pool.listedPools, wallet))
      }
    }
    checkDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.listedPools])

  useEffect(() => {
    const checkWeight = () => {
      if (pool.poolDetails?.length > 1) {
        dispatch(daoVaultWeight(pool.poolDetails, wallet))
        dispatch(bondVaultWeight(pool.poolDetails, wallet))
      }
    }
    checkWeight()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.poolDetails])

  useEffect(() => {
    const checkWeight = () => {
      if (dao.daoDetails?.length > 1) {
        dispatch(daoDepositTimes(dao.daoDetails, wallet))
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

  const getLockedSecs = () => {
    const depositTime = BN(dao.member?.depositTime)
    const lockUpSecs = BN('86400')
    const [units, time] = getTimeUntil(depositTime.plus(lockUpSecs), t)
    return [units, time]
  }

  const getClaimable = () => {
    calcCurrentRewardDao(
      pool.poolDetails,
      bond,
      dao,
      sparta.globalDetails.secondsPerEra,
      reserve.globalDetails.spartaBalance,
    )
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

  return (
    <Row>
      <Col xs="auto" className="">
        <Card xs="auto" className="card-320">
          <Card.Header className="">{t('daoVaultDetails')}</Card.Header>
          {!isLoading() ? (
            <Card.Body>
              <Row className="my-1">
                <Col xs="auto" className="text-card">
                  {t('totalWeight')}
                </Col>
                <Col className="text-end output-card">
                  {formatFromWei(getTotalWeight())}
                  <Icon icon="spartav2" size="20" className="mb-1 ms-1" />
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
        <Card className="card-320 card-underlay">
          <Card.Header>{t('memberDetails')}</Card.Header>
          {!isLoading() ? (
            <>
              <Card.Body>
                <Row className="my-1">
                  <Col xs="auto" className="text-card">
                    {t('yourWeight')}
                  </Col>
                  <Col className="text-end output-card">
                    {formatFromWei(
                      getVaultWeights(
                        pool.poolDetails,
                        dao.daoDetails,
                        bond.bondDetails,
                      ),
                    )}
                    <Icon icon="spartav2" size="20" className="mb-1 ms-1" />
                  </Col>
                </Row>
                <Row className="my-1">
                  <Col xs="auto" className="text-card">
                    {t('harvestable')}
                  </Col>
                  <Col className="text-end output-card">
                    {reserve.globalDetails.emissions
                      ? BN(dao.member?.weight).plus(bond.member?.weight) > 0
                        ? `${formatFromWei(getClaimable())} SPARTA`
                        : '0.00 SPARTA'
                      : t('incentivesDisabled')}
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer className="card-body text-center">
                {reserve.globalDetails.emissions ? (
                  <Button
                    className="w-100"
                    onClick={() => dispatch(daoHarvest(wallet))}
                    disabled={
                      BN(dao.member?.weight).plus(bond.member?.weight) <= 0
                    }
                  >
                    {t('harvestAll')}
                  </Button>
                ) : (
                  <Button className="w-100" disabled>
                    {t('incentivesDisabled')}
                  </Button>
                )}
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
            <Col xs="auto" key={i.address}>
              <Card className="card-320">
                <Card.Body>
                  <Row className="mb-2">
                    <Col xs="auto" className="position-relative">
                      <img
                        className="mr-3"
                        src={getToken(i.tokenAddress)?.symbolUrl}
                        alt={getToken(i.tokenAddress)?.symbol}
                        height="50px"
                      />
                      <img
                        height="25px"
                        src={spartaIcon}
                        alt="Sparta LP token icon"
                        className="position-absolute"
                        style={{ right: '8px', bottom: '7px' }}
                      />
                    </Col>
                    <Col xs="auto" className="pl-1">
                      <h3 className="mb-0">
                        {getToken(i.tokenAddress)?.symbol}p
                      </h3>
                      <Link to={`/pools/liquidity?asset1=${i.tokenAddress}`}>
                        <p className="text-sm-label-alt">
                          {t('obtain')} {getToken(i.tokenAddress)?.symbol}p
                          <Icon
                            icon="scan"
                            size="13"
                            fill={isLightMode ? 'black' : 'white'}
                            className="ms-1"
                          />
                        </p>
                      </Link>
                    </Col>
                  </Row>

                  <Row className="my-1">
                    <Col xs="auto" className="text-card">
                      {t('balance')}
                    </Col>
                    <Col className="text-end output-card">
                      {formatFromWei(i.balance)}{' '}
                      {getToken(i.tokenAddress)?.symbol}p
                    </Col>
                  </Row>

                  <Row className="my-1">
                    <Col xs="auto" className="text-card">
                      {t('staked')}
                    </Col>
                    <Col className="text-end output-card">
                      {formatFromWei(i.staked)}{' '}
                      {getToken(i.tokenAddress)?.symbol}p
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer>
                  <Row>
                    <Col xs="6" className="pe-1">
                      <DaoDepositModal
                        tokenAddress={i.tokenAddress}
                        disabled={i.balance <= 0}
                      />
                    </Col>
                    <Col xs="6" className="ps-1">
                      <Button
                        className="w-100"
                        onClick={() => dispatch(daoWithdraw(i.address, wallet))}
                        disabled={i.staked <= 0 || getLockedSecs()[0] > 0}
                      >
                        {t('withdrawAll')}
                      </Button>
                    </Col>
                  </Row>
                </Card.Footer>
              </Card>
            </Col>
          ))}
    </Row>
  )
}

export default DaoVault

import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  Button,
  Card,
  Col,
  Row,
  Popover,
  OverlayTrigger,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import { usePool } from '../../../store/pool'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import { useDao } from '../../../store/dao/selector'
import {
  daoHarvest,
  daoGlobalDetails,
  daoMemberDetails,
  daoVaultWeight,
  daoDepositTimes,
  getDaoDetails,
} from '../../../store/dao/actions'
import { useReserve } from '../../../store/reserve/selector'
import { useSparta } from '../../../store/sparta'
import { bondVaultWeight, getBondDetails, useBond } from '../../../store/bond'
import { Icon } from '../../../components/Icons/icons'
import { getVaultWeights } from '../../../utils/math/nonContract'
import { getPool } from '../../../utils/math/utils'
import { calcCurrentRewardDao } from '../../../utils/math/dao'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import DaoVaultItem from './DaoVaultItem'

const DaoVault = () => {
  const reserve = useReserve()
  const wallet = useWeb3React()
  const dao = useDao()
  const bond = useBond()
  const pool = usePool()
  const sparta = useSparta()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [txnLoading, setTxnLoading] = useState(false)

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
    await dispatch(daoHarvest(wallet))
    setTxnLoading(false)
  }

  return (
    <Row>
      <Col xs="auto" className="">
        <Card xs="auto" className="card-320" style={{ minHeight: '202' }}>
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

          <Col>
            <Card.Footer>
              <Link to="/pools/liquidity">
                <Button className="w-100">{t('joinPools')}</Button>
              </Link>
            </Card.Footer>
          </Col>
        </Card>
      </Col>

      <Col xs="auto">
        <Card className="card-320 card-underlay" style={{ minHeight: '202' }}>
          <Card.Header>{t('memberDetails')}</Card.Header>
          {!isLoading() ? (
            <>
              <Card.Body>
                <Row className="my-1">
                  <Col xs="auto" className="text-card">
                    {t('yourWeight')}
                  </Col>
                  <Col className="text-end output-card">
                    {!wallet.account ? (
                      t('connectWallet')
                    ) : (
                      <>
                        {formatFromWei(
                          getVaultWeights(
                            pool.poolDetails,
                            dao.daoDetails,
                            bond.bondDetails,
                          ),
                        )}
                        <Icon icon="spartav2" size="20" className="mb-1 ms-1" />
                      </>
                    )}
                  </Col>
                </Row>
                <Row className="my-1">
                  <Col xs="auto" className="text-card">
                    {t('harvestable')}
                  </Col>
                  <Col className="text-end output-card">
                    {reserve.globalDetails.emissions
                      ? !wallet.account
                        ? t('connectWallet')
                        : `${formatFromWei(getClaimable())} SPARTA`
                      : t('incentivesDisabled')}
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                {!wallet.account ? (
                  <>
                    {reserve.globalDetails.emissions ? (
                      <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Popover>
                            <Popover.Header />
                            <Popover.Body>
                              {t('connectWalletFirst')}
                            </Popover.Body>
                          </Popover>
                        }
                      >
                        <Button
                          className="w-100"
                          onClick={() => handleHarvest()}
                          disabled={!wallet.account || getClaimable() <= 0}
                        >
                          {t('harvestAll')}
                          {txnLoading && (
                            <Icon
                              icon="cycle"
                              size="20"
                              className="anim-spin ms-1"
                            />
                          )}
                        </Button>
                      </OverlayTrigger>
                    ) : (
                      <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Popover>
                            <Popover.Header />
                            <Popover.Body>
                              {t('connectWalletFirst')}
                            </Popover.Body>
                          </Popover>
                        }
                      >
                        <Button className="w-100" disabled>
                          {t('incentivesDisabled')}
                        </Button>
                      </OverlayTrigger>
                    )}
                  </>
                ) : (
                  <>
                    {reserve.globalDetails.emissions ? (
                      <Button
                        className="w-100"
                        onClick={() => handleHarvest()}
                        disabled={getClaimable() <= 0}
                      >
                        {t('harvestAll')}
                        {txnLoading && (
                          <Icon
                            icon="cycle"
                            size="20"
                            className="anim-spin ms-1"
                          />
                        )}
                      </Button>
                    ) : (
                      <Button className="w-100" disabled>
                        {t('incentivesDisabled')}
                      </Button>
                    )}
                  </>
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
            <DaoVaultItem key={i.address} i={i} claimable={getClaimable()} />
          ))}
    </Row>
  )
}

export default DaoVault

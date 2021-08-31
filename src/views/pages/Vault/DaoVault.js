import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import spartaIcon from '../../../assets/tokens/sparta-lp.svg'
import { usePool } from '../../../store/pool'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import { useDao } from '../../../store/dao/selector'
import {
  daoHarvest,
  daoWithdraw,
  daoGlobalDetails,
  daoMemberDetails,
} from '../../../store/dao/actions'
import { useReserve } from '../../../store/reserve/selector'
import DaoDepositModal from './Components/DaoDepositModal'
import { useSparta } from '../../../store/sparta'
import { bondMemberDetails, useBond } from '../../../store/bond'
import { Icon } from '../../../components/Icons/icons'
import {
  calcFeeBurn,
  getSecsSince,
  getTimeUntil,
} from '../../../utils/math/nonContract'
import { calcShare } from '../../../utils/math/utils'

const DaoVault = () => {
  const reserve = useReserve()
  const wallet = useWallet()
  const dao = useDao()
  const bond = useBond()
  const pool = usePool()
  const sparta = useSparta()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  // const [showDetails, setShowDetails] = useState(false)

  const isLightMode = window.localStorage.getItem('theme')

  const getToken = (_tokenAddr) =>
    pool.tokenDetails.filter((i) => i.address === _tokenAddr)[0]

  const [trigger0, settrigger0] = useState(0)
  const getData = () => {
    dispatch(daoGlobalDetails(wallet))
    dispatch(daoMemberDetails(wallet))
    dispatch(bondMemberDetails(wallet))
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

  const getFeeBurn = (_amount) => {
    const burnFee = calcFeeBurn(sparta.globalDetails.feeOnTransfer, _amount)
    return burnFee
  }

  const getLockedSecs = () => {
    const depositTime = BN('1623400000') // Remove this line after next DaoVault deploy
    // const depositTime = BN(dao.member?.depositTime) // Uncomment this line after next DaoVault deploy
    const lockUpSecs = BN('86400')
    const [units, time] = getTimeUntil(depositTime.plus(lockUpSecs), t)
    return [units, time]
  }

  const getClaimable = () => {
    const secondsSince = getSecsSince(dao.member?.lastHarvest)
    // get the members share
    const weight = BN(dao.member?.weight).plus(bond.member?.weight)
    const reserveShare = BN(reserve.globalDetails.spartaBalance).div(
      dao.global.erasToEarn,
    )
    const vaultShare = reserveShare.times(dao.global.daoClaim).div('10000')
    const totalWeight = BN(dao.global?.totalWeight).plus(bond.global?.weight)
    const share = calcShare(weight, totalWeight, vaultShare)
    // get the members claimable amount
    const claimAmount = share.times(secondsSince).div(dao.global.secondsPerEra)
    const feeBurn = getFeeBurn(claimAmount) // feeBurn - Reserve to User
    return BN(claimAmount).minus(feeBurn)
  }

  // const toggleCollapse = () => {
  //   setShowDetails(!showDetails)
  // }

  return (
    <Row>
      <Col xs="auto" className="">
        <Card xs="auto" className="card-320">
          <Card.Header className="">{t('daoVaultDetails')}</Card.Header>
          <Card.Body>
            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('totalWeight')}
              </Col>
              <Col className="text-end output-card">
                {formatFromWei(
                  BN(dao.global?.totalWeight).plus(bond.global?.weight),
                  0,
                )}{' '}
                SPARTA
              </Col>
            </Row>
            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('memberCount')}
              </Col>
              <Col className="text-end output-card">
                {dao.global?.memberCount} {t('members')}
              </Col>
            </Row>
            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('lockupPeriod')}
              </Col>
              <Col className="text-end output-card">24 {t('hours')}</Col>
            </Row>
          </Card.Body>
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
          <Card.Body>
            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('yourWeight')}
              </Col>
              <Col className="text-end output-card">
                {BN(dao.member?.weight).plus(bond.member?.weight) > 0
                  ? BN(dao.member?.weight)
                      .plus(bond.member?.weight)
                      .div(
                        BN(dao.global?.totalWeight).plus(bond.global?.weight),
                      )
                      .times(100)
                      .toFixed(4)
                  : '0.00'}
                %
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
            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('Locked for')}
              </Col>
              <Col className="text-end output-card">
                {getLockedSecs()[0] > 0
                  ? getLockedSecs()[0] + getLockedSecs()[1]
                  : t('unlocked')}
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer className="card-body text-center">
            {reserve.globalDetails.emissions ? (
              <Button
                className="w-100"
                onClick={() => dispatch(daoHarvest(wallet))}
                disabled={BN(dao.member?.weight).plus(bond.member?.weight) <= 0}
              >
                {t('harvestAll')}
              </Button>
            ) : (
              <Button className="w-100" disabled>
                {t('incentivesDisabled')}
              </Button>
            )}
          </Card.Footer>
        </Card>
      </Col>

      {pool?.poolDetails?.length > 0 &&
        pool.poolDetails
          .filter((i) => i.curated === true || i.staked > 0)
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

                    {/* <Col className="text-end my-auto">
                    {showDetails && (
                      <i
                        role="button"
                        className="icon-small icon-up icon-light"
                        onClick={() => toggleCollapse()}
                      />
                    )}
                    {!showDetails && (
                      <i
                        role="button"
                        className="icon-small icon-down icon-light"
                        onClick={() => toggleCollapse()}
                      />
                    )}
                  </Col> */}
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

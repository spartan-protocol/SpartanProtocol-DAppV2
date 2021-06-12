import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Card, Col, Row } from 'reactstrap'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import spartaIcon from '../../../assets/img/spartan_lp.svg'
import { usePool } from '../../../store/pool'
import { BN, formatFromUnits, formatFromWei } from '../../../utils/bigNumber'
import { useDao } from '../../../store/dao/selector'
import {
  daoHarvest,
  daoWithdraw,
  daoGlobalDetails,
  daoMemberDetails,
} from '../../../store/dao/actions'
import { calcFeeBurn, calcShare } from '../../../utils/web3Utils'
import { useReserve } from '../../../store/reserve/selector'
import DaoDepositModal from './Components/DaoDepositModal'
import { useSparta } from '../../../store/sparta'
import { bondMemberDetails, useBond } from '../../../store/bond'

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
    const timeStamp = BN(Date.now()).div(1000)
    const depositTime = BN('1623400000') // Remove this line after next DaoVault deploy
    // const depositTime = BN(dao.member?.depositTime) // Uncomment this line after next DaoVault deploy
    const lockUpSecs = BN('86400')
    const secondsLeft = depositTime.plus(lockUpSecs).minus(timeStamp)
    if (secondsLeft > 86400) {
      return [formatFromUnits(secondsLeft.div(60).div(60).div(24), 2), ' days']
    }
    if (secondsLeft > 3600) {
      return [formatFromUnits(secondsLeft.div(60).div(60), 2), ' hours']
    }
    if (secondsLeft > 60) {
      return [formatFromUnits(secondsLeft.div(60), 2), ' minutes']
    }
    if (secondsLeft > 0) {
      return [formatFromUnits(secondsLeft, 0), ' seconds']
    }
    return [0, ' secs (now)']
  }

  const getClaimable = () => {
    // get seconds passed since last harvest
    const timeStamp = BN(Date.now()).div(1000)
    const lastHarvest = BN(dao.member?.lastHarvest)
    const secondsSince = timeStamp.minus(lastHarvest)
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
    <>
      <Col xs="auto">
        <Card className="card-body card-320 pb-2 card-underlay">
          <Col>
            <h3>{t('daoVaultDetails')}</h3>
            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('totalWeight')}
              </Col>
              <Col className="text-right output-card">
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
              <Col className="text-right output-card">
                {dao.global?.memberCount} {t('members')}
              </Col>
            </Row>
            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('lockupPeriod')}
              </Col>
              <Col className="text-right output-card">24 Hours</Col>
            </Row>
            <Row className="card-body text-center">
              <Col xs="12" className="p-0">
                <Link to="/pools/liquidity">
                  <Button className="btn btn-primary p-2" block>
                    {t('joinPools')}
                  </Button>
                </Link>
              </Col>
            </Row>
          </Col>
        </Card>
      </Col>

      <Col xs="auto">
        <Card className="card-body card-320 pb-2 card-underlay">
          <Col>
            <h3>{t('memberDetails')}</h3>
            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('yourWeight')}
              </Col>
              <Col className="text-right output-card">
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
              <Col className="text-right output-card">
                {BN(dao.member?.weight).plus(bond.member?.weight) > 0 &&
                dao.member?.isMember
                  ? formatFromWei(getClaimable())
                  : '0.00'}{' '}
                SPARTA
              </Col>
            </Row>
            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('Locked for')}
              </Col>
              <Col className="text-right output-card">
                {getLockedSecs()[0] + getLockedSecs()[1]}
              </Col>
            </Row>
            <Row className="card-body text-center">
              <Col xs="12" className="p-0">
                <Button
                  className="btn btn-primary p-2"
                  block
                  onClick={() => dispatch(daoHarvest(wallet))}
                  disabled={
                    BN(dao.member?.weight).plus(bond.member?.weight) <= 0
                  }
                >
                  {t('harvestAll')}
                </Button>
              </Col>
            </Row>
          </Col>
        </Card>
      </Col>

      {pool?.poolDetails?.length > 0 &&
        pool.poolDetails
          .filter((i) => i.curated === true || i.staked > 0)
          .map((i) => (
            <Col xs="auto" key={i.address}>
              <Card className="card-body card-320 pb-2">
                <Row className="mb-2">
                  <Col xs="auto" className="pr-0">
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
                        <i className="icon-scan icon-mini ml-1" />
                      </p>
                    </Link>
                  </Col>

                  {/* <Col className="text-right my-auto">
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
                  <Col className="text-right output-card">
                    {formatFromWei(i.balance)}{' '}
                    {getToken(i.tokenAddress)?.symbol}p
                  </Col>
                </Row>

                <Row className="my-1">
                  <Col xs="auto" className="text-card">
                    {t('staked')}
                  </Col>
                  <Col className="text-right output-card">
                    {formatFromWei(i.staked)} {getToken(i.tokenAddress)?.symbol}
                    p
                  </Col>
                </Row>

                <Row className="card-body text-center pt-3 pb-2">
                  <Col xs="6" className="p-0 pr-1">
                    <DaoDepositModal
                      tokenAddress={i.tokenAddress}
                      disabled={i.balance <= 0}
                    />
                  </Col>
                  <Col xs="6" className="p-0 pl-1">
                    <Button
                      color="primary"
                      className="btn btn-primary p-2"
                      block
                      onClick={() => dispatch(daoWithdraw(i.address, wallet))}
                      disabled={i.staked <= 0 || getLockedSecs()[0] > 0}
                    >
                      {t('withdrawAll')}
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
    </>
  )
}

export default DaoVault

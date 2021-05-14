/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Card, Col, Row } from 'reactstrap'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import spartaIcon from '../../../assets/img/spartan_lp.svg'
import { usePool } from '../../../store/pool'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import { useDao } from '../../../store/dao/selector'
import {
  daoHarvest,
  daoWithdraw,
  getDaoMemberLastHarvest,
  getDaoVaultGlobalDetails,
  getDaoVaultMemberDetails,
} from '../../../store/dao/actions'
import { calcShare } from '../../../utils/web3Utils'
import { useReserve } from '../../../store/reserve/selector'
import DepositModal from './Components/DepositModal'

const DaoVault = () => {
  const reserve = useReserve()
  const wallet = useWallet()
  const dao = useDao()
  const pool = usePool()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  // const [showDetails, setShowDetails] = useState(false)
  const [tokenAddress, settokenAddress] = useState('')
  const [showModal, setShowModal] = useState(false)

  const getToken = (_tokenAddr) =>
    pool.tokenDetails.filter((i) => i.address === _tokenAddr)[0]

  const toggleModal = (_tokenAddr) => {
    settokenAddress(_tokenAddr)
    setShowModal(!showModal)
  }

  const [trigger0, settrigger0] = useState(0)
  const getData = () => {
    dispatch(getDaoVaultGlobalDetails())
    dispatch(getDaoVaultMemberDetails(wallet.account))
    dispatch(getDaoMemberLastHarvest(wallet.account))
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

  const getClaimable = () => {
    // get seconds passed since last harvest
    const timeStamp = BN(Date.now()).div(1000)
    const lastHarvest = BN(dao.lastHarvest)
    const secondsSince = timeStamp.minus(lastHarvest)
    // get the members share
    const weight = BN(dao.memberDetails.weight)
    const reserveShare = BN(reserve.globalDetails.spartaBalance).div(
      dao.globalDetails.erasToEarn,
    )
    const vaultShare = reserveShare
      .times(dao.globalDetails.daoClaim)
      .div('10000')
    const totalWeight = BN(dao.globalDetails.totalWeight)
    const share = calcShare(weight, totalWeight, vaultShare)
    // get the members claimable amount
    const claimAmount = share
      .times(secondsSince)
      .div(dao.globalDetails.secondsPerEra)
    return claimAmount
  }

  // const toggleCollapse = () => {
  //   setShowDetails(!showDetails)
  // }

  return (
    <>
      <Col xs="auto">
        <Card
          className="card-body card-320 pb-2 card-underlay"
          style={{ backgroundColor: '#25212D' }}
        >
          <Col>
            <h3>{t('daoVaultDetails')}</h3>
            <Row className="my-2">
              <Col xs="auto" className="text-card">
                {t('totalWeight')}
              </Col>
              <Col className="text-right output-card">
                {formatFromWei(dao.globalDetails?.totalWeight, 0)} SPARTA
              </Col>
            </Row>
            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('memberCount')}
              </Col>
              <Col className="text-right output-card">
                {dao.globalDetails?.memberCount} {t('members')}
              </Col>
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
        <Card
          className="card-body card-320 pb-2 card-underlay"
          style={{ backgroundColor: '#25212D' }}
        >
          <Col>
            <h3>{t('memberDetails')}</h3>
            <Row className="my-2">
              <Col xs="auto" className="text-card">
                {t('yourWeight')}
              </Col>
              <Col className="text-right output-card">
                {dao.memberDetails?.weight > 0
                  ? BN(dao.memberDetails?.weight)
                      .div(dao.globalDetails?.totalWeight)
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
                {dao.memberDetails?.weight > 0
                  ? formatFromWei(getClaimable())
                  : '0.00'}{' '}
                SPARTA
              </Col>
            </Row>
            <Row className="card-body text-center">
              <Col xs="12" className="p-0">
                <Button
                  className="btn btn-primary p-2"
                  block
                  onClick={() => dispatch(daoHarvest())}
                  disabled={dao.memberDetails?.weight <= 0}
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
                    <Button
                      color="primary"
                      className="btn btn-primary p-2"
                      block
                      onClick={() => toggleModal(i.tokenAddress)}
                      disabled={i.balance <= 0}
                    >
                      {t('deposit')}
                    </Button>
                  </Col>
                  <Col xs="6" className="p-0 pl-1">
                    <Button
                      color="primary"
                      className="btn btn-primary p-2"
                      block
                      onClick={() => dispatch(daoWithdraw(i.address))}
                      disabled={i.staked <= 0}
                    >
                      {t('withdrawAll')}
                    </Button>
                  </Col>
                </Row>
                {showModal && (
                  <DepositModal
                    showModal={showModal}
                    toggleModal={toggleModal}
                    tokenAddress={tokenAddress}
                  />
                )}
              </Card>
            </Col>
          ))}
    </>
  )
}

export default DaoVault

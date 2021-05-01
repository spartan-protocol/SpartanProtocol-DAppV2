/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Card, Col, Row } from 'reactstrap'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import spartaIcon from '../../../assets/img/spartan_lp.svg'
import { usePool } from '../../../store/pool'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import { useDao } from '../../../store/dao/selector'
import {
  daoDeposit,
  daoHarvest,
  daoWithdraw,
  getDaoMemberLastHarvest,
  getDaoVaultGlobalDetails,
  getDaoVaultMemberDetails,
} from '../../../store/dao/actions'
import { calcShare } from '../../../utils/web3Utils'
import { useReserve } from '../../../store/reserve/selector'

const DaoVault = () => {
  const reserve = useReserve()
  const wallet = useWallet()
  const dao = useDao()
  const pool = usePool()
  const dispatch = useDispatch()
  const [showDetails, setShowDetails] = useState(false)
  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

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

  const toggleCollapse = () => {
    setShowDetails(!showDetails)
  }

  return (
    <>
      <Col xs="auto">
        <Card
          className="card-body card-320"
          style={{ backgroundColor: '#25212D' }}
        >
          <Col>
            <h3>DaoVault Details</h3>
            <Row className="my-1">
              <Col xs="auto" className="text-card">
                Total Weight
              </Col>
              <Col className="text-right output-card">
                {formatFromWei(dao.globalDetails?.totalWeight, 0)} SPARTA
              </Col>
            </Row>
            <Row className="my-1">
              <Col xs="auto" className="text-card">
                Member Count
              </Col>
              <Col className="text-right output-card">
                {dao.globalDetails?.memberCount} Members
              </Col>
            </Row>
            <Row className="text-center mt-2">
              <Col xs="12" className="p-1">
                <Button className="btn-sm btn-primary h-100" disabled>
                  Join Pools
                </Button>
              </Col>
            </Row>
          </Col>
        </Card>
      </Col>

      <Col xs="auto">
        <Card
          className="card-body card-320"
          style={{ backgroundColor: '#25212D' }}
        >
          <Col>
            <h3>Member Details</h3>
            <Row className="my-1">
              <Col xs="auto" className="text-card">
                Your Weight
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
                Harvestable
              </Col>
              <Col className="text-right output-card">
                {dao.memberDetails?.weight > 0
                  ? formatFromWei(getClaimable())
                  : '0.00'}{' '}
                SPARTA
              </Col>
            </Row>
            <Row className="text-center mt-2">
              <Col xs="12" className="p-1">
                <Button
                  className="btn-sm btn-primary h-100"
                  onClick={() => dispatch(daoHarvest())}
                >
                  Harvest All
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
              <Card className="card-body card-320">
                <Row className="mt-n3">
                  <Col xs="auto" className="">
                    <h3 className="mt-4">
                      <img
                        className=""
                        src={getToken(i.tokenAddress)?.symbolUrl}
                        alt={getToken(i.tokenAddress)?.symbol}
                        height="50px"
                      />
                      <img
                        height="25px"
                        src={spartaIcon}
                        alt="Sparta LP token icon"
                        className="pr-2 ml-n3 mt-4"
                      />
                      {getToken(i.tokenAddress)?.symbol}p
                    </h3>
                  </Col>

                  <Col className="text-right my-auto">
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
                  </Col>
                </Row>

                <Row className="my-1">
                  <Col xs="auto" className="text-card">
                    Balance
                  </Col>
                  <Col className="text-right output-card">
                    {formatFromWei(i.balance)}{' '}
                    {getToken(i.tokenAddress)?.symbol}p
                  </Col>
                </Row>

                <Row className="my-1">
                  <Col xs="auto" className="text-card">
                    Staked
                  </Col>
                  <Col className="text-right output-card">
                    {formatFromWei(i.staked)} {getToken(i.tokenAddress)?.symbol}
                    p
                  </Col>
                </Row>

                <Row className="text-center mt-2">
                  <Col xs="6" className="p-1">
                    <Button
                      color="primary"
                      className="btn-sm h-100 w-100"
                      onClick={() => dispatch(daoDeposit(i.address, i.balance))}
                    >
                      Deposit
                    </Button>
                  </Col>
                  <Col xs="6" className="p-1">
                    <Button
                      color="primary"
                      className="btn-sm h-100 w-100"
                      onClick={() => dispatch(daoWithdraw(i.address))}
                    >
                      Withdraw
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

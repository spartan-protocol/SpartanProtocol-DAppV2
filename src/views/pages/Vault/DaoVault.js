import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Button, Card, Row, Col, ButtonGroup } from 'reactstrap'
import { useWallet } from '@binance-chain/bsc-use-wallet'
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

  return (
    <>
      <Row className="row-480">
        <Col xs="auto">
          <Card className="card-480">
            <Col>
              <h4>DaoVault Details</h4>
              <p>
                Total Weight: {formatFromWei(dao.globalDetails?.totalWeight, 0)}{' '}
                SPARTA
              </p>
              <p>Member Count: {dao.globalDetails?.memberCount}</p>
            </Col>
          </Card>
        </Col>
        <Col xs="auto">
          <Card className="card-480">
            <Col>
              <h4>DaoMember</h4>
              <p>
                Your Weight:{' '}
                {BN(dao.memberDetails?.weight)
                  .div(dao.globalDetails?.totalWeight)
                  .times(100)
                  .toFixed(4)}
                %
              </p>
              <p>Harvestable: {formatFromWei(getClaimable())} SPARTA</p>
            </Col>
            <Col xs="12" className="text-center">
              <Button
                color="primary"
                type="Button"
                onClick={() => dispatch(daoHarvest())}
              >
                Harvest
              </Button>
            </Col>
          </Card>
        </Col>
        {pool?.poolDetails?.length > 0 &&
          pool.poolDetails
            .filter((i) => i.curated === true || i.staked > 0)
            .map((i) => (
              <Col xs="auto" key={i.address}>
                <Card className="card-480">
                  <Col>
                    <h4>{getToken(i.tokenAddress)?.symbol}p</h4>
                    <p>Balance: {formatFromWei(i.balance)}</p>
                    <p>Staked: {formatFromWei(i.staked)}</p>
                  </Col>
                  <Col xs="12" className="text-center">
                    <ButtonGroup>
                      <Button
                        color="primary"
                        type="Button"
                        onClick={() =>
                          dispatch(daoDeposit(i.address, i.balance))
                        }
                      >
                        Deposit
                      </Button>
                      <Button
                        color="primary"
                        type="Button"
                        onClick={() => dispatch(daoWithdraw(i.address))}
                      >
                        Withdraw
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Card>
              </Col>
            ))}
      </Row>
    </>
  )
}

export default DaoVault

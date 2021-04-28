/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import {
  Button,
  Card,
  CardBody,
  Row,
  Col,
  ButtonGroup,
  Container,
} from 'reactstrap'
import { Link } from 'react-router-dom'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import { usePoolFactory } from '../../../store/poolFactory'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import spartaIcon from '../../../assets/img/spartan_synth.svg'
import { synthDeposit, synthWithdraw } from '../../../store/synth/actions'
import { useSynth } from '../../../store/synth/selector'
import { useDao } from '../../../store/dao/selector'
import {
  daoDeposit,
  daoHarvest,
  daoWithdraw,
  getDaoMemberLastHarvest,
  getDaoVaultGlobalDetails,
  getDaoVaultMemberDetails,
} from '../../../store/dao/actions'

const DaoVault = () => {
  const wallet = useWallet()
  const dao = useDao()
  const poolFactory = usePoolFactory()
  const dispatch = useDispatch()
  const getToken = (tokenAddress) =>
    poolFactory.tokenDetails.filter((i) => i.address === tokenAddress)[0]

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

  return (
    <>
      <Row className="row-480">
        <Col xs="12" lg="6" className="col-480">
          <Card className="card-480">
            <Col>
              <h4>Global Details</h4>
              <p>Min Time: {dao.globalDetails?.minTime}</p>
              <p>
                Total Weight: {formatFromWei(dao.globalDetails?.totalWeight)}
              </p>
              <p>Eras to Earn: {dao.globalDetails?.erasToEarn}</p>
              <p>Block Delay: {dao.globalDetails?.blockDelay}</p>
              <p>Vault Claim: {dao.globalDetails?.vaultClaim}</p>
            </Col>
          </Card>
        </Col>
        <Col xs="12" lg="6" className="col-480">
          <Card className="card-480">
            <Col>
              <h4>DaoMember</h4>
              <p>
                Your Weight: {formatFromWei(dao.memberDetails?.totalWeight)}
              </p>
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
        {poolFactory?.poolDetails?.length > 0 &&
          poolFactory.poolDetails
            .filter((i) => i.curated === true || i.staked > 0)
            .map((i) => (
              <Col xs="12" lg="6" className="col-480" key={i.address}>
                <Card className="card-480">
                  <Col>
                    <h4>{getToken(i.tokenAddress)?.symbol}-SPS</h4>
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

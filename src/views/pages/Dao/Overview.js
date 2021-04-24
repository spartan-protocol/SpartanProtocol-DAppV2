/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { Button, Card, CardBody, Row, Col } from 'reactstrap'

import UncontrolledTooltip from 'reactstrap/lib/UncontrolledTooltip'
import { useDispatch } from 'react-redux'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import Stake from './Stake'
import { daoHarvest, getDaoMemberLastHarvest } from '../../../store/dao/actions'
import { useDao } from '../../../store/dao/selector'
import { BN, formatFromUnits, formatFromWei } from '../../../utils/bigNumber'
import { useDaoVault } from '../../../store/daoVault/selector'

const Overview = () => {
  const wallet = useWallet()
  const daoVault = useDaoVault()
  const dao = useDao()
  const dispatch = useDispatch()
  const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  const [trigger, settrigger] = useState(0)

  const formatDate = (unixTime) => {
    const date = new Date(unixTime * 1000)
    return date.toLocaleDateString()
  }

  useEffect(async () => {
    dispatch(getDaoMemberLastHarvest(wallet.account))
    await pause(7500)
    settrigger(trigger + 1)
  }, [trigger])

  return (
    <>
      <div className="content">
        <Row className="card-body justify-content-center">
          <Col xs="6" xl="5">
            <h2 className="d-inline text-title ml-1">DaoVault</h2>
          </Col>
          <Col xs="6" xl="4" />
        </Row>

        <Row className="justify-content-center">
          <Col xs="12" xl="9">
            <Row>
              <Col xs="12">
                <Card
                  className="card-body"
                  style={{ backgroundColor: '#1D171F' }}
                >
                  <CardBody>
                    <Row>
                      <Col xs="12" md="5" lg="4">
                        <h2>
                          Claim rewards
                          <i
                            className="icon-small icon-info icon-dark ml-2"
                            id="tooltipAddBase"
                            role="button"
                          />
                          <UncontrolledTooltip
                            placement="right"
                            target="tooltipAddBase"
                          >
                            The quantity of & SPARTA you are adding to the pool.
                          </UncontrolledTooltip>
                        </h2>
                      </Col>

                      <Col xs="6" md="2" lg="2">
                        <div className="card-text">Rewards:</div>
                        <div className="subtitle-amount d-none d-md-block">
                          {formatFromWei(dao.harvestAmount.toString())}
                          {/* <i className="icon-extra-small icon-spinner icon-dark ml-1" /> */}
                        </div>
                      </Col>
                      <Col xs="6" className="d-block d-md-none">
                        <div className="subtitle-amount text-right">
                          {formatFromWei(dao.harvestAmount.toString())}
                          {/* <i className="icon-extra-small icon-spinner icon-dark ml-1" /> */}
                        </div>
                      </Col>

                      <Col xs="6" md="2" lg="2">
                        <div className="card-text">DAO Weight:</div>
                        <div className="subtitle-amount d-none d-md-block">
                          {daoVault.memberWeight > 0 &&
                            `${formatFromUnits(
                              BN(daoVault.memberWeight.toString())
                                .div(daoVault.daoTotalWeight.toString())
                                .times(100),
                            )}%`}
                          {daoVault.memberWeight <= 0 && 'Not a DAO member'}
                        </div>
                      </Col>
                      <Col xs="6" className="d-block d-md-none">
                        <div className="subtitle-amount text-right">
                          {daoVault.memberWeight > 0 &&
                            `${formatFromUnits(
                              BN(daoVault.memberWeight.toString())
                                .div(daoVault.daoTotalWeight.toString())
                                .times(100),
                            )}%`}
                          {daoVault.memberWeight <= 0 && 'Not a DAO member'}
                        </div>
                      </Col>

                      <Col xs="6" md="3" lg="2">
                        <div className="card-text">Last Harvest:</div>
                        <div className="subtitle-amount d-none d-md-block">
                          {dao.lastHarvest > 0 && formatDate(dao.lastHarvest)}
                        </div>
                      </Col>
                      <Col xs="6" className="d-block d-md-none">
                        <div className="subtitle-amount text-right">
                          {dao.lastHarvest > 0 && formatDate(dao.lastHarvest)}
                        </div>
                      </Col>

                      <Col
                        xs="9"
                        sm="6"
                        lg="2"
                        className="mx-auto my-lg-auto mt-2 p-0"
                      >
                        <Button
                          type="Button"
                          className="btn btn-primary w-100"
                          onClick={() => dispatch(daoHarvest())}
                        >
                          Harvest
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <div className="page-header">
                  Stake{' '}
                  <i
                    className="icon-small icon-info icon-dark ml-2"
                    id="tooltipAddBase"
                    role="button"
                  />
                  <UncontrolledTooltip
                    placement="right"
                    target="tooltipAddBase"
                  >
                    The quantity of & SPARTA you are adding to the pool.
                  </UncontrolledTooltip>
                </div>
                <br />
                <Stake />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Overview

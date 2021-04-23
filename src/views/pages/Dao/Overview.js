/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import {
  Button,
  Card,
  CardBody,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap'
import classnames from 'classnames'

import UncontrolledTooltip from 'reactstrap/lib/UncontrolledTooltip'
import { useDispatch } from 'react-redux'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import LockEarn from './LockEarn'
// import Proposals from './Proposals'
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
  const [activeTab, setActiveTab] = useState('1')

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  const formatDate = (unixTime) => {
    const date = new Date(unixTime * 1000)
    return date.toLocaleDateString()
  }

  const lastHarvestLoop = async () => {
    dispatch(getDaoMemberLastHarvest(wallet.account))
    await pause(10000)
    lastHarvestLoop()
  }

  useEffect(() => {
    lastHarvestLoop()
  }, [])

  return (
    <>
      <div className="content">
        <Row className="card-body justify-content-center">
          <Col xs="6" xl="5">
            <h2 className="d-inline text-title ml-1">Dao</h2>
          </Col>
          <Col xs="6" xl="4" />
        </Row>

        <Row className="justify-content-center">
          <Col xs="12" xl="9">
            <Row>
              <Col xs="12">
                <Row>
                  <Col sm={12}>
                    <Nav className="nav-tabs-custom card-body" pills>
                      <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === '1' })}
                          onClick={() => {
                            toggle('1')
                          }}
                        >
                          Lock & earn
                        </NavLink>
                      </NavItem>
                      {/* <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === '2' })}
                          onClick={() => {
                            toggle('2')
                          }}
                        >
                          Proposals
                        </NavLink>
                      </NavItem> */}
                    </Nav>
                  </Col>
                </Row>

                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1" className="p-3">
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
                                The quantity of & SPARTA you are adding to the
                                pool.
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
                              {formatDate(dao.lastHarvest)}
                            </div>
                          </Col>
                          <Col xs="6" className="d-block d-md-none">
                            <div className="subtitle-amount text-right">
                              {formatDate(dao.lastHarvest)}
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
                      Lock & earn{' '}
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
                    <LockEarn />
                  </TabPane>
                  {/* <TabPane tabId="2" className="p-3">
                    <Proposals />
                  </TabPane> */}
                </TabContent>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Overview

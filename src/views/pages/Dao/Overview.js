/*eslint-disable*/
import React, { useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  Row,
  Col,
  Breadcrumb,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Alert,
} from 'reactstrap'
import classnames from 'classnames'

import UncontrolledTooltip from 'reactstrap/lib/UncontrolledTooltip'
import { useDispatch } from 'react-redux'
import LockEarn from './LockEarn'
import Proposals from './Proposals'
import { daoHarvest } from '../../../store/dao/actions'
import { useDao } from '../../../store/dao/selector'
import { BN, formatFromUnits, formatFromWei } from '../../../utils/bigNumber'
import { useDaoVault } from '../../../store/daoVault/selector'

const Overview = () => {
  const daoVault = useDaoVault()
  const dao = useDao()
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState('1')

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  return (
    <>
      <div className="content">

        <Row className="card-body justify-content-center">
          <Col xs="6" xl="5">
            <h2 className="d-inline text-title ml-1">Dao</h2>
          </Col>
          <Col xs="6" xl="4">

          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col xs="12" xl="9">
            <Row>
              <Col sm={10}>
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
                      <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === '2' })}
                          onClick={() => {
                            toggle('2')
                          }}
                        >
                          Proposals
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Col>
                </Row>

                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1" className="p-3">
                    <br />
                    <Card
                      className="card-body"
                      style={{ backgroundColor: '#1D171F' }}
                    >
                      <CardBody>
                        <Row>
                          <Col md={3} xs={12} className="mb-n4">
                            <h2 className="mt-3">
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
                          <Col md={2}>
                            <div className="card-text">Rewards</div>
                          </Col>
                          <Col md={2}>
                            <div className="card-text">DAO weight</div>
                          </Col>
                          <Col md={2}>
                            <div className="card-text">Latest harvest</div>
                          </Col>
                          <Col md={2} className="ml-auto mr-2 mt-2">
                            <Button
                              type="Button"
                              className="btn btn-primary"
                              onClick={() => dispatch(daoHarvest())}
                            >
                              Harvest
                            </Button>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={3} />
                          <Col md={2}>
                            <div className="title-card mt-n2 ">
                              <div className="subtitle-amount mt-n4">
                                {formatFromWei(dao.harvestAmount.toString())}
                                <i className="icon-extra-small icon-spinner icon-dark ml-1" />
                              </div>
                            </div>
                          </Col>
                          <Col md={2}>
                            <div className="title-card mt-n4">
                              {daoVault.memberWeight > 0 &&
                              formatFromUnits(
                                BN(daoVault.memberWeight.toString())
                                  .div(daoVault.daoTotalWeight.toString())
                                  .times(100),
                              )}
                              {daoVault.memberWeight <= 0 && 'Not a DAO member'}
                            </div>
                          </Col>
                          <Col md={2}>
                            <div className="title-card mt-n4">XXX</div>
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
                  <TabPane tabId="2" className="p-3">
                    <Proposals />
                  </TabPane>
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

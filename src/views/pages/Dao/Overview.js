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
import LockEarn from './LockEarn'
import Proposals from './Proposals'

const Overview = () => {
  const [activeTab, setActiveTab] = useState('1')

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  return (
    <>
      <div className="content">
        <Row>
          <Col md={2}>
            <Breadcrumb>Dao</Breadcrumb>
          </Col>
          <Col md={6} className="mt-3 ml-n5">
            <Alert color="primary">
              <span>
                By adding liquidity to the pools you receive LP tokens. Earn
                extra SPARTA by locking these LP tokens in the DAO
              </span>
            </Alert>
          </Col>
        </Row>

        <Col md={6}> </Col>
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
                        <Button type="Button" className="btn btn-primary">
                          Harvest
                        </Button>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={3} />
                      <Col md={2}>
                        <div className="title-card mt-n2 ">
                          <div className="subtitle-amount mt-n4">
                            1,025 SPARTA
                            <i className="icon-extra-small icon-spinner icon-dark ml-1" />
                          </div>
                        </div>
                      </Col>
                      <Col md={2}>
                        <div className="title-card mt-n4">0,15%</div>
                      </Col>
                      <Col md={2}>
                        <div className="title-card mt-n4">2 days ago</div>
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
      </div>
    </>
  )
}

export default Overview

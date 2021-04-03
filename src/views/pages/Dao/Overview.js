/* eslint-disable */
import React, { useState } from "react"

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  Row,
  Col, Breadcrumb, Nav, NavItem, NavLink, TabContent, TabPane, UncontrolledAlert, Progress, Alert, CardTitle
} from "reactstrap"
import classnames from "classnames"

import coinBnb from "../../../assets/icons/coin_bnb.svg"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import LockEarn from "./LockEarn"
import bnbSparta from "../../../assets/icons/bnb_sparta.png"
import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip"

const Overview = () => {
  const [activeTab, setActiveTab] = useState("1")

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  return (
    <>
      <div className="content">
        <Breadcrumb>Dao</Breadcrumb>
        <Col md={6}> <Alert color="primary">
          <span>By adding liquidity to the pools you receive LP tokens. Earn extra SPARTA by locking these LP tokens in the DAO</span>
        </Alert></Col>
        <Row>
          <Col sm={10} >
            <Row>
              <Col sm={12} >
                <Nav className="nav-tabs-custom card-body" pills>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "1" })}
                      onClick={() => {
                        toggle("1")
                      }}
                    >
                      Lock & earn
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "2" })}
                      onClick={() => {
                        toggle("2")
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
                <br/>
                <Card className="card-body" style={{ backgroundColor: "#1D171F" }}>
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
                          The quantity of & SPARTA you are adding to the
                          pool.
                        </UncontrolledTooltip>
                      </h2></Col>
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
                        </Button></Col>
                    </Row>
                    <Row>
                      <Col md={3}>
                      </Col>
                      <Col md={2}>
                        <div className="title-card mt-n2 ">
                          <div className="subtitle-amount mt-n4">1,025 SPARTA<i
                            className="icon-extra-small icon-spinner icon-dark ml-1" /></div>
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
                <div className="page-header">Lock & earn  <i
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
                  </UncontrolledTooltip></div>
                <br/>
                <LockEarn />
              </TabPane>
              <TabPane tabId="2" className="p-3">
                <Row>
                  <Col className="text-right">
                    <ButtonGroup>
                      <Button color="danger">
                        <i className="bd-icons icon-check-2 mr-2" /> List
                      </Button>
                      <Button color="danger">
                        <i className="bd-icons icon-check-2 mr-2" /> Delist
                      </Button>
                      <Button color="danger">
                        <i className="bd-icons icon-check-2 mr-2" /> Allocate
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Overview

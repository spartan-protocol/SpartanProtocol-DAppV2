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
  Col, Breadcrumb, Nav, NavItem, NavLink, TabContent, TabPane, UncontrolledAlert, Progress, Alert
} from "reactstrap"
import classnames from "classnames"
import BondTable from "../BondTable"
import coinBnb from "../../../assets/icons/coin_bnb.svg"
import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip"
import coinSparta from "../../../assets/icons/coin_sparta.svg"
import ButtonGroup from "react-bootstrap/ButtonGroup"

const Overview = () => {
  const [activeTab, setActiveTab] = useState("1")

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  return (
    <>
      <div className="content">
        <Breadcrumb>Dao</Breadcrumb>
        <Alert color="primary">
          <span>By adding liquidity to the pools you receive LP tokens. Earn extra SPARTA by locking these LP tokens in the DAO</span>
        </Alert>
        <Row>
          <Col md={10}>
            <Row>
              <Col md={9}>
                <Nav tabs className="nav-tabs-custom">
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "1" })}
                      onClick={() => {
                        toggle("1")
                      }}
                    >
                      <span className="d-none d-sm-block">Lock & earn</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "2" })}
                      onClick={() => {
                        toggle("2")
                      }}
                    >
                      <span className="d-none d-sm-block">Proposals</span>
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
            </Row>

            <TabContent activeTab={activeTab}>

              <TabPane tabId="1" className="p-3">

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

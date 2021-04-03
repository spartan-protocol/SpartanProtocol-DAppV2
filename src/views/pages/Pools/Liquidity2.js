/* eslint-disable*/
import React, { Component, useEffect, useState } from "react"
import { useDispatch } from 'react-redux'

import {
  Breadcrumb, Button,
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane
} from "reactstrap"

import classnames from "classnames"
import SharePool from "../../../components/Share/SharePool"
import Wallet from "../../../components/Wallet/Wallet"
import AddLiquidity from "./AddLiquidity"
import BondTable from "../BondTable"
import NewBond from "./NewBond"
import { useWallet } from "@binance-chain/bsc-use-wallet"
import { getAddresses, getItemFromArray } from "../../../utils/web3"
import { usePoolFactory } from "../../../store/poolFactory"
import { useWeb3 } from "../../../store/web3"
import {
  calcLiquidityHoldings,
  calcLiquidityUnits,
  calcSwapFee,
  calcSwapOutput,
  calcValueInBase, calcValueInToken
} from "../../../utils/web3Utils"
import { BN, convertToWei } from "../../../utils/bigNumber"
import RemoveLiquidity from "./RemoveLiquidity"

const Liquidity2 = () => {

  const [activeTab, setActiveTab] = useState("1")

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }




  return (
    <>
      <div className="content">
        <br />
        <Breadcrumb>
          <Col md={8}>Liquidity</Col>
          <Col md={2}>
            <SharePool />
          </Col>
          <Col md={2}>
            <Wallet />
          </Col>
        </Breadcrumb>
        <Row>
          <Col md={8}>
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
                      <span className="d-none d-sm-block">Add</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "2" })}
                      onClick={() => {
                        toggle("2")
                      }}
                    >
                      <span className="d-none d-sm-block">Remove</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "3" })}
                      onClick={() => {
                        toggle("3")
                      }}
                    >
                      <span className="d-none d-sm-block">Transfer pool</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "4" })}
                      onClick={() => {
                        toggle("4")
                      }}
                    >
                      <span className="d-none d-sm-block">Bond</span>
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
            </Row>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1" className="p-3">
                <AddLiquidity />
              </TabPane>
              <TabPane tabId="2" className="p-3">
                <RemoveLiquidity />
              </TabPane>
              <TabPane tabId="3" className="p-3">
                <AddLiquidity />
              </TabPane>
              <TabPane tabId="4" className="p-3">
                <AddLiquidity />
              </TabPane>
            </TabContent>
          </Col>
        </Row>

      </div>
    </>
  )

}

export default Liquidity2

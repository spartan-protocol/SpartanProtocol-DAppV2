import React, { useState } from 'react'

import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap'

import classnames from 'classnames'
import AddLiquidity from './AddLiquidity'
import RemoveLiquidity from './RemoveLiquidity'
import BondLiquidity from './BondLiquidity'
import { usePoolFactory } from '../../../store/poolFactory'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'

const Liquidity = () => {
  const [activeTab, setActiveTab] = useState('1')
  const poolFactory = usePoolFactory()
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  return (
    <>
      <div className="content">
        <Row className="card-body justify-content-center">
          <Col xs="12">
            <h2 className="d-inline text-title ml-1">Liquidity</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs="auto">
            <Nav pills className="nav-tabs-custom card-body">
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '1' })}
                  onClick={() => {
                    toggle('1')
                  }}
                >
                  <span className="">Add</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '2' })}
                  onClick={() => {
                    toggle('2')
                  }}
                >
                  <span className="">Remove</span>
                </NavLink>
              </NavItem>
              {/* <NavItem>
                          <NavLink
                            className={classnames({ active: activeTab === '3' })}
                            onClick={() => {
                              toggle('3')
                            }}
                          >
                            <span className="">Zap</span>
                          </NavLink>
                        </NavItem> */}
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '4' })}
                  onClick={() => {
                    toggle('4')
                  }}
                >
                  <span className="">Bond</span>
                </NavLink>
              </NavItem>
            </Nav>
            {poolFactory.poolDetails.length > 0 && (
              <TabContent activeTab={activeTab}>
                {activeTab === '1' && (
                  <TabPane tabId="1" className="p-3">
                    <AddLiquidity />
                  </TabPane>
                )}
                {activeTab === '2' && (
                  <TabPane tabId="2" className="p-3">
                    <RemoveLiquidity />
                  </TabPane>
                )}
                {/* {activeTab === '3' && (
                      <TabPane tabId="3" className="p-3">
                        <ZapLiquidity />
                      </TabPane>
                    )} */}
                {activeTab === '4' && (
                  <TabPane tabId="4" className="p-3">
                    <BondLiquidity />
                  </TabPane>
                )}
              </TabContent>
            )}
            {poolFactory.poolDetails.length <= 0 && <HelmetLoading />}
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Liquidity

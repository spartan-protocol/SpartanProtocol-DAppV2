import React, { useState } from 'react'
import {
  CardText,
  Breadcrumb,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap'

import classnames from 'classnames'
import PoolsTable from '../PoolsTable'

const Overview = () => {
  // const [activeTab, setActiveTab] = useState('1')
  // const [activeTab1, setActiveTab1] = useState('5')
  // const [activeTab2, setActiveTab2] = useState('9')
  // const [activeTab3, setActiveTab3] = useState('13')
  const [customActiveTab, setCustomActiveTab] = useState('1')
  // const [activeTabJustify, setActiveTabJustify] = useState('5')

  // const toggle = (tab) => {
  //   if (activeTab !== tab) {
  //     setActiveTab(tab)
  //   }
  // }

  // const toggle1 = (tab) => {
  //   if (activeTab1 !== tab) {
  //     setActiveTab1(tab)
  //   }
  // }

  // const toggle2 = (tab) => {
  //   if (activeTab2 !== tab) {
  //     setActiveTab2(tab)
  //   }
  // }

  // const toggle3 = (tab) => {
  //   if (activeTab3 !== tab) {
  //     setActiveTab3(tab)
  //   }
  // }

  // const toggleCustomJustified = (tab) => {
  //   if (activeTabJustify !== tab) {
  //     setActiveTabJustify(tab)
  //   }
  // }

  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setCustomActiveTab(tab)
    }
  }

  return (
    <>
      <div className="content">
        <Breadcrumb>Pools</Breadcrumb>
        <Row>
          <Col lg={12}>
            <Nav tabs className="nav-tabs-custom">
              <NavItem>
                <NavLink
                  style={{ cursor: 'pointer' }}
                  className={classnames({
                    active: customActiveTab === '1',
                  })}
                  onClick={() => {
                    toggleCustom('1')
                  }}
                >
                  <span className="d-none d-sm-block">Pools overview</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  style={{ cursor: 'pointer' }}
                  className={classnames({
                    active: customActiveTab === '2',
                  })}
                  onClick={() => {
                    toggleCustom('2')
                  }}
                >
                  <span className="d-none d-sm-block">Positions</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  style={{ cursor: 'pointer' }}
                  className={classnames({
                    active: customActiveTab === '3',
                  })}
                  onClick={() => {
                    toggleCustom('3')
                  }}
                >
                  <span className="d-none d-sm-block">Analysis</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  style={{ cursor: 'pointer' }}
                  className={classnames({
                    active: customActiveTab === '4',
                  })}
                  onClick={() => {
                    toggleCustom('4')
                  }}
                >
                  <span className="d-none d-sm-block">Pairs</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  style={{ cursor: 'pointer' }}
                  className={classnames({
                    active: customActiveTab === '5',
                  })}
                  onClick={() => {
                    toggleCustom('5')
                  }}
                >
                  <span className="d-none d-sm-block">Tokens</span>
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent activeTab={customActiveTab}>
              <TabPane tabId="1" className="p-3">
                <PoolsTable />
              </TabPane>
              <TabPane tabId="2" className="p-3" />
              <TabPane tabId="3" className="p-3" />
              <TabPane tabId="4" className="p-3" />
              <TabPane tabId="5" className="p-3">
                <Row>
                  <Col sm="12">
                    <CardText>X</CardText>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="6" className="p-3">
                <Row>
                  <Col sm="12">
                    <CardText>X</CardText>
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

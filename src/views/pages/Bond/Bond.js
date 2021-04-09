import React, { useState } from 'react'
import {
  Breadcrumb,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Button,
} from 'reactstrap'
import classnames from 'classnames'

import BondTable from './BondTable'
import NewBond from './NewBond'

const Bond = () => {
  const [activeTab, setActiveTab] = useState('1')

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  return (
    <>
      <div className="content">
        <Breadcrumb>Bond & Mint</Breadcrumb>
        <Row>
          <Col md={10}>
            <Row>
              <Col md={9}>
                <Nav className="nav-tabs-custom card-body" pills>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '1' })}
                      onClick={() => {
                        toggle('1')
                      }}
                    >
                      Single token
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '2' })}
                      onClick={() => {
                        toggle('2')
                      }}
                    >
                      Both tokens
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
              <Col className="ml-5">
                <Button type="Button" className="btn btn-danger ml-lg-n5">
                  Proposals
                </Button>
                <Button type="Button" className="btn btn-primary">
                  Claim all (2)
                </Button>
              </Col>
            </Row>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1" className="p-3">
                <BondTable />
              </TabPane>
              <TabPane tabId="2" className="p-3">
                <NewBond />
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Bond

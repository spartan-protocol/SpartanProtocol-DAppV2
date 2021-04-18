import React, { useState } from 'react'
import {
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
        <Row className="card-body justify-content-center">
          <Col xs="6" xl="5">
            <h2 className="d-inline text-title ml-1">Bond</h2>
          </Col>
          <Col xs="6" xl="4" />
        </Row>
        <Row className="justify-content-center">
          <Col xs="12" xl="9">
            <Row>
              <Col md={12}>
                <Row>
                  <Col md={8}>
                    <Nav className="nav-tabs-custom card-body" pills>
                      <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === '1' })}
                          onClick={() => {
                            toggle('1')
                          }}
                        >
                          Your bonds
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === '2' })}
                          onClick={() => {
                            toggle('2')
                          }}
                        >
                          New bond
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Col>
                  <Col xs="6" xl="4">
                    <Button className="d-inline float-right btn btn-primary mt-3 ">
                      Claim all (2)
                    </Button>
                    <Button className="d-inline float-right btn btn-success mt-3 mr-2">
                      Proposals
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
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Bond

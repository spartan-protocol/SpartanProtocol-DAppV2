/*eslint-disable*/
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
        <Row className="card-body justify-content-center">
          <Col xs="6" xl="5">
            <h2 className="d-inline text-title ml-1">Bond</h2>
          </Col>
          <Col xs="6" xl="4">
            <Button
              className="d-inline float-right btn btn-info mt-2 mr-2"
            >
              <i className="spartan-icons icon-small icon-pools icon-dark mr-2" />
              Proposal
            </Button>
            <Button
              className="d-inline float-right btn btn-info mt-2 mr-2"

            >
              <i className="spartan-icons icon-small icon-pools icon-dark mr-2" />
              Claim all
            </Button>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs="12" xl="9">
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

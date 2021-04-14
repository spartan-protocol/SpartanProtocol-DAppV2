import React, { useState } from 'react'
import Select from 'react-select'

import classnames from 'classnames'
import { Card, CardBody, Col, Nav, NavItem, NavLink, Row } from 'reactstrap'
import ShareIcon from '../../../assets/icons/new.svg'

const AddLiquidity = () => {
  // const [singleSelect, setsingleSelect] = React.useState(null)
  const [singleSelect1, setsingleSelect1] = React.useState(null)
  const [activeTab, setActiveTab] = useState('1')

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  return (
    <>
      <Row>
        <Card>
          <CardBody>
            <Nav tabs className="nav-tabs-custom">
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '1' })}
                  onClick={() => {
                    toggle('1')
                  }}
                >
                  <span className="d-none d-sm-block">Single token</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '2' })}
                  onClick={() => {
                    toggle('2')
                  }}
                >
                  <span className="d-none d-sm-block">Both tokens</span>
                </NavLink>
              </NavItem>
            </Nav>

            <Row>
              <Col className="card-body">
                {' '}
                <img
                  src={ShareIcon}
                  alt="share icon"
                  style={{
                    height: '19px',
                    verticalAlign: 'bottom',
                    marginRight: '5px',
                  }}
                />{' '}
                You can now swap your BEP20 tokens, LP tokens & Synths
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Card
                  style={{ backgroundColor: '#25212D' }}
                  className="card-body "
                >
                  <Row>
                    <Col className="text-left">
                      <div className="title-card">Input</div>
                      <br />
                      <div className="title-card">From</div>
                      <br />
                      <div className="output-card" />
                    </Col>
                  </Row>
                </Card>
                <Card
                  style={{ backgroundColor: '#25212D' }}
                  className="card-body "
                >
                  <Row>
                    <Col className="text-left">
                      <div className="title-card">Select pool</div>
                      <br />
                      <Select
                        className="react-select info"
                        classNamePrefix="react-select"
                        name="singleSelect1"
                        value={singleSelect1}
                        onChange={(value) => setsingleSelect1(value)}
                        options={[
                          {
                            value: '',
                            label: 'Single Option',
                            isDisabled: true,
                          },
                        ]}
                        placeholder="Select a pool"
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Row>
    </>
  )
}

export default AddLiquidity

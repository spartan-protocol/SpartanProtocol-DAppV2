/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import {
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap'
import classnames from 'classnames'

import UncontrolledTooltip from 'reactstrap/lib/UncontrolledTooltip'
// import { useDispatch } from 'react-redux'
// import { useWallet } from '@binance-chain/bsc-use-wallet'
import Stake from './Stake'

const Overview = () => {
  // const wallet = useWallet()
  // const dispatch = useDispatch()
  // const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  const [activeTab, setActiveTab] = useState('1')
  // const [trigger, settrigger] = useState(0)

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  // const formatDate = (unixTime) => {
  //   const date = new Date(unixTime * 1000)
  //   return date.toLocaleDateString()
  // }

  // useEffect(async () => {
  //   dispatch(getSynthMemberLastHarvest(wallet.account))
  //   await pause(7500)
  //   settrigger(trigger + 1)
  // }, [trigger])

  return (
    <>
      <div className="content">
        <Row className="card-body justify-content-center">
          <Col xs="6" xl="5">
            <h2 className="d-inline text-title ml-1">SynthVault</h2>
          </Col>
          <Col xs="6" xl="4" />
        </Row>

        <Row className="justify-content-center">
          <Col xs="12" xl="9">
            <Row>
              <Col xs="12">
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
                          Stake
                        </NavLink>
                      </NavItem>
                      {/* <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === '2' })}
                          onClick={() => {
                            toggle('2')
                          }}
                        >
                          Proposals
                        </NavLink>
                      </NavItem> */}
                    </Nav>
                  </Col>
                </Row>

                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1" className="p-3">
                    <div className="page-header">
                      Stake{' '}
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
                    <Stake />
                  </TabPane>
                  {/* <TabPane tabId="2" className="p-3">
                    <Proposals />
                  </TabPane> */}
                </TabContent>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Overview

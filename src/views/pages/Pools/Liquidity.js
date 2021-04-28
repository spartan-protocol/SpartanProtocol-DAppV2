import React, { useState } from 'react'

import { Col, Nav, NavItem, NavLink, Row } from 'reactstrap'

import classnames from 'classnames'
import AddLiquidity from './AddLiquidity'
import RemoveLiquidity from './RemoveLiquidity'
import BondLiquidity from './BondLiquidity'
import { usePool } from '../../../store/pool'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'

const Liquidity = () => {
  const [activeTab, setActiveTab] = useState('1')
  const pool = usePool()
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  return (
    <>
      <div className="content">
        <Row className="row-480">
          <Col xs="auto">
            <div className="card-body card-480">
              <h2 className="text-title mb-0">Liquidity</h2>
            </div>
          </Col>
          <Col xs="auto">
            <Nav pills className="nav-tabs-custom card-body card-480">
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
          </Col>
        </Row>
        <Row className="row-480">
          {pool.poolDetails.length > 0 && (
            <>
              {activeTab === '1' && <AddLiquidity />}
              {activeTab === '2' && <RemoveLiquidity />}
              {activeTab === '4' && <BondLiquidity />}
            </>
          )}
          {pool.poolDetails.length <= 0 && <HelmetLoading />}
        </Row>
      </div>
    </>
  )
}

export default Liquidity

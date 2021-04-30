import React, { useState } from 'react'
import { Col, Nav, NavItem, NavLink, Row } from 'reactstrap'

import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import PoolsTable from './PoolsTable'

const Overview = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('pools')

  return (
    <>
      <div className="content">
        <Row className="row-480">
          <Col xs="12">
            <div className="card-body card-480-left">
              <h2 className="text-title-small mb-0">{t('pools')}</h2>
            </div>
          </Col>
        </Row>

        <Row className="row-480">
          <Col>
            <Nav className="nav-tabs-custom card-480-left mb-2" pills>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: activeTab === 'pools',
                  })}
                  onClick={() => {
                    setActiveTab('pools')
                  }}
                >
                  Pools
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: activeTab === 'positions',
                  })}
                  onClick={() => {
                    setActiveTab('positions')
                  }}
                >
                  Positions
                </NavLink>
              </NavItem>
            </Nav>
          </Col>
          {activeTab === 'pools' && <PoolsTable />}
        </Row>
      </div>
    </>
  )
}

export default Overview

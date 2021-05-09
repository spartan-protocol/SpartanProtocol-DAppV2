import React, { useState } from 'react'

import { Col, Nav, NavItem, NavLink, Row } from 'reactstrap'

import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import AddLiquidity from './AddLiquidity'
import RemoveLiquidity from './RemoveLiquidity'
import BondLiquidity from './BondLiquidity'
import { usePool } from '../../../store/pool'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import Share from '../../../components/Share/SharePool'

const Liquidity = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('1')
  const pool = usePool()
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  return (
    <>
      <div className="content">
        <Row className="row-480">
          <Col xs="12">
            <div className="card-480 my-3">
              <h2 className="text-title-small mb-0 mr-3">{t('liquidity')}</h2>
              <Share />
            </div>
          </Col>
        </Row>

        <Row className="row-480">
          <Col xs="12">
            <Nav pills className="nav-tabs-custom card-480 mb-3">
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '1' })}
                  onClick={() => {
                    toggle('1')
                  }}
                >
                  <span className="">{t('add')}</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '2' })}
                  onClick={() => {
                    toggle('2')
                  }}
                >
                  <span className="">{t('remove')}</span>
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
                  <span className="">{t('bond')}</span>
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
          <Col className="card-480">
            {pool.poolDetails.length <= 0 && <HelmetLoading />}
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Liquidity

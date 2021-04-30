import React, { useState, useEffect } from 'react'
import { Col, Nav, NavItem, NavLink, Row } from 'reactstrap'

import classnames from 'classnames'
// import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import PoolItem from './PoolItem'
import { usePool } from '../../../store/pool'
import { getAddresses } from '../../../utils/web3'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import { getBondListed } from '../../../store/bond/actions'

const Overview = () => {
  const dispatch = useDispatch()
  // const { t } = useTranslation()
  const pool = usePool()
  const addr = getAddresses()
  const [activeTab, setActiveTab] = useState('overview')

  const [trigger1, settrigger1] = useState(0)
  useEffect(() => {
    if (trigger1 === 0) {
      dispatch(getBondListed())
    }
    const timer = setTimeout(() => {
      dispatch(getBondListed())
      settrigger1(trigger1 + 1)
    }, 10000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger1])

  return (
    <>
      <div className="content">
        <Row className="row-480">
          <Col xs="12">
            <div className="card-body card-480-left">
              <h2 className="text-title-small mb-0">Home</h2>
            </div>
          </Col>
        </Row>

        <Row className="row-480">
          <Col xs="12">
            <Nav className="nav-tabs-custom card-480-left mb-3" pills>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: activeTab === 'overview',
                  })}
                  onClick={() => {
                    setActiveTab('overview')
                  }}
                >
                  Overview
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
          {activeTab === 'overview' &&
            pool?.poolDetails
              .filter((asset) => asset.tokenAddress !== addr.sparta)
              .sort((a, b) => b.baseAmount - a.baseAmount)
              .map((asset) => <PoolItem key={asset.address} asset={asset} />)}
          {activeTab === 'overview' && !pool.poolDetails && (
            <HelmetLoading height={300} width={300} />
          )}
        </Row>
      </div>
    </>
  )
}

export default Overview

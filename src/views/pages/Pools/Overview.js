import React, { useState, useEffect } from 'react'
import { Col, Nav, NavItem, NavLink, Row } from 'reactstrap'

import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import PoolItem from './PoolItem'
import { usePool } from '../../../store/pool'
import { getAddresses, getNetwork } from '../../../utils/web3'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import { getBondListed } from '../../../store/bond/actions'

const Overview = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const pool = usePool()
  const addr = getAddresses()
  const [activeTab, setActiveTab] = useState('overview')

  const [network, setnetwork] = useState(getNetwork())
  const [trigger0, settrigger0] = useState(0)
  const getData = () => {
    setnetwork(getNetwork())
  }
  useEffect(() => {
    if (trigger0 === 0) {
      getData()
    }
    const timer = setTimeout(() => {
      getData()
      settrigger0(trigger0 + 1)
    }, 2000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger0])

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
            <div className="card-480 my-3">
              <h2 className="text-title-small mb-0">{t('home')}</h2>
            </div>
          </Col>
        </Row>
        {network.chainId === 97 && (
          <>
            <Row className="row-480">
              <Col xs="12">
                <Nav className="nav-tabs-custom card-480 mb-3" pills>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === 'overview',
                      })}
                      onClick={() => {
                        setActiveTab('overview')
                      }}
                    >
                      {t('overview')}
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
                      {t('positions')}
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
              {activeTab === 'overview' &&
                pool?.poolDetails
                  .filter(
                    (asset) =>
                      asset.tokenAddress !== addr.sparta &&
                      asset.tokenAddress !== addr.oldSparta,
                  )
                  .sort((a, b) => b.baseAmount - a.baseAmount)
                  .map((asset) => (
                    <PoolItem key={asset.address} asset={asset} />
                  ))}
              {pool.poolDetails.length <= 0 && (
                <Col className="card-480">
                  <HelmetLoading height={300} width={300} />
                </Col>
              )}
            </Row>
          </>
        )}
        {network.chainId !== 97 && (
          <Row className="row-480">
            <Col xs="12">
              <h2>This feature is not available on this network</h2>
              <h4>
                Click the wallet icon in the header bar and select `Change
                Wallet` to change between BSC Mainnet & TestNet
              </h4>
              <h5>
                Ensure your MetaMask/Binance Wallet etc also has the same
                network selected
              </h5>
            </Col>
          </Row>
        )}
      </div>
    </>
  )
}

export default Overview

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Nav from 'react-bootstrap/Nav'
import { useLocation, useHistory } from 'react-router-dom'
import LiqAdd from './LiqAdd'
import LiqRemove from './LiqRemove'
import { usePool } from '../../store/pool'
import HelmetLoading from '../../components/Spinner/index'
import { getAddresses, getNetwork, tempChains } from '../../utils/web3'
import WrongNetwork from '../../components/WrongNetwork/index'
import { balanceWidths } from './Components/Utils'
import NewPool from '../Pools/NewPool'
import { Icon } from '../../components/Icons'
import Metrics from './Components/Metrics'
import { getPool } from '../../utils/math/utils'
import Share from '../../components/Share'

const Overview = () => {
  const { t } = useTranslation()
  const pool = usePool()
  const location = useLocation()
  const history = useHistory()
  const addr = getAddresses()

  const [activeTab, setActiveTab] = useState('add')
  const [network, setnetwork] = useState(getNetwork())
  const [tabParam1] = useState(new URLSearchParams(location.search).get(`tab`))
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [selectedPool, setSelectedPool] = useState(false)

  const tryParse = (data) => {
    try {
      return JSON.parse(data)
    } catch (e) {
      return pool.poolDetails[0]
    }
  }

  useEffect(() => {
    if (pool.poolDetails) {
      let asset1 = tryParse(window.localStorage.getItem('assetSelected1'))
      if (asset1.tokenAddress === addr.spartav2) {
        asset1 = tryParse(window.localStorage.getItem('assetSelected3'))
      }
      asset1 = getPool(asset1.tokenAddress, pool.poolDetails)
      setSelectedPool(asset1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.poolDetails, window.localStorage.getItem('assetSelected1')])

  useEffect(() => {
    if (tabParam1) {
      setActiveTab(tabParam1)
    }
  }, [tabParam1])

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

  useEffect(() => {
    balanceWidths()
  }, [activeTab])

  const isLoading = () => {
    if (!pool.poolDetails) {
      return true
    }
    return false
  }

  return (
    <>
      <div className="content">
        {tempChains.includes(network.chainId) && (
          <Row>
            {/* MODALS */}
            {showCreateModal && (
              <NewPool
                setShowModal={setShowCreateModal}
                showModal={showCreateModal}
              />
            )}

            {showShareModal && (
              <Share
                setShowShare={setShowShareModal}
                showShare={showShareModal}
              />
            )}

            {!isLoading() ? (
              <>
                <Col>
                  <Card>
                    <Card.Header>
                      <Nav
                        variant="pills"
                        activeKey={activeTab}
                        onSelect={(e) => setActiveTab(e)}
                        fill
                      >
                        <Nav.Item className="me-1">
                          <Nav.Link
                            className="btn-sm btn-outline-primary"
                            onClick={() => history.push(`/swap`)}
                          >
                            {t('swap')}
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="me-1">
                          <Nav.Link
                            eventKey="add"
                            className="btn-sm btn-outline-primary"
                          >
                            {t('add')}
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="me-1">
                          <Nav.Link
                            eventKey="remove"
                            className="btn-sm btn-outline-primary"
                          >
                            {t('remove')}
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="me-1 hide-i5">
                          <Nav.Link
                            className="btn-sm btn-outline-primary"
                            onClick={() => setShowCreateModal(!showCreateModal)}
                          >
                            {t('create')}
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link
                            className="btn-sm btn-outline-primary"
                            onClick={() => setShowShareModal(!showShareModal)}
                          >
                            <Icon icon="connect" size="15" />
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item disabled>
                          <Nav.Link
                            className="btn-sm btn-outline-primary"
                            disabled
                          >
                            {/* ADD SLIP TOLERANCE LOGIC */}
                            {/* ADD GAS PRICE LOGIC */}
                            <Icon icon="settings" size="15" />
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </Card.Header>
                    <Card.Body>
                      {activeTab === 'add' && <LiqAdd />}
                      {activeTab === 'remove' && <LiqRemove />}
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Metrics assetSwap={selectedPool} />
                </Col>
              </>
            ) : (
              <Col>
                <HelmetLoading height={150} width={150} />
              </Col>
            )}
          </Row>
        )}
        {!tempChains.includes(network.chainId) && <WrongNetwork />}
      </div>
    </>
  )
}

export default Overview

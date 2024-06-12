import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Nav from 'react-bootstrap/Nav'
import { useLocation, useNavigate } from 'react-router-dom'
import LiqAdd from './LiqAdd'
import LiqRemove from './LiqRemove'
import { usePool } from '../../store/pool'
import HelmetLoading from '../../components/Spinner/index'
import { tempChains } from '../../utils/web3'
import WrongNetwork from '../../components/WrongNetwork/index'
import { balanceWidths } from './Components/Utils'
import NewPool from '../Pools/NewPool'
import { Icon } from '../../components/Icons'
// import Metrics from './Components/Metrics'
import { getPool } from '../../utils/math/utils'
import Share from '../../components/Share'
import Settings from '../../components/Settings'
import { useApp } from '../../store/app'

const Overview = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  const { addresses, asset1, asset2, asset3, chainId } = useApp()
  const pool = usePool()

  const [activeTab, setActiveTab] = useState('add')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [assetLiq1, setAssetLiq1] = useState(false)
  const [assetLiq2, setAssetLiq2] = useState(false)
  const [assetLiq3, setAssetLiq3] = useState(false)
  const [loadedInitial, setloadedInitial] = useState(false)

  useEffect(() => {
    if (pool.poolDetails.length > 0) {
      setAssetLiq1(getPool(asset1.addr, pool.poolDetails))
      setAssetLiq2(getPool(asset2.addr, pool.poolDetails))
      setAssetLiq3(getPool(asset3.addr, pool.poolDetails))
    }
  }, [
    addresses.spartav2,
    asset1.addr,
    asset2.addr,
    asset3.addr,
    pool.poolDetails,
  ])

  // Check and set selected tab based on URL params ONLY ONCE
  useEffect(() => {
    if (!loadedInitial) {
      const tabParam1 = new URLSearchParams(location.search).get(`tab`)
      if (tabParam1) {
        setActiveTab(tabParam1)
      }
      setloadedInitial(true)
    }
  }, [loadedInitial, location.search])

  useEffect(() => {
    balanceWidths()
  }, [asset1.addr, asset2.addr, loadedInitial, pool.poolDetails, activeTab])

  const isLoading = () => {
    if (!pool.poolDetails) {
      return true
    }
    return false
  }

  return (
    <>
      <div className="content">
        {tempChains.includes(chainId) && (
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

            {showSettingsModal && (
              <Settings
                setShowModal={setShowSettingsModal}
                showModal={showSettingsModal}
              />
            )}

            {!isLoading() ? (
              <>
                <Col>
                  <Card className="mb-2" style={{ minWidth: '300px' }}>
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
                            onClick={() => navigate(`/swap`)}
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
                            <Icon icon="share" size="15" />
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link
                            className="btn-sm btn-outline-primary"
                            onClick={() =>
                              setShowSettingsModal(!showSettingsModal)
                            }
                          >
                            <Icon icon="settings" size="15" />
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </Card.Header>
                    <Card.Body>
                      {activeTab === 'add' && (
                        <LiqAdd
                          assetLiq1={assetLiq1}
                          assetLiq2={assetLiq2}
                          selectedPool={assetLiq3}
                        />
                      )}
                      {activeTab === 'remove' && (
                        <LiqRemove
                          selectedPool={assetLiq1}
                          assetLiq1={assetLiq2}
                          assetLiq2={assetLiq3}
                        />
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  {/* <Metrics
                    assetSwap={activeTab === 'add' ? assetLiq3 : assetLiq1}
                  /> */}
                </Col>
              </>
            ) : (
              <Col>
                <HelmetLoading height={150} width={150} />
              </Col>
            )}
          </Row>
        )}
        {!tempChains.includes(chainId) && <WrongNetwork />}
      </div>
    </>
  )
}

export default Overview

import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Nav from 'react-bootstrap/Nav'
import { getAddresses, getNetwork, tempChains } from '../../utils/web3'
import { usePool } from '../../store/pool'
import Metrics from './Components/Metrics'
import HelmetLoading from '../../components/Spinner/index'
import WrongNetwork from '../../components/WrongNetwork/index'
import { Icon } from '../../components/Icons/index'
import NewPool from '../Pools/NewPool'
import Share from '../../components/Share'
import SwapTokens from './swapTokens'
import { getPool } from '../../utils/math/utils'
import SwapLps from './swapLps'
import Settings from '../../components/Settings'

const Swap = () => {
  const { t } = useTranslation()
  const addr = getAddresses()
  const pool = usePool()
  const history = useHistory()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [network, setnetwork] = useState(getNetwork())
  const [trigger0, settrigger0] = useState(0)
  const [mode, setMode] = useState('token')
  const [selectedAsset1, setSelectedAsset1] = useState(false)
  const [selectedAsset2, setSelectedAsset2] = useState(false)

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
      asset1 = getPool(asset1.tokenAddress, pool.poolDetails)
      let asset2 = tryParse(window.localStorage.getItem('assetSelected2'))
      asset2 = getPool(asset2.tokenAddress, pool.poolDetails)
      setSelectedAsset1(asset1)
      setSelectedAsset2(asset2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pool.poolDetails,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetSelected1'),
  ])

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
                      <Nav variant="pills" activeKey="swap" fill>
                        <Nav.Item className="me-1">
                          <Nav.Link className="btn-sm" eventKey="swap">
                            {t('swap')}
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="me-1">
                          <Nav.Link
                            eventKey="add"
                            className="btn-sm"
                            onClick={() => history.push(`/liquidity`)}
                          >
                            {t('add')}
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="me-1">
                          <Nav.Link
                            eventKey="remove"
                            className="btn-sm"
                            onClick={() =>
                              history.push(`/liquidity?tab=remove`)
                            }
                          >
                            {t('remove')}
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="me-1 hide-i5">
                          <Nav.Link
                            className="btn-sm"
                            onClick={() => setShowCreateModal(!showCreateModal)}
                          >
                            {t('create')}
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link
                            className="btn-sm"
                            onClick={() => setShowShareModal(!showShareModal)}
                          >
                            <Icon icon="connect" size="15" />
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
                      <Row className="mb-3">
                        <Col>
                          <Nav
                            variant="pills"
                            activeKey={mode}
                            onSelect={(e) => setMode(e)}
                            fill
                          >
                            <Nav.Item>
                              <Nav.Link className="btn-sm" eventKey="token">
                                {t('tokens')}
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link className="btn-sm" eventKey="pool">
                                {t('lpTokens')}
                              </Nav.Link>
                            </Nav.Item>
                          </Nav>
                        </Col>
                      </Row>
                      {mode === 'token' && <SwapTokens />}
                      {mode === 'pool' && <SwapLps />}
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  {pool.poolDetails &&
                    selectedAsset1.tokenAddress !== addr.spartav2 && (
                      <Metrics assetSwap={selectedAsset1} />
                    )}
                  {pool.poolDetails &&
                    selectedAsset2.tokenAddress !== addr.spartav2 && (
                      <Metrics assetSwap={selectedAsset2} />
                    )}
                </Col>
              </>
            ) : (
              <Col className="">
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

export default Swap

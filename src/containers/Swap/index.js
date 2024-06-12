import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Nav from 'react-bootstrap/Nav'
import { tempChains } from '../../utils/web3'
import { usePool } from '../../store/pool'
// import Metrics from './Components/Metrics'
import HelmetLoading from '../../components/Spinner/index'
import WrongNetwork from '../../components/WrongNetwork/index'
import { Icon } from '../../components/Icons/index'
import NewPool from '../Pools/NewPool'
import Share from '../../components/Share'
import SwapTokens from './swapTokens'
import { getPool } from '../../utils/math/utils'
import SwapLps from './swapLps'
import Settings from '../../components/Settings'
import { useApp } from '../../store/app'

const Swap = () => {
  const { t } = useTranslation()

  const { asset1, asset2, chainId } = useApp()
  const pool = usePool()
  const navigate = useNavigate()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [mode, setMode] = useState('token')
  const [assetSwap1, setAssetSwap1] = useState(false)
  const [assetSwap2, setAssetSwap2] = useState(false)

  const isLoading = () => {
    if (!pool.poolDetails) {
      return true
    }
    return false
  }

  useEffect(() => {
    if (pool.poolDetails.length > 0) {
      setAssetSwap1(getPool(asset1.addr, pool.poolDetails))
      setAssetSwap2(getPool(asset2.addr, pool.poolDetails))
    }
  }, [asset1.addr, asset2.addr, pool.poolDetails])

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
                            onClick={() => navigate(`/liquidity`)}
                          >
                            {t('add')}
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="me-1">
                          <Nav.Link
                            eventKey="remove"
                            className="btn-sm"
                            onClick={() => navigate(`/liquidity?tab=remove`)}
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
                            <Icon icon="share" size="17" />
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link
                            className="btn-sm btn-outline-primary"
                            onClick={() =>
                              setShowSettingsModal(!showSettingsModal)
                            }
                          >
                            <Icon icon="settings" size="18" />
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
                      {mode === 'token' && (
                        <SwapTokens
                          assetSwap1={assetSwap1}
                          assetSwap2={assetSwap2}
                        />
                      )}
                      {mode === 'pool' && (
                        <SwapLps
                          assetSwap1={assetSwap1}
                          assetSwap2={assetSwap2}
                        />
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  {/* {assetSwap1 &&
                    assetSwap1.tokenAddress !== addresses.spartav2 && (
                      <Metrics assetSwap={assetSwap1} />
                    )}
                  {assetSwap2 &&
                    assetSwap2.tokenAddress !== addresses.spartav2 && (
                      <Metrics assetSwap={assetSwap2} />
                    )} */}
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

export default Swap

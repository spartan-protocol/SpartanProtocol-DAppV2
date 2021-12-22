import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, ButtonGroup, Button } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import LiqAdd from './LiqAdd'
import LiqRemove from './LiqRemove'
import { usePool } from '../../../store/pool'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import { getNetwork, tempChains } from '../../../utils/web3'
import WrongNetwork from '../../../components/Common/WrongNetwork'
import { balanceWidths } from './Components/Utils'

const Overview = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('1')
  const pool = usePool()
  const [network, setnetwork] = useState(getNetwork())
  const location = useLocation()

  const [tabParam1] = useState(new URLSearchParams(location.search).get(`tab`))

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
          <>
            <Row className="row-480">
              <ButtonGroup size="sm" className="mb-3">
                <Button
                  active={activeTab === '1'}
                  onClick={() => setActiveTab('1')}
                  variant="dark"
                >
                  {t('add')}
                </Button>
                <Button
                  active={activeTab === '2'}
                  onClick={() => setActiveTab('2')}
                  variant="dark"
                >
                  {t('remove')}
                </Button>
              </ButtonGroup>
              {!isLoading() ? (
                <>
                  {activeTab === '1' && <LiqAdd />}
                  {activeTab === '2' && <LiqRemove />}
                </>
              ) : (
                <Col className="card-480">
                  <HelmetLoading />
                </Col>
              )}
            </Row>
          </>
        )}
        {!tempChains.includes(network.chainId) && <WrongNetwork />}
      </div>
    </>
  )
}

export default Overview

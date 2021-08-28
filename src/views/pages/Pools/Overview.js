import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Tabs, Tab } from 'react-bootstrap'
import LiqAdd from './LiqAdd'
import LiqRemove from './LiqRemove'
import LiqBond from './LiqBond'
import { usePool } from '../../../store/pool'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import SharePool from '../../../components/Share/SharePool'
import { getNetwork } from '../../../utils/web3'
import WrongNetwork from '../../../components/Common/WrongNetwork'
import NewPool from '../Home/NewPool'
import { balanceWidths } from './Components/Utils'

const Overview = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('1')
  const pool = usePool()
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

  useEffect(() => {
    balanceWidths()
  }, [activeTab])

  return (
    <>
      <div className="content">
        <Row className="row-480">
          <Col xs="12">
            <div className="card-480 my-3">
              <h2 className="text-title-small mb-0 me-3">{t('liquidity')}</h2>
              <NewPool />
              {pool.poolDetails.length > 0 && <SharePool />}
            </div>
          </Col>
        </Row>
        {network.chainId === 97 && (
          <>
            <Row className="row-480">
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3 card-480"
              >
                <Tab eventKey="1" title={t('add')}>
                  {pool.poolDetails.length > 0 && activeTab === '1' && (
                    <LiqAdd />
                  )}
                </Tab>
                <Tab eventKey="2" title={t('remove')}>
                  {pool.poolDetails.length > 0 && activeTab === '2' && (
                    <LiqRemove />
                  )}
                </Tab>
                <Tab eventKey="4" title={t('bond')}>
                  {pool.poolDetails.length > 0 && activeTab === '4' && (
                    <LiqBond />
                  )}
                </Tab>
              </Tabs>
            </Row>
            <Row className="row-480">
              <Col className="card-480">
                {pool.poolDetails.length <= 0 && <HelmetLoading />}
              </Col>
            </Row>
          </>
        )}
        {network.chainId !== 97 && <WrongNetwork />}
      </div>
    </>
  )
}

export default Overview

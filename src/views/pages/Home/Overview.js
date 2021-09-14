import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Card, Col, Nav, Row } from 'react-bootstrap'
import PoolItem from './PoolItem'
import { usePool } from '../../../store/pool'
import { getNetwork } from '../../../utils/web3'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import { allListedAssets } from '../../../store/bond/actions'
import WrongNetwork from '../../../components/Common/WrongNetwork'
import SummaryItem from './SummaryItem'

const Overview = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const pool = usePool()

  const [activeTab, setActiveTab] = useState('1')

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
    if (trigger1 === 0 && network.chainId === 97) {
      dispatch(allListedAssets())
    }
    const timer = setTimeout(() => {
      if (network.chainId === 97) {
        dispatch(allListedAssets())
        settrigger1(trigger1 + 1)
      }
    }, 10000)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger1])

  return (
    <>
      <div className="content">
        {network.chainId === 97 && (
          <>
            <Row className="row-480">
              <Col xs="12">
                <SummaryItem activeTab={activeTab} />
                <Card>
                  <Card.Header className="p-0 border-0 mb-2 rounded-pill-top-left">
                    <Nav activeKey={activeTab} fill>
                      <Nav.Item key="1" className="rounded-pill-top-left">
                        <Nav.Link
                          eventKey="1"
                          className="rounded-pill-top-left"
                          onClick={() => {
                            setActiveTab('1')
                          }}
                        >
                          {t('pools')}
                        </Nav.Link>
                      </Nav.Item>

                      <Nav.Item key="2" className="rounded-pill-top-right">
                        <Nav.Link
                          className="rounded-pill-top-right"
                          eventKey="2"
                          onClick={() => {
                            setActiveTab('2')
                          }}
                        >
                          {t('new')}
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      {activeTab === '1' &&
                        pool?.poolDetails
                          .filter(
                            (asset) =>
                              asset.baseAmount > 0 && asset.newPool === false,
                          )
                          .sort((a, b) => b.baseAmount - a.baseAmount)
                          .map((asset) => (
                            <PoolItem key={asset.address} asset={asset} />
                          ))}
                      {activeTab === '2' &&
                        pool?.poolDetails
                          .filter(
                            (asset) =>
                              asset.baseAmount > 0 && asset.newPool === true,
                          )
                          .sort((a, b) => b.baseAmount - a.baseAmount)
                          .map((asset) => (
                            <PoolItem key={asset.address} asset={asset} />
                          ))}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              {pool.poolDetails.length <= 0 && (
                <Col className="card-480">
                  <HelmetLoading height={300} width={300} />
                </Col>
              )}
            </Row>
          </>
        )}
        {network.chainId !== 97 && <WrongNetwork />}
      </div>
    </>
  )
}

export default Overview

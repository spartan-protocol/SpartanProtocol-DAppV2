import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, ButtonGroup, Button } from 'react-bootstrap'
import LiqAdd from './LiqAdd'
import LiqRemove from './LiqRemove'
import LiqBond from './LiqBond'
import { usePool } from '../../../store/pool'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import { getNetwork } from '../../../utils/web3'
import WrongNetwork from '../../../components/Common/WrongNetwork'
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
        {network.chainId === 97 && (
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
                <Button
                  active={activeTab === '4'}
                  onClick={() => setActiveTab('4')}
                  variant="dark"
                >
                  {t('bond')}
                </Button>
              </ButtonGroup>
              {activeTab === '1' && <LiqAdd />}
              {activeTab === '2' && <LiqRemove />}
              {activeTab === '4' && <LiqBond />}
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

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Row, Col, Tabs, Tab } from 'react-bootstrap'
import DaoVault from './DaoVault'
import SynthVault from './SynthVault'
import { getNetwork } from '../../../utils/web3'
import WrongNetwork from '../../../components/Common/WrongNetwork'
import { usePool } from '../../../store/pool'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'

const Vault = () => {
  const { t } = useTranslation()
  const [mode, setMode] = useState('Dao')
  const pool = usePool()
  const [network, setnetwork] = useState(getNetwork())
  const [trigger0, settrigger0] = useState(0)
  const getNet = () => {
    setnetwork(getNetwork())
  }
  useEffect(() => {
    if (trigger0 === 0) {
      getNet()
    }
    const timer = setTimeout(() => {
      getNet()
      settrigger0(trigger0 + 1)
    }, 2000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger0])

  return (
    <>
      <div className="content">
        <Row className="row-480">
          <Col xs="12">
            <div className="card-480 my-3">
              <h2 className="text-title-small mb-0 me-3">{t('vault')}</h2>
            </div>
          </Col>
        </Row>
        {network.chainId === 97 && (
          <>
            <Row className="row-480">
              <Tabs
                activeKey={mode}
                onSelect={(k) => setMode(k)}
                className="mb-3 card-480"
              >
                <Tab eventKey="Dao" title={t('daoVault')}>
                  {pool.poolDetails.length > 0 && mode === 'Dao' && (
                    <DaoVault />
                  )}
                </Tab>
                <Tab eventKey="Synth" title={t('synthVault')}>
                  {pool.poolDetails.length > 0 && mode === 'Synth' && (
                    <SynthVault />
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

export default Vault

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row'
import { useLocation } from 'react-router-dom'
import DaoVault from './DaoVault'
import SynthVault from './SynthVault'
import BondVault from './BondVault'
import { getNetwork, tempChains } from '../../utils/web3'
import WrongNetwork from '../../components/WrongNetwork/index'
import { usePool } from '../../store/pool'
import HelmetLoading from '../../components/Spinner/index'

const Vaults = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const pool = usePool()
  const network = getNetwork()

  const [mode, setMode] = useState('Dao')
  const [tabParam1] = useState(new URLSearchParams(location.search).get(`tab`))

  useEffect(() => {
    if (tabParam1) setMode(tabParam1)
  }, [tabParam1])

  return (
    <>
      {tempChains.includes(network.chainId) && (
        <>
          <Row className="mb-3">
            <Col>
              <Nav
                variant="pills"
                activeKey={mode}
                onSelect={(e) => setMode(e)}
              >
                <Nav.Item>
                  <Nav.Link eventKey="Dao" className="btn-sm">
                    {t('daoVault')}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="Synth" className="btn-sm">
                    {t('synthVault')}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="Bond" className="btn-sm">
                    {t('bondVault')}
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
          </Row>
          <Row>
            <Col>
              {pool.poolDetails.length > 0 ? (
                <>
                  {mode === 'Dao' && <DaoVault />}
                  {mode === 'Synth' && <SynthVault />}
                  {mode === 'Bond' && <BondVault />}
                </>
              ) : (
                <HelmetLoading height={150} width={150} />
              )}
            </Col>
          </Row>
        </>
      )}
      {network.chainId && !tempChains.includes(network.chainId) && (
        <WrongNetwork />
      )}
    </>
  )
}

export default Vaults

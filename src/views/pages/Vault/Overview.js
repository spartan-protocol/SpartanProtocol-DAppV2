import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import { Row, Col, Nav, NavItem, NavLink } from 'reactstrap'
import DaoVault from './DaoVault'
import SynthVault from './SynthVault'
import { getNetwork } from '../../../utils/web3'
import WrongNetwork from '../../../components/Common/WrongNetwork'

const Vault = () => {
  const { t } = useTranslation()
  const [mode, setMode] = useState('Dao')
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
              <h2 className="text-title-small mb-0 mr-2">{t('vault')}</h2>
            </div>
          </Col>
        </Row>
        {network.chainId === 97 && (
          <>
            <Row className="row-480">
              <Col xs="12">
                <Nav pills className="nav-tabs-custom mt-2 mb-4">
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: mode === 'Dao',
                      })}
                      onClick={() => {
                        setMode('Dao')
                      }}
                    >
                      {t('daoVault')}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: mode === 'Synth',
                      })}
                      onClick={() => {
                        setMode('Synth')
                      }}
                    >
                      {t('synthVault')}
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
            </Row>
            <Row className="row-480">
              {mode === 'Dao' && <DaoVault />}
              {mode === 'Synth' && <SynthVault />}
            </Row>
          </>
        )}
        {network.chainId !== 97 && <WrongNetwork />}
      </div>
    </>
  )
}

export default Vault

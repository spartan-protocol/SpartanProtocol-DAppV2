import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Row, Col, Nav, NavItem, NavLink } from 'reactstrap'
import { getReserveGlobalDetails } from '../../../store/reserve/actions'
import { getSpartaGlobalDetails } from '../../../store/sparta/actions'
import DaoVault from './DaoVault'
import SynthVault from './SynthVault'

const Vault = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [mode, setMode] = useState('Dao')

  const [trigger0, settrigger0] = useState(0)
  const getData = () => {
    dispatch(getReserveGlobalDetails())
    dispatch(getSpartaGlobalDetails())
  }
  useEffect(() => {
    if (trigger0 === 0) {
      getData()
    }
    const timer = setTimeout(() => {
      getData()
      settrigger0(trigger0 + 1)
    }, 10000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger0])

  return (
    <>
      <div className="content">
        <Row className="row-480">
          <Col xs="12">
            <h2 className="text-title-small mb-0 mr-2">Staking</h2>
          </Col>
        </Row>
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
      </div>
    </>
  )
}

export default Vault

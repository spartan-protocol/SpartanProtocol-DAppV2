import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Row, Col, Button, ButtonGroup } from 'reactstrap'
import { getReserveGlobalDetails } from '../../../store/reserve/actions'
import { getSpartaGlobalDetails } from '../../../store/sparta/actions'
import DaoVault from './DaoVault'
import SynthVault from './SynthVault'

const Vault = () => {
  const dispatch = useDispatch()
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
        <Row className="card-body row-480">
          <Col xs="12" lg="6" className="col-480">
            <div className="d-inline text-title-small ml-l">
              {mode}Vault Staking
            </div>
          </Col>
          <Col xs="12" lg="6" className="col-480">
            <ButtonGroup className="ml-2">
              <Button
                color={mode === 'Dao' ? 'primary' : 'info'}
                type="Button"
                onClick={() => setMode('Dao')}
              >
                DaoVault
              </Button>
              <Button
                color={mode === 'Synth' ? 'primary' : 'info'}
                type="Button"
                onClick={() => setMode('Synth')}
              >
                SynthVault
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
        {mode === 'Dao' && <DaoVault />}
        {mode === 'Synth' && <SynthVault />}
      </div>
    </>
  )
}

export default Vault

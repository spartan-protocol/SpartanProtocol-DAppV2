import React, { useState } from 'react'
import { Row, Col, Button, ButtonGroup } from 'reactstrap'
import DaoVault from './DaoVault'
import SynthVault from './SynthVault'

const Vault = () => {
  const [mode, setMode] = useState('Dao')

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

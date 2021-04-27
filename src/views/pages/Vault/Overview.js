import React, { useState } from 'react'
import { Row, Col, Button, ButtonGroup } from 'reactstrap'
import DaoVault from './DaoVault'
import SynthVault from './SynthVault'

const Vault = () => {
  const [mode, setMode] = useState('Dao')

  return (
    <>
      <div className="content">
        <Row className="card-body justify-content-center">
          <Col xs="auto">
            <div className="d-inline text-title-small ml-l">
              {mode}Vault Staking
            </div>
          </Col>
          <Col>
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

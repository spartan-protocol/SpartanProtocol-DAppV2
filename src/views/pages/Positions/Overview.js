import React, { useState, useEffect } from 'react'
import { Card, Col, Row, Button, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { getNetwork, tempChains } from '../../../utils/web3'
import WrongNetwork from '../../../components/Common/WrongNetwork'
import { Icon } from '../../../components/Icons/icons'
import PoolPositions from './PoolPositions'
import SynthPositions from './SynthPositions'

const Positions = () => {
  const { t } = useTranslation()

  const [network, setnetwork] = useState(getNetwork())
  const [trigger0, settrigger0] = useState(0)
  const [showSynths, setShowSynths] = useState(false)

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

  return (
    <>
      <div className="content">
        {tempChains.includes(network.chainId) && network?.chainId === 56 ? (
          <>
            <Row className="row-480">
              <Col>
                {!showSynths ? 'Liquidity Positions' : 'Synth Positions'}
                <Form className="">
                  <span className="output-card">
                    {t('synthView')}
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      className="ms-2 d-inline-flex"
                      checked={showSynths}
                      onChange={() => {
                        setShowSynths(!showSynths)
                      }}
                    />
                  </span>
                </Form>
              </Col>
            </Row>
            <Row className="row-480">
              {!showSynths ? <PoolPositions /> : <SynthPositions />}
              <Col xs="auto">
                <Card className="card-320" style={{ minHeight: '445px' }}>
                  <Card.Header className="">
                    Assessing Positions
                    <Card.Subtitle className="">
                      <div className="my-2 d-inline-block me-2">More Info</div>
                    </Card.Subtitle>
                  </Card.Header>
                  <Card.Body className="output-card">
                    Assessing your position is subjective & depends on what you
                    are trying to achieve: <br />
                    <br />
                    <li>Accrue more USD?</li>
                    <li>Accrue more SPARTA?</li>
                    <li>Accrue more underlying tokens?</li>
                    <br />
                    This is why many scopes are provided. It is complex
                    assessing your position.
                    <br />
                    <br />
                    Click &apos;View In Docs&apos; below to read the
                    &apos;Positions Guide&apos; and learn more about it.
                  </Card.Body>
                  <Card.Footer>
                    <a
                      href="https://docs.spartanprotocol.org/#/positions"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button className="w-100">
                        {t('viewInDocs')}
                        <Icon icon="scan" size="15" className="ms-2 mb-1" />
                      </Button>
                    </a>
                  </Card.Footer>
                </Card>
              </Col>
            </Row>
          </>
        ) : (
          <div>Please change network to BSC Mainnet to continue...</div>
        )}
        {!tempChains.includes(network.chainId) && <WrongNetwork />}
      </div>
    </>
  )
}

export default Positions

import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row'
import { useTranslation } from 'react-i18next'
import { tempChains } from '../../utils/web3'
import WrongNetwork from '../../components/WrongNetwork/index'
import { Icon } from '../../components/Icons/index'
import PoolPositions from './PoolPositions'
import SynthPositions from './SynthPositions'
import { useApp } from '../../store/app'

const Positions = () => {
  const { t } = useTranslation()

  const app = useApp()

  const [activeTab, setActiveTab] = useState('pools')

  return (
    <>
      <div className="content">
        {tempChains.includes(app.chainId) && app.chainId === 56 ? (
          <>
            <Row className="mb-3">
              <Col>
                <Nav
                  variant="pills"
                  activeKey={activeTab}
                  onSelect={(e) => setActiveTab(e)}
                >
                  <Nav.Item>
                    <Nav.Link eventKey="pools" className="btn-sm">
                      {t('liquidityPositions')}
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="synths" className="btn-sm">
                      {t('synthPositions')}
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
            </Row>
            <Row>
              {activeTab === 'pools' ? <PoolPositions /> : <SynthPositions />}
              <Col>
                <Card style={{ minHeight: '445px', minWidth: '275px' }}>
                  <Card.Header>
                    <Card.Title className="pt-1">
                      Assessing Positions
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
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
                        <Icon
                          icon="scan"
                          size="15"
                          fill="white"
                          className="ms-2 mb-1"
                        />
                      </Button>
                    </a>
                  </Card.Footer>
                </Card>
              </Col>
            </Row>
          </>
        ) : (
          <div>{t('changeToMainnet')}</div>
        )}
        {!tempChains.includes(app.chainId) && <WrongNetwork />}
      </div>
    </>
  )
}

export default Positions

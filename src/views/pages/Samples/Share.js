import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { TwitterShareButton, TwitterIcon } from 'react-share'
import { Card, CardBody, Row, Col } from 'reactstrap'
import ShareLink from '../../../components/Share/ShareLink'
import ShareIcon from '../../../assets/icons/icon-share.svg'
import SpartaIcon from '../../../assets/icons/SPARTA.svg'
import CopyIcon from '../../../assets/icons/icon-copy.svg'

const Share = () => {
  const [showShare, setShowShare] = useState(false)

  return (
    <div className="content">
      <Row>
        <Col xs="12">
          <Button variant="primary" onClick={() => setShowShare(true)}>
            Show share
          </Button>
          <Modal show={showShare} onHide={() => setShowShare(false)}>
            <Modal.Body>
              <Row>
                <Col xs="12" className="text-center py-5">
                  <img src={ShareIcon} alt="Share icon" />
                </Col>
              </Row>
              <Row>
                <Col xs="12">
                  <Card className="card-share">
                    <CardBody className="py-3">
                      <h4 className="card-title">Swap on Spartan Protocol</h4>
                      <Row>
                        <Col xs="3">
                          <img src={SpartaIcon} alt="Sparta icon" />
                          <span
                            className="card-title"
                            style={{ marginLeft: '7px' }}
                          >
                            Sparta
                          </span>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                  <span
                    className="card-title"
                    style={{
                      color: '#fff',
                      fontWeight: 'bold',
                      marginLeft: '15px',
                    }}
                  >
                    Copy link
                  </span>
                  <Card className="card-link">
                    <CardBody className="py-3">
                      <Row>
                        <Col xs="10">
                          <span className="card-title">
                            https://spartanprotocol.org
                          </span>
                        </Col>
                        <Col xs="2">
                          <ShareLink url="https://spartanprotocol.org">
                            <img src={CopyIcon} alt="Copy icon" />
                          </ShareLink>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                  <Card className="card-share">
                    <CardBody className="py-3">
                      <Row>
                        <Col xs="10">
                          <span className="card-title">Share via Twitter</span>
                        </Col>
                        <Col xs="2">
                          <TwitterShareButton
                            url="https://spartanprotocol.org"
                            title="Sparta Protocol"
                          >
                            <TwitterIcon size={32} round />
                          </TwitterShareButton>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col xs="12">
                  <Button
                    type="Button"
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => setShowShare(false)}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Modal.Body>
          </Modal>
        </Col>
      </Row>
    </div>
  )
}

export default Share

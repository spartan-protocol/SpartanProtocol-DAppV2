import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Card, CardBody, Row, Col } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import CardHeader from 'reactstrap/es/CardHeader'
import CardTitle from 'reactstrap/es/CardTitle'

const NewProposal = () => {
  const [showModal, setShowModal] = useState(false)
  const { t } = useTranslation()

  return (
    <>
      <Button
        className="btn-transparent align-self-center btn btn-secondary"
        onClick={() => setShowModal(true)}
      >
        <i className="spartan-icons icon-small icon-pools icon-dark mr-1 mt-1 ml-2" />
      </Button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Card>
          <CardHeader>
            <CardTitle tag="h2" />
            <Row>
              <Col xs="10">
                <h2>{t('shareLink')}</h2>
              </Col>
              <Col xs="2">
                <Button
                  style={{
                    right: '16px',
                  }}
                  onClick={() => setShowModal(false)}
                  className="btn btn-transparent"
                >
                  <i className="icon-small icon-close" />
                </Button>
              </Col>
            </Row>
          </CardHeader>
          <Row className="card-body">
            <Col xs="12">
              <Card className="card-share">
                <CardBody className="py-3">
                  <h4 className="card-title">{t('swapSpartanProtocol')}</h4>
                  <Row>
                    <Col>here</Col>
                    <Col>there</Col>
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
                {t('copyLink')}
              </span>
            </Col>
          </Row>
          <Row>
            <Col xs="12" className="text-center">
              <Button
                type="Button"
                className="btn btn-primary"
                onClick={() => setShowModal(false)}
              >
                {t('cancel')}
              </Button>
            </Col>
          </Row>
        </Card>
      </Modal>
    </>
  )
}

export default NewProposal

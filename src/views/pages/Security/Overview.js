import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Col, Row } from 'react-bootstrap'

const Security = () => {
  const { t } = useTranslation()

  return (
    <>
      <div className="content">
        <Row className="row-480">
          <Col xs="12">
            <Card>
              <Card.Header className="">{t('header')}</Card.Header>
              <Card.Body>Body</Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Security

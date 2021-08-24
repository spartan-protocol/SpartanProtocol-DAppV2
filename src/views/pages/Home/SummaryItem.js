import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Col, Row } from 'react-bootstrap'
import { Icon } from '../../../components/Icons/icons'

const SummaryItem = () => {
  const { t } = useTranslation()

  return (
    <>
      <Col xs="auto">
        <Card className="card-underlay">
          <Card.Body>
            <Row className="">
              <Col xs="auto" className="pr-0">
                <Icon height="30" />
              </Col>
              <Col xs="auto">
                {t('add info for each tab here (and icon/badge)')}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </>
  )
}

export default SummaryItem

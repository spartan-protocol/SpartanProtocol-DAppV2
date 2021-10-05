import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Col, Row } from 'react-bootstrap'
// import { Icon } from '../../../components/Icons/icons'
import NewPool from './NewPool'

const SummaryItem = () => {
  const { t } = useTranslation()

  return (
    <>
      <Col xs="auto">
        <Card className="card-underlay">
          <Card.Header>
            <Row className="px-1">
              <Col xs="auto">{t('pools')}</Col>
              <Col className="">
                <NewPool />
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Row className="">
              {/* <Col xs="auto" className="pr-0">
                <Icon height="30" />
              </Col> */}
              <Col xs="auto">
                Listed Spartan Protocol Pools
                {/* <Badge bg="secondary">NEW</Badge> {t('poolNewInfo')}
                <br />
                <Badge bg="dark">NORMAL</Badge> {t('poolNormalInfo')}
                <br />
                <Badge bg="primary">CURATED</Badge> {t('poolCuratedInfo')} */}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </>
  )
}

export default SummaryItem

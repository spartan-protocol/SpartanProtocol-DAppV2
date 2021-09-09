import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Col, Row } from 'react-bootstrap'
import { Icon } from '../../../components/Icons/icons'
import NewPool from './NewPool'

const SummaryItem = (props) => {
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
              <Col xs="auto" className="pr-0">
                <Icon height="30" />
              </Col>
              <Col xs="auto">
                {props.activeTab === '1' &&
                  t(
                    'pools add info for each tab here (and icon/badge). make sure to explain normal pools and also curated pools',
                  )}
                {props.activeTab === '2' &&
                  t(
                    'new pools add info for each tab here (and icon/badge) make sure to explain these initializing pools',
                  )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </>
  )
}

export default SummaryItem

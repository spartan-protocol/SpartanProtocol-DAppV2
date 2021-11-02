import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Col, Row } from 'react-bootstrap'
// import { Icon } from '../../../components/Icons/icons'
import NewPool from './NewPool'
import PoolSelect from '../../../components/PoolSelect/PoolSelect'

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
                &nbsp;
                <PoolSelect />
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Row className="">
              {/* <Col xs="auto" className="pr-0">
                <Icon height="30" />
              </Col> */}
              <Col xs="auto">{t('listedPoolsInfo')}</Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </>
  )
}

export default SummaryItem

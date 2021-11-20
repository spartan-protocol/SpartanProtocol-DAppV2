import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Col, Row } from 'react-bootstrap'
// import { Icon } from '../../../components/Icons/icons'
import { install } from 'resize-observer'
import NewPool from './NewPool'
import PoolSelect from '../../../components/PoolSelect/PoolSelect'
import { useWeb3 } from '../../../store/web3'
import ChartTVL from './Charts/ChartTVL'
import ChartVol from './Charts/ChartVol'

const SummaryItem = () => {
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 720) {
      install()
    }
  }

  const { t } = useTranslation()
  const web3 = useWeb3()

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
            {web3.metrics ? (
              <Row>
                <Col>
                  <ChartTVL />
                </Col>
                <Col>
                  <ChartVol />
                </Col>
              </Row>
            ) : (
              'loading'
            )}
          </Card.Body>
        </Card>
      </Col>
    </>
  )
}

export default SummaryItem

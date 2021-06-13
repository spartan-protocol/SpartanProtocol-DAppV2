import React, { useState, useEffect } from 'react'
import { Col, Row } from 'reactstrap'

import { useTranslation } from 'react-i18next'
import { getNetwork } from '../../../utils/web3'

const Overview = () => {
  const { t } = useTranslation()
  const [network, setnetwork] = useState(getNetwork())
  const [trigger0, settrigger0] = useState(0)
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
        <Row className="row-480">
          <Col xs="12">
            <div className="card-480 my-3">
              <h2 className="text-title-small mb-0 mr-3">{t('codeArena')}</h2>
            </div>
          </Col>
        </Row>
        <Row className="row-480">
          <Col xs="12">DONATION TARGET BAR</Col>
          <Col xs="12">CODEARENA INFO</Col>
        </Row>
        {network.chainId === 56 && (
          <>
            <Row className="row-480">
              <Col xs="12">DONATE BUTTON</Col>
            </Row>
          </>
        )}
        {network.chainId !== 56 && (
          <Row className="row-480">
            <Col xs="12">
              Switch the DApp and your wallet to mainnet to donate
            </Col>
          </Row>
        )}
      </div>
    </>
  )
}

export default Overview

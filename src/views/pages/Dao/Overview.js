/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { Row, Col } from 'reactstrap'
import Proposals from './Proposals'

const Overview = () => {
  const temp = 'hello'

  return (
    <>
      <div className="content">
        <Row className="card-body justify-content-center">
          <Col xs="6" xl="5">
            <h2 className="d-inline text-title ml-1">{temp}</h2>
          </Col>
          <Col xs="6" xl="4" />
        </Row>

        <Row className="justify-content-center">
          <Col xs="12" xl="9">
            <Row>
              <Col xs="12">
                <Proposals />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Overview

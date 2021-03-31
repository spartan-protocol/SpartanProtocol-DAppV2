import React from 'react'
import { Row, Col } from 'reactstrap'
import SharePool from '../../../components/Share/SharePool'

const Share = () => (
  <div className="content">
    <Row>
      <Col xs="12">
        <SharePool url="https://spartanprotocol.org" />
      </Col>
    </Row>
  </div>
)

export default Share

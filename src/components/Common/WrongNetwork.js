import React from 'react'
import { Link } from 'react-router-dom'
import { Col, Row } from 'reactstrap'

const WrongNetwork = () => (
  <Row className="row-480">
    <Col xs="12">
      <h2>This feature will be available on Spartan Protocol V2!</h2>
      <h4>
        In the meantime please visit{' '}
        <Link
          to="/upgrade"
          style={{
            fontWeight: 'bold',
          }}
        >
          the upgrade page
        </Link>{' '}
        to swap your old SPARTA tokens to new $SPARTA
      </h4>
      <h5>
        You are also welcome to switch the network to testnet and play around
        with the testnet deployed V2
      </h5>
    </Col>
  </Row>
)

export default WrongNetwork

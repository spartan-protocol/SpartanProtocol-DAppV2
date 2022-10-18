import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import styles from './styles.module.scss'

const BridgeOnboard = () => (
  <>
    <Row>
      <Col className="my-2" md="6" sm="12">
        <h2>Title content title content</h2>
        <p>
          Body content Body content Body content Body content Body content Body
          content Body content
        </p>
        <div>Icons / logos</div>
      </Col>
      <Col className={styles.bridgeModule} md="6" sm="12">
        {/* <BridgeStep /> */}
      </Col>
    </Row>
  </>
)

export default BridgeOnboard

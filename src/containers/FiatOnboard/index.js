import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { Icon } from '../../components/Icons'
import FiatStep from '../../components/Onboarding/fiatStep'

import styles from './styles.module.scss'

const FiatOnboard = () => (
  <>
    <Row className={styles.parent}>
      <Col className={styles.first} md="6" sm="12">
        <h1>Fiat Onboarding</h1>
        <hr />
        <Icon icon="bankCards" className="mb-2 me-3" size="20" />
        <h5 className="d-inline-block">Buy crypto assets with fiat</h5>
        <br />
        <Icon icon="plus" className="mb-2 me-3" size="16" />
        <h5 className="d-inline-block">Supporting 30+ countries</h5>
        <br />
        <Icon icon="plus" className="mb-2 me-3" size="16" />
        <h5 className="d-inline-block">Buy 50+ crypto tokens</h5>
        <br />
        <Icon icon="plus" className="mb-2 me-3" size="16" />
        <h5 className="d-inline-block">Variety of payment methods</h5>
        <br />
        <div>
          <Icon icon="visa" width="66px" className="me-2" />
          <Icon icon="mastercard" width="60px" />
        </div>
        <div>Provider: (Binance Connect Logo)</div>
        <hr />
        <div>Your connected wallet: 0x...BLAH (COPY BTN)</div>
        <div>
          ARROW-DOWN ICON (ONLY ON MOBILE - SM) TO CLICK-JUMP OR HINT AT SCROLL
          TOWARDS iFRAME SECTION
        </div>
      </Col>
      <Col className={styles.second} md="6" sm="12">
        <div className={styles.binanceConnectModule}>
          <FiatStep />
        </div>
      </Col>
    </Row>
  </>
)

export default FiatOnboard

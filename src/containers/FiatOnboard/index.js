import { useWeb3React } from '@web3-react/core'
import React from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { Icon } from '../../components/Icons'
import FiatStep from '../../components/Onboarding/fiatStep'
import ShareLink from '../../components/Share/ShareLink'
import { formatShortString } from '../../utils/web3'

import styles from './styles.module.scss'

const FiatOnboard = () => {
  const wallet = useWeb3React()
  // ADD URL PARAMS LIKE: const assetParam1 = new URLSearchParams(location.search).get(`buy`) ----- "https//url.com?buy=BNB"
  // SO THAT WE CAN ADD CTAs IN PLACES LIKE WALLETSELECT TO BUY A SPECIFIC ASSET (Skip 1st step in the onboarding iframe)

  return (
    <>
      <Row className={styles.parent}>
        <Col className={styles.first} md="6" sm="12">
          <h1>Fiat Onboarding</h1>
          <hr />
          <Icon icon="currenciesClr" className="mb-2 me-3" size="35" />
          <h5 className="d-inline-block">Buy crypto with fiat</h5>
          <br />
          <Icon icon="paymentMethodsClr" className="mb-2 me-3" size="35" />
          <h5 className="d-inline-block">Many payment methods</h5>
          <br />
          <Icon icon="worldMapClr" className="mb-2 me-3" size="35" />
          <h5 className="d-inline-block">Supporting 30+ countries</h5>
          <br />
          <Icon icon="bnb" className="mb-2 me-3" size="35" />
          <h5 className="d-inline-block">Buy 50+ crypto tokens</h5>
          <br />
          <Button className="mt-3">
            <strong>Provided by:</strong>
            <Icon icon="binanceConnect" width="120px" className="ms-2" />
          </Button>
          <hr />
          {wallet.account && (
            <div>
              Your connected wallet: {formatShortString(wallet.account)}{' '}
              <ShareLink url={wallet.account}>
                <Icon icon="copy" size="18" className="ms-2" />
              </ShareLink>
            </div>
          )}
          <div className="text-center mt-3 d-md-none">
            <a href="#bconn">
              <Icon icon="arrowDown" size="25px" />
            </a>
          </div>
        </Col>
        <Col className={styles.second} id="bconn" md="6" sm="12">
          <div className={styles.binanceConnectModule}>
            <FiatStep />
          </div>
        </Col>
      </Row>
    </>
  )
}

export default FiatOnboard

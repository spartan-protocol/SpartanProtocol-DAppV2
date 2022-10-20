import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
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

  const [isBlocked, setisBlocked] = useState(false)

  // ADD URL PARAMS LIKE: const assetParam1 = new URLSearchParams(location.search).get(`buy`) ----- "https//url.com?buy=BNB"
  // SO THAT WE CAN ADD CTAs IN PLACES LIKE WALLETSELECT TO BUY A SPECIFIC ASSET (Skip 1st step in the onboarding iframe)

  useEffect(() => {
    const checkUrlBlocked = async () => {
      try {
        await axios.get('https://sensors.bifinity.cloud/sa.gif?project=eternal')
        setisBlocked(false)
      } catch (err) {
        setisBlocked(true)
        console.log(err)
      }
    }

    checkUrlBlocked()
  }, [])

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
          <h5 className="d-inline-block">Purchase 50+ crypto tokens</h5>
          <br />
          <Button
            className="mt-3"
            href="https://www.binancecnt.com/en"
            target="_blank"
          >
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
            {isBlocked ? (
              <div className={styles.blocked}>
                <h1>Blocker Detected</h1>
                <hr />
                <h5>Please disable:</h5>
                <h5>
                  <Icon icon="brave" size="20" /> Browser shields
                </h5>
                <h5>
                  <Icon icon="crossClr" size="20" /> Ad-blockers
                </h5>
                <h5>then refresh the page to access fiat onboarding</h5>
                <hr />
                <h5>How to disable:</h5>
                <Button
                  href="https://support.brave.com/hc/en-us/articles/360023646212-How-do-I-configure-global-and-site-specific-Shields-settings-"
                  target="_blank"
                >
                  <Icon icon="brave" size="20" /> Browser shields
                </Button>
              </div>
            ) : (
              <FiatStep />
            )}
          </div>
        </Col>
      </Row>
    </>
  )
}

export default FiatOnboard

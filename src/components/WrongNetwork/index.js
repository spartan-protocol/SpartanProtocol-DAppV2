import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useTranslation, Trans } from 'react-i18next'

const WrongNetwork = () => {
  const { t } = useTranslation()

  return (
    <Row className="row-480">
      <Col xs="12">
        <h2>{t('notReadyTitle')}</h2>
        <h4>
          Some features will be disabled for a short period on the front end.
        </h4>
        <h5>
          <Trans i18nKey="changeToTestnet">
            You are also welcome to switch the network to testnet and play
            around with the testnet. Get some testnet assets from the
            <a
              href="https://testnet.binance.org/faucet-smart"
              target="_blank"
              rel="noreferrer"
            >
              BSC testnet faucet here
            </a>
            . Claim BNB first (for gas)
          </Trans>
        </h5>
      </Col>
    </Row>
  )
}

export default WrongNetwork

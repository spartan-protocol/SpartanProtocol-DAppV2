import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { useTranslation, Trans } from 'react-i18next'
import { Link } from 'react-router-dom'

const WrongNetwork = () => {
  const { t } = useTranslation()

  return (
    <Row className="row-480">
      <Col xs="12">
        <h2>{t('notReadyTitle')}</h2>
        <h4>
          <Trans i18nKey="visitUpdateV2">
            In the meantime please visit
            <Link
              to="/upgrade"
              style={{
                fontWeight: 'bold',
              }}
            >
              the upgrade page
            </Link>
            to swap your old SPARTA tokens to new $SPARTA
          </Trans>
        </h4>
        <h5>
          <Trans i18nKey="changeToTestnet">
            You are also welcome to switch the network to testnet and play
            around with the testnet deployed V2. Get some testnet assets from
            the
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

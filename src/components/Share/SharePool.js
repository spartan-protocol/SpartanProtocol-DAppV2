import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { TwitterShareButton, TwitterIcon } from 'react-share'
import { Card, CardBody, Row, Col } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import CardHeader from 'reactstrap/es/CardHeader'
import CardTitle from 'reactstrap/es/CardTitle'
import ShareLink from './ShareLink'
import CopyIcon from '../../assets/icons/icon-copy.svg'

const Share = ({ assetToSwap }) => {
  const [showShare, setShowShare] = useState(false)
  const location = useLocation()
  const [url, setUrl] = useState('')
  const { t } = useTranslation()

  useEffect(() => {
    const assetSelected1 = JSON.parse(
      window.localStorage?.getItem('assetSelected1'),
    )
    const assetSelected2 = JSON.parse(
      window.localStorage?.getItem('assetSelected2'),
    )

    setUrl(
      `https://${window.location.host}${location.pathname}?asset1=${
        assetSelected1 ? encodeURIComponent(assetSelected1.tokenAddress) : ''
      }${
        assetSelected2
          ? `&asset2=${encodeURIComponent(assetSelected2.tokenAddress)}`
          : ''
      }`,
    )
  }, [
    location.pathname,
    location.host,
    location.search,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetSelected1'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetSelected2'),
  ])

  return (
    <>
      <Button
        className="d-inline float-right btn btn-info"
        style={{
          width: '100%',
        }}
        onClick={() => setShowShare(true)}
      >
        <i className="spartan-icons icon-small icon-pools icon-dark mr-2" />
        {t('shareLink')}
      </Button>
      <Modal show={showShare} onHide={() => setShowShare(false)}>
        <Card>
          <CardHeader>
            <CardTitle tag="h2" />
            <Row>
              <Col xs="10">
                <h2>{t('shareLink')}</h2>
              </Col>
              <Col xs="2">
                <Button
                  style={{
                    right: '16px',
                  }}
                  onClick={() => setShowShare(false)}
                  className="btn btn-transparent"
                >
                  <i className="icon-small icon-close" />
                </Button>
              </Col>
            </Row>
          </CardHeader>
          <Row className="card-body">
            <Col xs="12">
              <Card className="card-share">
                <CardBody className="py-3">
                  <h4 className="card-title">{t('swapSpartanProtocol')}</h4>
                  <Row>
                    <Col xs="5">
                      <img
                        src={assetToSwap.symbolUrl}
                        alt="coin to swap icon"
                      />
                      <span
                        className="card-title"
                        style={{ marginLeft: '7px' }}
                      >
                        {assetToSwap.symbol}
                      </span>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <span
                className="card-title"
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  marginLeft: '15px',
                }}
              >
                {t('copyLink')}
              </span>
              <ShareLink url={url}>
                <Card className="card-link">
                  <CardBody className="py-3">
                    <Row>
                      <Col xs="10">
                        <span className="card-title">
                          {url.length > 50 ? `${url.substr(0, 50)}...` : url}
                        </span>
                      </Col>
                      <Col xs="2">
                        <img src={CopyIcon} alt="Copy icon" />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </ShareLink>
              <TwitterShareButton
                url={url}
                title="Sparta Protocol"
                style={{ width: '100%' }}
              >
                <Card className="card-share">
                  <CardBody className="py-3">
                    <Row>
                      <Col xs="10">
                        <span className="card-title">
                          {t('shareViaTwiter')}
                        </span>
                      </Col>
                      <Col xs="2">
                        <TwitterIcon size={32} round />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </TwitterShareButton>
            </Col>
          </Row>
          <Row>
            <Col xs="12">
              <Button
                type="Button"
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => setShowShare(false)}
              >
                {t('cancel')}
              </Button>
            </Col>
          </Row>
        </Card>
      </Modal>
    </>
  )
}

export default Share

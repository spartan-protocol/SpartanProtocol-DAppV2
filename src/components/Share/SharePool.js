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
import { usePool } from '../../store/pool'

const Share = () => {
  const pool = usePool()
  const [showShare, setShowShare] = useState(false)
  const location = useLocation()
  const [url, setUrl] = useState('')
  const { t } = useTranslation()
  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]
  const [asset1, setasset1] = useState('')
  const [asset2, setasset2] = useState('')

  const tryParse = (data) => {
    try {
      return JSON.parse(data)
    } catch (e) {
      return pool.poolDetails[0]
    }
  }

  useEffect(() => {
    if (pool.poolDetails?.length > 0) {
      const assetSelected1 = tryParse(
        window.localStorage?.getItem('assetSelected1'),
      )
      const assetSelected2 = tryParse(
        window.localStorage?.getItem('assetSelected2'),
      )
      setasset1(assetSelected1)
      setasset2(assetSelected2)

      setUrl(
        `https://${window.location.host}${location.pathname}?asset1=${
          assetSelected1 ? encodeURIComponent(assetSelected1.tokenAddress) : ''
        }${
          assetSelected2
            ? `&asset2=${encodeURIComponent(assetSelected2.tokenAddress)}`
            : ''
        }`,
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        className="btn-transparent align-self-center btn btn-secondary"
        onClick={() => setShowShare(true)}
      >
        <i className="spartan-icons icon-small icon-pools icon-dark mr-1 mt-1" />
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
                    <Col>
                      <img
                        src={getToken(asset1?.tokenAddress)?.symbolUrl}
                        alt="coin to swap icon"
                      />
                      <span
                        className="card-title"
                        style={{ marginLeft: '7px' }}
                      >
                        {getToken(asset1?.tokenAddress)?.symbol}
                      </span>
                    </Col>
                    <Col>
                      <img
                        src={getToken(asset2?.tokenAddress)?.symbolUrl}
                        alt="coin to swap icon"
                      />
                      <span
                        className="card-title"
                        style={{ marginLeft: '7px' }}
                      >
                        {getToken(asset2?.tokenAddress)?.symbol}
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
            <Col xs="12" className="text-center">
              <Button
                type="Button"
                className="btn btn-primary"
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

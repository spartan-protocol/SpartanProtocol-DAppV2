import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { TwitterShareButton, TwitterIcon } from 'react-share'
import { useTranslation } from 'react-i18next'
import ShareLink from './ShareLink'
import { usePool } from '../../store/pool'
import { Icon } from '../Icons/index'

const Share = () => {
  const pool = usePool()
  const [showShare, setShowShare] = useState(false)
  const [url, setUrl] = useState('')
  const { t } = useTranslation()
  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]
  const [asset1, setasset1] = useState('')
  const [asset2, setasset2] = useState('')
  const [assetType1, setassetType1] = useState('')
  const [assetType2, setassetType2] = useState('')

  const tryParse = (data) => {
    try {
      return JSON.parse(data)
    } catch (e) {
      return pool.poolDetails[0]
    }
  }

  const validateType = (data) => {
    if (data === 'synth') {
      return 'synth'
    }
    if (data === 'pool') {
      return 'pool'
    }
    return 'token'
  }

  useEffect(() => {
    if (pool.poolDetails?.length > 0) {
      const assetSelected1 = tryParse(
        window.localStorage?.getItem('assetSelected1'),
      )
      const assetSelected2 = tryParse(
        window.localStorage?.getItem('assetSelected2'),
      )
      const type1 = validateType(window.localStorage?.getItem('assetType1'))
      const type2 = validateType(window.localStorage?.getItem('assetType2'))
      setasset1(assetSelected1)
      setasset2(assetSelected2)
      setassetType1(type1)
      setassetType2(type2)

      if (window.location.href.includes('liquidity')) {
        setUrl(
          `${window.location.href.split('?')[0]}?asset1=${
            assetSelected1
              ? encodeURIComponent(assetSelected1.tokenAddress)
              : ''
          }`,
        )
      } else if (window.location.href.includes('synths')) {
        setUrl(
          `${window.location.href.split('?')[0]}?asset2=${
            assetSelected2
              ? `${encodeURIComponent(assetSelected2.tokenAddress)}`
              : ''
          }&type1=token&type2=synth`,
        )
      } else {
        setUrl(
          `${window.location.href.split('?')[0]}?asset1=${
            assetSelected1
              ? encodeURIComponent(assetSelected1.tokenAddress)
              : ''
          }${
            assetSelected2
              ? `&asset2=${encodeURIComponent(assetSelected2.tokenAddress)}`
              : ''
          }&type1=${type1}&type2=${type2}`,
        )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    window.location.href,
    window.location.search,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetSelected1'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetSelected2'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetType1'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetType2'),
  ])

  return (
    <>
      <Button
        variant="transparent"
        className="ms-2 mb-1"
        onClick={() => setShowShare(true)}
      >
        <Icon icon="connect" size="20" />
      </Button>
      <Modal show={showShare} onHide={() => setShowShare(false)} centered>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>{t('shareLink')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="card-share">
            <Card.Body className="py-3">
              <Row>
                <Col>
                  <img
                    height="35px"
                    src={getToken(asset1?.tokenAddress)?.symbolUrl}
                    alt={`${getToken(asset1?.tokenAddress)?.symbol} icon`}
                    className="mx-2 rounded-circle"
                  />
                  {assetType1 === 'synth' && (
                    <Icon
                      icon="spartaSynth"
                      size="20"
                      className="token-badge-share"
                    />
                  )}
                  {assetType1 === 'pool' && (
                    <Icon
                      icon="spartaLp"
                      size="20"
                      className="token-badge-share"
                    />
                  )}
                  <span className="card-title" style={{ marginLeft: '7px' }}>
                    {getToken(asset1?.tokenAddress)?.symbol}
                    {assetType1 === 'synth' && 's'}
                    {assetType1 === 'pool' && 'p'}
                  </span>
                </Col>
                <Col>
                  <img
                    height="35px"
                    src={getToken(asset2?.tokenAddress)?.symbolUrl}
                    alt={`${getToken(asset1?.tokenAddress)?.symbol} icon`}
                    className="mx-2 rounded-circle"
                  />
                  {assetType2 === 'synth' && (
                    <Icon
                      icon="spartaSynth"
                      size="20"
                      className="token-badge-share"
                    />
                  )}
                  {assetType2 === 'pool' && (
                    <Icon
                      icon="spartaLp"
                      size="20"
                      className="token-badge-share"
                    />
                  )}

                  <span className="card-title" style={{ marginLeft: '7px' }}>
                    {getToken(asset2?.tokenAddress)?.symbol}
                    {assetType2 === 'synth' && 's'}
                    {assetType2 === 'pool' && 'p'}
                  </span>
                </Col>
              </Row>
            </Card.Body>
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
              <Card.Body className="py-3">
                <Row>
                  <Col xs="10">
                    <span className="card-title">
                      {url.length > 50 ? `${url.substr(0, 50)}...` : url}
                    </span>
                  </Col>
                  <Col xs="2" className="text-center">
                    <Icon icon="copy" size="24" />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </ShareLink>
          <TwitterShareButton
            url={url}
            title="Spartan Protocol"
            style={{ width: '100%' }}
          >
            <Card className="card-share">
              <Card.Body className="py-3">
                <Row>
                  <Col xs="10">
                    <span className="card-title">{t('shareViaTwiter')}</span>
                  </Col>
                  <Col xs="2">
                    <TwitterIcon size={32} round />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </TwitterShareButton>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="Button"
            className="w-100"
            onClick={() => setShowShare(false)}
          >
            {t('cancel')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Share

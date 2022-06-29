import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { TwitterShareButton, TwitterIcon } from 'react-share'
import { useTranslation } from 'react-i18next'
import ShareLink from './ShareLink'
import { usePool } from '../../store/pool'
import { Icon } from '../Icons/index'
import { useTheme } from '../../providers/Theme'
import { useApp } from '../../store/app'

const Share = ({ showShare, setShowShare }) => {
  const { isDark } = useTheme()
  const { t } = useTranslation()

  const { asset1, asset2 } = useApp()
  const pool = usePool()
  const [url, setUrl] = useState('')

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  useEffect(() => {
    if (pool.poolDetails?.length > 0) {
      if (window.location.href.includes('liquidity')) {
        setUrl(
          `${window.location.href.split('?')[0]}?asset1=${encodeURIComponent(
            asset1.addr,
          )}`,
        )
      } else if (window.location.href.includes('synths')) {
        setUrl(
          `${window.location.href.split('?')[0]}?asset2=${
            asset2.addr
          }&type1=token&type2=synth`,
        )
      } else {
        setUrl(
          `${window.location.href.split('?')[0]}?asset1=${encodeURIComponent(
            asset1.addr,
          )}${`&asset2=${encodeURIComponent(asset2.addr)}`}`,
        )
      }
    }
  }, [pool.poolDetails, asset1.addr, asset1.type, asset2.addr, asset2.type])

  return (
    <>
      <Modal show={showShare} onHide={() => setShowShare(false)} centered>
        <Modal.Header closeButton closeVariant={isDark ? 'white' : undefined}>
          <Modal.Title>{t('shareLink')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* ASSETS + ICONS SECTION */}
          <Row>
            <Col>
              <img
                height="35px"
                src={getToken(asset1.addr)?.symbolUrl}
                alt={`${getToken(asset1.addr)?.symbol} icon`}
                className="mx-2 rounded-circle"
              />
              {asset1.type === 'synth' && (
                <Icon
                  icon="spartaSynth"
                  size="20"
                  className="token-badge-share"
                />
              )}
              {asset1.type === 'pool' && (
                <Icon icon="spartaLp" size="20" className="token-badge-share" />
              )}
              <span className="card-title" style={{ marginLeft: '7px' }}>
                {getToken(asset1.addr)?.symbol}
                {asset1.type === 'synth' && 's'}
                {asset1.type === 'pool' && 'p'}
              </span>
            </Col>
            <Col>
              <img
                height="35px"
                src={getToken(asset2.addr)?.symbolUrl}
                alt={`${getToken(asset1.addr)?.symbol} icon`}
                className="mx-2 rounded-circle"
              />
              {asset2.type === 'synth' && (
                <Icon
                  icon="spartaSynth"
                  size="20"
                  className="token-badge-share"
                />
              )}
              {asset2.type === 'pool' && (
                <Icon icon="spartaLp" size="20" className="token-badge-share" />
              )}

              <span className="card-title" style={{ marginLeft: '7px' }}>
                {getToken(asset2.addr)?.symbol}
                {asset2.type === 'synth' && 's'}
                {asset2.type === 'pool' && 'p'}
              </span>
            </Col>
          </Row>
          <hr />
          {/* COPY LINK SECTION */}
          <Row>
            <Col xs="auto">{t('copyLink')}</Col>
            <Col>
              <span>{url.length > 50 ? `${url.substr(0, 50)}...` : url}</span>
            </Col>
            <Col xs="auto" className="text-center">
              <ShareLink url={url}>
                <Icon icon="copy" size="24" />
              </ShareLink>
            </Col>
          </Row>
          <hr />
          {/* TWITTER SHARE SECTION */}
          <Row>
            <Col xs="auto">
              <span>{t('shareViaTwiter')}</span>
            </Col>
            <Col />
            <Col xs="auto">
              <TwitterShareButton url={url} title="Spartan Protocol">
                <TwitterIcon size={32} round />
              </TwitterShareButton>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button type="Button" onClick={() => setShowShare(false)}>
            {t('cancel')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Share

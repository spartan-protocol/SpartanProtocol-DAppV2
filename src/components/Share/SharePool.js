import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { TwitterShareButton, TwitterIcon } from 'react-share'
import { Card, CardBody, Row, Col } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import CardHeader from 'reactstrap/es/CardHeader'
import CardTitle from 'reactstrap/es/CardTitle'
import ShareLink from './ShareLink'
import CopyIcon from '../../assets/icons/icon-copy.svg'
import { usePool } from '../../store/pool'
import spartaLpIcon from '../../assets/img/spartan_lp.svg'
import spartaSynthIcon from '../../assets/img/spartan_synth.svg'

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

      setUrl(
        `${window.location.href}?asset1=${
          assetSelected1 ? encodeURIComponent(assetSelected1.tokenAddress) : ''
        }${
          assetSelected2
            ? `&asset2=${encodeURIComponent(assetSelected2.tokenAddress)}`
            : ''
        }&type1=${type1}&type2=${type2}`,
      )
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
        className="btn-transparent align-self-center btn btn-secondary"
        onClick={() => setShowShare(true)}
      >
        <i className="spartan-icons icon-small icon-pools icon-dark mr-1 mt-1 ml-2" />
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
                        height="35px"
                        src={getToken(asset1?.tokenAddress)?.symbolUrl}
                        alt={`${getToken(asset1?.tokenAddress)?.symbol} icon`}
                        className="mx-2"
                      />
                      {assetType1 === 'synth' && (
                        <img
                          height="20px"
                          src={spartaSynthIcon}
                          alt={`${
                            getToken(asset1?.tokenAddress)?.symbol
                          } synth icon`}
                          className="position-absolute"
                          style={{ left: '45px', bottom: '-2px' }}
                        />
                      )}
                      {assetType1 === 'pool' && (
                        <img
                          height="20px"
                          src={spartaLpIcon}
                          alt={`${
                            getToken(asset1?.tokenAddress)?.symbol
                          } synth icon`}
                          className="position-absolute"
                          style={{ left: '45px', bottom: '-2px' }}
                        />
                      )}
                      <span
                        className="card-title"
                        style={{ marginLeft: '7px' }}
                      >
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
                        className="mx-2"
                      />
                      {assetType2 === 'synth' && (
                        <img
                          height="20px"
                          src={spartaSynthIcon}
                          alt={`${
                            getToken(asset1?.tokenAddress)?.symbol
                          } synth icon`}
                          className="position-absolute"
                          style={{ left: '45px', bottom: '-2px' }}
                        />
                      )}
                      {assetType2 === 'pool' && (
                        <img
                          height="20px"
                          src={spartaLpIcon}
                          alt={`${
                            getToken(asset1?.tokenAddress)?.symbol
                          } synth icon`}
                          className="position-absolute"
                          style={{ left: '45px', bottom: '-2px' }}
                        />
                      )}

                      <span
                        className="card-title"
                        style={{ marginLeft: '7px' }}
                      >
                        {getToken(asset2?.tokenAddress)?.symbol}
                        {assetType2 === 'synth' && 's'}
                        {assetType2 === 'pool' && 'p'}
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

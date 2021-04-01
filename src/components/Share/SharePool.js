import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { TwitterShareButton, TwitterIcon } from 'react-share'
import { Card, CardBody, Row, Col } from 'reactstrap'
import { useLocation } from 'react-router-dom'
import ShareLink from './ShareLink'
import ShareIcon from '../../assets/icons/icon-share.svg'
import SpartaIcon from '../../assets/icons/SPARTA.svg'
import CopyIcon from '../../assets/icons/icon-copy.svg'

const Share = () => {
  const [showShare, setShowShare] = useState(false)
  const location = useLocation()
  const [url, setUrl] = useState('')

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
        variant="secondary"
        className="btn-block"
        onClick={() => setShowShare(true)}
      >
        <img
          src={ShareIcon}
          alt="share icon"
          style={{
            height: '19px',
            verticalAlign: 'bottom',
            marginRight: '5px',
          }}
        />{' '}
        Show share
      </Button>
      <Modal show={showShare} onHide={() => setShowShare(false)}>
        <Modal.Body>
          <Row>
            <Col xs="12" className="text-center py-5">
              <img src={ShareIcon} alt="Share icon" />
            </Col>
          </Row>
          <Row>
            <Col xs="12">
              <Card className="card-share">
                <CardBody className="py-3">
                  <h4 className="card-title">Swap on Spartan Protocol</h4>
                  <Row>
                    <Col xs="3">
                      <img src={SpartaIcon} alt="Sparta icon" />
                      <span
                        className="card-title"
                        style={{ marginLeft: '7px' }}
                      >
                        Sparta
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
                Copy link
              </span>
              <Card className="card-link">
                <CardBody className="py-3">
                  <Row>
                    <Col xs="10">
                      <span className="card-title">
                        {url.length > 50 ? `${url.substr(0, 50)}...` : url}
                      </span>
                    </Col>
                    <Col xs="2">
                      <ShareLink url={url}>
                        <img src={CopyIcon} alt="Copy icon" />
                      </ShareLink>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <Card className="card-share">
                <CardBody className="py-3">
                  <Row>
                    <Col xs="10">
                      <span className="card-title">Share via Twitter</span>
                    </Col>
                    <Col xs="2">
                      <TwitterShareButton url={url} title="Sparta Protocol">
                        <TwitterIcon size={32} round />
                      </TwitterShareButton>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
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
                Cancel
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Share

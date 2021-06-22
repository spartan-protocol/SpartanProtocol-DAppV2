import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Row, Col, OverlayTrigger } from 'react-bootstrap'
import coinSparta from '../../../assets/icons/coin_sparta.svg'
import { usePool } from '../../../store/pool'
import { useWeb3 } from '../../../store/web3'
import { formatFromWei, formatFromUnits, BN } from '../../../utils/bigNumber'
import { calcAPY } from '../../../utils/web3Utils'
import { Tooltip } from '../../../components/Tooltip/tooltip'
import { Icon } from '../../../components/Icons/icons'

const SwapPair = ({ assetSwap }) => {
  const web3 = useWeb3()
  const pool = usePool()
  const { t } = useTranslation()
  const { poolDetails } = pool
  const asset =
    poolDetails && poolDetails.length
      ? poolDetails.find((lp) => lp.tokenAddress === assetSwap.tokenAddress)
      : 0
  const tokenPrice = BN(assetSwap?.baseAmount)
    .div(assetSwap?.tokenAmount)
    .times(web3?.spartaPrice)
  const spotPrice = BN(assetSwap?.baseAmount).div(assetSwap?.tokenAmount)
  const recentDivis = asset ? asset.recentDivis : 0
  const lastMonthDivis = asset ? asset.lastMonthDivis : 0
  const recentFees = asset ? asset.recentFees : 0
  const lastMonthFees = asset ? asset.lastMonthFees : 0
  const APY =
    recentFees && recentDivis
      ? formatFromUnits(
          calcAPY(
            recentDivis,
            lastMonthDivis,
            recentFees,
            lastMonthFees,
            assetSwap.genesis,
            assetSwap.baseAmount,
          ),
          2,
        )
      : 0

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  const apyTooltip = Tooltip('apy')

  return (
    <>
      <Card className="card-480 card-underlay">
        <Card.Body>
          <Row className="my-2">
            <Col xs="auto">
              <div className="output-card">
                <img
                  className="me-2"
                  src={getToken(assetSwap.tokenAddress)?.symbolUrl}
                  alt="Logo"
                  height="32"
                />
                {getToken(assetSwap.tokenAddress)?.symbol}
              </div>
            </Col>
            <Col className="output-card text-end">
              ${formatFromUnits(tokenPrice, 6)}
            </Col>
          </Row>

          <Row className="my-2">
            <Col xs="auto">
              <div className="output-card">
                <img className="me-2" src={coinSparta} alt="Logo" height="32" />
                SPARTA
              </div>
            </Col>
            <Col className="output-card text-end">${web3?.spartaPrice}</Col>
          </Row>

          <Row className="my-2">
            <Col xs="auto" className="text-card">
              {t('spotPrice')}
            </Col>
            <Col className="output-card text-end">
              {formatFromUnits(spotPrice, 4)} SPARTA
            </Col>
          </Row>

          <Row className="my-2">
            <Col xs="auto" className="text-card">
              {t('recentFees')}
            </Col>
            <Col className="output-card text-end">
              {formatFromWei(recentFees, 0)} SPARTA
            </Col>
          </Row>

          <Row className="my-2">
            <Col xs="auto" className="text-card">
              {t('recentDivis')}
            </Col>
            <Col className="output-card text-end">
              {assetSwap.curated === true
                ? `${formatFromWei(recentDivis, 0)} SPARTA`
                : t('notCurated')}
            </Col>
          </Row>
          <Row className="my-2">
            <Col xs="auto" className="text-card">
              {t('depth')}
            </Col>
            <Col className="output-card text-end">
              {formatFromWei(assetSwap.tokenAmount, 4)}{' '}
              {getToken(assetSwap.tokenAddress)?.symbol} <br />
              {formatFromWei(assetSwap.baseAmount, 4)} SPARTA
            </Col>
          </Row>
          <Row className="my-2">
            <Col xs="auto" className="text-card">
              APY{' '}
              <OverlayTrigger placement="auto" overlay={apyTooltip}>
                <span role="button">
                  <Icon icon="info" className="ms-1" size="17" fill="white" />
                </span>
              </OverlayTrigger>
            </Col>
            <Col className="output-card text-end">{APY}%</Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  )
}

export default SwapPair

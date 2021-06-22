import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Button,
  Card,
  Col,
  OverlayTrigger,
  Popover,
  Row,
} from 'react-bootstrap'
import { usePool } from '../../../store/pool'
import { useWeb3 } from '../../../store/web3/selector'
import { BN, formatFromUnits, formatFromWei } from '../../../utils/bigNumber'
import { calcAPY } from '../../../utils/web3Utils'
import { Icon } from '../../../components/Icons/icons'

const PoolItem = ({ asset }) => {
  const { t } = useTranslation()
  const pool = usePool()
  const history = useHistory()
  const web3 = useWeb3()
  const [showDetails, setShowDetails] = useState(false)
  const {
    tokenAddress,
    baseAmount,
    tokenAmount,
    recentDivis,
    lastMonthDivis,
    recentFees,
    lastMonthFees,
    genesis,
  } = asset
  const token = pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]
  const tokenValueBase = BN(baseAmount).div(tokenAmount)
  const tokenValueUSD = tokenValueBase.times(web3?.spartaPrice)
  const poolDepthUsd = BN(baseAmount).times(2).times(web3?.spartaPrice)
  const APY = formatFromUnits(
    calcAPY(
      recentDivis,
      lastMonthDivis,
      recentFees,
      lastMonthFees,
      genesis,
      baseAmount,
    ),
    2,
  )

  const poolAgeDays = (Date.now() - genesis * 1000) / 1000 / 60 / 60 / 24

  const toggleCollapse = () => {
    setShowDetails(!showDetails)
  }

  const tooltipApy = (
    <Popover>
      <Popover.Header>APY Info</Popover.Header>
      <Popover.Body>{t('apyInfo')}</Popover.Body>
    </Popover>
  )

  const tooltipRevenue = (
    <Popover>
      <Popover.Header>Revenue Info</Popover.Header>
      <Popover.Body>
        {t('revenueInfo', {
          days: poolAgeDays > 30 ? '30' : poolAgeDays.toFixed(2),
        })}
      </Popover.Body>
    </Popover>
  )

  const tooltipSwapRevenue = (
    <Popover>
      <Popover.Header>Swap Revenue</Popover.Header>
      <Popover.Body>
        {t('swapRevenue', {
          days: poolAgeDays > 30 ? '30' : poolAgeDays.toFixed(2),
        })}
      </Popover.Body>
    </Popover>
  )

  const tooltipDiviRevenue = (
    <Popover>
      <Popover.Header>Dividend Revenue</Popover.Header>
      <Popover.Body>
        {t('dividendRevenue', {
          days: poolAgeDays > 30 ? '30' : poolAgeDays.toFixed(2),
        })}
      </Popover.Body>
    </Popover>
  )

  return (
    <>
      <Col xs="auto">
        <Card className="card-body card-320 pt-3 pb-2 card-underlay">
          <Row className="mb-2">
            <Col xs="auto" className="pr-0">
              <img src={token.symbolUrl} alt={token.symbol} height="50" />
            </Col>
            <Col xs="auto">
              <h3 className="mb-0">{token.symbol}</h3>
              <p className="text-sm-label-alt">
                ${formatFromUnits(tokenValueUSD, 2)}
              </p>
            </Col>
            <Col className="text-end mt-2 p-0 pr-2">
              <OverlayTrigger placement="auto" overlay={tooltipApy}>
                <span role="button">
                  <Icon icon="info" className="me-1" size="17" fill="white" />
                </span>
              </OverlayTrigger>
              <p className="text-sm-label d-inline-block">APY</p>
              <p className="output-card">{APY}%</p>
            </Col>
            <Col
              xs="auto"
              className="text-end my-auto p-0 px-2"
              onClick={() => toggleCollapse()}
              role="button"
            >
              <Icon
                className=""
                icon={showDetails ? 'arrowUp' : 'arrowDown'}
                size="30"
              />
            </Col>
          </Row>
          <Row className="my-1">
            <Col xs="auto" className="text-card">
              {t('spotPrice')}
            </Col>
            <Col className="text-end output-card">
              {formatFromUnits(tokenValueBase, 2)} SPARTA
            </Col>
          </Row>
          {showDetails === true && <hr className="my-0" />}

          <Row className="my-1">
            <Col xs="auto" className="text-card">
              {t('poolDepth')}
            </Col>
            <Col className="text-end output-card">
              ${formatFromWei(poolDepthUsd, 0)} USD
            </Col>
          </Row>
          {showDetails === true && (
            <>
              <Row className="my-1">
                <Col xs="auto" className="text-card">
                  SPARTA
                </Col>
                <Col className="text-end output-card fw-light">
                  {formatFromWei(baseAmount)}
                </Col>
              </Row>

              <Row className="my-1">
                <Col xs="auto" className="text-card">
                  {token.symbol}
                </Col>
                <Col className="text-end output-card fw-light">
                  {formatFromWei(tokenAmount)}
                </Col>
              </Row>
              <hr className="my-0" />
            </>
          )}

          <Row className="my-1">
            <Col xs="auto" className="text-card">
              {t('revenue')}
              <OverlayTrigger placement="auto" overlay={tooltipRevenue}>
                <span role="button">
                  <Icon icon="info" className="ms-1" size="17" fill="white" />
                </span>
              </OverlayTrigger>
            </Col>
            <Col className="text-end output-card">
              $
              {lastMonthFees + lastMonthDivis > 0
                ? formatFromWei(
                    BN(lastMonthFees)
                      .plus(lastMonthDivis)
                      .times(web3?.spartaPrice),
                    0,
                  )
                : formatFromWei(
                    BN(recentFees).plus(recentDivis).times(web3?.spartaPrice),
                    0,
                  )}{' '}
              USD
            </Col>
          </Row>
          {showDetails === true && (
            <>
              <Row className="my-1">
                <Col xs="auto" className="text-card">
                  {t('fees')}
                  <OverlayTrigger placement="auto" overlay={tooltipSwapRevenue}>
                    <span role="button">
                      <Icon
                        icon="info"
                        className="ms-1"
                        size="17"
                        fill="white"
                      />
                    </span>
                  </OverlayTrigger>
                </Col>
                <Col className="text-end output-card fw-light">
                  {lastMonthFees > 0
                    ? formatFromWei(lastMonthFees, 0)
                    : formatFromWei(recentFees, 0)}{' '}
                  SPARTA
                </Col>
              </Row>

              <Row className="my-1">
                <Col xs="auto" className="text-card">
                  {t('dividends')}
                  <OverlayTrigger placement="auto" overlay={tooltipDiviRevenue}>
                    <span role="button">
                      <Icon
                        icon="info"
                        className="ms-1"
                        size="17"
                        fill="white"
                      />
                    </span>
                  </OverlayTrigger>
                </Col>
                <Col className="text-end output-card fw-light">
                  {asset.curated === true &&
                    lastMonthDivis > 0 &&
                    `${formatFromWei(lastMonthDivis, 0)} SPARTA`}
                  {asset.curated === true &&
                    lastMonthDivis <= 0 &&
                    `${formatFromWei(recentDivis, 0)} SPARTA`}
                  {asset.curated === false && t('notCurated')}
                </Col>
              </Row>
              <hr className="my-0" />
            </>
          )}
          <Row className="text-center mt-2">
            <Col>
              <Button
                size="sm"
                className="w-100 rounded-pill"
                onClick={() =>
                  history.push(`/pools/swap?asset1=${tokenAddress}`)
                }
              >
                {t('swap')}
              </Button>
            </Col>
            <Col>
              <Button
                size="sm"
                className="w-100 rounded-pill"
                onClick={() =>
                  history.push(`/pools/liquidity?asset1=${tokenAddress}`)
                }
              >
                {t('join')}
              </Button>
            </Col>
            <Col>
              <Button
                size="sm"
                className="w-100 rounded-pill"
                onClick={() => history.push('/vault')}
              >
                {t('stake')}
              </Button>
            </Col>
          </Row>
        </Card>
      </Col>
    </>
  )
}

export default PoolItem

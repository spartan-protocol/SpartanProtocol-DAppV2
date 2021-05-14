/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Card, Col, Row, UncontrolledTooltip } from 'reactstrap'
import { usePool } from '../../../store/pool'
import { useWeb3 } from '../../../store/web3/selector'
import { BN, formatFromUnits, formatFromWei } from '../../../utils/bigNumber'
import { calcAPY } from '../../../utils/web3Utils'

const PoolItem = ({ asset }) => {
  // const bond = useBond()
  const { t } = useTranslation()
  const pool = usePool()
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
    // curated,
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
  )

  const poolAgeDays = (Date.now() - genesis * 1000) / 1000 / 60 / 60 / 24

  const toggleCollapse = () => {
    setShowDetails(!showDetails)
  }

  return (
    <>
      <Col xs="auto">
        <Card className="card-body card-320 pt-3 pb-2">
          <Row className="mb-2">
            <Col xs="auto" className="pr-0">
              <img src={token.symbolUrl} alt={token.symbol} height="50" />
            </Col>
            <Col>
              <h3 className="mb-0">{token.symbol}</h3>
              <p className="text-sm-label-alt">
                ${formatFromUnits(tokenValueUSD)}
              </p>
            </Col>
            <Col className="mt-1 p-0">
              <p className="text-sm-label d-inline-block">APY</p>
              <i
                id="apy"
                role="button"
                className="icon-extra-small icon-info icon-light ml-1 align-middle mb-1"
              />
              <UncontrolledTooltip target="apy">
                {t('apyInfo')}
              </UncontrolledTooltip>
              <p className="output-card">{APY}%</p>
            </Col>
            <Col xs="auto" className="text-right my-auto">
              {showDetails && (
                <i
                  role="button"
                  className="icon-small icon-up icon-light"
                  onClick={() => toggleCollapse()}
                />
              )}
              {!showDetails && (
                <i
                  role="button"
                  className="icon-small icon-down icon-light"
                  onClick={() => toggleCollapse()}
                />
              )}
            </Col>
          </Row>
          <Row className="my-1">
            <Col xs="auto" className="text-card">
              {t('spotPrice')}
            </Col>
            <Col className="text-right output-card">
              {formatFromUnits(tokenValueBase)} SPARTA
            </Col>
          </Row>

          <Row className="my-1">
            <Col xs="auto" className="text-card">
              {t('poolDepth')}
            </Col>
            <Col className="text-right output-card">
              ${formatFromWei(poolDepthUsd, 0)} USD
            </Col>
          </Row>
          {showDetails === true && (
            <>
              <Row className="my-1">
                <Col xs="auto" className="text-card">
                  {t('fees')}
                  <i
                    id="fees"
                    role="button"
                    className="icon-extra-small icon-info icon-light ml-1 align-middle mb-1"
                  />
                  <UncontrolledTooltip target="fees">
                    {t('swapRevenue', {
                      days: poolAgeDays > 30 ? '30' : poolAgeDays.toFixed(2),
                    })}
                  </UncontrolledTooltip>
                </Col>
                <Col className="text-right output-card">
                  {lastMonthFees > 0
                    ? formatFromWei(lastMonthFees, 0)
                    : formatFromWei(recentFees, 0)}{' '}
                  SPARTA
                </Col>
              </Row>

              <Row className="my-1">
                <Col xs="auto" className="text-card">
                  {t('dividends')}
                  <i
                    id="divis"
                    role="button"
                    className="icon-extra-small icon-info icon-light ml-1 align-middle mb-1"
                  />
                  <UncontrolledTooltip target="divis">
                    {t('dividendRevenue', {
                      days: poolAgeDays > 30 ? '30' : poolAgeDays.toFixed(2),
                    })}
                  </UncontrolledTooltip>
                </Col>
                <Col className="text-right output-card">
                  {asset.curated === true &&
                    lastMonthDivis > 0 &&
                    `${formatFromWei(lastMonthDivis, 0)} SPARTA`}
                  {asset.curated === true &&
                    lastMonthDivis <= 0 &&
                    `${formatFromWei(recentDivis, 0)} SPARTA`}
                  {asset.curated === false && 'Not Curated'}
                </Col>
              </Row>
            </>
          )}
          <Row className="text-center mt-2">
            <Col xs="4" className="p-1">
              <Link to={`/dapp/pools/swap?asset1=${tokenAddress}`}>
                <Button color="primary" className="btn-sm w-100">
                  {t('swap')}
                </Button>
              </Link>
            </Col>
            <Col xs="4" className="p-1">
              <Link to={`/dapp/pools/liquidity?asset1=${tokenAddress}`}>
                <Button color="primary" className="btn-sm w-100">
                  {t('join')}
                </Button>
              </Link>
            </Col>
            <Col xs="4" className="p-1">
              <Link to="/dapp/vault">
                <Button color="primary" className="btn-sm w-100">
                  {t('stake')}
                </Button>
              </Link>
            </Col>
          </Row>
        </Card>
      </Col>
    </>
  )
}

export default PoolItem

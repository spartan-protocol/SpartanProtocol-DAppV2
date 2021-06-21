import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  OverlayTrigger,
  Popover,
  Row,
} from 'react-bootstrap'
import { MDBTooltip } from 'mdb-react-ui-kit'
import { usePool } from '../../../store/pool'
import { useWeb3 } from '../../../store/web3/selector'
import { BN, formatFromUnits, formatFromWei } from '../../../utils/bigNumber'
import { calcAPY } from '../../../utils/web3Utils'
import downIcon from '../../../assets/icons/arrow-down-light.svg'
import upIcon from '../../../assets/icons/arrow-up-light.svg'

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

  const apyTooltip = (
    <Popover>
      <Popover.Header>APY Info</Popover.Header>
      <Popover.Body>{t('apyInfo')}</Popover.Body>
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
            <Col className="text-right mt-1 p-0 pr-2">
              <OverlayTrigger
                trigger="click"
                placement="auto"
                overlay={apyTooltip}
                rootClose
              >
                <i className="icon-extra-small icon-info icon-light ml-1 align-middle mb-1" />
              </OverlayTrigger>
              <p className="text-sm-label d-inline-block">APY</p>
              <p className="output-card">{APY}%</p>
            </Col>
            <Col xs="auto" className="text-right my-auto p-0 px-2">
              <img
                onClick={() => toggleCollapse()}
                src={showDetails ? upIcon : downIcon}
                alt={showDetails ? 'upIcon' : 'downIcon'}
                className="swap-icon-color"
                aria-hidden="true"
                style={{
                  cursor: 'pointer',
                  height: '30px',
                  width: '30px',
                  top: '-15px',
                }}
              />
            </Col>
          </Row>
          <Row className="my-1">
            <Col xs="auto" className="text-card">
              {t('spotPrice')}
            </Col>
            <Col className="text-right output-card">
              {formatFromUnits(tokenValueBase, 2)} SPARTA
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
                  <MDBTooltip
                    tag="i"
                    wrapperClass="icon-extra-small icon-info icon-light ml-1 align-middle mb-1"
                    title={t('swapRevenue', {
                      days: poolAgeDays > 30 ? '30' : poolAgeDays.toFixed(2),
                    })}
                    placement="auto"
                  />
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
                  <MDBTooltip
                    tag="i"
                    wrapperClass="icon-extra-small icon-info icon-light ml-1 align-middle mb-1"
                    title={t('dividendRevenue', {
                      days: poolAgeDays > 30 ? '30' : poolAgeDays.toFixed(2),
                    })}
                    placement="auto"
                  />
                </Col>
                <Col className="text-right output-card">
                  {asset.curated === true &&
                    lastMonthDivis > 0 &&
                    `${formatFromWei(lastMonthDivis, 0)} SPARTA`}
                  {asset.curated === true &&
                    lastMonthDivis <= 0 &&
                    `${formatFromWei(recentDivis, 0)} SPARTA`}
                  {asset.curated === false && t('notCurated')}
                </Col>
              </Row>
            </>
          )}
          <Row className="text-center mt-2">
            <ButtonGroup xs="sm">
              <Button
                onClick={() =>
                  history.push(`/pools/swap?asset1=${tokenAddress}`)
                }
              >
                {t('swap')}
              </Button>
              <Button
                onClick={() =>
                  history.push(`/pools/liquidity?asset1=${tokenAddress}`)
                }
              >
                {t('join')}
              </Button>
              <Button onClick={() => history.push('/vault')}>
                {t('stake')}
              </Button>
            </ButtonGroup>
          </Row>
        </Card>
      </Col>
    </>
  )
}

export default PoolItem

import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Badge,
  Button,
  Card,
  Col,
  OverlayTrigger,
  Row,
  ProgressBar,
} from 'react-bootstrap'
import { usePool } from '../../../store/pool'
import { useWeb3 } from '../../../store/web3/selector'
import { BN, formatFromUnits, formatFromWei } from '../../../utils/bigNumber'
import { getAddresses } from '../../../utils/web3'
import { Icon } from '../../../components/Icons/icons'
import { Tooltip } from '../../../components/Tooltip/tooltip'
import { calcAPY } from '../../../utils/math/nonContract'

const PoolItem = ({ asset }) => {
  const { t } = useTranslation()
  const pool = usePool()
  const history = useHistory()
  const web3 = useWeb3()
  const addr = getAddresses()
  const [showDetails, setShowDetails] = useState(false)
  const isLightMode = window.localStorage.getItem('theme')
  const {
    tokenAddress,
    baseAmount,
    tokenAmount,
    recentDivis,
    lastMonthDivis,
    fees,
    genesis,
    newPool,
    curated,
  } = asset
  const token = pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]
  const tokenValueBase = BN(baseAmount).div(tokenAmount)
  const tokenValueUSD = tokenValueBase.times(web3?.spartaPrice)
  const poolDepthUsd = BN(baseAmount).times(2).times(web3?.spartaPrice)
  const APY = formatFromUnits(calcAPY(asset), 2)

  const getDivis = () =>
    BN(recentDivis).isGreaterThan(lastMonthDivis) ? recentDivis : lastMonthDivis

  const poolAgeDays = (Date.now() - genesis * 1000) / 1000 / 60 / 60 / 24

  const toggleCollapse = () => {
    setShowDetails(!showDetails)
  }

  const revenueTooltip = Tooltip(
    t,
    'revenue',
    poolAgeDays > 30 ? '30' : poolAgeDays.toFixed(2),
  )
  const swapRevTooltip = Tooltip(
    t,
    'swapRevenue',
    poolAgeDays > 30 ? '30' : poolAgeDays.toFixed(2),
  )
  const diviRevTooltip = Tooltip(
    t,
    'dividendRevenue',
    poolAgeDays > 30 ? '30' : poolAgeDays.toFixed(2),
  )
  const poolCapTooltip = Tooltip(t, 'poolCap')

  const getDepthPC = () => BN(baseAmount).div(asset.baseCap).times(100)

  return (
    <>
      <Col xs="auto">
        <Card className="card-320 pb-2 card-underlay card-alt">
          <Card.Header>
            <h6 className="mb-0 text-center">
              {newPool && (
                <Badge bg="dark" className="p-1 me-1">
                  NEW
                  <OverlayTrigger
                    placement="auto"
                    overlay={Tooltip(t, 'newPool', token.symbol)}
                  >
                    <span role="button">
                      <Icon
                        icon="info"
                        className="ms-1"
                        size="15"
                        // fill={isLightMode ? 'black' : 'white'}
                      />
                    </span>
                  </OverlayTrigger>
                </Badge>
              )}
              {curated && (
                <Badge bg="dark" className="p-1 me-1">
                  CURATED
                  <OverlayTrigger
                    placement="auto"
                    overlay={Tooltip(t, 'poolCurated', token.symbol)}
                  >
                    <span role="button">
                      <Icon
                        icon="info"
                        className="ms-1"
                        size="15"
                        // fill={isLightMode ? 'black' : 'white'}
                      />
                    </span>
                  </OverlayTrigger>
                </Badge>
              )}
              {!curated && (
                <Badge bg="dark" className="p-1 me-1">
                  NORMAL
                  <OverlayTrigger
                    placement="auto"
                    overlay={Tooltip(t, 'poolNormal', token.symbol)}
                  >
                    <span role="button">
                      <Icon
                        icon="info"
                        className="ms-1"
                        size="15"
                        // fill={isLightMode ? 'black' : 'white'}
                      />
                    </span>
                  </OverlayTrigger>
                </Badge>
              )}
              {!asset.frozen && (
                <Badge bg="success" className="p-1">
                  SAFE
                  <OverlayTrigger
                    placement="auto"
                    overlay={Tooltip(t, 'poolSafe', token.symbol)}
                  >
                    <span role="button">
                      <Icon
                        icon="info"
                        className="ms-1"
                        size="15"
                        fill={isLightMode ? 'black' : 'white'}
                      />
                    </span>
                  </OverlayTrigger>
                </Badge>
              )}
              {asset.frozen && (
                <Badge bg="danger" className="p-1">
                  FROZEN
                  <OverlayTrigger
                    placement="auto"
                    overlay={Tooltip(t, 'poolFrozen', token.symbol)}
                  >
                    <span role="button">
                      <Icon
                        icon="info"
                        className="ms-1"
                        size="15"
                        fill={isLightMode ? 'black' : 'white'}
                      />
                    </span>
                  </OverlayTrigger>
                </Badge>
              )}
            </h6>
          </Card.Header>
          <Card.Body>
            <Row className="mb-2">
              <Col xs="auto" className="pe-0">
                <img
                  src={token.symbolUrl}
                  className="rounded-circle"
                  alt={token.symbol}
                  height="45"
                />{' '}
              </Col>
              <Col xs="auto" className="pe-0">
                <h3 className="mb-0">{token.symbol}</h3>
                <p className="text-sm-label-alt">
                  ${formatFromUnits(tokenValueUSD, 2)}
                </p>
              </Col>
              <Col className="text-end mt-1 p-0 pr-2">
                <OverlayTrigger placement="auto" overlay={Tooltip(t, 'apy')}>
                  <span role="button">
                    <Icon
                      icon="info"
                      className="me-1"
                      size="17"
                      fill={isLightMode ? 'black' : 'white'}
                    />
                  </span>
                </OverlayTrigger>
                <p className="text-sm-label d-inline-block">APY</p>
                <p className="output-card">{APY}%</p>
              </Col>
              <Col
                xs="auto"
                className="text-end my-auto p-0 px-1"
                onClick={() => toggleCollapse()}
                role="button"
              >
                <Icon
                  className=""
                  icon={showDetails ? 'arrowUp' : 'arrowDown'}
                  fill={isLightMode ? 'black' : 'white'}
                  size="30"
                />
              </Col>
            </Row>

            <Row className="my-1">
              <Col xs="auto" className="text-card pe-0">
                {t('poolCap')}
                <OverlayTrigger placement="auto" overlay={poolCapTooltip}>
                  <span role="button">
                    <Icon
                      icon="info"
                      className="ms-1"
                      size="17"
                      fill={isLightMode ? 'black' : 'white'}
                    />
                  </span>
                </OverlayTrigger>
              </Col>
              <Col className="text-end output-card my-auto">
                <ProgressBar style={{ height: '5px' }} className="">
                  <ProgressBar
                    variant={getDepthPC() > 95 ? 'primary' : 'success'}
                    key={1}
                    now={getDepthPC()}
                  />
                </ProgressBar>
              </Col>
            </Row>
            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('poolDepth')}
              </Col>
              <Col className="text-end output-card">
                ${formatFromWei(poolDepthUsd, 2)}
                <Icon icon="usdc" className="ms-1" size="15" />
              </Col>
            </Row>
            {showDetails === true && (
              <>
                <Row className="my-1">
                  <Col xs="auto" className="text-card">
                    SPARTA
                  </Col>
                  <Col className="text-end output-card fw-light">
                    {formatFromWei(baseAmount, 0)}
                    <Icon icon="spartav2" className="ms-1" size="15" />
                  </Col>
                </Row>

                <Row className="my-1">
                  <Col xs="auto" className="text-card">
                    {token.symbol}
                  </Col>
                  <Col className="text-end output-card fw-light">
                    {formatFromWei(tokenAmount)}
                    <img
                      height="15px"
                      src={token.symbolUrl}
                      alt={token.name}
                      className="rounded-circle ms-1"
                    />
                  </Col>
                </Row>
                <hr className="my-0" />
              </>
            )}

            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('spotPrice')}
              </Col>
              <Col className="text-end output-card">
                {formatFromUnits(tokenValueBase, 2)}
                <Icon icon="spartav2" className="ms-1" size="15" />
              </Col>
            </Row>
            {showDetails === true && <hr className="my-0" />}

            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('revenue')}
                <OverlayTrigger placement="auto" overlay={revenueTooltip}>
                  <span role="button">
                    <Icon
                      icon="info"
                      className="ms-1"
                      size="17"
                      fill={isLightMode ? 'black' : 'white'}
                    />
                  </span>
                </OverlayTrigger>
              </Col>
              <Col className="text-end output-card">
                $
                {formatFromWei(
                  BN(fees).plus(getDivis()).times(web3?.spartaPrice),
                  0,
                )}
                <Icon icon="usdc" className="ms-1" size="15" />
              </Col>
            </Row>
            {showDetails === true && (
              <>
                <Row className="my-1">
                  <Col xs="auto" className="text-card">
                    {t('fees')}
                    <OverlayTrigger placement="auto" overlay={swapRevTooltip}>
                      <span role="button">
                        <Icon
                          icon="info"
                          className="ms-1"
                          size="17"
                          fill={isLightMode ? 'black' : 'white'}
                        />
                      </span>
                    </OverlayTrigger>
                  </Col>
                  <Col className="text-end output-card fw-light">
                    {formatFromWei(fees, 0)}
                    <Icon icon="spartav2" className="ms-1" size="15" />
                  </Col>
                </Row>

                <Row className="my-1">
                  <Col xs="auto" className="text-card">
                    {t('dividends')}
                    <OverlayTrigger placement="auto" overlay={diviRevTooltip}>
                      <span role="button">
                        <Icon
                          icon="info"
                          className="ms-1"
                          size="17"
                          fill={isLightMode ? 'black' : 'white'}
                        />
                      </span>
                    </OverlayTrigger>
                  </Col>
                  <Col className="text-end output-card fw-light">
                    {asset.curated === true && (
                      <>
                        {formatFromWei(getDivis(), 0)}
                        <Icon icon="spartav2" className="ms-1" size="15" />
                      </>
                    )}
                    {asset.curated === false && t('notCurated')}
                  </Col>
                </Row>
                <hr className="my-0" />
              </>
            )}
          </Card.Body>
          <Card.Footer>
            <Row className="text-center mt-2">
              <Col>
                <Button
                  size="sm"
                  variant="primary"
                  className="w-100 rounded-pill"
                  onClick={() =>
                    history.push(
                      `/swap?asset1=${tokenAddress}&asset2=${addr.spartav2}&type1=token&type2=token`,
                    )
                  }
                >
                  {t('swap')}
                </Button>
              </Col>
              <Col>
                <Button
                  size="sm"
                  variant="primary"
                  className="w-100 rounded-pill"
                  onClick={() =>
                    history.push(`/liquidity?asset1=${tokenAddress}`)
                  }
                >
                  {t('join')}
                </Button>
              </Col>
              <Col>
                <Button
                  size="sm"
                  variant="primary"
                  className="w-100 rounded-pill"
                  disabled={!asset.curated}
                  onClick={() => history.push('/vault')}
                >
                  {t('stake')}
                </Button>
              </Col>
            </Row>
          </Card.Footer>
        </Card>
      </Col>
    </>
  )
}

export default PoolItem

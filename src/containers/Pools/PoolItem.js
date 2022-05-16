import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Row from 'react-bootstrap/Row'
import { usePool } from '../../store/pool'
import { useWeb3 } from '../../store/web3'
import {
  BN,
  convertFromWei,
  formatFromUnits,
  formatFromWei,
  formatShortNumber,
} from '../../utils/bigNumber'
import { getAddresses } from '../../utils/web3'
import { Icon } from '../../components/Icons/index'
import { Tooltip } from '../../components/Tooltip/index'
import { calcAPY } from '../../utils/math/nonContract'
import spartaIcon from '../../assets/tokens/spartav2.svg'

import styles from './styles.module.scss'

const PoolItem = ({ asset, daoApy }) => {
  const { t } = useTranslation()
  const pool = usePool()
  const history = useHistory()
  const web3 = useWeb3()
  const addr = getAddresses()
  const [showDetails, setShowDetails] = useState(false)
  const {
    tokenAddress,
    baseAmount,
    tokenAmount,
    genesis,
    newPool,
    curated,
    safety,
    oldRate,
    newRate,
    baseCap,
  } = asset
  const token = pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]
  const tokenValueBase = BN(baseAmount).div(tokenAmount)
  const tokenValueUSD = tokenValueBase.times(web3?.spartaPrice)
  const poolDepthUsd = BN(baseAmount).times(2).times(web3?.spartaPrice)

  const getFees = () =>
    pool.incentives
      ? pool.incentives.filter((x) => x.address === asset.address)[0].fees
      : 0

  const getDivis = () =>
    curated && pool.incentives
      ? pool.incentives.filter((x) => x.address === asset.address)[0].incentives
      : 0

  const APY = calcAPY(asset, getFees(), getDivis())

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
    'incentivesRevenue',
    poolAgeDays > 30 ? '30' : poolAgeDays.toFixed(2),
  )
  const poolCapTooltip = Tooltip(t, 'poolCap')
  const poolRatioTooltip = Tooltip(t, 'poolRatio')

  const isAtCaps = () =>
    BN(baseAmount).gt(BN(baseCap).minus(5000000000000000000000))
  const getDepthPC = () => BN(baseAmount).div(asset.baseCap).times(100)
  const getRatioPC = () => BN(safety).times(100)
  const getScaled = () => {
    const scale = BN(200)
    const multi = BN(100)
    const ratio = getRatioPC()
    if (safety <= 0) {
      return 50
    }
    if (BN(newRate).isLessThan(oldRate)) {
      return BN(50).minus(ratio.div(scale).times(multi)) + 0
    }
    if (BN(newRate).isGreaterThan(oldRate)) {
      return BN(50).plus(ratio.div(scale).times(multi)) + 0
    }
    return 50
  }

  return (
    <>
      <Col xs="12" sm="6" lg="4">
        <Card className={styles.poolItem}>
          <Card.Body className="pb-0">
            <Row className="mb-2">
              <Col xs="auto" className="position-relative">
                <img
                  src={token.symbolUrl}
                  className="rounded-circle"
                  alt={token.symbol}
                  height="45"
                />
                <img
                  height="25px"
                  src={spartaIcon}
                  alt="Sparta synth token icon"
                  className="position-absolute"
                  style={{ right: '5px', bottom: '0px' }}
                />
              </Col>
              <Col className={styles.poolHeader}>
                <h3 className="mb-0">{token.symbol}</h3>
                <OverlayTrigger
                  placement="auto"
                  overlay={Tooltip(t, `$${formatFromUnits(tokenValueUSD, 18)}`)}
                >
                  <span role="button" className="fw-light">
                    {`$${formatFromUnits(tokenValueUSD, 2)}`}
                  </span>
                </OverlayTrigger>
              </Col>
              <Col xs="auto">
                {asset.frozen ? (
                  <Badge bg="danger" className="w-100 py-1 px-3 mb-1 text-end">
                    {t('inactive')}
                    <OverlayTrigger
                      placement="auto"
                      overlay={Tooltip(t, 'poolInactive', token.symbol)}
                    >
                      <span role="button">
                        <Icon
                          icon="info"
                          className="ms-1"
                          size="15"
                          fill="white"
                        />
                      </span>
                    </OverlayTrigger>
                  </Badge>
                ) : (
                  <Badge bg="success" className="w-100 py-1 px-3 mb-1 text-end">
                    {t('active')}
                    <OverlayTrigger
                      placement="auto"
                      overlay={Tooltip(t, 'poolActive', token.symbol)}
                    >
                      <span role="button">
                        <Icon
                          icon="info"
                          className="ms-1"
                          size="15"
                          fill="white"
                        />
                      </span>
                    </OverlayTrigger>
                  </Badge>
                )}
                <br />
                {newPool ? (
                  <Badge className="w-100 py-1 px-3 text-end">
                    {t('new')}
                    <OverlayTrigger
                      placement="auto"
                      overlay={Tooltip(t, 'newPool', token.symbol)}
                    >
                      <span role="button">
                        <Icon
                          icon="info"
                          className="ms-1"
                          size="15"
                          fill="white"
                        />
                      </span>
                    </OverlayTrigger>
                  </Badge>
                ) : curated ? (
                  <Badge bg="success" className="w-100 py-1 px-3 text-end">
                    {t('curated')}
                    <OverlayTrigger
                      placement="auto"
                      overlay={Tooltip(t, 'poolCurated', token.symbol)}
                    >
                      <span role="button">
                        <Icon
                          icon="info"
                          className="ms-1"
                          size="15"
                          fill="white"
                        />
                      </span>
                    </OverlayTrigger>
                  </Badge>
                ) : (
                  <Badge className="w-100 py-1 px-3 text-end">
                    {t('normal')}
                    <OverlayTrigger
                      placement="auto"
                      overlay={Tooltip(t, 'poolNormal', token.symbol)}
                    >
                      <span role="button">
                        <Icon
                          icon="info"
                          className="ms-1"
                          size="15"
                          fill="white"
                        />
                      </span>
                    </OverlayTrigger>
                  </Badge>
                )}
              </Col>
            </Row>

            <Row className="my-1">
              <Col xs="auto" className="pe-0">
                {t('estimatedApy')}
                <OverlayTrigger placement="auto" overlay={Tooltip(t, 'apy')}>
                  <span role="button">
                    <Icon icon="info" className="ms-1" size="17" />
                  </span>
                </OverlayTrigger>
              </Col>
              <Col className="text-end">
                {formatFromUnits(
                  curated && daoApy ? BN(APY).plus(daoApy) : APY,
                  2,
                )}
                %
                <OverlayTrigger
                  placement="auto"
                  overlay={
                    <Popover>
                      <Popover.Body>
                        <Row>
                          <Col xs="6">{t('poolApy')}</Col>
                          <Col xs="6" className="text-end">
                            {formatFromUnits(APY, 2)}%
                          </Col>
                          <Col xs="6">{t('vaultApy')}</Col>
                          <Col xs="6" className="text-end">
                            {curated
                              ? `${formatFromUnits(daoApy, 2)}%`
                              : t('notCurated')}
                          </Col>
                          <Col xs="12">
                            <hr className="my-2" />
                          </Col>
                          <Col xs="6">
                            <strong>{t('totalApy')}</strong>
                          </Col>
                          <Col xs="6" className="text-end">
                            <strong>
                              {formatFromUnits(
                                curated && daoApy ? BN(APY).plus(daoApy) : APY,
                                2,
                              )}
                              %
                            </strong>
                          </Col>
                          <Col xs="12">
                            <hr className="my-2" />
                          </Col>
                          <Col xs="12" className="text-center">
                            {t('apyEstimatedInfo')}
                          </Col>
                        </Row>
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <span role="button">
                    <Icon icon="info" className="ms-1" size="17" />
                  </span>
                </OverlayTrigger>
              </Col>
            </Row>
            {showDetails === true && (
              <>
                <Row className="my-1">
                  <Col xs="auto" className="fw-light">
                    {t('poolApy')}
                    <OverlayTrigger
                      placement="auto"
                      overlay={Tooltip(t, 'apyPool')}
                    >
                      <span role="button">
                        <Icon icon="info" className="ms-1" size="17" />
                      </span>
                    </OverlayTrigger>
                  </Col>
                  <Col className="text-end fw-light">
                    {formatFromUnits(APY, 2)}%
                  </Col>
                </Row>

                <Row className="my-1">
                  <Col xs="auto" className="fw-light">
                    {t('vaultApy')}
                    <OverlayTrigger
                      placement="auto"
                      overlay={Tooltip(t, 'apyVault')}
                    >
                      <span role="button">
                        <Icon icon="info" className="ms-1" size="17" />
                      </span>
                    </OverlayTrigger>
                  </Col>
                  <Col className="text-end fw-light">
                    {curated && daoApy
                      ? `+ ${formatFromUnits(daoApy, 2)}%`
                      : t('notCurated')}
                  </Col>
                </Row>
                <hr className="my-0" />
              </>
            )}

            <Row className="my-1">
              <Col xs="auto" className="pe-0">
                {t('poolCap')}
                <OverlayTrigger placement="auto" overlay={poolCapTooltip}>
                  <span role="button">
                    <Icon icon="info" className="ms-1" size="17" />
                  </span>
                </OverlayTrigger>
              </Col>
              <Col className="text-end my-auto">
                <Row>
                  <Col xs="auto">
                    {formatShortNumber(convertFromWei(baseAmount))}
                  </Col>
                  <Col className="my-auto px-0">
                    <ProgressBar style={{ height: '5px' }} className="">
                      <ProgressBar
                        variant={isAtCaps() ? 'danger' : 'success'}
                        key={1}
                        now={getDepthPC()}
                      />
                    </ProgressBar>
                  </Col>
                  <Col xs="auto">
                    {formatShortNumber(convertFromWei(asset.baseCap))}
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row className="my-1">
              <Col xs="auto" className="">
                {t('poolDepth')}
              </Col>
              <Col className="text-end">
                {`$${formatFromWei(poolDepthUsd, 0)}`}
              </Col>
            </Row>
            {showDetails === true && (
              <>
                <Row className="my-1">
                  <Col xs="auto" className="fw-light">
                    SPARTA
                  </Col>
                  <Col className="text-end fw-light">
                    {formatFromWei(baseAmount, 2)}
                    <Icon icon="spartav2" className="ms-1" size="15" />
                  </Col>
                </Row>

                <Row className="my-1">
                  <Col xs="auto" className="fw-light">
                    {token.symbol}
                  </Col>
                  <Col className="text-end fw-light">
                    {formatFromWei(tokenAmount, 2)}
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
              <Col xs="auto" className="">
                {t('spotPrice')}
              </Col>
              <Col className="text-end">
                {formatFromUnits(tokenValueBase, 2)}
                <Icon icon="spartav2" className="ms-1" size="15" />
              </Col>
            </Row>
            {showDetails === true && (
              <>
                <Row className="my-1">
                  <Col xs="auto" className="fw-light">
                    {t('TWAP')}
                  </Col>
                  <Col className="text-end fw-light">
                    {formatFromWei(oldRate, 2)}
                    <Icon icon="spartav2" className="ms-1" size="15" />
                  </Col>
                </Row>
                <Row className="my-1">
                  <Col xs="auto" className="pe-0 fw-light">
                    {t('poolRatio')}
                    <OverlayTrigger placement="auto" overlay={poolRatioTooltip}>
                      <span role="button">
                        <Icon icon="info" className="ms-1" size="17" />
                      </span>
                    </OverlayTrigger>
                  </Col>
                  <Col className="text-end my-auto">
                    <ProgressBar style={{ height: '5px' }} className="rounded">
                      <ProgressBar
                        variant="black"
                        key={1}
                        now={getScaled() <= 35 ? getScaled() : 16.5}
                        className="rounded-start"
                      />
                      {getScaled() <= 35 && <ProgressBar key={2} now={6} />}
                      <ProgressBar
                        variant="black"
                        key={3}
                        now={getScaled() <= 35 ? getScaled() - 35 : 16.5}
                      />

                      <ProgressBar
                        key={5}
                        now={
                          getScaled() > 35 && getScaled() < 65
                            ? getScaled() - 35
                            : 14.5
                        }
                        className="rounded-start"
                      />
                      {getScaled() > 35 && getScaled() < 65 && (
                        <ProgressBar variant="danger" key={6} now={6} />
                      )}
                      <ProgressBar
                        key={7}
                        now={
                          getScaled() > 35 && getScaled() < 65
                            ? 65 - getScaled()
                            : 14.5
                        }
                        className="rounded-end"
                      />

                      <ProgressBar
                        variant="black"
                        key={9}
                        now={getScaled() >= 65 ? getScaled() - 65 : 16.5}
                      />
                      {getScaled() >= 65 && <ProgressBar key={10} now={6} />}
                      <ProgressBar
                        variant="black"
                        key={11}
                        now={getScaled() >= 65 ? 100 - getScaled() : 16.5}
                        className="rounded-end"
                      />
                    </ProgressBar>
                  </Col>
                </Row>
                <hr className="my-0" />
              </>
            )}

            <Row className="my-1">
              <Col xs="auto" className="">
                {t('revenue')}
                <OverlayTrigger placement="auto" overlay={revenueTooltip}>
                  <span role="button">
                    <Icon icon="info" className="ms-1" size="17" />
                  </span>
                </OverlayTrigger>
              </Col>
              <Col className="text-end">
                $
                {formatFromWei(
                  BN(getFees()).plus(getDivis()).times(web3?.spartaPrice),
                  0,
                )}
              </Col>
            </Row>
            {showDetails === true && (
              <>
                <Row className="my-1">
                  <Col xs="auto" className="fw-light">
                    {t('fees')}
                    <OverlayTrigger placement="auto" overlay={swapRevTooltip}>
                      <span role="button">
                        <Icon icon="info" className="ms-1" size="17" />
                      </span>
                    </OverlayTrigger>
                  </Col>
                  <Col className="text-end fw-light">
                    {formatFromWei(getFees(), 0)}
                    <Icon icon="spartav2" className="ms-1" size="15" />
                  </Col>
                </Row>

                <Row className="my-1">
                  <Col xs="auto" className="fw-light">
                    {t('incentives')}
                    <OverlayTrigger placement="auto" overlay={diviRevTooltip}>
                      <span role="button">
                        <Icon icon="info" className="ms-1" size="17" />
                      </span>
                    </OverlayTrigger>
                  </Col>
                  <Col className="text-end fw-light">
                    {asset.curated === true && (
                      <>
                        {formatFromWei(getDivis(), 0)}
                        <Icon icon="spartav2" className="ms-1" size="15" />
                      </>
                    )}
                    {asset.curated === false && t('notCurated')}
                  </Col>
                </Row>
              </>
            )}
            <Row>
              <div
                className="text-center mt-2"
                onClick={() => toggleCollapse()}
                role="button"
                aria-hidden
              >
                {showDetails ? t('lessDetails') : t('moreDetails')}
                <Icon
                  className="ms-2 mb-1"
                  icon={showDetails ? 'arrowUp' : 'arrowDown'}
                  size="13"
                />
              </div>
            </Row>
          </Card.Body>
          <Card.Footer>
            <Row className="text-center mt-2">
              <Col>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  className="w-100"
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
                  variant="outline-secondary"
                  className="w-100"
                  onClick={() =>
                    history.push(`/liquidity?asset1=${tokenAddress}`)
                  }
                >
                  {t('join')}
                </Button>
              </Col>
              {asset.curated && (
                <Col>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    className="w-100"
                    disabled={!asset.curated}
                    onClick={() => history.push('/vaults')}
                  >
                    {t('stake')}
                  </Button>
                </Col>
              )}
            </Row>
          </Card.Footer>
        </Card>
      </Col>
    </>
  )
}

export default PoolItem

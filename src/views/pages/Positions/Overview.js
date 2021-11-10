import React, { useState, useEffect } from 'react'
import {
  Card,
  Col,
  Row,
  Button,
  OverlayTrigger,
  Popover,
} from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import { usePool } from '../../../store/pool'
import {
  getAddresses,
  getItemFromArray,
  getNetwork,
  tempChains,
} from '../../../utils/web3'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import WrongNetwork from '../../../components/Common/WrongNetwork'
import { Icon } from '../../../components/Icons/icons'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import { useBond } from '../../../store/bond'
import { useDao } from '../../../store/dao'
import {
  calcLiqValueAll,
  getBlockTimestamp,
  getSecsSince,
  getTimeSince,
} from '../../../utils/math/nonContract'
import { useWeb3 } from '../../../store/web3'
import AssetSelect from '../../../components/AssetSelect/AssetSelect'
import {
  calcLiqValue,
  calcSpotValueInBase,
  getBond,
  getDao,
  getPool,
  getToken,
} from '../../../utils/math/utils'
import { getMemberPositions } from '../../../utils/extCalls'

const Positions = () => {
  const isLightMode = window.localStorage.getItem('theme')
  const { t } = useTranslation()
  const pool = usePool()
  const bond = useBond()
  const dao = useDao()
  const web3 = useWeb3()
  const wallet = useWeb3React()
  const addr = getAddresses()

  const [showUsd, setShowUsd] = useState(true)
  const [showUsdPool, setShowUsdPool] = useState(true)
  const [poolPos, setPoolPos] = useState(false)
  const [position, setPosition] = useState(false)
  const [network, setnetwork] = useState(getNetwork())
  const [trigger0, settrigger0] = useState(0)

  const isLoading = () => {
    if (
      !pool.tokenDetails ||
      !pool.poolDetails ||
      !dao.daoDetails ||
      !bond.bondDetails
    ) {
      return true
    }
    return false
  }

  const tryParsePool = (data) => {
    try {
      return JSON.parse(data)
    } catch (e) {
      return pool.poolDetails[0]
    }
  }

  useEffect(() => {
    const getAssetDetails = () => {
      if (!isLoading()) {
        window.localStorage.setItem('assetType1', 'pool')
        let asset1 = tryParsePool(window.localStorage.getItem('assetSelected1'))
        asset1 =
          asset1 &&
          asset1.address !== '' &&
          pool.poolDetails.find((x) => x.tokenAddress === asset1.tokenAddress)
            ? asset1
            : { tokenAddress: addr.bnb }
        asset1 = getItemFromArray(asset1, pool.poolDetails)
        setPoolPos(asset1)
        window.localStorage.setItem('assetSelected1', JSON.stringify(asset1))
      }
    }
    getAssetDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isLoading,
    pool.poolDetails,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetSelected1'),
  ])

  const getWallet = () => {
    if (wallet?.account) {
      return wallet.account.toString().toLowerCase()
    }
    return false
  }

  const _getToken = () => getToken(poolPos.tokenAddress, pool.tokenDetails)

  const tryParse = (data) => {
    try {
      return JSON.parse(data)
    } catch (e) {
      return false
    }
  }

  const getFromLS = () => {
    let _position = false
    const _positions = tryParse(window.localStorage.getItem('sp_positions'))
    _position = _positions?.filter((scope) => scope.id === getWallet())[0]
    if (_position) {
      setPosition(_position)
    }
  }

  const getData = () => {
    setnetwork(getNetwork())
    getFromLS()
  }
  useEffect(() => {
    if (trigger0 === 0) {
      getData()
    }
    const timer = setTimeout(() => {
      getData()
      settrigger0(trigger0 + 1)
    }, 2000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger0])

  const updateLS = (queryData) => {
    const walletAddr = getWallet()
    if (walletAddr) {
      let posArray = tryParse(window.localStorage.getItem('sp_positions'))
      if (!posArray) {
        posArray = []
        posArray.push({ id: walletAddr })
      }
      let indexWal = posArray.findIndex((pos) => pos.id === walletAddr)
      if (indexWal === -1) {
        posArray.push({ id: walletAddr })
        indexWal = posArray.findIndex((pos) => pos.id === walletAddr)
      }
      posArray[indexWal].lastUpdated = getBlockTimestamp()
      posArray[indexWal].fees = queryData.fees
      posArray[indexWal].id = queryData.id
      posArray[indexWal].netAddSparta = queryData.netAddSparta
      posArray[indexWal].netAddUsd = queryData.netAddUsd
      posArray[indexWal].netHarvestSparta = queryData.netHarvestSparta
      posArray[indexWal].netHarvestUsd = queryData.netHarvestUsd
      posArray[indexWal].netRemSparta = queryData.netRemSparta
      posArray[indexWal].netRemUsd = queryData.netRemUsd
      posArray[indexWal].positions = queryData.positions
      window.localStorage.setItem('sp_positions', JSON.stringify(posArray))
      getFromLS()
    }
  }

  const getOverall = async () => {
    const memberPos = await getMemberPositions(wallet.account)
    updateLS(memberPos)
  }

  const getRedemptionValue = () => {
    let [spartaValue, usdValue] = calcLiqValueAll(
      pool.poolDetails,
      dao.daoDetails,
      bond.bondDetails,
      web3.spartaPrice,
    )
    if (spartaValue <= 0) {
      spartaValue = '0.00'
    }
    if (usdValue <= 0) {
      usdValue = '0.00'
    }
    return [spartaValue, usdValue]
  }

  const isOverall = () => {
    if (position) {
      return true
    }
    return false
  }

  const getNetAdd = () => {
    const _sparta = position?.netAddSparta > 0 ? position?.netAddSparta : '0.00'
    const _usd = position?.netAddUsd > 0 ? position?.netAddUsd : '0.00'
    return [_sparta, _usd]
  }

  const getNetRemove = () => {
    const _sparta = position?.netRemSparta > 0 ? position?.netRemSparta : '0.00'
    const _usd = position?.netRemUsd > 0 ? position?.netRemUsd : '0.00'
    return [_sparta, _usd]
  }

  const getNetHarvest = () => {
    const netHarvestSparta = position?.netHarvestSparta
    const _sparta = netHarvestSparta > 0 ? netHarvestSparta : '0.00'
    const _usd = position?.netHarvestUsd > 0 ? position?.netHarvestUsd : '0.00'
    return [_sparta, _usd]
  }

  const getNetGain = (inUsd) => {
    if (!isOverall) {
      return 'Generate First'
    }
    const add = BN(getNetAdd()[inUsd ? 1 : 0])
    const remove = BN(getNetRemove()[inUsd ? 1 : 0])
    const harvest = BN(getNetHarvest()[inUsd ? 1 : 0])
    const value = BN(getRedemptionValue()[inUsd ? 1 : 0])
    const gain = value.plus(harvest).plus(remove).minus(add)
    return gain
  }

  const getNetGainSpartaToUsd = () => {
    const netGainSparta = getNetGain(false)
    const inUsd = netGainSparta.times(web3.spartaPrice)
    return inUsd
  }

  const getNetGainUsdToSparta = () => {
    const netGainUsd = getNetGain(true)
    const inSparta = netGainUsd.div(web3.spartaPrice)
    return inSparta
  }

  const getOverallTime = () => {
    if (!isOverall) {
      return 'Generate First'
    }
    const time = position?.lastUpdated
    if (time > 0) {
      return getTimeSince(time, t)
    }
    return 'Generate First'
  }

  const _getPoolPos = () => {
    if (position && poolPos) {
      const { positions } = position
      const _pos = positions.filter(
        (x) => x.pool.id === poolPos.address.toString().toLowerCase(),
      )[0]
      if (_pos) {
        return _pos
      }
    }
    return {
      netAddSparta: '0',
      netAddToken: '0',
      netAddUsd: '0',
      netLiqUnits: '0',
      netRemSparta: '0',
      netRemToken: '0',
      netRemUsd: '0',
      pool: {
        id: '',
        symbol: 'Invalid',
      },
    }
  }

  const getPoolNetAdd = () => {
    const pewl = _getPoolPos()
    const netAddSparta = pewl.netAddSparta > 0 ? pewl.netAddSparta : '0.00'
    const netAddToken = pewl.netAddToken > 0 ? pewl.netAddToken : '0.00'
    const netAddUsd = pewl.netAddUsd > 0 ? pewl.netAddUsd : '0.00'
    return [netAddSparta, netAddToken, netAddUsd]
  }

  const getPoolNetRem = () => {
    const pewl = _getPoolPos()
    const netRemSparta = pewl.netRemSparta > 0 ? pewl.netRemSparta : '0.00'
    const netRemToken = pewl.netRemToken > 0 ? pewl.netRemToken : '0.00'
    const netRemUsd = pewl.netRemUsd > 0 ? pewl.netRemUsd : '0.00'
    return [netRemSparta, netRemToken, netRemUsd]
  }

  const getPoolRedValue = () => {
    const poolDets = getPool(poolPos.tokenAddress, pool.poolDetails)
    const daoDets = getDao(poolPos.tokenAddress, dao.daoDetails)
    const bondDets = getBond(poolPos.tokenAddress, bond.bondDetails)
    const totalLps = BN(poolDets.balance)
      .plus(daoDets.staked)
      .plus(bondDets.staked)
    let [spartaValue, tokenValue] = calcLiqValue(totalLps, poolDets)
    let usdValue = spartaValue.times(2).times(web3.spartaPrice)
    if (spartaValue <= 0) {
      spartaValue = '0.00'
    }
    if (tokenValue <= 0) {
      tokenValue = '0.00'
    }
    if (usdValue <= 0) {
      usdValue = '0.00'
    }
    return [spartaValue, tokenValue, usdValue]
  }

  const getPoolNetGain = (type) => {
    const typeIndex = type === 'sparta' ? 0 : type === 'token' ? 1 : 2
    if (!isOverall) {
      return 'Generate First'
    }
    const add = BN(getPoolNetAdd()[typeIndex])
    const remove = BN(getPoolNetRem()[typeIndex])
    const value = BN(getPoolRedValue()[typeIndex])
    const gain = value.plus(remove).minus(add)
    return gain
  }

  const getPoolNetGainWorthUsd = () => {
    const _pool = getPool(poolPos.tokenAddress, pool.poolDetails)
    const netGainSparta = getPoolNetGain('sparta')
    const netGainToken = getPoolNetGain('token')
    const spartaValue = calcSpotValueInBase(netGainToken, _pool)
    const inUsd = netGainSparta.plus(spartaValue).times(web3.spartaPrice)
    return inUsd
  }

  return (
    <>
      <div className="content">
        {tempChains.includes(network.chainId) && (
          <>
            <Row className="row-480">
              <Col xs="auto">
                <Card className="card-320" style={{ minHeight: '445px' }}>
                  <Card.Header className="">
                    Overall Position
                    <Card.Subtitle className="">
                      <div className="mt-2 d-inline-block me-2">
                        vs Hodl {showUsd ? 'USD' : 'SPARTA'}
                      </div>
                      <Button
                        variant="info"
                        className="p-1 text-sm-label"
                        onClick={() => setShowUsd(!showUsd)}
                      >
                        Change to:
                        <Icon
                          icon={!showUsd ? 'usd' : 'spartav2'}
                          size="17"
                          className="ms-1"
                        />
                      </Button>
                    </Card.Subtitle>
                  </Card.Header>
                  {!isLoading() ? (
                    <>
                      <Card.Body className="pb-1">
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('liquidityAdded')}
                            <OverlayTrigger
                              placement="auto"
                              overlay={
                                <Popover>
                                  <Popover.Header as="h3">
                                    {t('liquidityAdded')}
                                  </Popover.Header>
                                  <Popover.Body className="text-center">
                                    Total sum of all liquidity added to the
                                    pools by your wallet (including Bond). The
                                    value is based on the price of the assets at
                                    the time they were added, derived via the
                                    pools internal pricing.
                                  </Popover.Body>
                                </Popover>
                              }
                            >
                              <span role="button">
                                <Icon
                                  icon="info"
                                  className="ms-1 mb-1"
                                  size="15"
                                  fill={isLightMode ? 'black' : 'white'}
                                />
                              </span>
                            </OverlayTrigger>
                          </Col>
                          <Col className="text-end output-card">
                            {isOverall()
                              ? formatFromWei(
                                  showUsd ? getNetAdd()[1] : getNetAdd()[0],
                                  2,
                                )
                              : 'Generate First'}
                            <Icon
                              icon={showUsd ? 'usd' : 'spartav2'}
                              className="ms-1"
                              size="15"
                            />
                          </Col>
                        </Row>
                        <hr />
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('liquidityRemoved')}
                            <OverlayTrigger
                              placement="auto"
                              overlay={
                                <Popover>
                                  <Popover.Header as="h3">
                                    {t('liquidityRemoved')}
                                  </Popover.Header>
                                  <Popover.Body className="text-center">
                                    Total sum of all liquidity removed from the
                                    pools by your wallet. The value is based on
                                    the price of the assets at the time they
                                    were removed, derived via the pools internal
                                    pricing.
                                  </Popover.Body>
                                </Popover>
                              }
                            >
                              <span role="button">
                                <Icon
                                  icon="info"
                                  className="ms-1 mb-1"
                                  size="15"
                                  fill={isLightMode ? 'black' : 'white'}
                                />
                              </span>
                            </OverlayTrigger>
                          </Col>
                          <Col className="text-end output-card">
                            {isOverall()
                              ? formatFromWei(
                                  showUsd
                                    ? getNetRemove()[1]
                                    : getNetRemove()[0],
                                  2,
                                )
                              : 'Generate First'}
                            <Icon
                              icon={showUsd ? 'usd' : 'spartav2'}
                              className="ms-1"
                              size="15"
                            />
                          </Col>
                        </Row>
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('totalHarvested')}
                            <OverlayTrigger
                              placement="auto"
                              overlay={
                                <Popover>
                                  <Popover.Header as="h3">
                                    {t('totalHarvested')}
                                  </Popover.Header>
                                  <Popover.Body className="text-center">
                                    Total sum of all harvests by your wallet.
                                    The value is based on the price of the
                                    SPARTA at the time they were harvested,
                                    derived via the pools internal pricing.
                                  </Popover.Body>
                                </Popover>
                              }
                            >
                              <span role="button">
                                <Icon
                                  icon="info"
                                  className="ms-1 mb-1"
                                  size="15"
                                  fill={isLightMode ? 'black' : 'white'}
                                />
                              </span>
                            </OverlayTrigger>
                          </Col>
                          <Col className="text-end output-card">
                            {isOverall()
                              ? formatFromWei(
                                  showUsd
                                    ? getNetHarvest()[1]
                                    : getNetHarvest()[0],
                                  2,
                                )
                              : 'Generate First'}
                            <Icon
                              icon={showUsd ? 'usd' : 'spartav2'}
                              className="ms-1"
                              size="15"
                            />
                          </Col>
                        </Row>
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('redemptionValue')}
                            <OverlayTrigger
                              placement="auto"
                              overlay={
                                <Popover>
                                  <Popover.Header as="h3">
                                    {t('redemptionValue')}
                                  </Popover.Header>
                                  <Popover.Body className="text-center">
                                    Total value of all assets you would receive
                                    if you were to redeem all LP tokens held or
                                    attributed to this wallet. The value is
                                    internally derived based on the current spot
                                    prices of the assets in the pools.
                                  </Popover.Body>
                                </Popover>
                              }
                            >
                              <span role="button">
                                <Icon
                                  icon="info"
                                  className="ms-1 mb-1"
                                  size="15"
                                  fill={isLightMode ? 'black' : 'white'}
                                />
                              </span>
                            </OverlayTrigger>
                          </Col>
                          <Col className="text-end output-card">
                            {formatFromWei(
                              showUsd
                                ? getRedemptionValue()[1]
                                : getRedemptionValue()[0],
                              2,
                            )}
                            <Icon
                              icon={showUsd ? 'usd' : 'spartav2'}
                              className="ms-1"
                              size="15"
                            />
                          </Col>
                        </Row>
                        <hr />
                        <Row className="my-1">
                          <Col xs="auto" className="output-card">
                            {t('gainVs')} {showUsd ? 'USD' : 'SPARTA'}
                            <OverlayTrigger
                              placement="auto"
                              overlay={
                                <Popover>
                                  <Popover.Header as="h3">
                                    {t('gainVs')} {showUsd ? 'USD' : 'SPARTA'}
                                  </Popover.Header>
                                  <Popover.Body className="text-center">
                                    Your NET position based on the sum of the
                                    above rows. This is a comparison to if you
                                    were to hold {showUsd ? 'USD' : 'SPARTA'}{' '}
                                    instead of providing liquidity to the pools.
                                  </Popover.Body>
                                </Popover>
                              }
                            >
                              <span role="button">
                                <Icon
                                  icon="info"
                                  className="ms-1 mb-1"
                                  size="15"
                                  fill={isLightMode ? 'black' : 'white'}
                                />
                              </span>
                            </OverlayTrigger>
                          </Col>
                          <Col className="text-end output-card">
                            {isOverall()
                              ? formatFromWei(
                                  showUsd
                                    ? getNetGain(true)
                                    : getNetGain(false),
                                  2,
                                )
                              : 'Generate First'}
                            <Icon
                              icon={showUsd ? 'usd' : 'spartav2'}
                              className="ms-1"
                              size="15"
                            />
                          </Col>
                        </Row>
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('currentlyWorth')}
                            <OverlayTrigger
                              placement="auto"
                              overlay={
                                <Popover>
                                  <Popover.Header as="h3">
                                    {t('currentlyWorth')}
                                  </Popover.Header>
                                  <Popover.Body className="text-center">
                                    This is the current spot value of the Gain
                                    vs Hodl figure above
                                  </Popover.Body>
                                </Popover>
                              }
                            >
                              <span role="button">
                                <Icon
                                  icon="info"
                                  className="ms-1 mb-1"
                                  size="15"
                                  fill={isLightMode ? 'black' : 'white'}
                                />
                              </span>
                            </OverlayTrigger>
                          </Col>
                          <Col className="text-end output-card">
                            {isOverall()
                              ? formatFromWei(
                                  !showUsd
                                    ? getNetGainSpartaToUsd()
                                    : getNetGainUsdToSparta(),
                                  2,
                                )
                              : 'Generate First'}
                            <Icon
                              icon={!showUsd ? 'usd' : 'spartav2'}
                              className="ms-1"
                              size="15"
                            />
                          </Col>
                        </Row>
                        <hr />
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('lastUpdated')}
                            <OverlayTrigger
                              placement="auto"
                              overlay={
                                <Popover>
                                  <Popover.Header as="h3">
                                    {t('lastUpdated')}
                                  </Popover.Header>
                                  <Popover.Body className="text-center">
                                    The last time you clicked &apos;Reload&apos;
                                    to update all &apos;realised&apos; position
                                    events. Note that the &apos;Redemption
                                    Value&apos; is dynamic and does not need to
                                    be updated via the button.
                                  </Popover.Body>
                                </Popover>
                              }
                            >
                              <span role="button">
                                <Icon
                                  icon="info"
                                  className="ms-1 mb-1"
                                  size="15"
                                  fill={isLightMode ? 'black' : 'white'}
                                />
                              </span>
                            </OverlayTrigger>
                          </Col>
                          <Col className="text-end output-card">
                            {getOverallTime()}
                          </Col>
                        </Row>
                      </Card.Body>
                      <Card.Footer>
                        <Button
                          onClick={() => getOverall()}
                          className="w-100"
                          disabled={getSecsSince(position.lastUpdated) < 60}
                        >
                          {getSecsSince(position.lastUpdated) < 60
                            ? 'Wait 60s'
                            : 'Reload'}
                        </Button>
                      </Card.Footer>
                    </>
                  ) : (
                    <Col className="">
                      <HelmetLoading height={300} width={300} />
                    </Col>
                  )}
                </Card>
              </Col>

              <Col xs="auto">
                <Card className="card-320" style={{ minHeight: '445px' }}>
                  <Card.Header className="">
                    {!isLoading() ? `${_getToken().symbol}p` : 'Pool'} Position
                    <Card.Subtitle className="">
                      <div className="mt-2 d-inline-block me-2">
                        vs Hodl {showUsdPool ? 'USD' : 'Units'}
                      </div>
                      <Button
                        variant="info"
                        className="p-1 text-sm-label"
                        onClick={() => setShowUsdPool(!showUsdPool)}
                      >
                        Change to:
                        <Icon
                          icon={!showUsdPool ? 'usd' : 'spartav2'}
                          size="17"
                          className="ms-1"
                        />
                        {!isLoading() && showUsdPool && (
                          <img
                            src={_getToken().symbolUrl}
                            height="17"
                            alt="token"
                          />
                        )}
                      </Button>
                    </Card.Subtitle>
                  </Card.Header>
                  {!isLoading() ? (
                    <Card.Body>
                      <Row className="mb-2">
                        <div className="ms-1">
                          <AssetSelect priority="1" filter={['pool']} />
                        </div>
                      </Row>
                      <hr />
                      {showUsdPool ? (
                        <>
                          <Row className="my-1">
                            <Col xs="auto" className="text-card">
                              {t('liquidityAdded')}
                              <OverlayTrigger
                                placement="auto"
                                overlay={
                                  <Popover>
                                    <Popover.Header as="h3">
                                      {t('liquidityAdded')}
                                    </Popover.Header>
                                    <Popover.Body className="text-center">
                                      Total sum of all liquidity added to the
                                      pools by your wallet (including Bond). The
                                      value is based on the price of the assets
                                      at the time they were added, derived via
                                      the pools internal pricing.
                                    </Popover.Body>
                                  </Popover>
                                }
                              >
                                <span role="button">
                                  <Icon
                                    icon="info"
                                    className="ms-1 mb-1"
                                    size="15"
                                    fill={isLightMode ? 'black' : 'white'}
                                  />
                                </span>
                              </OverlayTrigger>
                            </Col>
                            <Col className="text-end output-card">
                              {isOverall()
                                ? formatFromWei(getPoolNetAdd()[2], 2)
                                : 'Generate First'}
                              <Icon icon="usd" className="ms-1" size="15" />
                            </Col>
                          </Row>
                          <hr />
                          <Row className="my-1">
                            <Col xs="auto" className="text-card">
                              {t('liquidityRemoved')}
                              <OverlayTrigger
                                placement="auto"
                                overlay={
                                  <Popover>
                                    <Popover.Header as="h3">
                                      {t('liquidityRemoved')}
                                    </Popover.Header>
                                    <Popover.Body className="text-center">
                                      Total sum of all liquidity removed from
                                      the pools by your wallet. The value is
                                      based on the price of the assets at the
                                      time they were removed, derived via the
                                      pools internal pricing.
                                    </Popover.Body>
                                  </Popover>
                                }
                              >
                                <span role="button">
                                  <Icon
                                    icon="info"
                                    className="ms-1 mb-1"
                                    size="15"
                                    fill={isLightMode ? 'black' : 'white'}
                                  />
                                </span>
                              </OverlayTrigger>
                            </Col>
                            <Col className="text-end output-card">
                              {isOverall()
                                ? formatFromWei(getPoolNetRem()[2], 2)
                                : 'Generate First'}
                              <Icon icon="usd" className="ms-1" size="15" />
                            </Col>
                          </Row>
                          <Row className="my-1">
                            <Col xs="auto" className="text-card">
                              {t('redemptionValue')}
                              <OverlayTrigger
                                placement="auto"
                                overlay={
                                  <Popover>
                                    <Popover.Header as="h3">
                                      {t('redemptionValue')}
                                    </Popover.Header>
                                    <Popover.Body className="text-center">
                                      Total value of all assets you would
                                      receive if you were to redeem all LP
                                      tokens held or attributed to this wallet.
                                      The value is internally derived based on
                                      the current spot prices of the assets in
                                      the pools.
                                    </Popover.Body>
                                  </Popover>
                                }
                              >
                                <span role="button">
                                  <Icon
                                    icon="info"
                                    className="ms-1 mb-1"
                                    size="15"
                                    fill={isLightMode ? 'black' : 'white'}
                                  />
                                </span>
                              </OverlayTrigger>{' '}
                            </Col>
                            <Col className="text-end output-card">
                              {formatFromWei(getPoolRedValue()[2], 2)}
                              <Icon icon="usd" className="ms-1" size="15" />
                            </Col>
                          </Row>
                          <hr />
                          <Row className="my-1">
                            <Col xs="auto" className="output-card">
                              {t('gainVs')} {showUsdPool ? 'USD' : 'SPARTA'}
                              <OverlayTrigger
                                placement="auto"
                                overlay={
                                  <Popover>
                                    <Popover.Header as="h3">
                                      {t('gainVs')} USD
                                    </Popover.Header>
                                    <Popover.Body className="text-center">
                                      Your NET position based on the sum of the
                                      above rows. This is a comparison to if you
                                      were to hold USD instead of providing
                                      liquidity to the pools (Excluding Harvest
                                      Rewards)
                                    </Popover.Body>
                                  </Popover>
                                }
                              >
                                <span role="button">
                                  <Icon
                                    icon="info"
                                    className="ms-1 mb-1"
                                    size="15"
                                    fill={isLightMode ? 'black' : 'white'}
                                  />
                                </span>
                              </OverlayTrigger>
                            </Col>
                            <Col className="text-end output-card">
                              {isOverall()
                                ? formatFromWei(getPoolNetGain('usd'), 2)
                                : 'Generate First'}
                              <Icon icon="usd" className="ms-1" size="15" />
                            </Col>
                          </Row>
                        </>
                      ) : (
                        <>
                          <Row className="my-1">
                            <Col xs="auto" className="text-card">
                              {t('liquidityAdded')}
                              <OverlayTrigger
                                placement="auto"
                                overlay={
                                  <Popover>
                                    <Popover.Header as="h3">
                                      {t('liquidityAdded')}
                                    </Popover.Header>
                                    <Popover.Body className="text-center">
                                      Total sum of all SPARTA units added to the
                                      pools by your wallet (including Bond)
                                    </Popover.Body>
                                  </Popover>
                                }
                              >
                                <span role="button">
                                  <Icon
                                    icon="info"
                                    className="ms-1 mb-1"
                                    size="15"
                                    fill={isLightMode ? 'black' : 'white'}
                                  />
                                </span>
                              </OverlayTrigger>
                            </Col>
                            <Col className="text-end output-card">
                              {isOverall()
                                ? formatFromWei(getPoolNetAdd()[0], 2)
                                : 'Generate First'}
                              <Icon
                                icon="spartav2"
                                className="ms-1"
                                size="15"
                              />
                            </Col>
                          </Row>
                          <Row className="my-1">
                            <Col xs="auto" className="text-card">
                              {t('liquidityRemoved')}
                              <OverlayTrigger
                                placement="auto"
                                overlay={
                                  <Popover>
                                    <Popover.Header as="h3">
                                      {t('liquidityRemoved')}
                                    </Popover.Header>
                                    <Popover.Body className="text-center">
                                      Total sum of all SPARTA units removed from
                                      the pools by your wallet
                                    </Popover.Body>
                                  </Popover>
                                }
                              >
                                <span role="button">
                                  <Icon
                                    icon="info"
                                    className="ms-1 mb-1"
                                    size="15"
                                    fill={isLightMode ? 'black' : 'white'}
                                  />
                                </span>
                              </OverlayTrigger>
                            </Col>
                            <Col className="text-end output-card">
                              {isOverall()
                                ? formatFromWei(getPoolNetRem()[0], 2)
                                : 'Generate First'}
                              <Icon
                                icon="spartav2"
                                className="ms-1"
                                size="15"
                              />
                            </Col>
                          </Row>
                          <Row className="my-1">
                            <Col xs="auto" className="text-card">
                              {t('redemptionValue')}
                              <OverlayTrigger
                                placement="auto"
                                overlay={
                                  <Popover>
                                    <Popover.Header as="h3">
                                      {t('redemptionValue')}
                                    </Popover.Header>
                                    <Popover.Body className="text-center">
                                      Total SPARTA you would receive if you were
                                      to redeem all LP tokens held or attributed
                                      to this wallet (SPARTA-side / half)
                                    </Popover.Body>
                                  </Popover>
                                }
                              >
                                <span role="button">
                                  <Icon
                                    icon="info"
                                    className="ms-1 mb-1"
                                    size="15"
                                    fill={isLightMode ? 'black' : 'white'}
                                  />
                                </span>
                              </OverlayTrigger>
                            </Col>
                            <Col className="text-end output-card">
                              {formatFromWei(getPoolRedValue()[0], 2)}
                              <Icon
                                icon="spartav2"
                                className="ms-1"
                                size="15"
                              />
                            </Col>
                          </Row>
                          <Row className="my-1">
                            <Col xs="auto" className="output-card">
                              {t('gain')} (SPARTA)
                              <OverlayTrigger
                                placement="auto"
                                overlay={
                                  <Popover>
                                    <Popover.Header as="h3">
                                      {t('gain')}
                                    </Popover.Header>
                                    <Popover.Body className="text-center">
                                      Your NET SPARTA position based on the sum
                                      of the above rows (Excluding Harvest
                                      Rewards)
                                    </Popover.Body>
                                  </Popover>
                                }
                              >
                                <span role="button">
                                  <Icon
                                    icon="info"
                                    className="ms-1 mb-1"
                                    size="15"
                                    fill={isLightMode ? 'black' : 'white'}
                                  />
                                </span>
                              </OverlayTrigger>
                            </Col>
                            <Col className="text-end output-card">
                              {isOverall()
                                ? formatFromWei(getPoolNetGain('sparta'), 2)
                                : 'Generate First'}
                              <Icon
                                icon="spartav2"
                                className="ms-1"
                                size="15"
                              />
                            </Col>
                          </Row>
                          <hr />
                          <Row className="my-1">
                            <Col xs="auto" className="text-card">
                              {t('liquidityAdded')}
                              <OverlayTrigger
                                placement="auto"
                                overlay={
                                  <Popover>
                                    <Popover.Header as="h3">
                                      {t('liquidityAdded')}
                                    </Popover.Header>
                                    <Popover.Body className="text-center">
                                      Total sum of all {_getToken().symbol}{' '}
                                      units added to the pools by your wallet
                                      (including Bond)
                                    </Popover.Body>
                                  </Popover>
                                }
                              >
                                <span role="button">
                                  <Icon
                                    icon="info"
                                    className="ms-1 mb-1"
                                    size="15"
                                    fill={isLightMode ? 'black' : 'white'}
                                  />
                                </span>
                              </OverlayTrigger>
                            </Col>
                            <Col className="text-end output-card">
                              {isOverall()
                                ? formatFromWei(getPoolNetAdd()[1], 2)
                                : 'Generate First'}
                              <img
                                src={_getToken().symbolUrl}
                                height="15"
                                alt="token"
                                className="mb-1 ms-1"
                              />
                            </Col>
                          </Row>
                          <Row className="my-1">
                            <Col xs="auto" className="text-card">
                              {t('liquidityRemoved')}
                              <OverlayTrigger
                                placement="auto"
                                overlay={
                                  <Popover>
                                    <Popover.Header as="h3">
                                      {t('liquidityRemoved')}
                                    </Popover.Header>
                                    <Popover.Body className="text-center">
                                      Total sum of all {_getToken().symbol}{' '}
                                      units removed from the pools by your
                                      wallet
                                    </Popover.Body>
                                  </Popover>
                                }
                              >
                                <span role="button">
                                  <Icon
                                    icon="info"
                                    className="ms-1 mb-1"
                                    size="15"
                                    fill={isLightMode ? 'black' : 'white'}
                                  />
                                </span>
                              </OverlayTrigger>
                            </Col>
                            <Col className="text-end output-card">
                              {isOverall()
                                ? formatFromWei(getPoolNetRem()[1], 2)
                                : 'Generate First'}
                              <img
                                src={_getToken().symbolUrl}
                                height="15"
                                alt="token"
                                className="mb-1 ms-1"
                              />
                            </Col>
                          </Row>
                          <Row className="my-1">
                            <Col xs="auto" className="text-card">
                              {t('redemptionValue')}
                              <OverlayTrigger
                                placement="auto"
                                overlay={
                                  <Popover>
                                    <Popover.Header as="h3">
                                      {t('redemptionValue')}
                                    </Popover.Header>
                                    <Popover.Body className="text-center">
                                      Total {_getToken().symbol} you would
                                      receive if you were to redeem all LP
                                      tokens held or attributed to this wallet (
                                      {_getToken().symbol}-side / half)
                                    </Popover.Body>
                                  </Popover>
                                }
                              >
                                <span role="button">
                                  <Icon
                                    icon="info"
                                    className="ms-1 mb-1"
                                    size="15"
                                    fill={isLightMode ? 'black' : 'white'}
                                  />
                                </span>
                              </OverlayTrigger>
                            </Col>
                            <Col className="text-end output-card">
                              {formatFromWei(getPoolRedValue()[1], 2)}
                              <img
                                src={_getToken().symbolUrl}
                                height="15"
                                alt="token"
                                className="mb-1 ms-1"
                              />
                            </Col>
                          </Row>
                          <Row className="my-1">
                            <Col xs="auto" className="output-card">
                              {t('gain')} ({_getToken().symbol})
                              <OverlayTrigger
                                placement="auto"
                                overlay={
                                  <Popover>
                                    <Popover.Header as="h3">
                                      {t('gain')}
                                    </Popover.Header>
                                    <Popover.Body className="text-center">
                                      Your NET {_getToken().symbol} position
                                      based on the sum of the above rows
                                      (Excluding Harvest Rewards)
                                    </Popover.Body>
                                  </Popover>
                                }
                              >
                                <span role="button">
                                  <Icon
                                    icon="info"
                                    className="ms-1 mb-1"
                                    size="15"
                                    fill={isLightMode ? 'black' : 'white'}
                                  />
                                </span>
                              </OverlayTrigger>
                            </Col>
                            <Col className="text-end output-card">
                              {isOverall()
                                ? formatFromWei(getPoolNetGain('token'), 2)
                                : 'Generate First'}
                              <img
                                src={_getToken().symbolUrl}
                                height="15"
                                alt="token"
                                className="mb-1 ms-1"
                              />
                            </Col>
                          </Row>
                          <hr />
                          <Row className="my-1">
                            <Col xs="auto" className="output-card">
                              {t('gainVs')} Units
                              <OverlayTrigger
                                placement="auto"
                                overlay={
                                  <Popover>
                                    <Popover.Header as="h3">
                                      {t('gainVs')} Units
                                    </Popover.Header>
                                    <Popover.Body className="text-center">
                                      Your NET position based on the sum of the
                                      above rows. This is a comparison to if you
                                      were to hold the underlying assets (SPARTA
                                      + {_getToken().symbol}) instead of
                                      providing them as liquidity to the pools
                                      (Excluding Harvest Rewards)
                                    </Popover.Body>
                                  </Popover>
                                }
                              >
                                <span role="button">
                                  <Icon
                                    icon="info"
                                    className="ms-1 mb-1"
                                    size="15"
                                    fill={isLightMode ? 'black' : 'white'}
                                  />
                                </span>
                              </OverlayTrigger>
                            </Col>
                            <Col className="text-end output-card">
                              {isOverall()
                                ? formatFromWei(getPoolNetGainWorthUsd(), 2)
                                : 'Generate First'}
                              <Icon icon="usd" className="ms-1" size="15" />
                            </Col>
                          </Row>
                        </>
                      )}
                    </Card.Body>
                  ) : (
                    <Col className="">
                      <HelmetLoading height={300} width={300} />
                    </Col>
                  )}
                </Card>
              </Col>
            </Row>
          </>
        )}
        {!tempChains.includes(network.chainId) && <WrongNetwork />}
      </div>
    </>
  )
}

export default Positions

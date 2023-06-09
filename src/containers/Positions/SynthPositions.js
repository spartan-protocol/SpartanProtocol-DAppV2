import React, { useState, useEffect, useCallback } from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Nav from 'react-bootstrap/Nav'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Row from 'react-bootstrap/Row'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import { useDispatch } from 'react-redux'
import { usePool } from '../../store/pool'
import HelmetLoading from '../../components/Spinner/index'
import { Icon } from '../../components/Icons/index'
import { BN, formatFromWei } from '../../utils/bigNumber'
import {
  calcSpotValueAll,
  getBlockTimestamp,
  getSecsSince,
  getSwapSpot,
} from '../../utils/math/nonContract'
import { useWeb3 } from '../../store/web3'
import AssetSelect from '../../components/AssetSelect/index'
import {
  calcSpotValueInBase,
  getPool,
  getSynth,
  getToken,
} from '../../utils/math/utils'
import { getMemberSynthPositions } from '../../utils/extCalls'
import { useSynth } from '../../store/synth'
import { appAsset, useApp } from '../../store/app'

const SynthPositions = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { address } = useAccount()

  const { addresses, asset1 } = useApp()
  const pool = usePool()
  const synth = useSynth()
  const web3 = useWeb3()

  const [viewOverall, setViewOverall] = useState('usd')
  const [viewPool, setViewPool] = useState('usd')
  const [poolPos, setPoolPos] = useState(false)
  const [position, setPosition] = useState(false)
  const [spartaPrice, setspartaPrice] = useState(0)

  useEffect(() => {
    if (web3.spartaPrice > 0) {
      setspartaPrice(web3.spartaPrice)
    } else if (web3.spartaPriceInternal > 0) {
      setspartaPrice(web3.spartaPriceInternal)
    }
  }, [web3.spartaPrice, web3.spartaPriceInternal])

  const isLoading = () => {
    if (!pool.tokenDetails || !pool.poolDetails || !synth.synthDetails) {
      return true
    }
    return false
  }

  useEffect(() => {
    const getAssetDetails = () => {
      if (pool.poolDetails) {
        let _asset1Addr = asset1.addr
        _asset1Addr = getSynth(_asset1Addr, synth.synthDetails)?.address
          ? _asset1Addr
          : addresses.bnb
        setPoolPos(getPool(_asset1Addr, pool.poolDetails))
        dispatch(appAsset('1', _asset1Addr, 'synth'))
      }
    }
    getAssetDetails()
  }, [
    addresses.bnb,
    asset1.addr,
    dispatch,
    pool.poolDetails,
    synth.synthDetails,
  ])

  const getWallet = useCallback(() => {
    if (address) {
      return address.toString().toLowerCase()
    }
    return false
  }, [address])

  const _getToken = () => getToken(poolPos.tokenAddress, pool.tokenDetails)

  const tryParse = (data) => {
    try {
      return JSON.parse(data)
    } catch (e) {
      return false
    }
  }

  const getFromLS = useCallback(() => {
    let _position = false
    const _positions = tryParse(
      window.localStorage.getItem('sp_synthpositions'),
    )
    _position = _positions?.filter((scope) => scope.id === getWallet())[0]
    if (_position) {
      setPosition(_position)
    }
  }, [getWallet])

  useEffect(() => {
    const getData = () => {
      getFromLS()
    }
    getData() // Run on load
    const interval = setInterval(() => {
      getData() // Run on interval
    }, 2000)
    return () => {
      clearInterval(interval)
    }
  }, [getFromLS])

  const updateLS = (queryData, block) => {
    const walletAddr = getWallet()
    if (walletAddr) {
      let posArray = tryParse(window.localStorage.getItem('sp_synthpositions'))
      if (!posArray) {
        posArray = []
        posArray.push({ id: walletAddr })
      }
      let indexWal = posArray.findIndex((pos) => pos.id === walletAddr)
      if (indexWal === -1) {
        posArray.push({ id: walletAddr })
        indexWal = posArray.findIndex((pos) => pos.id === walletAddr)
      }
      posArray[indexWal].block = block
      posArray[indexWal].lastUpdated = getBlockTimestamp()
      posArray[indexWal].id = queryData.id
      posArray[indexWal].netAddSparta = queryData.netForgeSparta
      posArray[indexWal].netAddUsd = queryData.netForgeUsd
      posArray[indexWal].netRemSparta = queryData.netMeltSparta
      posArray[indexWal].netRemUsd = queryData.netMeltUsd
      posArray[indexWal].netHarvestSparta = queryData.netSynthHarvestSparta
      posArray[indexWal].netHarvestUsd = queryData.netSynthHarvestUsd
      posArray[indexWal].positions = queryData.synthPositions
      window.localStorage.setItem('sp_synthpositions', JSON.stringify(posArray))
      getFromLS()
    }
  }

  const getOverall = async () => {
    const [memberPos, block] = await getMemberSynthPositions(address)
    updateLS(memberPos, block)
  }

  const getRedemptionValue = () => {
    let [spartaValue, usdValue] = calcSpotValueAll(
      pool.poolDetails,
      synth.synthDetails,
      spartaPrice,
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
    const inUsd = netGainSparta.times(spartaPrice)
    return inUsd
  }

  const getNetGainUsdToSparta = () => {
    const netGainUsd = getNetGain(true)
    const inSparta = netGainUsd.div(spartaPrice)
    return inSparta
  }

  const getBlock = () => {
    if (!isOverall) {
      return 'Generate First'
    }
    if (position?.block > 0) {
      return position?.block
    }
    return 'Generate First'
  }

  const getBlockRPC = () => {
    if (web3.rpcs[0].good) {
      return web3.rpcs[0].block
    }
    return 'Network Issues'
  }

  const parseIdToAddr = (idString) => {
    const synthAddr = idString.split('#')[1]
    return synthAddr
  }

  const _getPoolPos = () => {
    if (position && poolPos) {
      const { positions } = position
      const _pos = positions.filter(
        (x) =>
          parseIdToAddr(x.id) ===
          getSynth(poolPos.tokenAddress, synth.synthDetails)
            ?.address.toString()
            .toLowerCase(),
      )[0]
      if (_pos) {
        return _pos
      }
    }
    return {
      id: '',
      netForgeSparta: '0',
      netForgeUsd: '0',
      netMeltSparta: '0',
      netMeltUsd: '0',
      netSynthHarvestSparta: '0',
      netSynthHarvestUsd: '0',
    }
  }

  const getPoolNetAdd = () => {
    const pewl = _getPoolPos()
    const netAddSparta = pewl.netForgeSparta > 0 ? pewl.netForgeSparta : '0.00'
    const netAddUsd = pewl.netForgeUsd > 0 ? pewl.netForgeUsd : '0.00'
    return [netAddSparta, netAddUsd]
  }

  const getPoolNetRem = () => {
    const pewl = _getPoolPos()
    const netRemSparta = pewl.netMeltSparta > 0 ? pewl.netMeltSparta : '0.00'
    const netRemUsd = pewl.netMeltUsd > 0 ? pewl.netMeltUsd : '0.00'
    return [netRemSparta, netRemUsd]
  }

  const getPoolNetHarvest = () => {
    const pewl = _getPoolPos()
    const netSparta =
      pewl.netSynthHarvestSparta > 0 ? pewl.netSynthHarvestSparta : '0.00'
    const netUsd =
      pewl.netSynthHarvestUsd > 0 ? pewl.netSynthHarvestUsd : '0.00'
    return [netSparta, netUsd]
  }

  const getSynthRedValue = () => {
    const poolDets = getPool(poolPos.tokenAddress, pool.poolDetails)
    const synthDets = getSynth(poolPos.tokenAddress, synth.synthDetails)
    const totalSynths = BN(synthDets?.balance).plus(synthDets?.staked)
    let spartaValue = calcSpotValueInBase(totalSynths, poolDets)
    let usdValue = spartaValue.times(spartaPrice)
    if (spartaValue <= 0) {
      spartaValue = '0.00'
    }
    if (usdValue <= 0) {
      usdValue = '0.00'
    }
    return [spartaValue, usdValue]
  }

  const getPoolNetGain = (type) => {
    const typeIndex = type === 'sparta' ? 0 : 1
    if (!isOverall) {
      return 'Generate First'
    }
    const add = BN(getPoolNetAdd()[typeIndex])
    const remove = BN(getPoolNetRem()[typeIndex])
    const value = BN(getSynthRedValue()[typeIndex])
    const harvest = BN(getPoolNetHarvest()[typeIndex])
    const gain = value.plus(remove).plus(harvest).minus(add)
    return gain
  }

  const getPoolNetGainWorthUnit = () => {
    const poolDets = getPool(poolPos.tokenAddress, pool.poolDetails)
    const netGainUsd = getPoolNetHarvest()[1]
    const inSparta = BN(netGainUsd).div(spartaPrice)
    const spotRate = getSwapSpot(poolDets, poolDets, false, true)
    const inUnit = inSparta.times(spotRate)
    return inUnit
  }

  // const getPoolNetGainWorthUsd = () => {
  //   const netGainSparta = getPoolNetGain('sparta')
  //   const inUsd = netGainSparta.times(spartaPrice)
  //   return inUsd
  // }

  const getPoolNetGainWorthSparta = () => {
    const netGainUsd = getPoolNetGain('usd')
    const inSparta = netGainUsd.div(spartaPrice)
    return inSparta
  }

  return (
    <>
      <Col>
        <Card
          className="mb-2"
          style={{ minHeight: '445px', minWidth: '300px' }}
        >
          <Card.Header>
            <Card.Title className="pt-1">Overall Position</Card.Title>
          </Card.Header>
          {!isLoading() ? (
            <>
              <Card.Body className="pb-1">
                <Row className="mb-3">
                  <Col>
                    <Nav
                      variant="pills"
                      activeKey={viewOverall}
                      onSelect={(e) => setViewOverall(e)}
                      fill
                    >
                      <Nav.Item>
                        <Nav.Link className="btn-sm" eventKey="usd">
                          Vs Hodl {t('USD')}
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link className="btn-sm" eventKey="units">
                          Vs Hodl {t('SPARTA')}
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>
                </Row>
                <hr />
                <Row className="my-1">
                  <Col xs="auto">
                    {t('assetsForged')}
                    <OverlayTrigger
                      placement="auto"
                      overlay={
                        <Popover>
                          <Popover.Header as="h3">
                            {t('assetsForged')}
                          </Popover.Header>
                          <Popover.Body className="text-center">
                            {t('assetsForgedInfo')}
                          </Popover.Body>
                        </Popover>
                      }
                    >
                      <span role="button">
                        <Icon icon="info" className="ms-1 mb-1" size="15" />
                      </span>
                    </OverlayTrigger>
                  </Col>
                  <Col className="text-end ">
                    {isOverall()
                      ? formatFromWei(
                          viewOverall === 'usd'
                            ? getNetAdd()[1]
                            : getNetAdd()[0],
                          2,
                        )
                      : 'Generate First'}
                    <Icon
                      icon={viewOverall === 'usd' ? 'usd' : 'spartav2'}
                      className="ms-1"
                      size="15"
                    />
                  </Col>
                </Row>
                <hr />
                <Row className="my-1">
                  <Col xs="auto">
                    {t('assetsMelted')}
                    <OverlayTrigger
                      placement="auto"
                      overlay={
                        <Popover>
                          <Popover.Header as="h3">
                            {t('assetsMelted')}
                          </Popover.Header>
                          <Popover.Body className="text-center">
                            {t('assetsMeltedInfo')}
                          </Popover.Body>
                        </Popover>
                      }
                    >
                      <span role="button">
                        <Icon icon="info" className="ms-1 mb-1" size="15" />
                      </span>
                    </OverlayTrigger>
                  </Col>
                  <Col className="text-end">
                    {isOverall()
                      ? formatFromWei(
                          viewOverall === 'usd'
                            ? getNetRemove()[1]
                            : getNetRemove()[0],
                          2,
                        )
                      : 'Generate First'}
                    <Icon
                      icon={viewOverall === 'usd' ? 'usd' : 'spartav2'}
                      className="ms-1"
                      size="15"
                    />
                  </Col>
                </Row>
                <Row className="my-1">
                  <Col xs="auto">
                    {t('totalHarvested')}
                    <OverlayTrigger
                      placement="auto"
                      overlay={
                        <Popover>
                          <Popover.Header as="h3">
                            {t('totalHarvested')}
                          </Popover.Header>
                          <Popover.Body className="text-center">
                            {t('totalHarvestedInfo')}
                          </Popover.Body>
                        </Popover>
                      }
                    >
                      <span role="button">
                        <Icon icon="info" className="ms-1 mb-1" size="15" />
                      </span>
                    </OverlayTrigger>
                  </Col>
                  <Col className="text-end ">
                    {isOverall()
                      ? formatFromWei(
                          viewOverall === 'usd'
                            ? getNetHarvest()[1]
                            : getNetHarvest()[0],
                          2,
                        )
                      : 'Generate First'}
                    <Icon
                      icon={viewOverall === 'usd' ? 'usd' : 'spartav2'}
                      className="ms-1"
                      size="15"
                    />
                  </Col>
                </Row>
                <Row className="my-1">
                  <Col xs="auto">
                    {t('redemptionValue')}
                    <OverlayTrigger
                      placement="auto"
                      overlay={
                        <Popover>
                          <Popover.Header as="h3">
                            {t('redemptionValue')}
                          </Popover.Header>
                          <Popover.Body className="text-center">
                            {t('redemptionValueInfo')}
                          </Popover.Body>
                        </Popover>
                      }
                    >
                      <span role="button">
                        <Icon icon="info" className="ms-1 mb-1" size="15" />
                      </span>
                    </OverlayTrigger>
                  </Col>
                  <Col className="text-end ">
                    {formatFromWei(
                      viewOverall === 'usd'
                        ? getRedemptionValue()[1]
                        : getRedemptionValue()[0],
                      2,
                    )}
                    <Icon
                      icon={viewOverall === 'usd' ? 'usd' : 'spartav2'}
                      className="ms-1"
                      size="15"
                    />
                  </Col>
                </Row>
                <hr />
                <Row className="my-1">
                  <Col xs="auto">
                    <strong>
                      {t('gainVs')} {viewOverall === 'usd' ? 'USD' : 'SPARTA'}
                    </strong>
                    <OverlayTrigger
                      placement="auto"
                      overlay={
                        <Popover>
                          <Popover.Header as="h3">
                            {t('gainVs')}{' '}
                            {viewOverall === 'usd' ? 'USD' : 'SPARTA'}
                          </Popover.Header>
                          <Popover.Body className="text-center">
                            {t('gainVsInfo', {
                              coin: viewOverall === 'usd' ? 'USD' : 'SPARTA',
                            })}
                          </Popover.Body>
                        </Popover>
                      }
                    >
                      <span role="button">
                        <Icon icon="info" className="ms-1 mb-1" size="15" />
                      </span>
                    </OverlayTrigger>
                  </Col>
                  <Col className="text-end">
                    <strong>
                      {isOverall()
                        ? formatFromWei(
                            viewOverall === 'usd'
                              ? getNetGain(true)
                              : getNetGain(false),
                            2,
                          )
                        : 'Generate First'}
                    </strong>
                    <Icon
                      icon={viewOverall === 'usd' ? 'usd' : 'spartav2'}
                      className="ms-1"
                      size="15"
                    />
                  </Col>
                </Row>
                <Row className="my-1">
                  <Col xs="auto">
                    {t('currentlyWorth')}
                    <OverlayTrigger
                      placement="auto"
                      overlay={
                        <Popover>
                          <Popover.Header as="h3">
                            {t('currentlyWorth')}
                          </Popover.Header>
                          <Popover.Body className="text-center">
                            {t('currentlyWorthInfo')}
                          </Popover.Body>
                        </Popover>
                      }
                    >
                      <span role="button">
                        <Icon icon="info" className="ms-1 mb-1" size="15" />
                      </span>
                    </OverlayTrigger>
                  </Col>
                  <Col className="text-end ">
                    {isOverall()
                      ? formatFromWei(
                          viewOverall === 'units'
                            ? getNetGainSpartaToUsd()
                            : getNetGainUsdToSparta(),
                          2,
                        )
                      : 'Generate First'}{' '}
                    <Icon
                      icon={viewOverall === 'units' ? 'usd' : 'spartav2'}
                      className="ms-1"
                      size="15"
                    />
                  </Col>
                </Row>
                <hr />
                <Row className="my-1">
                  <Col xs="auto">
                    {t('currentBlock')}
                    <OverlayTrigger
                      placement="auto"
                      overlay={
                        <Popover>
                          <Popover.Header as="h3">
                            {t('currentBlock')}
                          </Popover.Header>
                          <Popover.Body className="text-center">
                            {t('currentBlockInfo')}
                          </Popover.Body>
                        </Popover>
                      }
                    >
                      <span role="button">
                        <Icon icon="info" className="ms-1 mb-1" size="15" />
                      </span>
                    </OverlayTrigger>
                  </Col>
                  <Col className="text-end ">{getBlockRPC()}</Col>
                </Row>
                <Row className="my-1">
                  <Col xs="auto">
                    {t('lastUpdated')}
                    <OverlayTrigger
                      placement="auto"
                      overlay={
                        <Popover>
                          <Popover.Header as="h3">
                            {t('lastUpdated')}
                          </Popover.Header>
                          <Popover.Body className="text-center">
                            {t('lastUpdatedInfo')}
                          </Popover.Body>
                        </Popover>
                      }
                    >
                      <span role="button">
                        <Icon icon="info" className="ms-1 mb-1" size="15" />
                      </span>
                    </OverlayTrigger>
                  </Col>
                  <Col className="text-end ">{getBlock()}</Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <Button
                  onClick={() => getOverall()}
                  className="w-100"
                  disabled={getSecsSince(position.lastUpdated) < 60 || !address}
                >
                  {getSecsSince(position.lastUpdated) < 60
                    ? `${`Wait ${60 - getSecsSince(position.lastUpdated)}`}s`
                    : 'Reload'}
                </Button>
              </Card.Footer>
            </>
          ) : (
            <Col>
              <HelmetLoading height={150} width={150} />
            </Col>
          )}
        </Card>
      </Col>

      <Col>
        <Card
          className="mb-2"
          style={{ minHeight: '445px', minWidth: '300px' }}
        >
          <Card.Header>
            <Row>
              <Col>
                <Card.Title className="pt-1">
                  {t('assetPosition', {
                    asset: !isLoading() ? `${_getToken().symbol}s` : 'Synth',
                  })}
                </Card.Title>
              </Col>
              <Col xs="auto">
                {!isLoading() && (
                  <AssetSelect priority="1" filter={['synth']} />
                )}
              </Col>
            </Row>
          </Card.Header>
          {!isLoading() ? (
            <Card.Body>
              <Row className="mb-3">
                <Col>
                  <Nav
                    variant="pills"
                    activeKey={viewPool}
                    onSelect={(e) => setViewPool(e)}
                    fill
                  >
                    <Nav.Item>
                      <Nav.Link className="btn-sm" eventKey="usd">
                        Vs Hodl {t('USD')}
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link className="btn-sm" eventKey="units">
                        Vs Hodl {t('Units')}
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
              </Row>
              <hr />

              <Row className="my-1">
                <Col xs="auto">
                  {t('assetsForged')}
                  <OverlayTrigger
                    placement="auto"
                    overlay={
                      <Popover>
                        <Popover.Header as="h3">
                          {t('assetsForged')}
                        </Popover.Header>
                        <Popover.Body className="text-center">
                          {t('assetsForgedInfo', {
                            these: ` ${t('these')}`,
                          })}
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <span role="button">
                      <Icon icon="info" className="ms-1 mb-1" size="15" />
                    </span>
                  </OverlayTrigger>
                </Col>
                <Col className="text-end ">
                  {isOverall()
                    ? formatFromWei(
                        viewPool === 'usd'
                          ? getPoolNetAdd()[1]
                          : getPoolNetAdd()[0],
                        2,
                      )
                    : 'Generate First'}
                  <Icon
                    icon={viewPool === 'usd' ? 'usd' : 'spartav2'}
                    className="ms-1"
                    size="15"
                  />
                </Col>
              </Row>
              <hr />
              <Row className="my-1">
                <Col xs="auto">
                  {t('assetsMelted')}
                  <OverlayTrigger
                    placement="auto"
                    overlay={
                      <Popover>
                        <Popover.Header as="h3">
                          {t('assetsMelted')}
                        </Popover.Header>
                        <Popover.Body className="text-center">
                          {t('assetsMeltedInfo', { these: ` ${t('these')}` })}
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <span role="button">
                      <Icon icon="info" className="ms-1 mb-1" size="15" />
                    </span>
                  </OverlayTrigger>
                </Col>
                <Col className="text-end ">
                  {isOverall()
                    ? formatFromWei(
                        viewPool === 'usd'
                          ? getPoolNetRem()[1]
                          : getPoolNetRem()[0],
                        2,
                      )
                    : 'Generate First'}
                  <Icon
                    icon={viewPool === 'usd' ? 'usd' : 'spartav2'}
                    className="ms-1"
                    size="15"
                  />
                </Col>
              </Row>
              <Row className="my-1">
                <Col xs="auto">
                  {t('totalHarvested')}
                  <OverlayTrigger
                    placement="auto"
                    overlay={
                      <Popover>
                        <Popover.Header as="h3">
                          {t('totalHarvested')}
                        </Popover.Header>
                        <Popover.Body className="text-center">
                          {t('totalHarvestedInfo')}
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <span role="button">
                      <Icon icon="info" className="ms-1 mb-1" size="15" />
                    </span>
                  </OverlayTrigger>
                </Col>
                <Col className="text-end ">
                  {isOverall()
                    ? formatFromWei(
                        viewPool === 'usd'
                          ? getPoolNetHarvest()[1]
                          : getPoolNetHarvest()[0],
                        2,
                      )
                    : 'Generate First'}
                  <Icon
                    icon={viewPool === 'usd' ? 'usd' : 'spartav2'}
                    className="ms-1"
                    size="15"
                  />
                </Col>
              </Row>
              <Row className="my-1">
                <Col xs="auto">
                  {t('redemptionValue')}
                  <OverlayTrigger
                    placement="auto"
                    overlay={
                      <Popover>
                        <Popover.Header as="h3">
                          {t('redemptionValue')}
                        </Popover.Header>
                        <Popover.Body className="text-center">
                          {t('redemptionValueSynthInfo')}
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <span role="button">
                      <Icon icon="info" className="ms-1 mb-1" size="15" />
                    </span>
                  </OverlayTrigger>{' '}
                </Col>
                <Col className="text-end ">
                  {formatFromWei(
                    viewPool === 'usd'
                      ? getSynthRedValue()[1]
                      : getSynthRedValue()[0],
                    2,
                  )}
                  <Icon
                    icon={viewPool === 'usd' ? 'usd' : 'spartav2'}
                    className="ms-1"
                    size="15"
                  />
                </Col>
              </Row>
              <hr />
              <Row className="my-1">
                <Col xs="auto">
                  <strong>
                    {t('gainVs')}{' '}
                    {viewPool === 'usd' ? 'USD' : _getToken().symbol}
                  </strong>
                  <OverlayTrigger
                    placement="auto"
                    overlay={
                      <Popover>
                        <Popover.Header as="h3">
                          {t('gainVs')}{' '}
                          {viewPool === 'usd' ? 'USD' : _getToken().symbol}
                        </Popover.Header>
                        <Popover.Body className="text-center">
                          {t('gainVsInfoSynth', {
                            coin:
                              viewPool === 'usd' ? 'USD' : _getToken().symbol,
                          })}
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <span role="button">
                      <Icon icon="info" className="ms-1 mb-1" size="15" />
                    </span>
                  </OverlayTrigger>
                </Col>
                <Col className="text-end">
                  <strong>
                    {isOverall()
                      ? formatFromWei(
                          viewPool === 'usd'
                            ? getPoolNetGain('usd')
                            : getPoolNetHarvest()[1],
                          2,
                        )
                      : 'Generate First'}
                  </strong>
                  <Icon icon="usd" className="ms-1" size="15" />
                </Col>
              </Row>
              <Row className="my-1">
                <Col xs="auto">
                  {t('currentlyWorth')}
                  <OverlayTrigger
                    placement="auto"
                    overlay={
                      <Popover>
                        <Popover.Header as="h3">
                          {t('currentlyWorth')}
                        </Popover.Header>
                        <Popover.Body className="text-center">
                          {t('currentlyWorthInfo')}
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <span role="button">
                      <Icon icon="info" className="ms-1 mb-1" size="15" />
                    </span>
                  </OverlayTrigger>
                </Col>
                <Col className="text-end ">
                  {isOverall()
                    ? formatFromWei(
                        viewPool === 'units'
                          ? getPoolNetGainWorthUnit()
                          : getPoolNetGainWorthSparta(),
                        2,
                      )
                    : 'Generate First'}
                  {viewPool === 'usd' && (
                    <Icon icon="spartav2" className="ms-1" size="15" />
                  )}
                  {!isLoading() && viewPool === 'units' && (
                    <img
                      src={_getToken().symbolUrl}
                      height="17"
                      alt="token"
                      className="ms-1"
                    />
                  )}
                </Col>
              </Row>
            </Card.Body>
          ) : (
            <Col>
              <HelmetLoading height={150} width={150} />
            </Col>
          )}
        </Card>
      </Col>
    </>
  )
}

export default SynthPositions

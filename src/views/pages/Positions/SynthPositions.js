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
import { getAddresses, getItemFromArray } from '../../../utils/web3'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import { Icon } from '../../../components/Icons/icons'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import {
  calcSpotValueAll,
  getBlockTimestamp,
  getSecsSince,
} from '../../../utils/math/nonContract'
import { useWeb3 } from '../../../store/web3'
import AssetSelect from '../../../components/AssetSelect/AssetSelect'
import {
  calcSpotValueInBase,
  getPool,
  getSynth,
  getToken,
} from '../../../utils/math/utils'
import { getMemberSynthPositions } from '../../../utils/extCalls'
import { useSynth } from '../../../store/synth/selector'

const SynthPositions = () => {
  const isLightMode = window.localStorage.getItem('theme')
  const { t } = useTranslation()
  const pool = usePool()
  const synth = useSynth()
  const web3 = useWeb3()
  const wallet = useWeb3React()
  const addr = getAddresses()

  const [showUsd, setShowUsd] = useState(true)
  const [showUsdPool, setShowUsdPool] = useState(true)
  const [poolPos, setPoolPos] = useState(false)
  const [position, setPosition] = useState(false)
  const [trigger0, settrigger0] = useState(0)

  const isLoading = () => {
    if (!pool.tokenDetails || !pool.poolDetails || !synth.synthDetails) {
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
        window.localStorage.setItem('assetType1', 'synth')
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
    const _positions = tryParse(
      window.localStorage.getItem('sp_synthpositions'),
    )
    _position = _positions?.filter((scope) => scope.id === getWallet())[0]
    if (_position) {
      setPosition(_position)
    }
  }

  const getData = () => {
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
    const [memberPos, block] = await getMemberSynthPositions(wallet.account)
    updateLS(memberPos, block)
  }

  const getRedemptionValue = () => {
    let [spartaValue, usdValue] = calcSpotValueAll(
      pool.poolDetails,
      synth.synthDetails,
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
          parseIdToAddr(x.pool.id) ===
          getSynth(poolPos.tokenAddress).toString().toLowerCase(),
      )[0]
      if (_pos) {
        return _pos
      }
    }
    return {
      netAddSparta: '0',
      netAddUsd: '0',
      netRemSparta: '0',
      netRemUsd: '0',
      netHarvestSparta: '0',
      netHarvestUsd: '0',
      pool: {
        id: '',
        symbol: 'Invalid',
      },
    }
  }

  const getPoolNetAdd = () => {
    const pewl = _getPoolPos()
    const netAddSparta = pewl.netAddSparta > 0 ? pewl.netAddSparta : '0.00'
    const netAddUsd = pewl.netAddUsd > 0 ? pewl.netAddUsd : '0.00'
    return [netAddSparta, netAddUsd]
  }

  const getPoolNetRem = () => {
    const pewl = _getPoolPos()
    const netRemSparta = pewl.netRemSparta > 0 ? pewl.netRemSparta : '0.00'
    const netRemUsd = pewl.netRemUsd > 0 ? pewl.netRemUsd : '0.00'
    return [netRemSparta, netRemUsd]
  }

  const getPoolNetHarvest = () => {
    const pewl = _getPoolPos()
    const netSparta = pewl.netHarvestSparta > 0 ? pewl.netHarvestSparta : '0.00'
    const netUsd = pewl.netHarvestUsd > 0 ? pewl.netHarvestUsd : '0.00'
    return [netSparta, netUsd]
  }

  const getSynthRedValue = () => {
    const poolDets = getPool(poolPos.tokenAddress, pool.poolDetails)
    const synthDets = getSynth(poolPos.tokenAddress, synth.synthDetails)
    const totalSynths = BN(synthDets.balance).plus(synthDets.staked)
    let spartaValue = calcSpotValueInBase(totalSynths, poolDets)
    let usdValue = spartaValue.times(web3.spartaPrice)
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

  const getPoolNetGainWorthUsd = () => {
    const netGainSparta = getPoolNetGain('sparta')
    const inUsd = netGainSparta.times(web3.spartaPrice)
    return inUsd
  }

  const getPoolNetGainWorthSparta = () => {
    const netGainUsd = getPoolNetGain('usd')
    const inSparta = netGainUsd.div(web3.spartaPrice)
    return inSparta
  }

  return (
    <>
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
                    {t('assetsForged')}
                    <OverlayTrigger
                      placement="auto"
                      overlay={
                        <Popover>
                          <Popover.Header as="h3">
                            {t('assetsForged')}
                          </Popover.Header>
                          <Popover.Body className="text-center">
                            Total sum of all assets used to mint Synths by your
                            wallet. The value is based on the price of the
                            assets at the time they were added, derived via the
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
                    {t('assetsMelted')}
                    <OverlayTrigger
                      placement="auto"
                      overlay={
                        <Popover>
                          <Popover.Header as="h3">
                            {t('assetsMelted')}
                          </Popover.Header>
                          <Popover.Body className="text-center">
                            Total sum of all assets received via melting Synths
                            by your wallet. The value is based on the price of
                            the assets at the time they were received, derived
                            via the pools internal pricing.
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
                          showUsd ? getNetRemove()[1] : getNetRemove()[0],
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
                            Total sum of all harvests by your wallet. The value
                            is based on the price of the SPARTA at the time they
                            were harvested, derived via the pools internal
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
                            ? getPoolNetHarvest()[1]
                            : getPoolNetHarvest()[0],
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
                            Total value of all Synth assets attributed to this
                            wallet. The value is internally derived based on the
                            current spot prices of the assets in the pools.
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
                            Your NET position based on the sum of the above
                            rows. This is a comparison to if you were to hold{' '}
                            {showUsd ? 'USD' : 'SPARTA'} instead of providing
                            liquidity to the pools.
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
                          showUsd ? getNetGain(true) : getNetGain(false),
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
                            This is the current spot value of the Gain vs Hodl
                            figure above
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
                    {t('currentBlock')}
                    <OverlayTrigger
                      placement="auto"
                      overlay={
                        <Popover>
                          <Popover.Header as="h3">
                            {t('currentBlock')}
                          </Popover.Header>
                          <Popover.Body className="text-center">
                            The most recent block from your connected RPC
                            network.
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
                  <Col className="text-end output-card">{getBlockRPC()}</Col>
                </Row>
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
                            The most recent block from the last time you clicked
                            &apos;Reload&apos; to update all
                            &apos;realised&apos; position events. Note that the
                            &apos;Redemption Value&apos; is dynamic and does not
                            need to be updated via the button.
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
                  <Col className="text-end output-card">{getBlock()}</Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <Button
                  onClick={() => getOverall()}
                  className="w-100"
                  disabled={
                    getSecsSince(position.lastUpdated) < 60 || !wallet.account
                  }
                >
                  {getSecsSince(position.lastUpdated) < 60
                    ? `${`Wait ${60 - getSecsSince(position.lastUpdated)}`}s`
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
            {!isLoading() ? `${_getToken().symbol}s` : 'Synth'} Position
            <Card.Subtitle className="">
              <div className="mt-2 d-inline-block me-2">
                vs Hodl {showUsdPool ? 'USD' : 'SPARTA'}
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
              </Button>
            </Card.Subtitle>
          </Card.Header>
          {!isLoading() ? (
            <Card.Body>
              <Row className="mb-2">
                <div className="ms-1">
                  <AssetSelect priority="1" filter={['synth']} />
                </div>
              </Row>
              <hr />

              <Row className="my-1">
                <Col xs="auto" className="text-card">
                  {t('assetsForged')}
                  <OverlayTrigger
                    placement="auto"
                    overlay={
                      <Popover>
                        <Popover.Header as="h3">
                          {t('assetsForged')}
                        </Popover.Header>
                        <Popover.Body className="text-center">
                          Total sum of all assets used to mint these Synths by
                          your wallet. The value is based on the price of the
                          assets at the time they were added, derived via the
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
                        showUsdPool ? getPoolNetAdd()[1] : getPoolNetAdd()[0],
                        2,
                      )
                    : 'Generate First'}
                  <Icon
                    icon={showUsdPool ? 'usd' : 'spartav2'}
                    className="ms-1"
                    size="15"
                  />
                </Col>
              </Row>
              <hr />
              <Row className="my-1">
                <Col xs="auto" className="text-card">
                  {t('assetsMelted')}
                  <OverlayTrigger
                    placement="auto"
                    overlay={
                      <Popover>
                        <Popover.Header as="h3">
                          {t('assetsMelted')}
                        </Popover.Header>
                        <Popover.Body className="text-center">
                          Total sum of all assets received from melting these
                          Synths by your wallet. The value is based on the price
                          of the assets at the time they were removed, derived
                          via the pools internal pricing.
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
                        showUsdPool ? getPoolNetRem()[1] : getPoolNetRem()[0],
                        2,
                      )
                    : 'Generate First'}
                  <Icon
                    icon={showUsdPool ? 'usd' : 'spartav2'}
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
                          Total sum of all harvests by your wallet. The value is
                          based on the price of the SPARTA at the time they were
                          harvested, derived via the pools internal pricing.
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
                        showUsdPool
                          ? getPoolNetHarvest()[1]
                          : getPoolNetHarvest()[0],
                        2,
                      )
                    : 'Generate First'}
                  <Icon
                    icon={showUsdPool ? 'usd' : 'spartav2'}
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
                          Total value of all Synth assets attributed to this
                          wallet. The value is internally derived based on the
                          current spot prices of the assets in the pools.
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
                  {formatFromWei(
                    showUsdPool ? getSynthRedValue()[1] : getSynthRedValue()[0],
                    2,
                  )}
                  <Icon
                    icon={showUsdPool ? 'usd' : 'spartav2'}
                    className="ms-1"
                    size="15"
                  />
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
                          {t('gainVs')} {showUsdPool ? 'USD' : 'SPARTA'}
                        </Popover.Header>
                        <Popover.Body className="text-center">
                          Your NET position based on the sum of the above rows.
                          This is a comparison to if you were to hold
                          {showUsdPool ? ' USD ' : ' SPARTA '}
                          instead of minting Synths.
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
                        showUsdPool
                          ? getPoolNetGain('usd')
                          : getPoolNetGain('sparta'),
                        2,
                      )
                    : 'Generate First'}
                  <Icon
                    icon={showUsdPool ? 'usd' : 'spartav2'}
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
                          This is the current spot value of the Gain vs Hodl
                          figure above
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
                        !showUsdPool
                          ? getPoolNetGainWorthUsd()
                          : getPoolNetGainWorthSparta(),
                        2,
                      )
                    : 'Generate First'}
                  <Icon
                    icon={!showUsdPool ? 'usd' : 'spartav2'}
                    className="ms-1"
                    size="15"
                  />
                </Col>
              </Row>
            </Card.Body>
          ) : (
            <Col className="">
              <HelmetLoading height={300} width={300} />
            </Col>
          )}
        </Card>
      </Col>
    </>
  )
}

export default SynthPositions

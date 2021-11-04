import React, { useState, useEffect } from 'react'
import { Card, Col, Row, Button } from 'react-bootstrap'
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
  const { t } = useTranslation()
  const pool = usePool()
  const bond = useBond()
  const dao = useDao()
  const web3 = useWeb3()
  const wallet = useWeb3React()
  const addr = getAddresses()

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
    if (position) {
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
                <Card className="card-320">
                  <Card.Header className="">
                    Overall Position
                    <Card.Subtitle className="">
                      In USD (at time of)
                    </Card.Subtitle>
                    <Card.Subtitle className="">
                      *Add switch to Hodl USD / Units*
                    </Card.Subtitle>
                  </Card.Header>
                  {!isLoading() ? (
                    <>
                      <Card.Body>
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('netAddUsd')}
                          </Col>
                          <Col className="text-end output-card">
                            {formatFromWei(getNetAdd()[1], 2)}
                            <Icon icon="usd" className="ms-1" size="15" />
                          </Col>
                        </Row>
                        <hr />
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('netRemoveUsd')}
                          </Col>
                          <Col className="text-end output-card">
                            {formatFromWei(getNetRemove()[1], 2)}
                            <Icon icon="usd" className="ms-1" size="15" />
                          </Col>
                        </Row>
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('netHarvestUsd')}
                          </Col>
                          <Col className="text-end output-card">
                            {formatFromWei(getNetHarvest()[1], 2)}
                            <Icon icon="usd" className="ms-1" size="15" />
                          </Col>
                        </Row>
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('redemptionValueUsd')}
                          </Col>
                          <Col className="text-end output-card">
                            {formatFromWei(getRedemptionValue()[1], 2)}
                            <Icon icon="usd" className="ms-1" size="15" />
                          </Col>
                        </Row>
                        <hr />
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('gainLossUsd')}
                          </Col>
                          <Col className="text-end output-card">
                            {formatFromWei(getNetGain(true), 2)}
                            <Icon icon="usd" className="ms-1" size="15" />
                          </Col>
                        </Row>
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('lastUpdated')}
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
                <Card className="card-320">
                  <Card.Header className="">
                    Overall Position
                    <Card.Subtitle className="">
                      In SPARTA (at time of)
                    </Card.Subtitle>
                    <Card.Subtitle className="">
                      *Combine this with other tile*
                    </Card.Subtitle>
                  </Card.Header>
                  {!isLoading() ? (
                    <>
                      <Card.Body>
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('netAddSparta')}
                          </Col>
                          <Col className="text-end output-card">
                            {formatFromWei(getNetAdd()[0], 2)}
                            <Icon icon="spartav2" className="ms-1" size="15" />
                          </Col>
                        </Row>
                        <hr />
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('netRemoveSparta')}
                          </Col>
                          <Col className="text-end output-card">
                            {formatFromWei(getNetRemove()[0], 2)}
                            <Icon icon="spartav2" className="ms-1" size="15" />
                          </Col>
                        </Row>
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('netHarvestSparta')}
                          </Col>
                          <Col className="text-end output-card">
                            {formatFromWei(getNetHarvest()[0], 2)}
                            <Icon icon="spartav2" className="ms-1" size="15" />
                          </Col>
                        </Row>
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('redemptionValueSparta')}
                          </Col>
                          <Col className="text-end output-card">
                            {formatFromWei(getRedemptionValue()[0], 2)}
                            <Icon icon="spartav2" className="ms-1" size="15" />
                          </Col>
                        </Row>
                        <hr />
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('gainLoss')}($SPARTA)
                          </Col>
                          <Col className="text-end output-card">
                            {formatFromWei(getNetGain(false), 2)}
                            <Icon icon="spartav2" className="ms-1" size="15" />
                          </Col>
                        </Row>
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('worthNow')}($USD)
                          </Col>
                          <Col className="text-end output-card">
                            {formatFromWei(getNetGainSpartaToUsd(), 2)}
                            <Icon icon="usd" className="ms-1" size="15" />
                          </Col>
                        </Row>
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('lastUpdated')}
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
                <Card className="card-320">
                  <Card.Header className="">
                    {!isLoading() ? `${_getToken().symbol}p` : 'Pool'} Position
                    <Card.Subtitle className="">Vs Hodl USD</Card.Subtitle>
                    <Card.Subtitle className="">
                      *Add switch to Hodl USD / Units*
                    </Card.Subtitle>
                  </Card.Header>
                  {!isLoading() ? (
                    <Card.Body>
                      <Row className="my-1">
                        <AssetSelect priority="1" filter={['pool']} />
                      </Row>
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('netAddUsd')}
                        </Col>
                        <Col className="text-end output-card">
                          {formatFromWei(getPoolNetAdd()[2], 2)}
                          <Icon icon="usd" className="ms-1" size="15" />
                        </Col>
                      </Row>
                      <hr />
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('netRemoveUsd')}
                        </Col>
                        <Col className="text-end output-card">
                          {formatFromWei(getPoolNetRem()[2], 2)}
                          <Icon icon="usd" className="ms-1" size="15" />
                        </Col>
                      </Row>
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('netRedeemable')}
                        </Col>
                        <Col className="text-end output-card">
                          {formatFromWei(getPoolRedValue()[2], 2)}
                          <Icon icon="usd" className="ms-1" size="15" />
                        </Col>
                      </Row>
                      <hr />
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('gainLoss')}
                        </Col>
                        <Col className="text-end output-card">
                          {formatFromWei(getPoolNetGain('usd'), 2)}
                          <Icon icon="usd" className="ms-1" size="15" />
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
              <Col xs="auto">
                <Card className="card-320">
                  <Card.Header className="">
                    {!isLoading() ? `${_getToken().symbol}p` : 'Pool'} Position
                    <Card.Subtitle className="">Vs Hodl Units</Card.Subtitle>
                    <Card.Subtitle className="">
                      *Combine this with other tile*
                    </Card.Subtitle>
                  </Card.Header>
                  {!isLoading() ? (
                    <Card.Body>
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('netAddSparta')}
                        </Col>
                        <Col className="text-end output-card">
                          {formatFromWei(getPoolNetAdd()[0], 2)}
                          <Icon icon="spartav2" className="ms-1" size="15" />
                        </Col>
                      </Row>
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('netRemoveSparta')}
                        </Col>
                        <Col className="text-end output-card">
                          {formatFromWei(getPoolNetRem()[0], 2)}
                          <Icon icon="spartav2" className="ms-1" size="15" />
                        </Col>
                      </Row>
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('netRedeemSparta')}
                        </Col>
                        <Col className="text-end output-card">
                          {formatFromWei(getPoolRedValue()[0], 2)}
                          <Icon icon="spartav2" className="ms-1" size="15" />
                        </Col>
                      </Row>
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('gainLossSparta')}
                        </Col>
                        <Col className="text-end output-card">
                          {formatFromWei(getPoolNetGain('sparta'), 2)}
                          <Icon icon="spartav2" className="ms-1" size="15" />
                        </Col>
                      </Row>
                      <hr />
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('netAddToken')}
                        </Col>
                        <Col className="text-end output-card">
                          {formatFromWei(getPoolNetAdd()[1], 2)}
                          {/* <Icon icon="usd" className="ms-1" size="15" /> */}
                        </Col>
                      </Row>
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('netRemoveToken')}
                        </Col>
                        <Col className="text-end output-card">
                          {formatFromWei(getPoolNetRem()[1], 2)}
                          {/* <Icon icon="usd" className="ms-1" size="15" /> */}
                        </Col>
                      </Row>
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('netRedeemToken')}
                        </Col>
                        <Col className="text-end output-card">
                          {formatFromWei(getPoolRedValue()[1], 2)}
                          {/* <Icon icon="usd" className="ms-1" size="15" /> */}
                        </Col>
                      </Row>
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('gainLossToken')}
                        </Col>
                        <Col className="text-end output-card">
                          {formatFromWei(getPoolNetGain('token'), 2)}
                          {/* <Icon icon="spartav2" className="ms-1" size="15" /> */}
                        </Col>
                      </Row>
                      <hr />
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('gainWorthNow')}($USD)
                        </Col>
                        <Col className="text-end output-card">
                          {formatFromWei(getPoolNetGainWorthUsd(), 2)}
                          <Icon icon="usd" className="ms-1" size="15" />
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
            </Row>
          </>
        )}
        {!tempChains.includes(network.chainId) && <WrongNetwork />}
      </div>
    </>
  )
}

export default Positions

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
  getTimeSince,
} from '../../../utils/math/nonContract'
import { useWeb3 } from '../../../store/web3'
import AssetSelect from '../../../components/AssetSelect/AssetSelect'
import { getToken } from '../../../utils/math/utils'

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
    _position = _positions?.filter(
      (scope) => scope.wallet === wallet.account,
    )[0]
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

  const updateOverallLS = (overallData) => {
    const walletAddr = wallet.account
    let posArray = tryParse(window.localStorage.getItem('sp_positions'))
    if (!posArray) {
      posArray = []
      posArray.push({ wallet: walletAddr, overall: {}, positions: [] })
    }
    let indexWal = posArray.findIndex((pos) => pos.wallet === walletAddr)
    if (indexWal === -1) {
      posArray.push({ wallet: walletAddr, overall: {}, positions: [] })
      indexWal = posArray.findIndex((pos) => pos.wallet === walletAddr)
    }
    posArray[indexWal].overall.netAddSparta = overallData.netAddSparta
    posArray[indexWal].overall.netRemoveSparta = overallData.netRemoveSparta
    posArray[indexWal].overall.netHarvestSparta = overallData.netHarvestSparta
    posArray[indexWal].overall.netAddUsd = overallData.netAddUsd
    posArray[indexWal].overall.netRemoveUsd = overallData.netRemoveUsd
    posArray[indexWal].overall.netHarvestUsd = overallData.netHarvestUsd
    posArray[indexWal].overall.lastUpdated = overallData.lastUpdated
    window.localStorage.setItem('sp_positions', JSON.stringify(posArray))
    getFromLS()
  }

  const getOverall = () => {
    // DUMMY DATA, ADD IN API CALLS TO GET THIS DATA
    const overallData = {
      netAddSparta: '100000000000000000000',
      netRemoveSparta: '200000000000000000000',
      netHarvestSparta: '300000000000000000000',
      netAddUsd: '100000000000000000000',
      netRemoveUsd: '200000000000000000000',
      netHarvestUsd: '300000000000000000000',
      lastUpdated: getBlockTimestamp(),
    }
    updateOverallLS(overallData)
  }

  // /** @returns {object} poolDetails item */
  // const _getPool = (tokenAddr) => getPool(tokenAddr, pool.poolDetails)

  // /** @returns BN(usdValue) */
  // const getUSD = (tokenAddr, amount) => {
  //   if (pool.poolDetails.length > 1) {
  //     if (_getPool(tokenAddr)) {
  //       return calcLiqValueIn(amount, _getPool(tokenAddr), web3.spartaPrice)[1]
  //     }
  //   }
  //   return '0.00'
  // }

  const getRedemptionValue = (inUsd) => {
    const [spartaValue, usdValue] = calcLiqValueAll(
      pool.poolDetails,
      dao.daoDetails,
      bond.bondDetails,
      web3.spartaPrice,
    )
    if (inUsd) {
      if (usdValue > 0) {
        return usdValue
      }
    }
    if (spartaValue > 0) {
      return spartaValue
    }
    return '0.00'
  }

  // const isPosition = () => {
  //   if (position) {
  //     return true
  //   }
  //   return false
  // }

  const isOverall = () => {
    if (position?.overall) {
      return true
    }
    return false
  }

  const getNetAdd = (inUsd) => {
    const value = inUsd
      ? position?.overall?.netAddUsd
      : position?.overall?.netAddSparta
    if (value > 0) {
      return value
    }
    return '0.00'
  }

  const getNetRemove = (inUsd) => {
    const value = inUsd
      ? position?.overall?.netRemoveUsd
      : position?.overall?.netRemoveSparta
    if (value > 0) {
      return value
    }
    return '0.00'
  }

  const getNetHarvest = (inUsd) => {
    const value = inUsd
      ? position?.overall?.netHarvestUsd
      : position?.overall?.netHarvestSparta
    if (value > 0) {
      return value
    }
    return '0.00'
  }

  const getNetGain = (inUsd) => {
    if (!isOverall) {
      return 'Generate First'
    }
    const add = BN(getNetAdd(inUsd && true))
    const remove = BN(getNetRemove(inUsd && true))
    const harvest = BN(getNetHarvest(inUsd && true))
    const value = BN(getRedemptionValue(inUsd && true))
    const gain = value.plus(harvest).plus(remove).minus(add)
    if (gain > 0) {
      return gain
    }
    return '0.00'
  }

  const getNetGainSpartaToUsd = () => {
    const netGainSparta = getNetGain(false)
    if (netGainSparta > 0) {
      const inUsd = netGainSparta.times(web3.spartaPrice)
      if (inUsd > 0) {
        return inUsd
      }
    }
    return '0.00'
  }

  const getOverallTime = () => {
    if (!isOverall) {
      return 'Generate First'
    }
    const time = position?.overall?.lastUpdated
    if (time > 0) {
      return getTimeSince(time, t)
    }
    return 'Generate First'
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
                          <Col
                            className="text-end output-card"
                            onClick={() => console.log(position)}
                          >
                            {formatFromWei(getNetAdd(true), 2)}
                            <Icon icon="usd" className="ms-1" size="15" />
                          </Col>
                        </Row>
                        <hr />
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('netRemoveUsd')}
                          </Col>
                          <Col className="text-end output-card">
                            {formatFromWei(getNetRemove(true), 2)}
                            <Icon icon="usd" className="ms-1" size="15" />
                          </Col>
                        </Row>
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('netHarvestUsd')}
                          </Col>
                          <Col className="text-end output-card">
                            {formatFromWei(getNetHarvest(true), 2)}
                            <Icon icon="usd" className="ms-1" size="15" />
                          </Col>
                        </Row>
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('redemptionValueUsd')}
                          </Col>
                          <Col className="text-end output-card">
                            {formatFromWei(getRedemptionValue(true), 2)}
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
                        <Button onClick={() => getOverall()}>Reload</Button>
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
                          <Col
                            className="text-end output-card"
                            onClick={() => console.log(position)}
                          >
                            {formatFromWei(getNetAdd(false), 2)}
                            <Icon icon="spartav2" className="ms-1" size="15" />
                          </Col>
                        </Row>
                        <hr />
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('netRemoveSparta')}
                          </Col>
                          <Col className="text-end output-card">
                            {formatFromWei(getNetRemove(false), 2)}
                            <Icon icon="spartav2" className="ms-1" size="15" />
                          </Col>
                        </Row>
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('netHarvestSparta')}
                          </Col>
                          <Col className="text-end output-card">
                            {formatFromWei(getNetHarvest(false), 2)}
                            <Icon icon="spartav2" className="ms-1" size="15" />
                          </Col>
                        </Row>
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('redemptionValueSparta')}
                          </Col>
                          <Col className="text-end output-card">
                            {formatFromWei(getRedemptionValue(false), 2)}
                            <Icon icon="spartav2" className="ms-1" size="15" />
                          </Col>
                        </Row>
                        <hr />
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('gainLossSparta')}
                          </Col>
                          <Col className="text-end output-card">
                            {formatFromWei(getNetGain(false), 2)}
                            <Icon icon="spartav2" className="ms-1" size="15" />
                          </Col>
                        </Row>
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('gainLossUsd')}
                          </Col>
                          <Col className="text-end output-card">
                            {formatFromWei(getNetGainSpartaToUsd())}
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
                        <Button onClick={() => getOverall()}>Reload</Button>
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
                          some numb
                          <Icon icon="usd" className="ms-1" size="15" />
                        </Col>
                      </Row>
                      <hr />
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('netRemoveUsd')}
                        </Col>
                        <Col className="text-end output-card">
                          some numb
                          <Icon icon="usd" className="ms-1" size="15" />
                        </Col>
                      </Row>
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('netRedeemable')}
                        </Col>
                        <Col className="text-end output-card">
                          some numb
                          <Icon icon="usd" className="ms-1" size="15" />
                        </Col>
                      </Row>
                      <hr />
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('gainLoss')}
                        </Col>
                        <Col className="text-end output-card">
                          some numb
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
                    *Selected Pool* Position
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
                          some numb
                          <Icon icon="usd" className="ms-1" size="15" />
                        </Col>
                      </Row>
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('netAdd*Token*')}
                        </Col>
                        <Col className="text-end output-card">
                          some numb
                          <Icon icon="usd" className="ms-1" size="15" />
                        </Col>
                      </Row>
                      <hr />
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('netRemoveSparta')}
                        </Col>
                        <Col className="text-end output-card">
                          some numb
                          <Icon icon="usd" className="ms-1" size="15" />
                        </Col>
                      </Row>
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('netRemove*Token*')}
                        </Col>
                        <Col className="text-end output-card">
                          some numb
                          <Icon icon="usd" className="ms-1" size="15" />
                        </Col>
                      </Row>
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('netRedeem*Sparta*')}
                        </Col>
                        <Col className="text-end output-card">
                          some numb
                          <Icon icon="usd" className="ms-1" size="15" />
                        </Col>
                      </Row>
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('netRedeem*Token*')}
                        </Col>
                        <Col className="text-end output-card">
                          some numb
                          <Icon icon="usd" className="ms-1" size="15" />
                        </Col>
                      </Row>
                      <hr />
                      <Row className="my-1">
                        <Col xs="auto" className="text-card">
                          {t('gainLoss')}
                        </Col>
                        <Col className="text-end output-card">
                          some numb
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

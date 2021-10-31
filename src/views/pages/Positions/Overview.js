import React, { useState, useEffect } from 'react'
import { Card, Col, Row, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import { usePool } from '../../../store/pool'
import { getNetwork, tempChains } from '../../../utils/web3'
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

const Positions = () => {
  const { t } = useTranslation()
  const pool = usePool()
  const bond = useBond()
  const dao = useDao()
  const web3 = useWeb3()
  const wallet = useWeb3React()

  const [position, setPosition] = useState(false)
  const [network, setnetwork] = useState(getNetwork())
  const [trigger0, settrigger0] = useState(0)

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

  const isLoading = () => {
    if (!pool.poolDetails || !dao.daoDetails || !bond.bondDetails) {
      return true
    }
    return false
  }

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
    posArray[indexWal].overall.netAddUsd = overallData.netAddUsd
    posArray[indexWal].overall.netRemoveUsd = overallData.netRemoveUsd
    posArray[indexWal].overall.netHarvestSparta = overallData.netHarvestSparta
    posArray[indexWal].overall.netHarvestUsd = overallData.netHarvestUsd
    posArray[indexWal].overall.lastUpdated = overallData.lastUpdated
    window.localStorage.setItem('sp_positions', JSON.stringify(posArray))
    getFromLS()
  }

  const getOverall = () => {
    // DUMMY DATA, ADD IN API CALLS TO GET THIS DATA
    const overallData = {
      netAddUsd: '100000000000000000000',
      netRemoveUsd: '200000000000000000000',
      netHarvestSparta: '300000000000000000000',
      netHarvestUsd: '400000000000000000000',
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

  const getRedemptionValue = () => {
    const total = calcLiqValueAll(
      pool.poolDetails,
      dao.daoDetails,
      bond.bondDetails,
      web3.spartaPrice,
    )[1]
    if (total > 0) {
      return total
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

  const getNetAddUsd = () => {
    const value = position?.overall?.netAddUsd
    if (value > 0) {
      return value
    }
    return '0.00'
  }

  const getNetRemoveUsd = () => {
    const value = position?.overall?.netRemoveUsd
    if (value > 0) {
      return value
    }
    return '0.00'
  }

  const getNetHarvest = (inUsd) => {
    let value = position?.overall?.netHarvestSparta
    if (inUsd) {
      value = position?.overall?.netHarvestUsd
    }
    if (value > 0) {
      return value
    }
    return '0.00'
  }

  const getNetGain = () => {
    if (!isOverall) {
      return 'Generate First'
    }
    const add = BN(getNetAddUsd())
    const remove = BN(getNetRemoveUsd())
    const harvest = BN(getNetHarvest(true))
    const value = BN(getRedemptionValue())
    const gain = value.plus(harvest).plus(remove).minus(add)
    if (gain > 0) {
      return gain
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
                            {formatFromWei(getNetAddUsd(), 2)}
                            <Icon icon="usd" className="ms-1" size="15" />
                          </Col>
                        </Row>
                        <hr />
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('netRemoveUsd')}
                          </Col>
                          <Col className="text-end output-card">
                            {formatFromWei(getNetRemoveUsd(), 2)}
                            <Icon icon="usd" className="ms-1" size="15" />
                          </Col>
                        </Row>
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('netHarvest')}
                          </Col>
                          <Col className="text-end output-card">
                            {formatFromWei(getNetHarvest(true), 2)}
                            <Icon icon="usd" className="ms-1" size="15" />
                          </Col>
                        </Row>
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('redemptionValue')}
                          </Col>
                          <Col className="text-end output-card">
                            {formatFromWei(getRedemptionValue(), 2)}
                            <Icon icon="usd" className="ms-1" size="15" />
                          </Col>
                        </Row>
                        <hr />
                        <Row className="my-1">
                          <Col xs="auto" className="text-card">
                            {t('gainLoss')}
                          </Col>
                          <Col className="text-end output-card">
                            {formatFromWei(getNetGain(), 2)}
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
                    *Selected Pool* Position
                    <Card.Subtitle className="">
                      *Add switch to Hodl USD / Units*
                    </Card.Subtitle>
                  </Card.Header>
                  {!isLoading() ? (
                    <Card.Body>
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

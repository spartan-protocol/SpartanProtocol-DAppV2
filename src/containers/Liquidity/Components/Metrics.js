import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Row from 'react-bootstrap/Row'
import { Tooltip } from '../../../components/Tooltip/index'
import { Icon } from '../../../components/Icons/index'
import { calcAPY, calcDaoAPY } from '../../../utils/math/nonContract'
import { callPoolMetrics } from '../../../utils/extCalls'
import ChartTVL from './Charts/ChartTVL'
import { usePool } from '../../../store/pool'
import { useWeb3 } from '../../../store/web3'
import { useBond, bondVaultWeight } from '../../../store/bond'
import { BN, formatFromUnits } from '../../../utils/bigNumber'
import ChartRevenue from './Charts/ChartRevenue'
import ChartVolume from './Charts/ChartVolume'
import ChartSwapDemand from './Charts/ChartSwapDemand'
import ChartTxnCount from './Charts/ChartTxnCount'
import { getUnixStartOfDay } from '../../../utils/helpers'
import ChartLPs from './Charts/ChartLPs'
import { useDao, daoVaultWeight } from '../../../store/dao'

const Metrics = ({ assetSwap }) => {
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const pool = usePool()
  const bond = useBond()
  const dao = useDao()
  const { t } = useTranslation()
  const { curated } = assetSwap

  const metricTypes = [
    'Swap Volume',
    'TVL (Depth)',
    'Revenue',
    'Swap Demand',
    'Txn Count',
    'LP Units',
  ]

  const periodTypes = [7, 14, 30, 60, 365]

  const [metric, setMetric] = useState(metricTypes[0])
  const [period, setPeriod] = useState(periodTypes[2])
  const [poolMetrics, setPoolMetrics] = useState([])
  const [prevAsset, setPrevAsset] = useState('')
  const [stale, setStale] = useState(false)
  const [daoApy, setDaoApy] = useState('0')

  /** Get the current block from a main RPC */
  const getBlockTimer = useRef(null)

  useEffect(() => {
    dispatch(daoVaultWeight())
    dispatch(bondVaultWeight())
  }, [dispatch, pool.poolDetails])

  useEffect(() => {
    if (prevAsset !== assetSwap.address) {
      setPoolMetrics([])
      setPrevAsset(assetSwap.address)
    }
    const getMetrics = async () => {
      if (assetSwap.address) {
        const metrics = await callPoolMetrics(assetSwap.address)
        setPoolMetrics(metrics)
      }
    }
    getMetrics() // Run on load
    getBlockTimer.current = setInterval(async () => {
      if (assetSwap.address) {
        getMetrics() // Run on interval
      }
    }, 20000)
    return () => clearInterval(getBlockTimer.current)
  }, [getBlockTimer, assetSwap.address, prevAsset])

  useEffect(() => {
    const dayStart = getUnixStartOfDay()
    const weekStart = BN(dayStart).minus(86400 * 7)
    const lastBar = BN(poolMetrics[0]?.timestamp)
    setStale(!lastBar.isGreaterThan(weekStart))
  }, [poolMetrics])

  const asset =
    pool.poolDetails && pool.poolDetails.length
      ? pool.poolDetails.find(
          (lp) => lp.tokenAddress === assetSwap.tokenAddress,
        )
      : 0

  const tokenPrice = BN(assetSwap.baseAmount)
    .div(assetSwap.tokenAmount)
    .times(web3.spartaPrice)

  const getFees = () => {
    let accumulative = BN(0)
    if (poolMetrics) {
      const length = poolMetrics.length >= period ? period : poolMetrics.length
      const metrics = poolMetrics ? poolMetrics.slice(0, length).reverse() : []
      for (let i = 0; i < length; i++) {
        accumulative = accumulative.plus(metrics[i].fees)
      }
    }
    return accumulative
  }

  const getDivis = () => {
    let accumulative = BN(0)
    if (asset.curated && poolMetrics) {
      const length = poolMetrics.length >= period ? period : poolMetrics.length
      const metrics = poolMetrics ? poolMetrics.slice(0, length).reverse() : []
      for (let i = 0; i < length; i++) {
        accumulative = accumulative.plus(metrics[i].incentives)
      }
    }
    return accumulative
  }

  useEffect(() => {
    const getTotalDaoWeight = () => {
      const _amount = BN(bond.totalWeight).plus(dao.totalWeight)
      if (_amount > 0) {
        return _amount
      }
      return '0.00'
    }
    const getDaoApy = () => {
      let revenue = BN(web3.metrics.global[0].daoVault30Day)
      revenue = revenue.toString()
      const baseAmount = getTotalDaoWeight().toString()
      const apy = calcDaoAPY(revenue, baseAmount)
      return apy.toFixed(2).toString()
    }
    if (web3.metrics.global && bond.totalWeight && dao.totalWeight) {
      setDaoApy(getDaoApy())
    }
  }, [web3.metrics.global, bond.totalWeight, dao.totalWeight])

  const APY = asset ? calcAPY(assetSwap, getFees(), getDivis(), period) : 0

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  const isLoading = () => {
    if (!pool.poolDetails || !pool.tokenDetails || !assetSwap.tokenAddress) {
      return true
    }
    return false
  }

  return (
    <>
      {!isLoading() && (
        <Card className="card-480 mb-2">
          <Card.Header className="border-0">
            <Row className="mt-2">
              <Col xs="auto" className="mt-1 pe-2 position-relative">
                <img
                  src={getToken(assetSwap.tokenAddress).symbolUrl}
                  alt="Token logo"
                  height="40"
                  className="rounded-circle"
                />
                {/* <Icon icon="spartav2" size="25" className="token-badge-pair" /> */}
              </Col>
              <Col xs="auto">
                <h6 className="mb-1">
                  {getToken(assetSwap.tokenAddress).symbol}
                  <span className="output-card ms-2">
                    ${formatFromUnits(tokenPrice, 4)}
                  </span>
                </h6>
                <h6 className="mb-0">
                  SPARTA
                  <span className="output-card ms-2">
                    ${formatFromUnits(web3.spartaPrice, 4)}
                  </span>
                </h6>
              </Col>
              <Col className="text-end">
                <span className="mb-1 text-sm-label">
                  APY
                  <OverlayTrigger placement="auto" overlay={Tooltip(t, 'apy')}>
                    <span role="button">
                      <Icon icon="info" className="ms-1 mb-1" size="17" />
                    </span>
                  </OverlayTrigger>
                </span>
                <h6 className="mb-0">
                  {formatFromUnits(curated ? BN(daoApy).plus(APY) : APY, 2)}%
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
                                  curated ? BN(APY).plus(daoApy) : APY,
                                  2,
                                )}
                                %
                              </strong>
                            </Col>
                            <Col xs="12">
                              <hr className="my-2" />
                            </Col>
                            <Col xs="12" className="text-center">
                              All APYs are estimates
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
                </h6>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <div className="text-center">
              <Dropdown className="d-inline">
                <Dropdown.Toggle size="sm" className="mx-1">
                  {metric}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {metricTypes.map((type) => (
                    <Dropdown.Item key={type} onClick={() => setMetric(type)}>
                      {type}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown className="d-inline">
                <Dropdown.Toggle size="sm" className="mx-1">
                  {`${period} Days`}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {periodTypes.map((type) => (
                    <Dropdown.Item key={type} onClick={() => setPeriod(type)}>
                      {`${type} Days`}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {metric === metricTypes[0] && (
              <ChartVolume metrics={poolMetrics} period={period} />
            )}
            {metric === metricTypes[1] && (
              <ChartTVL
                metrics={poolMetrics}
                poolItem={assetSwap}
                period={period}
              />
            )}
            {metric === metricTypes[2] && (
              <ChartRevenue metrics={poolMetrics} period={period} />
            )}
            {metric === metricTypes[3] && (
              <ChartSwapDemand metrics={poolMetrics} period={period} />
            )}
            {metric === metricTypes[4] && (
              <ChartTxnCount metrics={poolMetrics} period={period} />
            )}
            {metric === metricTypes[5] && (
              <ChartLPs
                metrics={poolMetrics}
                poolItem={assetSwap}
                period={period}
              />
            )}
            <div className="text-center">
              {stale && poolMetrics[0] && 'No swap activity for 7+ days'}
            </div>
          </Card.Body>
        </Card>
      )}
    </>
  )
}

export default Metrics

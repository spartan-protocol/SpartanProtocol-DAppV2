import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Row, Col, OverlayTrigger, Dropdown } from 'react-bootstrap'
import { Tooltip } from '../../../../components/Tooltip/tooltip'
import { Icon } from '../../../../components/Icons/icons'
import { calcAPY } from '../../../../utils/math/nonContract'
import { callPoolMetrics } from '../../../../utils/extCalls'
import ChartTVL from './Charts/ChartTVL'
import { usePool } from '../../../../store/pool'
import { useWeb3 } from '../../../../store/web3'
import { BN, formatFromUnits } from '../../../../utils/bigNumber'
import ChartRevenue from './Charts/ChartRevenue'
import ChartVolume from './Charts/ChartVolume'
import ChartSwapDemand from './Charts/ChartSwapDemand'
import ChartTxnCount from './Charts/ChartTxnCount'

const Metrics = ({ assetSwap }) => {
  const isLightMode = window.localStorage.getItem('theme')
  const web3 = useWeb3()
  const pool = usePool()
  const { t } = useTranslation()

  const metricTypes = [
    'Swap Volume',
    'TVL (Depth)',
    'Revenue',
    'Swap Demand',
    'Txn Count',
  ]

  const periodTypes = [7, 14, 30, 60, 365]

  const [metric, setMetric] = useState(metricTypes[0])
  const [period, setPeriod] = useState(periodTypes[2])
  const [poolMetrics, setPoolMetrics] = useState([])

  /** Get the current block from a main RPC */
  const getBlockTimer = useRef(null)
  useEffect(() => {
    const getMetrics = async () => {
      if (assetSwap.address) {
        const metrics = await callPoolMetrics(assetSwap.address)
        setPoolMetrics(metrics)
      }
    }
    getMetrics() // Run on load
    getBlockTimer.current = setInterval(async () => {
      if (assetSwap.address) {
        getMetrics()
      }
    }, 20000)
    return () => clearInterval(getBlockTimer.current)
  }, [getBlockTimer, assetSwap.address])

  const asset =
    pool.poolDetails && pool.poolDetails.length
      ? pool.poolDetails.find(
          (lp) => lp.tokenAddress === assetSwap.tokenAddress,
        )
      : 0
  const tokenPrice = BN(assetSwap.baseAmount)
    .div(assetSwap.tokenAmount)
    .times(web3.spartaPrice)
  const recentFees = asset ? asset.fees : 0

  const getDivis = () =>
    asset.curated && pool.incentives
      ? pool.incentives.filter((x) => x.address === asset.address)[0].incentives
      : 0

  const APY =
    recentFees && asset ? formatFromUnits(calcAPY(assetSwap, getDivis()), 2) : 0

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
                      <Icon
                        icon="info"
                        className="ms-1 mb-1"
                        size="17"
                        fill={isLightMode ? 'black' : 'white'}
                      />
                    </span>
                  </OverlayTrigger>
                </span>
                <h6 className="mb-0">{APY}%</h6>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body className="">
            <div className="text-center">
              <Dropdown className="d-inline">
                <Dropdown.Toggle variant="info" size="sm" className="mx-1">
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
                <Dropdown.Toggle variant="info" size="sm" className="mx-1">
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
          </Card.Body>
        </Card>
      )}
    </>
  )
}

export default Metrics

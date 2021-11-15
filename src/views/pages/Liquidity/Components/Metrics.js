import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Row, Col, OverlayTrigger } from 'react-bootstrap'
import { Tooltip } from '../../../../components/Tooltip/tooltip'
import { Icon } from '../../../../components/Icons/icons'
import { calcAPY } from '../../../../utils/math/nonContract'
import { callPoolMetrics } from '../../../../utils/extCalls'
import ChartTVL from './Charts/ChartTVL'
import { usePool } from '../../../../store/pool'
import { useWeb3 } from '../../../../store/web3'
import { BN, formatFromUnits } from '../../../../utils/bigNumber'
import ChartRevenue from './Charts/ChartRevenue'

const Metrics = ({ assetSwap }) => {
  const isLightMode = window.localStorage.getItem('theme')
  const web3 = useWeb3()
  const pool = usePool()
  const { t } = useTranslation()

  const [poolMetrics, setPoolMetrics] = useState(false)

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
    asset.curated
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
        <Card className="card-480 card-underlay mb-2">
          <Card.Header className="border-0">
            <Row className="mt-2">
              <Col xs="auto" className="mt-1 pe-2 position-relative">
                <img
                  src={getToken(assetSwap.tokenAddress).symbolUrl}
                  alt="Token logo"
                  height="50"
                  className="rounded-circle"
                />
                {/* <Icon icon="spartav2" size="25" className="token-badge-pair" /> */}
              </Col>
              <Col xs="auto">
                <h5 className="mb-1">
                  {getToken(assetSwap.tokenAddress).symbol}
                  <span className="output-card ms-2">
                    ${formatFromUnits(tokenPrice, 4)}
                  </span>
                </h5>
                <h5 className="mb-0">
                  SPARTA
                  <span className="output-card ms-2">
                    ${formatFromUnits(web3.spartaPrice, 4)}
                  </span>
                </h5>
              </Col>
              <Col xs="auto" className="text-card">
                APY{' '}
                <OverlayTrigger placement="auto" overlay={Tooltip(t, 'apy')}>
                  <span role="button">
                    <Icon
                      icon="info"
                      className="ms-1"
                      size="17"
                      fill={isLightMode ? 'black' : 'white'}
                    />
                  </span>
                </OverlayTrigger>
                {APY}%
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <ChartRevenue metrics={poolMetrics} />
          </Card.Body>
        </Card>
      )}
      <Card className="card-480 p-2">
        <ChartTVL metrics={poolMetrics} />
      </Card>
    </>
  )
}

export default Metrics

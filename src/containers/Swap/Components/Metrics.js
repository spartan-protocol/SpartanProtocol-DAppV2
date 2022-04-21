import React, { useEffect, useRef, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import { callPoolMetrics } from '../../../utils/extCalls'
import { usePool } from '../../../store/pool'
import { useWeb3 } from '../../../store/web3'
import { BN, formatFromUnits } from '../../../utils/bigNumber'
import ChartPrice from './Charts/ChartPrice'
import { getUnixStartOfDay } from '../../../utils/helpers'

const Metrics = ({ assetSwap }) => {
  const web3 = useWeb3()
  const pool = usePool()

  const [poolMetrics, setPoolMetrics] = useState([])
  const [prevAsset, setPrevAsset] = useState('')
  const [stale, setStale] = useState(false)

  /** Get the current block from a main RPC */
  const getBlockTimer = useRef(null)

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
        getMetrics()
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

  const tokenPrice = BN(assetSwap.baseAmount)
    .div(assetSwap.tokenAmount)
    .times(web3.spartaPrice)

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
            </Row>
          </Card.Header>
          <Card.Body className="pt-1">
            <ChartPrice metrics={poolMetrics} tokenPrice={tokenPrice} />
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

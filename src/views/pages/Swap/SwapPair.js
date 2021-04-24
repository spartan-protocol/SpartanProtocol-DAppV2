import React from 'react'
import { Card, Col, Row } from 'reactstrap'
import UncontrolledTooltip from 'reactstrap/lib/UncontrolledTooltip'
import coinSparta from '../../../assets/icons/coin_sparta.svg'
import { formatFromWei, formatFromUnits, BN } from '../../../utils/bigNumber'
import { calcAPY } from '../../../utils/web3Utils'

const SwapPair = ({ assetSwap, finalLpArray, web3 }) => {
  const asset =
    finalLpArray && finalLpArray.length
      ? finalLpArray.find((lp) => lp.symbol === assetSwap.symbol)
      : 0
  const tokenPrice = BN(assetSwap?.baseAmount)
    .div(assetSwap?.tokenAmount)
    .times(web3?.spartaPrice)
  const spotPrice = BN(assetSwap?.baseAmount).div(assetSwap?.tokenAmount)
  const recentDivis = asset ? asset.recentDivis : 0
  const lastMonthDivis = asset ? asset.lastMonthDivis : 0
  const recentFees = asset ? asset.recentFees : 0
  const lastMonthFees = asset ? asset.lastMonthFees : 0
  const APY =
    recentFees && recentDivis
      ? formatFromUnits(
          calcAPY(
            recentDivis,
            lastMonthDivis,
            recentFees,
            lastMonthFees,
            assetSwap.genesis,
            assetSwap.baseAmount,
          ),
        )
      : 0

  return (
    <>
      <Card className="card-body">
        <Row className="my-2">
          <Col xs="auto">
            <div className="output-card">
              <img
                className="mr-2"
                src={assetSwap.symbolUrl}
                alt="Logo"
                height="32"
              />
              {assetSwap?.symbol}
            </div>
          </Col>
          <Col className="output-card text-right">
            ${formatFromUnits(tokenPrice, 6)}
          </Col>
        </Row>

        <Row className="my-2">
          <Col xs="auto">
            <div className="output-card">
              <img className="mr-2" src={coinSparta} alt="Logo" height="32" />
              SPARTA
            </div>
          </Col>
          <Col className="output-card text-right">${web3?.spartaPrice}</Col>
        </Row>

        <Row className="my-2">
          <Col xs="auto" className="text-card">
            Spot Price
          </Col>
          <Col className="output-card text-right">
            {formatFromUnits(spotPrice, 4)} SPARTA
          </Col>
        </Row>

        <Row className="my-2">
          <Col xs="auto" className="text-card">
            Recent Fees
          </Col>
          <Col className="output-card text-right">
            {formatFromWei(recentFees, 0)} SPARTA
          </Col>
        </Row>

        <Row className="my-2">
          <Col xs="auto" className="text-card">
            Recent Divis
          </Col>
          <Col className="output-card text-right">
            {assetSwap.curated === true
              ? `${formatFromWei(recentDivis, 0)} SPARTA`
              : 'Not Curated'}
          </Col>
        </Row>
        <Row className="my-2">
          <Col xs="auto" className="text-card">
            Depth
          </Col>
          <Col className="output-card text-right">
            {formatFromWei(assetSwap.tokenAmount, 4)} {assetSwap.symbol} <br />
            {formatFromWei(assetSwap.baseAmount, 4)} SPARTA
          </Col>
        </Row>
        <Row className="my-2">
          <Col xs="auto" className="text-card">
            APY{' '}
            <i
              className="icon-small icon-info icon-dark ml-2"
              id="tooltipInput"
              role="button"
            />
            <UncontrolledTooltip placement="right" target="tooltipInput">
              dividend per year
            </UncontrolledTooltip>
          </Col>
          <Col className="output-card text-right">{APY}%</Col>
        </Row>
      </Card>
    </>
  )
}

export default SwapPair

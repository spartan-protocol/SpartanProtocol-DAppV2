import React from 'react'
import { Card, Col, Row, Table } from 'reactstrap'
import UncontrolledTooltip from 'reactstrap/lib/UncontrolledTooltip'
import coinSparta from '../../../assets/icons/coin_sparta.svg'
import { formatFromWei, formatFromUnits } from '../../../utils/bigNumber'
import { calcAPY } from '../../../utils/web3Utils'

const SwapPair = ({ assetSwap, finalLpArray, web3 }) => {
  const asset =
    finalLpArray && finalLpArray.length
      ? finalLpArray.find((lp) => lp.symbol === assetSwap.symbol)
      : 0
  const tokenPrice =
    (assetSwap?.baseAmount / assetSwap?.tokenAmount) * web3?.spartaPrice
  const spotPrice = assetSwap?.baseAmount / assetSwap?.tokenAmount
  const recentFees = asset ? formatFromWei(asset.recentFees, 0) : 0
  const recentDivis = asset ? formatFromWei(asset.recentDivis, 0) : 0
  const APY =
    recentFees && recentDivis
      ? formatFromUnits(calcAPY(recentDivis, recentFees, assetSwap.baseAmount))
      : 0

  return (
    <>
      <Card className="card-body">
        <Row>
          <Table borderless className="ml-2 mr-5">
            <tbody>
              <tr>
                <td>
                  <div className="output-card">
                    <img
                      className="mr-2"
                      src={assetSwap.symbolUrl}
                      alt="Logo"
                      height="32"
                    />
                    {assetSwap?.symbol}
                  </div>
                </td>
                <th className="output-card text-right">
                  ${parseFloat(tokenPrice).toFixed(4)}
                </th>
              </tr>
              <tr>
                <td>
                  <div className="output-card">
                    <img
                      className="mr-2"
                      src={coinSparta}
                      alt="Logo"
                      height="32"
                    />
                    SPARTA
                  </div>
                </td>
                <th className="output-card text-right">${web3?.spartaPrice}</th>
              </tr>
            </tbody>
          </Table>
        </Row>
        <Row className="mr-4">
          <Col xl={6} className="text-card">
            Spot price
          </Col>
          <Col xl={6} className="output-card text-right">
            {parseFloat(spotPrice).toFixed(4)} SPARTA
          </Col>
        </Row>
        <Row className="mr-4">
          <Col xl={6} className="text-card">
            Volume
          </Col>
          <Col xl={6} className="output-card text-right">
            $
          </Col>
        </Row>
        <Row className="mr-4">
          <Col xl={6} className="text-card">
            Recent Fees
          </Col>
          <Col xl={6} className="output-card text-right">
            {recentFees} SPARTA
          </Col>
        </Row>
        <Row className="mr-4">
          <Col xl={6} className="text-card">
            Recent Divis
          </Col>
          <Col xl={6} className="output-card text-right">
            {recentDivis} SPARTA
          </Col>
        </Row>
        <Row className="mr-4">
          <Col xl={6} className="text-card">
            Deph
          </Col>
          <Col xl={6} className="output-card text-right">
            {formatFromWei(assetSwap.tokenAmount, 0)} {assetSwap.symbol} <br />
            {formatFromWei(assetSwap.baseAmount, 0)} SPARTA
          </Col>
        </Row>
        <Row className="mr-4">
          <Col xl={6} className="text-card">
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
          <Col xl={6} className="output-card text-right">
            {APY}%
          </Col>
        </Row>
      </Card>
    </>
  )
}

export default SwapPair

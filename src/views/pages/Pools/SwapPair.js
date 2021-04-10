/* eslint-disable*/

import React, { useState, useEffect } from "react"
import Breadcrumb from "react-bootstrap/Breadcrumb"
import { Button, Card, Col, Row, Input, FormGroup, Table } from "reactstrap"
import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip"
import { useDispatch } from "react-redux"
import { useWallet } from "@binance-chain/bsc-use-wallet"
import { useLocation } from "react-router-dom"
import Wallet from "../../../components/Wallet/Wallet"
import AssetSelect from "../../../components/AssetSelect/AssetSelect"
import { getAddresses, getItemFromArray } from "../../../utils/web3"
import { usePoolFactory } from "../../../store/poolFactory"
import { BN, convertToWei, formatFromWei } from "../../../utils/bigNumber"
import RecentTxns from "../../../components/RecentTxns/RecentTxns"
import {
  calcDoubleSwapOutput,
  calcDoubleSwapInput,
  calcSwapOutput,
  getSwapInput,
  calcSwapFee,
  calcDoubleSwapFee,
  calcValueInBase,
  calcLiquidityHoldings,
  calcLiquidityUnits
} from "../../../utils/web3Utils"
import {
  routerSwapAssets,
  routerZapLiquidity
} from "../../../store/router/actions"
import Approval from "../../../components/Approval/Approval"
import { useWeb3 } from "../../../store/web3"
import HelmetLoading from "../../../components/Loaders/HelmetLoading"
import { getPoolContract } from "../../../utils/web3Pool"
import ShareIcon from "../../../assets/icons/new.svg"
import coinBnb from "../../../assets/icons/coin_bnb.svg"
import coinSparta from "../../../assets/icons/coin_sparta.svg"

const SwapPair = () => {


  return (
    <>
      <Card className="card-body">
        <Row>
          <Table borderless className="ml-2 mr-5">
            <tbody>
            <tr>
              <td>
                <div className="output-card">
                  <img className="mr-2" src={coinBnb} alt="Logo" height="32" />
                  BNB
                </div>
              </td>
              <th className="output-card text-right">$260.55</th>
            </tr>
            <tr>
              <td>
                <div className="output-card">
                  <img className="mr-2" src={coinSparta} alt="Logo" height="32" />
                  SPARTA
                </div>
              </td>
              <th className="output-card text-right">$1.30</th>
            </tr>
            </tbody>
          </Table>

        </Row>
        <Row>
          <Col> <Button
            color="default"
            size="lg"
            block
          >
            View pair info
          </Button></Col>
        </Row>
      </Card>

    </>
  )
}

export default SwapPair

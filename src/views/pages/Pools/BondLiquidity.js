/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'

import classnames from 'classnames'
import {
  Button,
  Card,
  CardBody,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  Nav,
  NavItem,
  NavLink,
  UncontrolledAlert,
  UncontrolledTooltip,
  Progress,
  Row,
} from 'reactstrap'
import { useDispatch } from 'react-redux'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import AssetSelect from '../../../components/AssetSelect/AssetSelect'
import { usePoolFactory } from '../../../store/poolFactory'
import { getAddresses, getItemFromArray } from '../../../utils/web3'
import {
  BN,
  convertFromWei,
  convertToWei,
  formatFromWei,
} from '../../../utils/bigNumber'
import SwapPair from '../Swap/SwapPair'
import { useWeb3 } from '../../../store/web3'
import {
  routerRemoveLiq,
  routerRemoveLiqAsym,
} from '../../../store/router/actions'
import RecentTxns from '../../../components/RecentTxns/RecentTxns'
import { getPoolContract } from '../../../utils/web3Pool'
import { useBond } from '../../../store/bond/selector'
import { calcLiquidityUnits, calcSwapOutput } from '../../../utils/web3Utils'
import Approval from '../../../components/Approval/Approval'
import { bondDeposit } from '../../../store/bond/actions'

const BondLiquidity = () => {
  const wallet = useWallet()
  const bond = useBond()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const poolFactory = usePoolFactory()
  const addr = getAddresses()
  const [assetBond1, setAssetBond1] = useState('...')
  const [spartaMinted, setSpartaMinted] = useState('0')
  const [lpOutput, setLpOutput] = useState('0')

  useEffect(() => {
    const { finalArray } = poolFactory
    const getAssetDetails = () => {
      if (finalArray) {
        window.localStorage.setItem('assetType1', 'token')

        let asset1 = JSON.parse(window.localStorage.getItem('assetSelected1'))

        asset1 =
          asset1 && asset1.tokenAddress !== addr.sparta
            ? asset1
            : { tokenAddress: addr.bnb }

        asset1 = getItemFromArray(asset1, poolFactory.finalArray)

        setAssetBond1(asset1)

        window.localStorage.setItem('assetSelected1', JSON.stringify(asset1))
      }
    }

    getAssetDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    poolFactory.finalArray,
    poolFactory.finalLpArray,
    window.localStorage.getItem('assetSelected1'),
  ])

  const bondInput1 = document.getElementById('bondInput1')

  const clearInputs = () => {
    if (bondInput1) {
      bondInput1.value = '0'
    }
  }

  // Bond Functions
  const calcSpartaMinted = () => {
    if (bondInput1) {
      const minted = calcSwapOutput(
        convertToWei(bondInput1.value),
        assetBond1.tokenAmount,
        assetBond1.baseAmount,
        true,
      )
      setSpartaMinted(minted)
      return minted
    }
    return '0'
  }

  const calcOutput = () => {
    if (bondInput1) {
      const output = calcLiquidityUnits(
        calcSpartaMinted(),
        convertToWei(bondInput1.value),
        assetBond1.baseAmount,
        assetBond1.tokenAmount,
        assetBond1.poolUnits,
      )
      setLpOutput(output)
      return output
    }
    return '0'
  }

  useEffect(() => {
    if (
      document.activeElement.id === 'bondInput1' &&
      bondInput1?.value !== ''
    ) {
      calcOutput()
    } else if (bondInput1 && bondInput1?.value === '') {
      bondInput1.value = '0'
    }
  }, [bondInput1?.value, assetBond1])

  return (
    <>
      <Row>
        <Card className="card-body ">
          <Card style={{ backgroundColor: '#25212D' }} className="card-body ">
            <Row>
              <Col xs="4" className="">
                <div className="title-card">Bond Input</div>
              </Col>
              <Col xs="8" className="text-right">
                <div className="title-card">
                  Balance:{' '}
                  {`${formatFromWei(assetBond1.balanceTokens)} ${
                    assetBond1.symbol
                  }`}
                </div>
              </Col>
            </Row>
            <Row className="my-3 input-pane">
              <Col xs="6">
                <div className="output-card">
                  <AssetSelect priority="1" filter={['token']} />
                </div>
              </Col>
              <Col className="text-right" xs="6">
                <InputGroup className="h-100">
                  <Input
                    className="text-right h-100 ml-0"
                    type="text"
                    placeholder="0"
                    id="bondInput1"
                  />
                  <InputGroupAddon
                    addonType="append"
                    role="button"
                    tabIndex={-1}
                    onKeyPress={() => clearInputs()}
                    onClick={() => clearInputs()}
                  >
                    <i className="icon-search-bar icon-close icon-light my-auto" />
                  </InputGroupAddon>
                </InputGroup>
              </Col>
            </Row>
          </Card>
          <UncontrolledAlert
            className="alert-with-icon"
            color="danger"
            fade={false}
          >
            <span
              data-notify="icon"
              className="icon-small icon-info icon-dark mb-5"
            />
            <span data-notify="message">
              The equivalent purchasing power in SPARTA is minted with both
              assets added symmetrically to the BNB:SPARTA liquidity pool. LP
              tokens will be issued as usual and vested to you over a 12 month
              period.
            </span>
          </UncontrolledAlert>
          <br />
          <Row>
            <Col>
              <div className="text-card">
                SPARTA allocation
                <i
                  className="icon-small icon-info icon-dark ml-2"
                  id="tooltipAddBase"
                  role="button"
                />
                <UncontrolledTooltip placement="right" target="tooltipAddBase">
                  The quantity of & SPARTA you are adding to the pool.
                </UncontrolledTooltip>
              </div>
            </Col>
            <Col className="output-card text-right">
              {formatFromWei(bond.bondSpartaRemaining)} Remaining
            </Col>
          </Row>

          <br />
          <div className="progress-container progress-primary">
            <span className="progress-badge" />
            <Progress
              max="2500000"
              value={formatFromWei(bond.bondSpartaRemaining)}
            />
          </div>
          <Row className="mb-2">
            <Col xs="4" className="">
              <div className="title-card">Input</div>
            </Col>
            <Col xs="8" className="text-right">
              <div className="title-card">
                {bondInput1?.value} {assetBond1?.symbol}
              </div>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col xs="4" className="">
              <div className="title-card">Minted</div>
            </Col>
            <Col xs="8" className="text-right">
              <div className="title-card">
                {formatFromWei(spartaMinted)} SPARTA
              </div>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col xs="4" className="">
              <div className="title-card">Output</div>
            </Col>
            <Col xs="8" className="text-right">
              <div className="title-card">
                {formatFromWei(lpOutput)} {assetBond1?.symbol}-SPP
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs="6">
              <Approval
                tokenAddress={assetBond1?.tokenAddress}
                symbol={assetBond1?.symbol}
                walletAddress={wallet?.account}
                contractAddress={addr.bond}
                txnAmount={convertToWei(bondInput1?.value)}
              />
            </Col>
            <Col xs="6">
              <Button
                color="primary"
                size="lg"
                block
                onClick={() =>
                  dispatch(
                    bondDeposit(
                      assetBond1?.tokenAddress,
                      convertToWei(bondInput1?.value),
                    ),
                  )
                }
              >
                Bond BNB
              </Button>
            </Col>
          </Row>
        </Card>
        {/* <Col md={4}>
          <Card className="card-body ">
            <Card style={{ backgroundColor: '#25212D' }} className="card-body ">
              <Row>
                <Col>
                  <div className="title-card text-left">Bond Input</div>
                  <div className="output-card text-left">52.23</div>
                </Col>
                <Col>
                  <br />
                  <div className="output-card text-right">
                    SPARTA
                    <img className="ml-2" src="" alt="SPARTA" />
                  </div>
                </Col>
              </Row>
              <br />
            </Card>
            <UncontrolledAlert
              className="alert-with-icon"
              color="danger"
              fade={false}
            >
              <span
                data-notify="icon"
                className="icon-small icon-info icon-dark mb-5"
              />
              <span data-notify="message">
                Bond BNB to get SPARTA LP Tokens. Claim your vested LP
                tokens.Your BNB-SPARTA LP tokens remain in time-locked contract
              </span>
            </UncontrolledAlert>
            <br />

            <br />
            <Row>
              <Col>
                <div className="text-card text-left">
                  Remaining BNB-SPARTA LP
                </div>
                <div className="text-card text-left">Duration</div>
                <div className="text-card text-leftt">Redemption date</div>
                <div className="text-card text-leftt">Redemption date</div>
              </Col>
              <Col>
                <div className="output-card text-right">0.00B</div>
                <div className="output-card text-right">0 days</div>
                <div className="output-card text-right">-</div>
                <div className="output-card text-right">-</div>
              </Col>
            </Row>
            <br />
            <Button color="danger" size="lg" block>
              Claim LP Tokens
            </Button>
          </Card>
        </Col> */}
      </Row>
    </>
  )
}

export default BondLiquidity

/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'

import {
  Button,
  Card,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  // UncontrolledAlert,
  UncontrolledTooltip,
  Progress,
  Row,
} from 'reactstrap'
import { useDispatch } from 'react-redux'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import AssetSelect from '../../../components/AssetSelect/AssetSelect'
import { usePool } from '../../../store/pool'
import { getAddresses, getItemFromArray } from '../../../utils/web3'
import {
  BN,
  convertFromWei,
  convertToWei,
  formatFromUnits,
  formatFromWei,
} from '../../../utils/bigNumber'
import { useBond } from '../../../store/bond/selector'
import {
  calcLiquidityUnits,
  calcSwapOutput,
  calcValueInBase,
} from '../../../utils/web3Utils'
import Approval from '../../../components/Approval/Approval'
import {
  bondDeposit,
  getBondListed,
  getBondSpartaRemaining,
} from '../../../store/bond/actions'
import SwapPair from '../Swap/SwapPair'
import { useWeb3 } from '../../../store/web3'

const BondLiquidity = () => {
  const web3 = useWeb3()
  const wallet = useWallet()
  const bond = useBond()
  const dispatch = useDispatch()
  const pool = usePool()
  const addr = getAddresses()
  const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  const [assetBond1, setAssetBond1] = useState('...')

  const spartaRemainingLoop = async () => {
    dispatch(getBondSpartaRemaining())
    dispatch(getBondListed())
    await pause(10000)
    spartaRemainingLoop()
  }

  useEffect(() => {
    spartaRemainingLoop()
  }, [])

  useEffect(() => {
    const { poolDetails } = pool
    const getAssetDetails = () => {
      if (poolDetails) {
        window.localStorage.setItem('assetType1', 'token')

        let asset1 = JSON.parse(window.localStorage.getItem('assetSelected1'))

        asset1 =
          asset1 && asset1.tokenAddress !== addr.sparta
            ? asset1
            : { tokenAddress: addr.bnb }

        asset1 = getItemFromArray(asset1, pool.poolDetails)

        setAssetBond1(asset1)

        window.localStorage.setItem('assetSelected1', JSON.stringify(asset1))
      }
    }

    getAssetDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.poolDetails, window.localStorage.getItem('assetSelected1')])

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  const bondInput1 = document.getElementById('bondInput1')

  const clearInputs = () => {
    if (bondInput1) {
      bondInput1.value = ''
      bondInput1.focus()
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
      return output
    }
    return '0'
  }

  const getInput1ValueUSD = () => {
    if (assetBond1 && bondInput1?.value) {
      return calcValueInBase(
        assetBond1.tokenAmount,
        assetBond1.baseAmount,
        convertToWei(bondInput1.value),
      ).times(web3.spartaPrice)
    }
    return '0'
  }

  return (
    <>
      <Row className="justify-content-center">
        <Card className="card-body" style={{ maxWidth: '480px' }}>
          <Card style={{ backgroundColor: '#25212D' }} className="card-body">
            <Row>
              <Col xs="4" className="">
                <div className="">Input</div>
              </Col>
              <Col xs="8" className="text-right">
                <div
                  role="button"
                  onClick={() => {
                    bondInput1.value = convertFromWei(
                      getToken(assetBond1.tokenAddress)?.balance,
                    )
                  }}
                >
                  Balance:{' '}
                  {formatFromWei(getToken(assetBond1.tokenAddress)?.balance)}
                </div>
              </Col>
            </Row>
            <Row className="my-3">
              <Col xs="6">
                <div className="output-card ml-2">
                  <AssetSelect
                    priority="1"
                    filter={['token']}
                    whiteList={bond.bondListed}
                  />
                </div>
              </Col>
              <Col className="text-right" xs="6">
                <InputGroup className="">
                  <Input
                    className="text-right ml-0"
                    type="text"
                    placeholder="0.00"
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
                <div className="text-right">
                  ~$
                  {bondInput1?.value
                    ? formatFromWei(getInput1ValueUSD(), 2)
                    : '0.00'}
                </div>
              </Col>
            </Row>
          </Card>
          {/* <UncontrolledAlert
            className="alert-with-icon"
            color="danger"
            fade={false}
          >
            <span
              data-notify="icon"
              className="icon-small icon-info icon-dark mb-5"
            />
            <span
              id="notification-message"
              data-notify="message"
              className="p-0"
            >
              The equivalent purchasing power in SPARTA is minted with both
              assets added symmetrically to the BNB:SPARTA liquidity pool. LP
              tokens will be issued as usual and vested to you over a 12 month
              period.
            </span>
          </UncontrolledAlert> */}

          <Row className="card-body py-0">
            <Col>
              <div className="text-card">
                Allocation
                <i
                  className="icon-small icon-info icon-dark ml-2"
                  id="tooltipAddBase"
                  role="button"
                />
                <UncontrolledTooltip placement="right" target="tooltipAddBase">
                  The amount of SPARTA remaining in the Bond+Mint program. This
                  can be topped up by 2.5M SPARTA by proposals in the DAO when
                  it runs out.
                </UncontrolledTooltip>
              </div>
            </Col>
            <Col className="output-card text-right">
              {formatFromWei(bond.bondSpartaRemaining, 0)} Remaining
            </Col>
          </Row>

          <div className="card-body">
            <div className="progress-container progress-primary">
              <Progress
                max="2500000"
                value={convertFromWei(bond.bondSpartaRemaining)}
                className=""
              >
                {formatFromUnits(
                  BN(convertFromWei(bond.bondSpartaRemaining)).div(25000),
                  2,
                )}
                % Remaining
              </Progress>
            </div>
            <Row className="mb-2">
              <Col xs="auto">
                <div className="title-card">Input</div>
              </Col>
              <Col className="text-right">
                <div className="">
                  {bondInput1?.value > 0
                    ? formatFromUnits(bondInput1?.value, 6)
                    : '0.00'}{' '}
                  {getToken(assetBond1.tokenAddress)?.symbol}
                </div>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col xs="auto" className="">
                <div className="title-card">Minted</div>
              </Col>
              <Col className="text-right">
                <div className="">
                  {calcSpartaMinted() > 0
                    ? formatFromWei(calcSpartaMinted(), 6)
                    : '0.00'}{' '}
                  SPARTA
                </div>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col xs="auto" className="">
                <div className="title-card">Output</div>
              </Col>
              <Col className="text-right">
                <div className="">
                  {calcOutput() > 0 ? formatFromWei(calcOutput(), 6) : '0.00'}{' '}
                  {getToken(assetBond1.tokenAddress)?.symbol}-SPP
                </div>
              </Col>
            </Row>
          </div>

          <Row>
            <Approval
              tokenAddress={assetBond1?.tokenAddress}
              symbol={getToken(assetBond1.tokenAddress)?.symbol}
              walletAddress={wallet?.account}
              contractAddress={addr.bond}
              txnAmount={convertToWei(bondInput1?.value)}
              assetNumber="1"
            />
            <Col xs="12">
              <Button
                color="primary"
                size="lg"
                className="p-3"
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
                Bond {getToken(assetBond1.tokenAddress)?.symbol}
              </Button>
            </Col>
          </Row>
        </Card>
      </Row>
      {pool.poolDetails && (
        <Row>
          <Col xs="12" className="p-0">
            <SwapPair assetSwap={assetBond1} />
          </Col>
        </Row>
      )}
    </>
  )
}

export default BondLiquidity

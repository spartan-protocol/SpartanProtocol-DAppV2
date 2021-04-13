/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useState, useEffect } from 'react'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import { Button, Card, Col, Row, Input, FormGroup } from 'reactstrap'
import UncontrolledTooltip from 'reactstrap/lib/UncontrolledTooltip'
import { useDispatch } from 'react-redux'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useLocation } from 'react-router-dom'
import Wallet from '../../../components/Wallet/Wallet'
import AssetSelect from '../../../components/AssetSelect/AssetSelect'
import { getAddresses, getItemFromArray } from '../../../utils/web3'
import { usePoolFactory } from '../../../store/poolFactory'
import {
  BN,
  convertToWei,
  convertFromWei,
  formatFromWei,
  formatFromUnits,
} from '../../../utils/bigNumber'
import RecentTxns from '../../../components/RecentTxns/RecentTxns'
import {
  calcDoubleSwapOutput,
  calcDoubleSwapInput,
  calcSwapOutput,
  getSwapInput,
  calcSwapFee,
  calcDoubleSwapFee,
  calcValueInBase,
  calcLiquidityHoldings,
  calcLiquidityUnits,
} from '../../../utils/web3Utils'
import {
  routerSwapAssets,
  routerSwapBaseToSynth,
  routerSwapSynthToBase,
  routerZapLiquidity,
} from '../../../store/router/actions'
import Approval from '../../../components/Approval/Approval'
import { useWeb3 } from '../../../store/web3'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import { getPoolContract } from '../../../utils/web3Pool'
import NewIcon from '../../../assets/icons/new.svg'
import SwapPair from './SwapPair'

const Swap = () => {
  const web3 = useWeb3()
  const wallet = useWallet()
  const dispatch = useDispatch()
  const addr = getAddresses()
  const poolFactory = usePoolFactory()
  const location = useLocation()
  const [assetSwap1, setAssetSwap1] = useState('...')
  const [assetSwap2, setAssetSwap2] = useState('...')
  const [filter, setFilter] = useState(['token'])
  const [mode, setMode] = useState('token')
  const [assetParam1, setAssetParam1] = useState(
    new URLSearchParams(location.search).get(`asset1`),
  )
  const [assetParam2, setAssetParam2] = useState(
    new URLSearchParams(location.search).get(`asset2`),
  )

  useEffect(() => {
    const { finalLpArray } = poolFactory

    const getAssetDetails = () => {
      if (finalLpArray?.length > 0) {
        let asset1 = JSON.parse(window.localStorage.getItem('assetSelected1'))
        let asset2 = JSON.parse(window.localStorage.getItem('assetSelected2'))
        const type1 = window.localStorage.getItem('assetType1')
        const type2 = window.localStorage.getItem('assetType2')

        if (finalLpArray.find((asset) => asset.tokenAddress === assetParam1)) {
          ;[asset1] = finalLpArray.filter(
            (asset) => asset.tokenAddress === assetParam1,
          )
          setAssetParam1('')
        }
        if (finalLpArray.find((asset) => asset.tokenAddress === assetParam2)) {
          ;[asset2] = finalLpArray.filter(
            (asset) => asset.tokenAddress === assetParam2,
          )
          setAssetParam2('')
        }

        if (type1 === 'pool') {
          setFilter(['pool'])
          setMode('pool')
          window.localStorage.setItem('assetType1', 'pool')
          window.localStorage.setItem('assetType2', 'pool')
          if (asset2?.symbol === 'SPARTA') {
            asset2 =
              asset1?.tokenAddress !== finalLpArray[1].tokenAddress
                ? { tokenAddress: finalLpArray[1].tokenAddress }
                : { tokenAddress: finalLpArray[2].tokenAddress }
          }
        } else if (type1 === 'synth') {
          setFilter(['sparta'])
          setMode('synth')
          asset2 = { tokenAddress: addr.sparta }
          window.localStorage.setItem('assetType1', 'synth')
          window.localStorage.setItem('assetType2', 'token')
        } else if (asset1?.symbol !== 'SPARTA' && type1 === 'token') {
          setFilter(['token'])
          setMode('token')
          window.localStorage.setItem('assetType1', 'token')
          window.localStorage.setItem('assetType2', 'token')
        } else if (asset1?.symbol === 'SPARTA' && type2 === 'synth') {
          setFilter(['token', 'synth'])
          setMode('synth')
          window.localStorage.setItem('assetType1', 'token')
          window.localStorage.setItem('assetType2', 'synth')
        } else {
          setFilter(['token', 'synth'])
          setMode('token')
          window.localStorage.setItem('assetType1', 'token')
          if (type2 === 'pool') {
            window.localStorage.setItem('assetType2', 'token')
          }
        }

        if (asset2?.tokenAddress === asset1?.tokenAddress) {
          asset2 =
            asset1?.tokenAddress !== finalLpArray[1].tokenAddress
              ? { tokenAddress: finalLpArray[1].tokenAddress }
              : { tokenAddress: finalLpArray[2].tokenAddress }
        }

        if (!asset1) {
          asset1 = { tokenAddress: addr.sparta }
        }

        if (!asset2) {
          asset2 = { tokenAddress: addr.bnb }
        }

        asset1 = getItemFromArray(asset1, finalLpArray)
        asset2 = getItemFromArray(asset2, finalLpArray)

        setAssetSwap1(asset1)
        setAssetSwap2(asset2)

        window.localStorage.setItem('assetSelected1', JSON.stringify(asset1))
        window.localStorage.setItem('assetSelected2', JSON.stringify(asset2))
      }
    }

    getAssetDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mode,
    poolFactory.finalArray,
    poolFactory.finalLpArray,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetSelected1'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetSelected2'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetType1'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetType2'),
  ])

  const swapInput1 = document.getElementById('swapInput1')
  const swapInput2 = document.getElementById('swapInput2')

  const handleReverseAssets = async () => {
    const asset1 = JSON.parse(window.localStorage.getItem('assetSelected1'))
    const asset2 = JSON.parse(window.localStorage.getItem('assetSelected2'))
    const type1 = window.localStorage.getItem('assetType1')
    const type2 = window.localStorage.getItem('assetType2')
    window.localStorage.setItem('assetSelected1', JSON.stringify(asset2))
    window.localStorage.setItem('assetSelected2', JSON.stringify(asset1))
    window.localStorage.setItem('assetType1', type2)
    window.localStorage.setItem('assetType2', type1)
    swapInput1.value = ''
    swapInput2.value = ''
  }

  //= =================================================================================//
  // Functions SWAP calculations

  const getBalance = (asset) => {
    let item = ''
    let type = ''
    if (asset === 1) {
      item = assetSwap1
      type = window.localStorage.getItem('assetType1')
    } else {
      item = assetSwap2
      type = window.localStorage.getItem('assetType2')
    }
    if (type === 'token') {
      return item.balanceTokens
    }
    if (type === 'pool') {
      return item.balanceLPs
    }
    if (type === 'synth') {
      return item.balanceSynths
    }
    return item.balanceTokens
  }

  const getInput1USD = () => {
    if (assetSwap1?.symbol === 'SPARTA' && swapInput1?.value) {
      return BN(convertToWei(swapInput1?.value)).times(web3.spartaPrice)
    }
    if (assetSwap1?.symbol !== 'SPARTA' && swapInput1?.value) {
      return BN(
        calcValueInBase(
          assetSwap1?.tokenAmount,
          assetSwap1?.baseAmount,
          convertToWei(swapInput1?.value),
        ),
      ).times(web3.spartaPrice)
    }
    return '0'
  }

  const getInput2USD = () => {
    if (assetSwap2?.symbol === 'SPARTA' && swapInput2?.value) {
      return BN(convertToWei(swapInput2?.value)).times(web3.spartaPrice)
    }
    if (assetSwap2?.symbol !== 'SPARTA' && swapInput2?.value) {
      return BN(
        calcValueInBase(
          assetSwap2?.tokenAmount,
          assetSwap2?.baseAmount,
          convertToWei(swapInput2?.value),
        ),
      ).times(web3.spartaPrice)
    }
    return '0'
  }

  const getSwapOutput = () => {
    if (assetSwap1?.symbol === 'SPARTA') {
      return calcSwapOutput(
        convertToWei(swapInput1?.value),
        assetSwap2?.tokenAmount,
        assetSwap2?.baseAmount,
      )
    }
    if (assetSwap2?.symbol === 'SPARTA') {
      return calcSwapOutput(
        convertToWei(swapInput1?.value),
        assetSwap1?.tokenAmount,
        assetSwap1?.baseAmount,
        true,
      )
    }
    return calcDoubleSwapOutput(
      convertToWei(swapInput1?.value),
      assetSwap1?.tokenAmount,
      assetSwap1?.baseAmount,
      assetSwap2?.tokenAmount,
      assetSwap2?.baseAmount,
    )
  }

  const getSwapFee = () => {
    // Fee in SPARTA via fee in TOKEN (Swap from SPARTA)
    if (assetSwap1?.symbol === 'SPARTA') {
      return calcValueInBase(
        assetSwap2?.tokenAmount,
        assetSwap2?.baseAmount,
        calcSwapFee(
          convertToWei(swapInput1?.value),
          assetSwap2?.tokenAmount,
          assetSwap2?.baseAmount,
        ),
      )
    }
    // Fee in SPARTA (Swap to SPARTA)
    if (assetSwap2?.symbol === 'SPARTA') {
      return calcSwapFee(
        convertToWei(swapInput1?.value),
        assetSwap1?.tokenAmount,
        assetSwap1?.baseAmount,
        true,
      )
    }
    // Fee in SPARTA via fee in token2 (swap token1 to token2)
    return calcValueInBase(
      assetSwap2?.tokenAmount,
      assetSwap2?.baseAmount,
      calcDoubleSwapFee(
        convertToWei(swapInput1?.value),
        assetSwap1?.tokenAmount,
        assetSwap1?.baseAmount,
        assetSwap2?.tokenAmount,
        assetSwap2?.baseAmount,
      ),
    )
  }

  //= =================================================================================//
  // Functions for SWAP input handling

  const handleInputChange = (input, focusInput1) => {
    if (assetSwap1?.symbol === 'SPARTA') {
      if (focusInput1 === true) {
        swapInput2.value = formatFromWei(
          calcSwapOutput(
            convertToWei(input),
            assetSwap2.tokenAmount,
            assetSwap2.baseAmount,
            false,
          ),
        )
      } else {
        swapInput1.value = formatFromWei(
          getSwapInput(
            convertToWei(input),
            assetSwap2.tokenAmount,
            assetSwap2.baseAmount,
            false,
          ),
        )
      }
    } else if (assetSwap2?.symbol === 'SPARTA') {
      if (focusInput1 === true) {
        swapInput2.value = formatFromWei(
          calcSwapOutput(
            convertToWei(input),
            assetSwap1.tokenAmount,
            assetSwap1.baseAmount,
            true,
          ),
        )
      } else {
        swapInput1.value = formatFromWei(
          getSwapInput(
            convertToWei(input),
            assetSwap1.tokenAmount,
            assetSwap1.baseAmount,
            true,
          ),
        )
      }
    } else if (focusInput1 === true) {
      swapInput2.value = formatFromWei(
        calcDoubleSwapOutput(
          convertToWei(input),
          assetSwap1.tokenAmount,
          assetSwap1.baseAmount,
          assetSwap2.tokenAmount,
          assetSwap2.baseAmount,
        ),
      )
    } else {
      swapInput1.value = formatFromWei(
        calcDoubleSwapInput(
          convertToWei(input),
          assetSwap2.tokenAmount,
          assetSwap2.baseAmount,
          assetSwap1.tokenAmount,
          assetSwap1.baseAmount,
        ),
      )
    }
  }

  //= =================================================================================//
  // Functions ZAP calculations

  const getZapRemoveBase = () => {
    if (assetSwap1 && swapInput1?.value) {
      return calcLiquidityHoldings(
        assetSwap1.baseAmount,
        convertToWei(swapInput1.value),
        assetSwap1.poolUnits,
      )
    }
    return '0'
  }

  const getZapRemoveToken = () => {
    if (assetSwap1 && swapInput1?.value) {
      return calcLiquidityHoldings(
        assetSwap1.tokenAmount,
        convertToWei(swapInput1.value),
        assetSwap1.poolUnits,
      )
    }
    return '0'
  }

  const getZapOtherRemoveBase = () => {
    if (assetSwap2 && swapInput2?.value) {
      return calcLiquidityHoldings(
        assetSwap2.baseAmount,
        convertToWei(swapInput2.value),
        assetSwap2.poolUnits,
      )
    }
    return '0'
  }

  const getZapOtherRemoveToken = () => {
    if (assetSwap2 && swapInput2?.value) {
      return calcLiquidityHoldings(
        assetSwap2.tokenAmount,
        convertToWei(swapInput2.value),
        assetSwap2.poolUnits,
      )
    }
    return '0'
  }

  const getZapSwap1 = () => {
    if (assetSwap1 && swapInput1?.value) {
      return calcSwapOutput(
        getZapRemoveToken(),
        assetSwap1.tokenAmount,
        assetSwap1.baseAmount,
        true,
      )
    }
    return '0'
  }

  const getZapSwap2 = () => {
    if (assetSwap1 && swapInput1?.value) {
      return calcSwapOutput(
        getZapSwap1(),
        assetSwap2.tokenAmount,
        assetSwap2.baseAmount,
        false,
      )
    }
    return '0'
  }

  const getZapDoubleSwapFee = () => {
    if (assetSwap1 && swapInput1?.value) {
      return calcDoubleSwapFee(
        getZapRemoveToken(),
        assetSwap1.tokenAmount,
        assetSwap1.baseAmount,
        assetSwap2.tokenAmount,
        assetSwap2.baseAmount,
      )
    }
    return '0'
  }

  const getZapOutput = () => {
    if (assetSwap1 && swapInput1?.value) {
      return calcLiquidityUnits(
        getZapRemoveBase(),
        getZapSwap2(),
        assetSwap2.baseAmount,
        assetSwap2.tokenAmount,
        assetSwap2.poolUnits,
      )
    }
    return '0'
  }

  // UPDATE THIS WITH ASSET VALUES CALCS
  const getInputZap1USD = () => {
    if (assetSwap1 && swapInput1?.value) {
      return BN(
        calcValueInBase(
          assetSwap1?.tokenAmount,
          assetSwap1?.baseAmount,
          getZapRemoveToken(),
        ),
      )
        .plus(getZapRemoveBase())
        .times(web3.spartaPrice)
    }
    return '0'
  }

  // UPDATE THIS WITH ASSET VALUES CALCS
  const getInputZap2USD = () => {
    if (assetSwap2 && swapInput2?.value) {
      return BN(
        calcValueInBase(
          assetSwap2?.tokenAmount,
          assetSwap2?.baseAmount,
          getZapOtherRemoveToken(),
        ),
      )
        .plus(getZapOtherRemoveBase())
        .times(web3.spartaPrice)
    }
    return '0'
  }

  //= =================================================================================//
  // Functions for ZAP input handling

  const handleZapInputChange = (input, focusInput1) => {
    if (mode === 'token') {
      handleInputChange(input, focusInput1)
    } else if (mode === 'pool') {
      if (focusInput1 === true) {
        swapInput2.value = formatFromWei(getZapOutput(), 18)
      } else {
        swapInput1.value = formatFromWei()
      }
    }
  }

  return (
    <>
      <div className="content">
        <br />
        <Breadcrumb>
          <Col md={10}>Swap {mode !== 'token' && mode} tokens </Col>
          <Col md={2}>
            {' '}
            <Wallet />
          </Col>
        </Breadcrumb>

        {poolFactory.finalArray?.length > 0 && (
          <Row>
            <Col xl={8}>
              <Card className="card-body">
                <Row>
                  <Col className="card-body">
                    <img
                      src={NewIcon}
                      alt="new badge"
                      style={{
                        height: '19px',
                        verticalAlign: 'bottom',
                        marginRight: '5px',
                      }}
                    />{' '}
                    You can now swap your BEP20 tokens, LP tokens & Synths
                  </Col>
                </Row>
                {/* Top 'Input' Row */}
                <Row>
                  {/* 'From' input box */}
                  <Col md={5}>
                    <Card
                      style={{ backgroundColor: '#25212D' }}
                      className="card-body"
                    >
                      <Row>
                        <Col xs="6">
                          <div className="title-card">From</div>
                        </Col>
                        <Col className="text-right" xs="6">
                          <div
                            className="output-card mb-2"
                            role="button"
                            onClick={() => {
                              swapInput1.value = convertFromWei(getBalance(1))
                              handleZapInputChange(
                                convertFromWei(getBalance(1)),
                                true,
                              )
                            }}
                          >
                            Balance {formatFromWei(getBalance(1), 4)}
                          </div>
                        </Col>
                      </Row>
                      <Row className="my-3">
                        <Col xs="6">
                          <div className="output-card">
                            <AssetSelect
                              priority="1"
                              filter={['token', 'pool', 'synth']}
                            />
                          </div>
                        </Col>
                        <Col className="text-right" xs="6">
                          <FormGroup className="h-100">
                            <Input
                              className="text-right h-100"
                              type="text"
                              placeholder="0"
                              id="swapInput1"
                              onInput={(event) =>
                                handleZapInputChange(event.target.value, true)
                              }
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="6">
                          <div className="output-card">
                            1 {assetSwap1?.symbol} ={' '}
                            {formatFromUnits(
                              BN(swapInput2?.value).div(BN(swapInput1?.value)),
                              6,
                            )}{' '}
                            {assetSwap2?.symbol}
                          </div>
                        </Col>
                        <Col className="text-right" xs="6">
                          <div className="output-card">
                            ~$
                            {mode === 'token' && formatFromWei(getInput1USD())}
                            {mode === 'pool' &&
                              formatFromWei(getInputZap1USD())}
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  {/* 'Reverse' selected assets */}
                  <Col md={2}>
                    <div className="card-body mt-4 text-center">
                      <Button
                        className="btn-rounded btn-icon"
                        color="primary"
                        onClick={() => handleReverseAssets()}
                      >
                        <i className="icon-small icon-swap icon-light mt-1" />
                      </Button>
                    </div>
                  </Col>
                  {/* 'To' input box */}
                  <Col md={5}>
                    <Card
                      style={{ backgroundColor: '#25212D' }}
                      className="card-body "
                    >
                      <Row>
                        <Col xs="6">
                          <div className="title-card">To</div>
                        </Col>
                        <Col className="text-right" xs="6">
                          <div
                            className="output-card mb-2"
                            role="button"
                            onClick={() => {
                              swapInput2.value = convertFromWei(getBalance(2))
                              handleZapInputChange(
                                convertFromWei(getBalance(2)),
                                false,
                              )
                            }}
                          >
                            Balance {formatFromWei(getBalance(2), 4)}
                          </div>
                        </Col>
                      </Row>
                      <Row className="my-3">
                        <Col xs="6">
                          <div className="output-card">
                            <AssetSelect
                              priority="2"
                              filter={filter}
                              blackList={[assetSwap1?.tokenAddress]}
                            />
                          </div>
                        </Col>
                        <Col className="text-right" xs="6">
                          <FormGroup className="h-100">
                            <Input
                              className="text-right h-100"
                              type="text"
                              placeholder="0"
                              id="swapInput2"
                              onInput={(event) =>
                                handleZapInputChange(event.target.value, false)
                              }
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="6">
                          <div className="output-card">
                            1 {assetSwap2?.symbol} ={' '}
                            {formatFromUnits(
                              BN(swapInput1?.value).div(BN(swapInput2?.value)),
                              6,
                            )}{' '}
                            {assetSwap1?.symbol}
                          </div>
                        </Col>
                        <Col className="text-right" xs="6">
                          <div className="output-card">
                            ~$
                            {mode === 'token' && formatFromWei(getInput2USD())}
                            {mode === 'pool' &&
                              formatFromWei(getInputZap2USD())}
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
                {/* 'Approval/Allowance' row */}
                <Row>
                  <Col>
                    {mode === 'token' &&
                      assetSwap1?.tokenAddress !== addr.bnb &&
                      wallet?.account &&
                      swapInput1?.value && (
                        <Approval
                          tokenAddress={assetSwap1?.tokenAddress}
                          walletAddress={wallet?.account}
                          contractAddress={addr.router}
                          txnAmount={swapInput1?.value}
                        />
                      )}
                  </Col>
                </Row>
                {/* Bottom 'swap' txnDetails row */}
                {mode === 'token' && (
                  <>
                    <Row className="mb-3">
                      <Col xs="5">
                        <div className="text-card">
                          Input{' '}
                          <i
                            className="icon-small icon-info icon-dark ml-2"
                            id="tooltipInput"
                            role="button"
                          />
                          <UncontrolledTooltip
                            placement="right"
                            target="tooltipInput"
                          >
                            Your input amount.
                          </UncontrolledTooltip>
                        </div>
                      </Col>
                      <Col xs="7" className="text-right">
                        <div className="output-card">
                          {formatFromUnits(swapInput1?.value, 10)}{' '}
                          {assetSwap1?.symbol}
                        </div>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col xs="5">
                        <div className="text-card">
                          Fee{' '}
                          <i
                            className="icon-small icon-info icon-dark ml-2"
                            id="tooltipFee"
                            role="button"
                          />
                          <UncontrolledTooltip
                            placement="right"
                            target="tooltipFee"
                          >
                            The slip fee being injected into the pool with this
                            txn to reward liquidity providers.
                          </UncontrolledTooltip>
                        </div>
                      </Col>
                      <Col xs="7" className="text-right">
                        <div className="output-card">
                          {formatFromWei(getSwapFee())} SPARTA
                        </div>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col xs="5">
                        <div className="amount align-items-center">
                          Output{' '}
                          <i
                            className="icon-small icon-info icon-dark ml-2"
                            id="tooltipOutput"
                            role="button"
                          />
                          <UncontrolledTooltip
                            placement="right"
                            target="tooltipOutput"
                          >
                            The estimated unit qty of the to/output asset to be
                            received from this transaction.
                          </UncontrolledTooltip>
                        </div>
                      </Col>
                      <Col xs="7" className="text-right">
                        <div className="subtitle-amount">
                          {formatFromWei(getSwapOutput())} {assetSwap2?.symbol}
                        </div>
                      </Col>
                    </Row>
                  </>
                )}

                {/* Bottom 'zap' txnDetails row */}
                {mode === 'pool' && (
                  <>
                    <Row className="mb-3">
                      <Col xs="5">
                        <div className="text-card">
                          Input{' '}
                          <i
                            className="icon-small icon-info icon-dark ml-2"
                            id="tooltipZapInput"
                            role="button"
                          />
                          <UncontrolledTooltip
                            placement="right"
                            target="tooltipZapInput"
                          >
                            Your input amount.
                          </UncontrolledTooltip>
                        </div>
                      </Col>
                      <Col xs="7" className="text-right">
                        <div className="output-card">
                          {swapInput1?.value} {assetSwap1?.symbol}-SPP
                        </div>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col xs="5">
                        <div className="text-card">
                          Remove{' '}
                          <i
                            className="icon-small icon-info icon-dark ml-2"
                            id="tooltipZapRemove"
                            role="button"
                          />
                          <UncontrolledTooltip
                            placement="right"
                            target="tooltipZapRemove"
                          >
                            The remove-liquidity step being processed in this
                            transaction
                          </UncontrolledTooltip>
                        </div>
                      </Col>
                      <Col xs="7" className="text-right">
                        <div className="output-card">
                          {formatFromWei(getZapRemoveBase())} SPARTA +{' '}
                          {formatFromWei(getZapRemoveToken())}{' '}
                          {assetSwap1?.symbol}
                        </div>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col xs="5">
                        <div className="text-card">
                          Swaps{' '}
                          <i
                            className="icon-small icon-info icon-dark ml-2"
                            id="tooltipZapSwaps"
                            role="button"
                          />
                          <UncontrolledTooltip
                            placement="right"
                            target="tooltipZapSwaps"
                          >
                            The swaps taking place to accomodate your
                            transaction
                          </UncontrolledTooltip>
                        </div>
                      </Col>
                      <Col xs="7" className="text-right">
                        <div className="output-card">
                          {formatFromWei(getZapRemoveToken())}{' '}
                          {assetSwap1?.symbol} for{' '}
                          {formatFromWei(getZapSwap1())} SPARTA
                        </div>
                        <div className="output-card">
                          & {formatFromWei(getZapSwap1())} SPARTA for{' '}
                          {formatFromWei(getZapSwap2())} {assetSwap2?.symbol}
                        </div>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col xs="5">
                        <div className="text-card">
                          Fee{' '}
                          <i
                            className="icon-small icon-info icon-dark ml-2"
                            id="tooltipZapFee"
                            role="button"
                          />
                          <UncontrolledTooltip
                            placement="right"
                            target="tooltipZapFee"
                          >
                            The slip fee being injected into the pool to reward
                            the liquidity providers
                          </UncontrolledTooltip>
                        </div>
                      </Col>
                      <Col xs="7" className="text-right">
                        <div className="output-card">
                          {formatFromWei(getZapDoubleSwapFee())} SPARTA
                        </div>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col xs="5">
                        <div className="text-card">
                          Add{' '}
                          <i
                            className="icon-small icon-info icon-dark ml-2"
                            id="tooltipZapAdd"
                            role="button"
                          />
                          <UncontrolledTooltip
                            placement="right"
                            target="tooltipZapAdd"
                          >
                            The amount of each asset being added to the
                            liquidity pool
                          </UncontrolledTooltip>
                        </div>
                      </Col>
                      <Col xs="7" className="text-right">
                        <div className="output-card">
                          {formatFromWei(getZapRemoveBase())} SPARTA +{' '}
                          {formatFromWei(getZapSwap2())} {assetSwap2?.symbol}
                        </div>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col xs="5">
                        <div className="amount">
                          Output{' '}
                          <i
                            className="icon-small icon-info icon-dark ml-2"
                            id="tooltipZapOutput"
                            role="button"
                          />
                          <UncontrolledTooltip
                            placement="right"
                            target="tooltipZapOutput"
                          >
                            The estimated output
                          </UncontrolledTooltip>
                        </div>
                      </Col>
                      <Col xs="7" className="text-right">
                        <div className="subtitle-amount">
                          {formatFromWei(getZapOutput())} {assetSwap2?.symbol}
                          -SPP
                        </div>
                      </Col>
                    </Row>
                  </>
                )}

                {/* Bottom 'synth' txnDetails row */}
                {mode === 'synth' && (
                  <>
                    <Row className="mb-3">
                      <Col xs="5">
                        <div className="text-card">
                          Input{' '}
                          <i
                            className="icon-small icon-info icon-dark ml-2"
                            id="tooltipSynthInput"
                            role="button"
                          />
                          <UncontrolledTooltip
                            placement="right"
                            target="tooltipSynthInput"
                          >
                            Your input amount.
                          </UncontrolledTooltip>
                        </div>
                      </Col>
                      <Col xs="7" className="text-right">
                        <div className="output-card">
                          {swapInput1?.value} {assetSwap1?.symbol}-SPS
                        </div>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col xs="5">
                        <div className="text-card">
                          Fee{' '}
                          <i
                            className="icon-small icon-info icon-dark ml-2"
                            id="tooltipSynthFee"
                            role="button"
                          />
                          <UncontrolledTooltip
                            placement="right"
                            target="tooltipSynthFee"
                          >
                            The slip fee being injected into the pool to reward
                            the liquidity providers
                          </UncontrolledTooltip>
                        </div>
                      </Col>
                      <Col xs="7" className="text-right">
                        <div className="output-card">
                          {formatFromWei(getZapDoubleSwapFee())} SPARTA
                        </div>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col xs="5">
                        <div className="amount">
                          Output{' '}
                          <i
                            className="icon-small icon-info icon-dark ml-2"
                            id="tooltipSynthOutput"
                            role="button"
                          />
                          <UncontrolledTooltip
                            placement="right"
                            target="tooltipSynthOutput"
                          >
                            The estimated output
                          </UncontrolledTooltip>
                        </div>
                      </Col>
                      <Col xs="7" className="text-right">
                        <div className="subtitle-amount">
                          {formatFromWei(getZapOutput())} {assetSwap2?.symbol}
                          -SPP
                        </div>
                      </Col>
                    </Row>
                  </>
                )}
                {mode === 'token' && (
                  <Button
                    color="primary"
                    size="lg"
                    onClick={() =>
                      dispatch(
                        routerSwapAssets(
                          convertToWei(swapInput1?.value),
                          assetSwap1.tokenAddress,
                          assetSwap2.tokenAddress,
                        ),
                      )
                    }
                    block
                  >
                    Swap
                  </Button>
                )}
                {mode === 'pool' && (
                  <Button
                    color="primary"
                    size="lg"
                    onClick={() =>
                      dispatch(
                        routerZapLiquidity(
                          convertToWei(swapInput1?.value),
                          assetSwap1.tokenAddress,
                          assetSwap2.tokenAddress,
                        ),
                      )
                    }
                    block
                  >
                    Swap
                  </Button>
                )}
                {mode === 'synth' &&
                  JSON.parse(window.localStorage.getItem('assetSelected1'))
                    .symbol === 'SPARTA' && (
                    <Button
                      color="primary"
                      size="lg"
                      onClick={() =>
                        dispatch(
                          routerSwapBaseToSynth(
                            convertToWei(swapInput1?.value),
                            assetSwap2.synthAddress,
                          ),
                        )
                      }
                      block
                    >
                      Swap
                    </Button>
                  )}

                {mode === 'synth' &&
                  JSON.parse(window.localStorage.getItem('assetSelected2'))
                    .symbol === 'SPARTA' && (
                    <Button
                      color="primary"
                      size="lg"
                      onClick={() =>
                        dispatch(
                          routerSwapSynthToBase(
                            convertToWei(swapInput1?.value),
                            assetSwap1.synthAddress,
                            false,
                          ),
                        )
                      }
                      block
                    >
                      Swap
                    </Button>
                  )}
              </Card>
            </Col>
            <Col>
              <SwapPair />
            </Col>
          </Row>
        )}
        {!poolFactory.finalArray && (
          <div>
            <HelmetLoading height={300} width={300} />
          </div>
        )}
        <Row>
          <Col>
            <RecentTxns
              contracts={poolFactory.finalArray
                ?.filter((asset) => asset.symbol !== 'SPARTA')
                .map((asset) => getPoolContract(asset.poolAddress))}
              walletAddr={wallet.account}
            />
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Swap

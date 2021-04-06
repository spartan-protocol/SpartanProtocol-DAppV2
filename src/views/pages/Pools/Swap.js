import React, { useState, useEffect } from 'react'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import {
  Button,
  Card,
  Col,
  Row,
  Input,
  FormGroup,
  CustomInput,
} from 'reactstrap'
import UncontrolledTooltip from 'reactstrap/lib/UncontrolledTooltip'
import { useDispatch } from 'react-redux'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useLocation } from 'react-router-dom'
import Wallet from '../../../components/Wallet/Wallet'
import AssetSelect from '../../../components/AssetSelect/AssetSelect'
import { getAddresses, getItemFromArray } from '../../../utils/web3'
import { usePoolFactory } from '../../../store/poolFactory'
import { BN, convertToWei, formatFromWei } from '../../../utils/bigNumber'
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
  routerZapLiquidity,
} from '../../../store/router/actions'
import { getRouterContract } from '../../../utils/web3Router'
import Approval from '../../../components/Approval/Approval'
import { useWeb3 } from '../../../store/web3'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'

const Swap = () => {
  const web3 = useWeb3()
  const wallet = useWallet()
  const dispatch = useDispatch()
  const addr = getAddresses()
  const poolFactory = usePoolFactory()
  const location = useLocation()
  const [assetSwap1, setAssetSwap1] = useState('...')
  const [assetSwap2, setAssetSwap2] = useState('...')
  const [zapMode, setZapMode] = useState(false)
  const [assetParam1, setAssetParam1] = useState(
    new URLSearchParams(location.search).get(`asset1`),
  )
  const [assetParam2, setAssetParam2] = useState(
    new URLSearchParams(location.search).get(`asset2`),
  )

  useEffect(() => {
    const { finalLpArray } = poolFactory

    const getAssetDetails = () => {
      if (finalLpArray) {
        let asset1 = JSON.parse(window.localStorage.getItem('assetSelected1'))
        let asset2 = JSON.parse(window.localStorage.getItem('assetSelected2'))

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

        if (zapMode) {
          asset1 =
            asset1?.symbol !== 'SPARTA' &&
            asset1.tokenAddress !== asset2.tokenAddress
              ? asset1
              : { tokenAddress: addr.bnb }
          asset2 =
            asset2?.symbol !== 'SPARTA' &&
            asset2.tokenAddress !== asset1.tokenAddress
              ? asset2
              : { tokenAddress: addr.bnb }
        } else {
          asset1 =
            asset1 && asset1.tokenAddress !== asset2.tokenAddress
              ? asset1
              : { tokenAddress: addr.bnb }
          asset2 =
            asset2 && asset2.tokenAddress !== asset1.tokenAddress
              ? asset2
              : { tokenAddress: addr.sparta }
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
    zapMode,
    poolFactory.finalArray,
    poolFactory.finalLpArray,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetSelected1'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetSelected2'),
  ])

  const swapInput1 = document.getElementById('swapInput1')
  const swapInput2 = document.getElementById('swapInput2')

  const handleReverseAssets = async () => {
    const asset1 = JSON.parse(window.localStorage.getItem('assetSelected1'))
    const asset2 = JSON.parse(window.localStorage.getItem('assetSelected2'))
    window.localStorage.setItem('assetSelected1', JSON.stringify(asset2))
    window.localStorage.setItem('assetSelected2', JSON.stringify(asset1))
  }

  //= =================================================================================//
  // Functions SWAP calculations

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
    if (!zapMode) {
      handleInputChange(input, focusInput1)
    } else if (assetSwap1?.symbol === 'SPARTA') {
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

  return (
    <>
      <div className="content">
        <br />
        <Breadcrumb>
          <Col md={10}>Swap </Col>
          <Col md={2}>
            {' '}
            <Wallet />
          </Col>
        </Breadcrumb>
        {poolFactory.finalArray?.length > 0 && (
          <Row>
            <Col xl={8}>
              <Card className="card-body">
                <div className="d-flex align-items-center">
                  <span className="mr-2 category">Zap Mode</span>
                  <CustomInput
                    type="switch"
                    id="switch-5"
                    className="mt-n4"
                    onClick={() => setZapMode(!zapMode)}
                  />
                </div>
                <br />
                <br />
                {/* Top 'Input' Row */}
                <Row>
                  {/* 'From' input box */}
                  <Col md={5}>
                    <Card
                      style={{ backgroundColor: '#25212D' }}
                      className="card-body"
                    >
                      <Row>
                        <Col className="text-left">
                          <div className="title-card">From</div>
                          <br />
                          <div className="output-card">
                            {!zapMode && (
                              <AssetSelect
                                priority="1"
                                blackList={[assetSwap2?.tokenAddress]}
                              />
                            )}
                            {zapMode && (
                              <AssetSelect
                                priority="1"
                                type="pools"
                                blackList={[
                                  assetSwap2?.tokenAddress,
                                  addr.sparta,
                                ]}
                              />
                            )}
                          </div>
                        </Col>
                        <Col className="text-right">
                          <br />
                          <div className="output-card">
                            Balance{' '}
                            {!zapMode &&
                              formatFromWei(assetSwap1?.balanceTokens)}
                            {zapMode && formatFromWei(assetSwap1?.balanceLPs)}
                          </div>
                          <FormGroup>
                            <Input
                              className="text-right"
                              type="text"
                              placeholder="0"
                              id="swapInput1"
                              onInput={(event) =>
                                handleZapInputChange(event.target.value, true)
                              }
                            />
                          </FormGroup>
                          <div className="output-card">
                            ~${!zapMode && formatFromWei(getInput1USD())}
                            {zapMode && formatFromWei(getInputZap1USD())}
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
                        <Col className="text-left">
                          <div className="title-card">To</div>
                          <br />
                          <div className="output-card">
                            {!zapMode && (
                              <AssetSelect
                                priority="2"
                                blackList={[assetSwap1?.tokenAddress]}
                              />
                            )}
                            {zapMode && (
                              <AssetSelect
                                priority="2"
                                type="pools"
                                blackList={[
                                  addr?.sparta,
                                  assetSwap1?.tokenAddress,
                                ]}
                              />
                            )}
                          </div>
                        </Col>
                        <Col className="text-right">
                          <br />
                          <div className="output-card">
                            Balance{' '}
                            {!zapMode &&
                              formatFromWei(assetSwap2?.balanceTokens)}
                            {zapMode && formatFromWei(assetSwap2?.balanceLPs)}
                          </div>
                          <FormGroup>
                            <Input
                              className="text-right"
                              type="text"
                              placeholder="0"
                              id="swapInput2"
                              onInput={(event) =>
                                handleZapInputChange(event.target.value, false)
                              }
                            />
                          </FormGroup>
                          <div className="output-card">
                            ~${!zapMode && formatFromWei(getInput2USD())}
                            {zapMode && formatFromWei(getInputZap2USD())}
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
                {/* 'Approval/Allowance' row */}
                <Row>
                  <Col>
                    {!zapMode &&
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
                {!zapMode && (
                  <Row>
                    {/* TextLeft 'txnDetails' col */}
                    <Col>
                      <div className="text-card">
                        Input{' '}
                        <i
                          className="icon-small icon-info icon-dark ml-2"
                          id="tooltipAddBase"
                          role="button"
                        />
                        <UncontrolledTooltip
                          placement="right"
                          target="tooltipAddBase"
                        >
                          The quantity of & SPARTA you are adding to the pool.
                        </UncontrolledTooltip>
                      </div>
                      <br />
                      <div className="text-card">
                        Swap Fee{' '}
                        <i
                          className="icon-small icon-info icon-dark ml-2"
                          id="tooltipAddBase"
                          role="button"
                        />
                        <UncontrolledTooltip
                          placement="right"
                          target="tooltipAddBase"
                        >
                          The quantity of & SPARTA you are adding to the pool.
                        </UncontrolledTooltip>
                      </div>
                      <br />
                      <div className="amount">
                        Output{' '}
                        <i
                          className="icon-small icon-info icon-dark ml-2"
                          id="tooltipAddBase"
                          role="button"
                        />
                        <UncontrolledTooltip
                          placement="right"
                          target="tooltipAddBase"
                        >
                          The quantity of & SPARTA you are adding to the pool.
                        </UncontrolledTooltip>
                      </div>
                      <br />
                    </Col>
                    {/* TextRight 'txnDetails' col */}
                    <Col className="text-right">
                      <div className="output-card">
                        {swapInput1?.value} {assetSwap1?.symbol}
                      </div>
                      <br />
                      <div className="output-card">
                        {formatFromWei(getSwapFee())} SPARTA
                      </div>
                      <br />
                      <div className="subtitle-amount">
                        {formatFromWei(getSwapOutput())} {assetSwap2?.symbol}
                      </div>
                    </Col>
                  </Row>
                )}
                {/* Bottom 'zap' txnDetails row */}
                {zapMode && (
                  <Row>
                    {/* TextLeft 'zap' txnDetails col */}
                    <Col>
                      <div className="text-card">
                        Input{' '}
                        <i
                          className="icon-small icon-info icon-dark ml-2"
                          id="tooltipAddBase"
                          role="button"
                        />
                        <UncontrolledTooltip
                          placement="right"
                          target="tooltipAddBase"
                        >
                          The quantity of & SPARTA you are adding to the pool.
                        </UncontrolledTooltip>
                      </div>
                      <br />
                      <div className="text-card">
                        Remove{' '}
                        <i
                          className="icon-small icon-info icon-dark ml-2"
                          id="tooltipAddBase"
                          role="button"
                        />
                        <UncontrolledTooltip
                          placement="right"
                          target="tooltipAddBase"
                        >
                          The quantity of & SPARTA you are adding to the pool.
                        </UncontrolledTooltip>
                      </div>
                      <br />
                      <div className="text-card">
                        Swap{' '}
                        <i
                          className="icon-small icon-info icon-dark ml-2"
                          id="tooltipAddBase"
                          role="button"
                        />
                        <UncontrolledTooltip
                          placement="right"
                          target="tooltipAddBase"
                        >
                          The quantity of & SPARTA you are adding to the pool.
                        </UncontrolledTooltip>
                      </div>
                      <br />
                      <div className="text-card">
                        Add{' '}
                        <i
                          className="icon-small icon-info icon-dark ml-2"
                          id="tooltipAddBase"
                          role="button"
                        />
                        <UncontrolledTooltip
                          placement="right"
                          target="tooltipAddBase"
                        >
                          The quantity of & SPARTA you are adding to the pool.
                        </UncontrolledTooltip>
                      </div>
                      <br />
                      <div className="amount">
                        Output{' '}
                        <i
                          className="icon-small icon-info icon-dark ml-2"
                          id="tooltipAddBase"
                          role="button"
                        />
                        <UncontrolledTooltip
                          placement="right"
                          target="tooltipAddBase"
                        >
                          The quantity of & SPARTA you are adding to the pool.
                        </UncontrolledTooltip>
                      </div>
                      <br />
                    </Col>
                    {/* TextRight zap txnDetails col */}
                    <Col className="text-right">
                      <div className="output-card">
                        input {swapInput1?.value} SP-p{assetSwap1?.symbol}
                      </div>
                      <br />
                      <div className="output-card">
                        remove {formatFromWei(getZapRemoveBase())} SPARTA +{' '}
                        {formatFromWei(getZapRemoveToken())}{' '}
                        {assetSwap1?.symbol}
                      </div>
                      <br />
                      <div className="output-card">
                        swap {formatFromWei(getZapRemoveToken())}{' '}
                        {assetSwap1?.symbol} for {formatFromWei(getZapSwap1())}{' '}
                        SPARTA
                      </div>
                      <div className="output-card">
                        then swap {formatFromWei(getZapSwap1())} SPARTA for{' '}
                        {formatFromWei(getZapSwap2())}
                        {assetSwap2?.symbol}
                      </div>
                      <div className="output-card">
                        inc slip fee: {formatFromWei(getZapDoubleSwapFee())}{' '}
                        SPARTA
                      </div>
                      <br />
                      <div className="output-card">
                        add {formatFromWei(getZapRemoveBase())} SPARTA +{' '}
                        {formatFromWei(getZapSwap2())} {assetSwap2?.symbol}
                      </div>
                      <br />
                      <div className="subtitle-amount">
                        output {formatFromWei(getZapOutput())} SP-p
                        {assetSwap2?.symbol}
                      </div>
                    </Col>
                  </Row>
                )}
                {!zapMode && (
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
                {zapMode && (
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
              </Card>
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
              contract={getRouterContract()}
              walletAddr={wallet.account}
            />
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Swap

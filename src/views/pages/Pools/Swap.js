import React, { useState, useEffect } from 'react'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import { Button, Card, Col, Row, Input, FormGroup } from 'reactstrap'
import UncontrolledTooltip from 'reactstrap/lib/UncontrolledTooltip'
import { useDispatch } from 'react-redux'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import Wallet from '../../../components/Wallet/Wallet'
import AssetSelect from '../../../components/AssetSelect/AssetSelect'
import { getAddresses, getItemFromArray } from '../../../utils/web3'
import { usePoolFactory } from '../../../store/poolFactory'
import { convertToWei, formatFromWei } from '../../../utils/bigNumber'
import RecentTxns from '../../../components/RecentTxns/RecentTxns'
import {
  calcDoubleSwapOutput,
  calcDoubleSwapInput,
  calcSwapOutput,
  getSwapInput,
} from '../../../utils/web3Utils'
import { routerSwapAssets } from '../../../store/router/actions'
import { getRouterContract } from '../../../utils/web3Router'

const Swap = () => {
  const wallet = useWallet()
  const dispatch = useDispatch()
  const addr = getAddresses()
  const poolFactory = usePoolFactory()
  const [assetSwap1, setAssetSwap1] = useState('...')
  const [assetSwap2, setAssetSwap2] = useState('...')
  const [zapMode, setZapMode] = useState(false)

  useEffect(() => {
    const { finalArray } = poolFactory
    const getAssetDetails = () => {
      if (finalArray) {
        let asset1 = JSON.parse(window.localStorage.getItem('assetSelected1'))
        let asset2 = JSON.parse(window.localStorage.getItem('assetSelected2'))

        asset1 =
          asset1 && asset1.tokenAddress !== asset2.tokenAddress
            ? asset1
            : { tokenAddress: addr.bnb }
        asset2 =
          asset2 && asset2.tokenAddress !== asset1.tokenAddress
            ? asset2
            : { tokenAddress: addr.sparta }

        if (poolFactory.finalLpArray) {
          asset1 = getItemFromArray(asset1, poolFactory.finalLpArray)
          asset2 = getItemFromArray(asset2, poolFactory.finalLpArray)
        } else {
          asset1 = getItemFromArray(asset1, poolFactory.finalArray)
          asset2 = getItemFromArray(asset2, poolFactory.finalArray)
        }

        setAssetSwap1(asset1)
        setAssetSwap2(asset2)

        window.localStorage.setItem('assetSelected1', JSON.stringify(asset1))
        window.localStorage.setItem('assetSelected2', JSON.stringify(asset2))
      }
    }

    getAssetDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
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
  // Functions swap calculations

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

  //= =================================================================================//
  // Functions for input handling

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

  useEffect(() => {
    const clearInputs = () => {
      if (swapInput1) {
        swapInput1.value = ''
      }
    }

    clearInputs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetSwap1])

  useEffect(() => {
    const clearInputs = () => {
      if (swapInput2) {
        swapInput2.value = ''
      }
    }

    clearInputs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetSwap2])

  return (
    <>
      <div className="content">
        <br />
        <Breadcrumb>
          <Col md={10}>
            Swap{' '}
            <Button
              className="btn-rounded btn-icon"
              color="primary"
              onClick={() => setZapMode(!zapMode)}
            >
              Zap Mode
            </Button>
          </Col>
          <Col md={2}>
            {' '}
            <Wallet />
          </Col>
        </Breadcrumb>
        <Row>
          <Col md={8}>
            <Card className="card-body">
              <Row>
                <Col md={5}>
                  <Card
                    style={{ backgroundColor: '#25212D' }}
                    className="card-body "
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
                              blackList={[assetSwap2?.tokenAddress]}
                            />
                          )}
                        </div>
                      </Col>
                      <Col className="text-right">
                        <br />
                        <div className="output-card">
                          Balance{' '}
                          {!zapMode && formatFromWei(assetSwap1?.balanceTokens)}
                          {zapMode && formatFromWei(assetSwap1?.balanceLPs)}
                        </div>
                        <FormGroup>
                          <Input
                            className="text-right"
                            type="text"
                            placeholder="0"
                            id="swapInput1"
                            onInput={(event) =>
                              handleInputChange(event.target.value, true)
                            }
                          />
                        </FormGroup>
                        <div className="output-card">~$XX.XX</div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col>
                  <div className="card-body ml-5 mt-4">
                    <Button
                      className="btn-rounded btn-icon"
                      color="primary"
                      onClick={() => handleReverseAssets()}
                    >
                      <i className="icon-small icon-swap icon-light mt-1" />
                    </Button>
                  </div>
                </Col>

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
                              blackList={[assetSwap1?.tokenAddress]}
                            />
                          )}
                        </div>
                      </Col>
                      <Col className="text-right">
                        <br />
                        <div className="output-card">
                          Balance{' '}
                          {!zapMode && formatFromWei(assetSwap2?.balanceTokens)}
                          {zapMode && formatFromWei(assetSwap2?.balanceLPs)}
                        </div>
                        <br />
                        <FormGroup>
                          <Input
                            className="text-right"
                            type="text"
                            placeholder="0"
                            id="swapInput2"
                            onInput={(event) =>
                              handleInputChange(event.target.value, false)
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <Row>
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
                    Slip{' '}
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
                <Col className="text-right">
                  <div className="output-card">
                    {swapInput1?.value} {assetSwap1?.symbol}
                  </div>
                  <br />
                  <div className="output-card">0,000 %</div>
                  <br />
                  <div className="subtitle-amount">
                    {formatFromWei(getSwapOutput())} {assetSwap2?.symbol}
                  </div>
                </Col>
              </Row>
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
            </Card>
          </Col>
        </Row>
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

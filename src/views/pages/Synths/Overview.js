/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import {
  Button,
  Card,
  Col,
  Row,
  Input,
  Nav,
  NavItem,
  NavLink,
  InputGroup,
  InputGroupAddon,
} from 'reactstrap'
import UncontrolledTooltip from 'reactstrap/lib/UncontrolledTooltip'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import AssetSelect from '../../../components/AssetSelect/AssetSelect'
import { getAddresses, getItemFromArray } from '../../../utils/web3'
import { usePool } from '../../../store/pool'
import {
  BN,
  convertToWei,
  convertFromWei,
  formatFromWei,
  formatFromUnits,
} from '../../../utils/bigNumber'
import {
  calcSwapOutput,
  calcSwapFee,
  calcValueInBase,
  calcShare,
  calcLiquidityUnitsAsym,
} from '../../../utils/web3Utils'
import {
  swapAssetToSynth,
  swapSynthToAsset,
} from '../../../store/router/actions'
import { useWeb3 } from '../../../store/web3'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import { useSynth } from '../../../store/synth/selector'
import mintIcon from '../../../assets/icons/mint.svg'
import fireIcon from '../../../assets/icons/fire.svg'
import Approval from '../../../components/Approval/Approval'
import SwapPair from '../Swap/SwapPair'
import Share from '../../../components/Share/SharePool'

const Swap = () => {
  const wallet = useWallet()
  const synth = useSynth()
  const { t } = useTranslation()
  const web3 = useWeb3()
  const dispatch = useDispatch()
  const addr = getAddresses()
  const pool = usePool()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('mint')
  const [assetSwap1, setAssetSwap1] = useState('...')
  const [assetSwap2, setAssetSwap2] = useState('...')
  const [assetParam1, setAssetParam1] = useState(
    new URLSearchParams(location.search).get(`asset1`),
  )
  const [assetParam2, setAssetParam2] = useState(
    new URLSearchParams(location.search).get(`asset2`),
  )

  useEffect(() => {
    const { poolDetails } = pool

    const getAssetDetails = () => {
      if (poolDetails?.length > 0) {
        let asset1 = JSON.parse(window.localStorage.getItem('assetSelected1'))
        let asset2 = JSON.parse(window.localStorage.getItem('assetSelected2'))

        if (poolDetails.find((asset) => asset.tokenAddress === assetParam1)) {
          ;[asset1] = poolDetails.filter(
            (asset) => asset.tokenAddress === assetParam1,
          )
          setAssetParam1('')
        }
        if (poolDetails.find((asset) => asset.tokenAddress === assetParam2)) {
          ;[asset2] = poolDetails.filter(
            (asset) => asset.tokenAddress === assetParam2,
          )
          setAssetParam2('')
        }

        if (activeTab === 'mint') {
          window.localStorage.setItem('assetType1', 'token')
          window.localStorage.setItem('assetType2', 'synth')
          if (asset2.curated !== true) {
            asset2 = { tokenAddress: addr.bnb }
          }
        } else {
          window.localStorage.setItem('assetType1', 'synth')
          window.localStorage.setItem('assetType2', 'token')
          if (asset1.tokenAddress === addr.sparta) {
            asset1 = { tokenAddress: addr.bnb }
          }
        }

        if (!asset1) {
          asset1 = { tokenAddress: addr.sparta }
        }

        if (!asset2) {
          asset2 = { tokenAddress: addr.bnb }
        }

        asset1 = getItemFromArray(asset1, poolDetails)
        asset2 = getItemFromArray(asset2, poolDetails)

        setAssetSwap1(asset1)
        setAssetSwap2(asset2)

        window.localStorage.setItem('assetSelected1', JSON.stringify(asset1))
        window.localStorage.setItem('assetSelected2', JSON.stringify(asset2))
      }
    }

    getAssetDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeTab,
    pool.poolDetails,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetSelected1'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetSelected2'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetType1'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetType2'),
  ])

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  const getSynth = (tokenAddress) =>
    synth.synthDetails.filter((i) => i.tokenAddress === tokenAddress)[0]

  const swapInput1 = document.getElementById('swapInput1')
  const swapInput2 = document.getElementById('swapInput2')

  const clearInputs = () => {
    if (swapInput1) {
      swapInput1.value = ''
      swapInput1.focus()
    }
    if (swapInput2) {
      swapInput2.value = ''
    }
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
      return getToken(item.tokenAddress)?.balance
    }
    if (type === 'synth') {
      return getSynth(item.tokenAddress)?.balance
    }
    return item.balanceTokens
  }

  //= =================================================================================//
  // Functions for SWAP input handling
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
    clearInputs(1)
  }

  //= =================================================================================//
  // Functions SYNTHS calculations

  const getSynthLPsFromBase = (baseOuput) => {
    let temp = '0'
    if (baseOuput) {
      if (assetSwap1.tokenAddress === assetSwap2.tokenAddress) {
        temp = calcLiquidityUnitsAsym(
          baseOuput,
          BN(assetSwap2.baseAmount).minus(baseOuput),
          assetSwap2.poolUnits,
        )
      } else {
        temp = calcLiquidityUnitsAsym(
          baseOuput,
          assetSwap2.baseAmount,
          assetSwap2.poolUnits,
        )
      }
    } else {
      temp = calcLiquidityUnitsAsym(
        convertToWei(swapInput1.value),
        assetSwap2.baseAmount,
        assetSwap2.poolUnits,
      )
    }
    return temp
  }

  const getSynthFeeFromBase = () => {
    let temp = calcSwapFee(
      convertToWei(swapInput1?.value),
      assetSwap2?.tokenAmount,
      assetSwap2?.baseAmount,
    )
    temp = calcValueInBase(assetSwap2.tokenAmount, assetSwap2.baseAmount, temp)
    return temp
  }

  const getSynthOutputFromBase = () => {
    let tokenValue = '0'
    if (assetSwap1.tokenAddress === addr.sparta) {
      const lpUnits = getSynthLPsFromBase()
      const baseAmount = calcShare(
        lpUnits,
        BN(assetSwap2.poolUnits).plus(lpUnits),
        BN(assetSwap2.baseAmount).plus(BN(swapInput1?.value)),
      )
      const tokenAmount = calcShare(
        lpUnits,
        BN(assetSwap2.poolUnits).plus(lpUnits),
        assetSwap2.tokenAmount,
      )
      const baseSwapped = calcSwapOutput(
        baseAmount,
        assetSwap2.tokenAmount,
        BN(assetSwap2.baseAmount).plus(BN(swapInput1?.value)),
      )
      tokenValue = BN(tokenAmount).plus(baseSwapped)
    } else {
      const outPutBase = calcSwapOutput(
        convertToWei(swapInput1?.value),
        assetSwap1?.tokenAmount,
        assetSwap1?.baseAmount,
        true,
      )
      const lpUnits = getSynthLPsFromBase(outPutBase)
      let baseAmount = '0'
      let tokenAmount = '0'
      let baseSwapped = '0'
      if (assetSwap1.tokenAddress === assetSwap2.tokenAddress) {
        baseAmount = calcShare(
          lpUnits,
          BN(assetSwap2.poolUnits).plus(lpUnits),
          BN(assetSwap2.baseAmount),
        )
        tokenAmount = calcShare(
          lpUnits,
          BN(assetSwap2.poolUnits).plus(lpUnits),
          BN(assetSwap2.tokenAmount).plus(convertToWei(swapInput1?.value)),
        )
        baseSwapped = calcSwapOutput(
          baseAmount,
          BN(assetSwap2.tokenAmount).plus(convertToWei(swapInput1?.value)),
          BN(assetSwap2.baseAmount),
        )
      } else {
        baseAmount = calcShare(
          lpUnits,
          BN(assetSwap2.poolUnits).plus(lpUnits),
          BN(assetSwap2.baseAmount).plus(BN(outPutBase)),
        )
        tokenAmount = calcShare(
          lpUnits,
          BN(assetSwap2.poolUnits).plus(lpUnits),
          assetSwap2.tokenAmount,
        )
        baseSwapped = calcSwapOutput(
          baseAmount,
          assetSwap2.tokenAmount,
          BN(assetSwap2.baseAmount).plus(BN(outPutBase)),
        )
      }
      tokenValue = BN(tokenAmount).plus(baseSwapped)
    }
    return tokenValue
  }

  const getSynthFeeToBase = () => {
    const fee = calcSwapFee(
      convertToWei(swapInput1.value),
      assetSwap1.tokenAmount,
      assetSwap1.baseAmount,
      true,
    )
    return fee
  }

  const getSynthOutputToBase = () => {
    let tokenValue = '0'
    let outPutBase = '0'
    if (assetSwap2.tokenAddress === addr.sparta) {
      const inputSynth = convertToWei(swapInput1?.value)
      tokenValue = calcSwapOutput(
        inputSynth,
        assetSwap1.tokenAmount,
        assetSwap1.baseAmount,
        true,
      )
    } else if (assetSwap1.tokenAddress === assetSwap2.tokenAddress) {
      outPutBase = calcSwapOutput(
        convertToWei(swapInput1?.value),
        assetSwap1?.tokenAmount,
        assetSwap1?.baseAmount,
        true,
      )
      tokenValue = calcSwapOutput(
        outPutBase,
        assetSwap2.tokenAmount,
        BN(assetSwap2.baseAmount).minus(outPutBase),
        false,
      )
    } else {
      outPutBase = calcSwapOutput(
        convertToWei(swapInput1?.value),
        assetSwap1?.tokenAmount,
        assetSwap1?.baseAmount,
        true,
      )
      tokenValue = calcSwapOutput(
        outPutBase,
        assetSwap2.tokenAmount,
        assetSwap2.baseAmount,
        false,
      )
    }
    return tokenValue
  }

  //= =================================================================================//
  // Functions for input handling

  const handleZapInputChange = () => {
    if (activeTab === 'mint') {
      if (swapInput1?.value) {
        swapInput2.value = convertFromWei(getSynthOutputFromBase(), 18)
      } else {
        clearInputs()
      }
    } else if (swapInput1?.value) {
      swapInput2.value = convertFromWei(getSynthOutputToBase(), 18)
    } else {
      clearInputs()
    }
  }

  // GET USD VALUES
  const getInput1USD = () => {
    if (assetSwap1.tokenAddress === addr.sparta) {
      return BN(convertToWei(swapInput1?.value)).times(web3.spartaPrice)
    }
    if (swapInput1?.value) {
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

  // GET USD VALUES
  const getInput2USD = () => {
    if (assetSwap2.tokenAddress === addr.sparta) {
      return BN(convertToWei(swapInput2?.value)).times(web3.spartaPrice)
    }
    if (swapInput2?.value) {
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

  const getRateSlip = () => {
    if (assetSwap1 && swapInput1?.value > 0 && swapInput2?.value > 0) {
      return BN(getInput2USD()).div(getInput1USD()).minus('1').times('100')
    }
    return '0'
  }

  const handleTokenInputChange = (e) => {
    e.currentTarget.value = e.currentTarget.value
      .replace(/[^0-9.]/g, '')
      .replace(/(\..*?)\..*/g, '$1')
  }

  useEffect(() => {
    handleZapInputChange()
  }, [swapInput1?.value, swapInput2?.value, assetSwap1, assetSwap2, activeTab])

  return (
    <>
      <div className="content">
        {pool.poolDetails?.length > 0 && (
          <>
            <Row className="row-480">
              <Col xs="12">
                <div className="card-480 my-3">
                  <h2 className="text-title-small mb-0 mr-2">{t('synths')}</h2>
                  <Share />
                </div>
              </Col>
            </Row>
            <Row className="row-480">
              <Card xs="auto" className="card-body card-480 mb-auto">
                <Nav pills className="nav-tabs-custom mt-2 mb-4">
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === 'mint',
                      })}
                      onClick={() => {
                        toggle('mint')
                      }}
                    >
                      Mint Synths
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: activeTab === 'burn',
                      })}
                      onClick={() => {
                        toggle('burn')
                      }}
                    >
                      Burn Synths
                    </NavLink>
                  </NavItem>
                </Nav>
                <Row>
                  <Col xs="12" className="px-1 px-sm-3">
                    <Card
                      style={{ backgroundColor: '#25212D' }}
                      className="card-body mb-1"
                    >
                      <Row>
                        {/* 'From' input box */}
                        <Col xs="4">
                          <div className="text-sm-label">
                            {' '}
                            {activeTab === 'mint' ? 'Add' : 'Burn'}
                          </div>
                        </Col>

                        <Col xs="8" className="text-right">
                          <div
                            className="text-sm-label"
                            role="button"
                            onClick={() => {
                              swapInput1.value = convertFromWei(getBalance(1))
                              handleZapInputChange(
                                convertFromWei(getBalance(1)),
                                true,
                              )
                            }}
                          >
                            {t('balance')}
                            {': '}
                            {formatFromWei(getBalance(1), 4)}
                          </div>
                        </Col>
                      </Row>
                      <Row className="my-2">
                        <Col xs="auto" className="ml-1">
                          <AssetSelect
                            priority="1"
                            filter={
                              activeTab === 'mint' ? ['token'] : ['synth']
                            }
                          />
                        </Col>
                        <Col className="text-right">
                          <InputGroup className="m-0 mt-n1">
                            <Input
                              className="text-right h-100 ml-0 p-2"
                              type="text"
                              placeholder="Add..."
                              id="swapInput1"
                              inputMode="decimal"
                              pattern="^[0-9]*[.,]?[0-9]*$"
                              autoComplete="off"
                              autoCorrect="off"
                              minLength="1"
                              onInput={(e) => handleTokenInputChange(e)}
                            />
                            <InputGroupAddon
                              addonType="append"
                              role="button"
                              tabIndex={-1}
                              onKeyPress={() => clearInputs(1)}
                              onClick={() => clearInputs(1)}
                            >
                              <i className="icon-search-bar icon-mini icon-close icon-light my-auto" />
                            </InputGroupAddon>
                          </InputGroup>
                          <div className="text-right text-sm-label">
                            ~$
                            {swapInput1?.value
                              ? formatFromWei(getInput1USD(), 2)
                              : '0.00'}
                          </div>
                        </Col>
                      </Row>
                    </Card>
                    <Row className="my-n2">
                      {activeTab === 'mint' && (
                        <img
                          src={mintIcon}
                          alt="plusicon"
                          className="mx-auto z-index my-n2"
                          style={{ height: '35px' }}
                        />
                      )}
                      {activeTab === 'burn' && (
                        <img
                          src={fireIcon}
                          alt="plusicon"
                          className="mx-auto z-index my-n2"
                          style={{ height: '35px' }}
                        />
                      )}
                    </Row>

                    {activeTab === 'mint' && (
                      <Card
                        style={{ backgroundColor: '#25212D' }}
                        className="card-body mb-1"
                      >
                        <Row className="my-2">
                          <Col xs="4" className="">
                            <div className="text-sm-label">
                              {' '}
                              {activeTab === 'mint' ? 'Mint' : 'Receive'}
                            </div>
                          </Col>
                          <Col xs="8" className="text-right">
                            <div className="text-sm-label">
                              Balance{': '}
                              {pool.poolDetails &&
                                formatFromWei(getBalance(2), 4)}
                            </div>
                          </Col>
                        </Row>
                        <Row className="">
                          <Col xs="auto" className="ml-1">
                            <AssetSelect priority="2" filter={['synth']} />
                          </Col>
                          <Col className="text-right">
                            <InputGroup className="m-0 mt-n1">
                              <Input
                                className="text-right h-100 ml-0 p-2 text-light"
                                type="text"
                                placeholder="0.00"
                                id="swapInput2"
                                inputMode="decimal"
                                pattern="^[0-9]*[.,]?[0-9]*$"
                                autoComplete="off"
                                autoCorrect="off"
                                minLength="1"
                                onInput={(e) => handleTokenInputChange(e)}
                              />
                            </InputGroup>
                            <div className="text-right text-sm-label">
                              ~$
                              {swapInput2?.value
                                ? formatFromWei(getInput2USD(), 2)
                                : '0.00'}
                              {' ('}
                              {swapInput2?.value
                                ? formatFromUnits(getRateSlip())
                                : '0.00'}
                              {'%)'}
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    )}

                    {activeTab === 'burn' && (
                      <Card
                        style={{ backgroundColor: '#25212D' }}
                        className="card-body mb-1"
                      >
                        <Row className="my-2">
                          <Col xs="4" className="">
                            <div className="text-sm-label">
                              {activeTab === 'burn' ? 'Receive' : 'Burn'}
                            </div>
                          </Col>
                          <Col xs="8" className="text-right">
                            <div className="text-sm-label">
                              Balance{': '}
                              {pool.poolDetails &&
                                formatFromWei(getBalance(2), 4)}
                            </div>
                          </Col>
                        </Row>

                        <Row className="">
                          <Col xs="auto">
                            <div className="output-card ml-1">
                              <AssetSelect priority="2" filter={['token']} />
                            </div>
                          </Col>
                          <Col className="text-right">
                            <InputGroup className="m-0 mt-n1">
                              <Input
                                className="text-right h-100 ml-0 p-2 text-light"
                                type="text"
                                placeholder="0.00"
                                id="swapInput2"
                                disabled
                              />
                            </InputGroup>
                            <div className="text-right text-sm-label">
                              ~$
                              {swapInput2?.value
                                ? formatFromWei(getInput2USD(), 2)
                                : '0.00'}
                              {' ('}
                              {swapInput2?.value
                                ? formatFromUnits(getRateSlip(), 2)
                                : '0.00'}
                              {'%)'}
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    )}

                    {/* Bottom 'synth' txnDetails row */}
                    <Row className="mb-2 mt-3">
                      <Col xs="auto">
                        <div className="text-card">{t('input')}</div>
                      </Col>
                      <Col className="text-right">
                        <span className="output-card text-light">
                          {swapInput1?.value
                            ? formatFromUnits(swapInput1?.value, 6)
                            : '0.00'}{' '}
                          {getToken(assetSwap1.tokenAddress)?.symbol}
                          {activeTab === 'burn' && 's'}
                        </span>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col xs="auto">
                        <div className="text-card">
                          Fee{' '}
                          <i
                            className="icon-extra-small icon-info icon-dark ml-2 mt-n1"
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
                      <Col className="text-right">
                        {assetSwap1?.tokenAddress === addr.sparta && (
                          <div className="output-card text-light">
                            {swapInput1?.value
                              ? formatFromWei(getSynthFeeFromBase(), 6)
                              : '0.00'}{' '}
                            SPARTA
                          </div>
                        )}
                        {assetSwap1?.tokenAddress !== addr.sparta && (
                          <div className="output-card text-light">
                            {swapInput1?.value
                              ? formatFromWei(getSynthFeeToBase(), 6)
                              : '0.00'}{' '}
                            SPARTA
                          </div>
                        )}
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col xs="auto">
                        <div className="subtitle-card">Output</div>
                      </Col>
                      <Col className="text-right">
                        {activeTab === 'mint' && (
                          <span className="subtitle-card">
                            {swapInput1?.value
                              ? formatFromWei(getSynthOutputFromBase(), 6)
                              : '0.00'}
                            <span className="output-card ml-1">
                              {getToken(assetSwap2.tokenAddress)?.symbol}s
                            </span>
                          </span>
                        )}

                        {activeTab === 'burn' && (
                          <span className="subtitle-card">
                            {swapInput1?.value
                              ? formatFromWei(getSynthOutputToBase(), 6)
                              : '0.00'}
                            <span className="output-card ml-1">
                              {getToken(assetSwap2.tokenAddress)?.symbol}
                            </span>
                          </span>
                        )}
                      </Col>
                    </Row>

                    {/* 'Approval/Allowance' row */}
                    {activeTab === 'mint' && (
                      <>
                        {assetSwap1?.tokenAddress !== addr.bnb &&
                          wallet?.account &&
                          swapInput1?.value && (
                            <Approval
                              tokenAddress={assetSwap1?.tokenAddress}
                              symbol={getToken(assetSwap1.tokenAddress)?.symbol}
                              walletAddress={wallet?.account}
                              contractAddress={addr.router}
                              txnAmount={convertToWei(swapInput1?.value)}
                              assetNumber="1"
                            />
                          )}
                        <Col>
                          <Button
                            color="primary"
                            size="lg"
                            onClick={() =>
                              dispatch(
                                swapAssetToSynth(
                                  convertToWei(swapInput1?.value),
                                  assetSwap1.tokenAddress,
                                  getSynth(assetSwap2.tokenAddress)?.address,
                                ),
                              )
                            }
                            block
                          >
                            Mint {getToken(assetSwap2.tokenAddress)?.symbol}s
                          </Button>
                        </Col>
                      </>
                    )}
                    {activeTab === 'burn' && (
                      <Col>
                        <Button
                          color="primary"
                          size="lg"
                          onClick={() =>
                            dispatch(
                              swapSynthToAsset(
                                convertToWei(swapInput1?.value),
                                getSynth(assetSwap1.tokenAddress)?.address,
                                assetSwap2.tokenAddress,
                              ),
                            )
                          }
                          block
                        >
                          Burn {getToken(assetSwap1.tokenAddress)?.symbol}s
                        </Button>
                      </Col>
                    )}
                  </Col>
                </Row>
              </Card>
              <Col xs="auto">
                {pool.poolDetails &&
                  assetSwap1.tokenAddress !== addr.sparta &&
                  assetSwap2.tokenAddress !== assetSwap1.tokenAddress && (
                    <SwapPair assetSwap={assetSwap1} />
                  )}
                {pool.poolDetails &&
                  assetSwap2.tokenAddress !== addr.sparta && (
                    <SwapPair assetSwap={assetSwap2} />
                  )}
              </Col>
            </Row>
          </>
        )}
        {pool.poolDetails.length <= 0 && (
          <div>
            <HelmetLoading height={300} width={300} />
          </div>
        )}
      </div>
    </>
  )
}

export default Swap

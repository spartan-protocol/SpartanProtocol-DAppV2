/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import {
  Button,
  Card,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  Nav,
  NavItem,
  NavLink,
  Row,
} from 'reactstrap'
import { useDispatch } from 'react-redux'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useLocation } from 'react-router-dom'
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
import {
  calcLiquidityHoldings,
  calcLiquidityUnits,
  calcLiquidityUnitsAsym,
  calcSwapFee,
  calcValueInBase,
  calcValueInToken,
} from '../../../utils/web3Utils'
import SwapPair from '../Swap/SwapPair'
import { useWeb3 } from '../../../store/web3'
import { routerAddLiq, routerAddLiqAsym } from '../../../store/router/actions'
import Approval from '../../../components/Approval/Approval'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import plusIcon from '../../../assets/icons/plus.svg'
import swapIcon from '../../../assets/icons/swapadd.svg'

const AddLiquidity = () => {
  const wallet = useWallet()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const pool = usePool()
  const addr = getAddresses()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('addTab1')
  const [assetAdd1, setAssetAdd1] = useState('...')
  const [assetAdd2, setAssetAdd2] = useState('...')
  const [poolAdd1, setPoolAdd1] = useState('...')
  const [outputLp, setOutputLp] = useState('0.00')
  const [assetParam1, setAssetParam1] = useState(
    new URLSearchParams(location.search).get(`asset1`),
  )

  useEffect(() => {
    const { poolDetails } = pool
    const getAssetDetails = () => {
      if (poolDetails.length > 0 && activeTab === 'addTab1') {
        window.localStorage.setItem('assetType1', 'token')
        window.localStorage.setItem('assetType2', 'token')
        window.localStorage.setItem('assetType3', 'pool')

        let asset1 = JSON.parse(window.localStorage.getItem('assetSelected1'))
        let asset2 = JSON.parse(window.localStorage.getItem('assetSelected2'))
        let asset3 = JSON.parse(window.localStorage.getItem('assetSelected3'))

        if (poolDetails.find((asset) => asset.tokenAddress === assetParam1)) {
          ;[asset1] = poolDetails.filter(
            (asset) => asset.tokenAddress === assetParam1,
          )
          setAssetParam1('')
        }

        asset1 =
          asset1 && asset1.tokenAddress !== addr.sparta
            ? asset1
            : { tokenAddress: addr.bnb }
        asset2 = { tokenAddress: addr.sparta }
        asset3 =
          asset1.tokenAddress !== addr.sparta
            ? asset1
            : { tokenAddress: addr.bnb }

        asset1 = getItemFromArray(asset1, pool.poolDetails)
        asset2 = getItemFromArray(asset2, pool.poolDetails)
        asset3 = getItemFromArray(asset3, pool.poolDetails)

        setAssetAdd1(asset1)
        setAssetAdd2(asset2)
        setPoolAdd1(asset3)

        window.localStorage.setItem('assetSelected1', JSON.stringify(asset1))
        window.localStorage.setItem('assetSelected2', JSON.stringify(asset2))
        window.localStorage.setItem('assetSelected3', JSON.stringify(asset3))
      } else if (poolDetails && activeTab === 'addTab2') {
        window.localStorage.setItem('assetType1', 'token')
        window.localStorage.setItem('assetType3', 'pool')

        let asset1 = JSON.parse(window.localStorage.getItem('assetSelected1'))
        let asset3 = JSON.parse(window.localStorage.getItem('assetSelected3'))

        asset1 = asset1 || { tokenAddress: addr.bnb }
        asset3 = asset1.tokenAddress !== addr.sparta ? asset1 : asset3

        asset1 = getItemFromArray(asset1, pool.poolDetails)
        asset3 = getItemFromArray(asset3, pool.poolDetails)

        setAssetAdd1(asset1)
        setPoolAdd1(asset3)

        window.localStorage.setItem('assetSelected1', JSON.stringify(asset1))
        window.localStorage.setItem('assetSelected3', JSON.stringify(asset3))
      }
    }

    getAssetDetails()
  }, [
    pool.poolDetails,
    window.localStorage.getItem('assetSelected1'),
    window.localStorage.getItem('assetSelected2'),
    window.localStorage.getItem('assetSelected3'),
    activeTab,
  ])

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  const addInput1 = document.getElementById('addInput1')
  const addInput2 = document.getElementById('addInput2')
  const addInput3 = document.getElementById('addInput3')

  const clearInputs = (focusAfter) => {
    setOutputLp('0.00')
    if (addInput1) {
      addInput1.value = ''
    }
    if (addInput2) {
      addInput2.value = ''
    }
    if (addInput3) {
      addInput3.value = ''
    }
    if (focusAfter === 1) {
      addInput1.focus()
    }
    if (focusAfter === 2) {
      addInput2.focus()
    }
  }

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
    clearInputs(1)
  }

  const getBalance = (asset) => {
    if (asset === 1) {
      return getToken(assetAdd1?.tokenAddress)?.balance
    }
    if (asset === 2) {
      return getToken(assetAdd2?.tokenAddress)?.balance
    }
    return poolAdd1?.balance
  }

  //= =================================================================================//
  // 'Add Both' Functions (Re-Factor)

  const getAddBothOutputLP = () => {
    if (addInput1 && addInput2 && assetAdd1) {
      return convertFromWei(
        calcLiquidityUnits(
          convertToWei(addInput2?.value),
          convertToWei(addInput1?.value),
          assetAdd1?.baseAmount,
          assetAdd1?.tokenAmount,
          assetAdd1?.poolUnits,
        ),
      )
    }
    return '0.00'
  }

  //= =================================================================================//
  // 'Add Single' Functions (Re-Factor)

  const getAddSingleOutputLP = () => {
    if (addInput1 && assetAdd1) {
      return convertFromWei(
        calcLiquidityUnitsAsym(
          convertToWei(addInput1?.value),
          assetAdd1.tokenAddress === addr.sparta
            ? poolAdd1?.baseAmount
            : poolAdd1?.tokenAmount,
          poolAdd1?.poolUnits,
        ),
      )
    }
    return '0.00'
  }

  const getAddSingleSwapFee = () => {
    if (addInput1 && assetAdd1) {
      const swapFee = calcSwapFee(
        convertToWei(BN(addInput1?.value).div(2)),
        poolAdd1.tokenAmount,
        poolAdd1.baseAmount,
        assetAdd1.symbol !== 'SPARTA',
      )
      return swapFee
    }
    return '0.00'
  }

  const getInput1ValueUSD = () => {
    if (assetAdd1?.tokenAddress !== addr.sparta && addInput1?.value) {
      return calcValueInBase(
        poolAdd1.tokenAmount,
        poolAdd1.baseAmount,
        convertToWei(addInput1.value),
      ).times(web3.spartaPrice)
    }
    if (assetAdd1?.tokenAddress === addr.sparta && addInput1?.value) {
      return BN(convertToWei(addInput1.value)).times(web3.spartaPrice)
    }
    return '0.00'
  }

  const getInput2ValueUSD = () => {
    if (assetAdd2 && addInput2?.value) {
      return BN(convertToWei(addInput2.value)).times(web3.spartaPrice)
    }
    return '0.00'
  }

  const getLpValueBase = () => {
    if (assetAdd1 && addInput1?.value) {
      return calcLiquidityHoldings(
        poolAdd1.baseAmount,
        outputLp,
        poolAdd1.poolUnits,
      )
    }
    return '0.00'
  }

  const getLpValueToken = () => {
    if (assetAdd1 && addInput1?.value) {
      return calcLiquidityHoldings(
        poolAdd1.tokenAmount,
        outputLp,
        poolAdd1.poolUnits,
      )
    }
    return '0.00'
  }

  const getLpValueUSD = () => {
    if (assetAdd1 && addInput1?.value) {
      return BN(
        calcValueInBase(
          poolAdd1?.tokenAmount,
          poolAdd1?.baseAmount,
          getLpValueToken(),
        ),
      )
        .plus(getLpValueBase())
        .times(web3.spartaPrice)
    }

    return '0.00'
  }

  //= =================================================================================//
  // General Functions

  const handleInputChange = () => {
    if (activeTab === 'addTab1') {
      if (addInput2 && addInput2 !== document.activeElement) {
        addInput2.value = calcValueInBase(
          assetAdd1.tokenAmount,
          assetAdd1.baseAmount,
          addInput1.value > 0 ? addInput1.value : '0.00',
        )
        setOutputLp(convertToWei(getAddBothOutputLP()))
      } else if (addInput1 && addInput1 !== document.activeElement) {
        addInput1.value = calcValueInToken(
          assetAdd1.tokenAmount,
          assetAdd1.baseAmount,
          addInput2.value > 0 ? addInput2.value : '0.00',
        )
        setOutputLp(convertToWei(getAddBothOutputLP()))
      }
    } else if (activeTab === 'addTab2') {
      if (addInput1?.value && addInput3) {
        setOutputLp(convertToWei(getAddSingleOutputLP()))
        addInput3.value = getAddSingleOutputLP()
      }
    }
  }

  const getRateSlip = () => {
    if (assetAdd1 && addInput1?.value > 0) {
      return BN(getLpValueUSD())
        .div(getInput1ValueUSD())
        .minus('1')
        .times('100')
    }
    return '0.00'
  }

  const handleTokenInputChange = (e) => {
    e.currentTarget.value = e.currentTarget.value
      .replace(/[^0-9.]/g, '')
      .replace(/(\..*?)\..*/g, '$1')
  }

  useEffect(() => {
    handleInputChange()
  }, [
    addInput1?.value,
    addInput2?.value,
    assetAdd1,
    assetAdd2,
    poolAdd1,
    activeTab,
  ])

  return (
    <>
      <Col xs="auto">
        <Card xs="auto" className="card-body card-480">
          <Nav pills className="nav-tabs-custom mt-2 mb-4">
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === 'addTab1' })}
                onClick={() => {
                  toggle('addTab1')
                }}
              >
                Add Both
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === 'addTab2' })}
                onClick={() => {
                  toggle('addTab2')
                }}
              >
                Add Single
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
                  <Col xs="4">
                    <div className="text-sm-label">Add</div>
                  </Col>

                  <Col xs="8" className="text-right">
                    <div
                      className="text-sm-label"
                      role="button"
                      onClick={() => {
                        addInput1.value = convertFromWei(getBalance(1))
                      }}
                    >
                      Balance:{' '}
                      {pool.poolDetails && formatFromWei(getBalance(1))}{' '}
                    </div>
                  </Col>
                </Row>

                <Row className="my-2">
                  <Col xs="auto" className="ml-1">
                    <AssetSelect
                      priority="1"
                      filter={['token']}
                      blackList={[activeTab === 'addTab1' ? addr.sparta : '']}
                    />
                  </Col>
                  <Col className="text-right">
                    <InputGroup className="m-0 mt-n1">
                      <Input
                        className="text-right h-100 ml-0 p-2"
                        type="text"
                        placeholder="Add..."
                        id="addInput1"
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
                      {addInput1?.value
                        ? formatFromWei(getInput1ValueUSD(), 2)
                        : '0.00'}
                    </div>
                  </Col>
                </Row>
              </Card>

              <Row className="my-n2">
                {activeTab === 'addTab1' && (
                  <img
                    src={plusIcon}
                    alt="plusicon"
                    className="mx-auto z-index my-n2"
                    style={{ height: '35px' }}
                  />
                )}
                {activeTab === 'addTab2' && (
                  <img
                    src={swapIcon}
                    alt="swapaddicon"
                    className="mx-auto z-index my-n2"
                    style={{ height: '35px' }}
                  />
                )}
              </Row>

              {activeTab === 'addTab1' && (
                <Card
                  style={{ backgroundColor: '#25212D' }}
                  className="card-body mb-1"
                >
                  <Row className="my-2">
                    <Col xs="4" className="">
                      <div className="text-sm-label">Add</div>
                    </Col>
                    <Col xs="8" className="text-right">
                      <div
                        className="text-sm-label"
                        role="button"
                        onClick={() => {
                          addInput2.focus()
                          addInput2.value = convertFromWei(getBalance(2))
                        }}
                      >
                        Balance:{' '}
                        {pool.poolDetails && formatFromWei(getBalance(2))}
                      </div>
                    </Col>
                  </Row>
                  <Row className="">
                    <Col xs="auto" className="ml-1">
                      <AssetSelect
                        priority="2"
                        filter={['token']}
                        whiteList={[addr.sparta]}
                        disabled={activeTab === 'addTab1'}
                      />
                    </Col>
                    <Col className="text-right">
                      <InputGroup className="m-0">
                        <Input
                          className="text-right h-100 ml-0 p-2"
                          type="text"
                          placeholder="Add..."
                          id="addInput2"
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
                          onKeyPress={() => clearInputs(2)}
                          onClick={() => clearInputs(2)}
                        >
                          <i className="icon-search-bar icon-mini icon-close icon-light my-auto" />
                        </InputGroupAddon>
                      </InputGroup>
                      <div className="text-right text-sm-label">
                        ~$
                        {addInput2?.value
                          ? formatFromWei(getInput2ValueUSD(), 2)
                          : '0.00'}
                      </div>
                    </Col>
                  </Row>
                </Card>
              )}

              {activeTab === 'addTab2' && (
                <Card
                  style={{ backgroundColor: '#25212D' }}
                  className="card-body mb-1"
                >
                  <Row className="my-2">
                    <Col xs="4" className="">
                      <div className="text-sm-label">Pool</div>
                    </Col>
                    <Col xs="8" className="text-right">
                      <div className="text-sm-label">
                        Balance:{' '}
                        {pool.poolDetails && formatFromWei(getBalance(3))}
                      </div>
                    </Col>
                  </Row>

                  <Row className="">
                    <Col xs="auto">
                      <div className="output-card ml-1">
                        <AssetSelect
                          priority="3"
                          filter={['pool']}
                          disabled={
                            activeTab === 'addTab1' ||
                            assetAdd1.tokenAddress !== addr.sparta
                          }
                        />
                      </div>
                    </Col>
                    <Col className="text-right">
                      <InputGroup className="m-0 mt-n1">
                        <Input
                          className="text-right h-100 ml-0 p-2 text-light"
                          type="text"
                          placeholder="0.00"
                          id="addInput3"
                          disabled
                        />
                      </InputGroup>
                      <div className="text-right text-sm-label">
                        ~$
                        {addInput1?.value
                          ? formatFromWei(getLpValueUSD(), 2)
                          : '0.00'}
                        {' ('}
                        {addInput1?.value
                          ? formatFromUnits(getRateSlip())
                          : '0.00'}
                        {'%)'}
                      </div>
                    </Col>
                  </Row>
                </Card>
              )}

              {pool.poolDetails && (
                <>
                  <Card className="card-body mb-1">
                    <Row className="mb-2">
                      <Col xs="auto">
                        <span className="text-card">Add</span>
                      </Col>
                      <Col className="text-right">
                        <span className="output-card text-light">
                          {addInput1?.value > 0
                            ? formatFromUnits(addInput1?.value, 6)
                            : '0.00'}{' '}
                          {getToken(assetAdd1.tokenAddress)?.symbol}
                        </span>
                      </Col>
                    </Row>

                    {activeTab === 'addTab1' && (
                      <Row className="mb-2">
                        <Col xs="auto">
                          <span className="text-card">Add</span>
                        </Col>
                        <Col className="text-right">
                          <span className="output-card text-light">
                            {addInput2?.value > 0
                              ? formatFromUnits(addInput2?.value, 6)
                              : '0.00'}{' '}
                            <span className="">SPARTA</span>
                          </span>
                        </Col>
                      </Row>
                    )}

                    {activeTab === 'addTab2' && (
                      <Row className="mb-2">
                        <Col xs="auto" className="title-card">
                          <span className="text-card">Fee</span>
                        </Col>
                        <Col className="text-right">
                          <span className="output-card text-light">
                            {assetAdd1 && getAddSingleSwapFee() > 0
                              ? formatFromWei(getAddSingleSwapFee(), 6)
                              : '0.00'}{' '}
                            <span className="">SPARTA</span>
                          </span>
                        </Col>
                      </Row>
                    )}

                    <Row className="">
                      <Col xs="auto" className="title-card">
                        <span className="subtitle-card">Receive</span>
                      </Col>
                      <Col className="text-right">
                        <span className="subtitle-card">
                          {outputLp > 0 ? formatFromWei(outputLp, 6) : '0.00'}{' '}
                          <span className="output-card ml-1">
                            {getToken(assetAdd1.tokenAddress)?.symbol}p
                          </span>
                        </span>
                      </Col>
                    </Row>
                  </Card>
                </>
              )}
              {!pool.poolDetails && (
                <HelmetLoading height="150px" width="150px" />
              )}
            </Col>
          </Row>
          <Row className="text-center">
            {assetAdd1?.tokenAddress &&
              assetAdd1?.tokenAddress !== addr.bnb &&
              wallet?.account &&
              addInput1?.value && (
                <Approval
                  tokenAddress={assetAdd1?.tokenAddress}
                  symbol={getToken(assetAdd1.tokenAddress)?.symbol}
                  walletAddress={wallet?.account}
                  contractAddress={addr.router}
                  txnAmount={convertToWei(addInput1?.value)}
                  assetNumber="1"
                />
              )}
            <Col xs="12" sm="4" md="12" className="hide-if-siblings">
              <Button
                className="h-100 w-75 btn-primary"
                onClick={() =>
                  activeTab === 'addTab1'
                    ? dispatch(
                        routerAddLiq(
                          convertToWei(addInput2.value),
                          convertToWei(addInput1.value),
                          assetAdd1.tokenAddress,
                        ),
                      )
                    : dispatch(
                        routerAddLiqAsym(
                          convertToWei(addInput1.value),
                          assetAdd1.tokenAddress === addr.sparta,
                          poolAdd1.tokenAddress,
                        ),
                      )
                }
              >
                Join Pool
              </Button>
            </Col>
            {assetAdd2?.tokenAddress &&
              assetAdd2?.tokenAddress !== addr.bnb &&
              wallet?.account &&
              addInput2?.value && (
                <Approval
                  tokenAddress={assetAdd2?.tokenAddress}
                  symbol={getToken(assetAdd2.tokenAddress)?.symbol}
                  walletAddress={wallet?.account}
                  contractAddress={addr.router}
                  txnAmount={convertToWei(addInput2?.value)}
                  assetNumber="2"
                />
              )}
          </Row>
        </Card>
      </Col>
      {pool.poolDetails && (
        <Col xs="auto">
          <SwapPair assetSwap={poolAdd1} />
        </Col>
      )}
    </>
  )
}

export default AddLiquidity

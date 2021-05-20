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
import { useTranslation } from 'react-i18next'
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
import {
  calcLiquidityHoldings,
  calcSwapFee,
  calcSwapOutput,
  calcValueInBase,
} from '../../../utils/web3Utils'
import SwapPair from '../Swap/SwapPair'
import { useWeb3 } from '../../../store/web3'
import {
  routerRemoveLiq,
  routerRemoveLiqAsym,
} from '../../../store/router/actions'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import swapIcon from '../../../assets/icons/swapadd.svg'

const RemoveLiquidity = () => {
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const pool = usePool()
  const addr = getAddresses()
  const wallet = useWallet()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('1')
  const [assetRemove1, setAssetRemove1] = useState('...')
  const [assetRemove2, setAssetRemove2] = useState('...')
  const [poolRemove1, setPoolRemove1] = useState('...')
  const [output1, setoutput1] = useState('0.00')
  const [output2, setoutput2] = useState('0.00')

  const tryParse = (data) => {
    try {
      return JSON.parse(data)
    } catch (e) {
      return pool.poolDetails[0]
    }
  }

  useEffect(() => {
    const { poolDetails } = pool
    const getAssetDetails = () => {
      if (poolDetails.length > 0 && activeTab === '1') {
        window.localStorage.setItem('assetType1', 'pool')
        window.localStorage.setItem('assetType2', 'token')
        window.localStorage.setItem('assetType3', 'token')

        let asset1 = tryParse(window.localStorage.getItem('assetSelected1'))
        let asset2 = tryParse(window.localStorage.getItem('assetSelected2'))
        let asset3 = tryParse(window.localStorage.getItem('assetSelected3'))

        asset1 =
          asset1 &&
          asset1.tokenAddress !== addr.spartav1 &&
          pool.poolDetails.find((x) => x.tokenAddress === asset1.tokenAddress)
            ? asset1
            : { tokenAddress: addr.bnb }
        asset2 =
          asset1.tokenAddress !== addr.spartav1
            ? asset1
            : { tokenAddress: addr.bnb }
        asset3 = { tokenAddress: addr.spartav1 }

        asset1 = getItemFromArray(asset1, pool.poolDetails)
        asset2 = getItemFromArray(asset2, pool.poolDetails)
        asset3 = getItemFromArray(asset3, pool.poolDetails)

        setPoolRemove1(asset1)
        setAssetRemove1(asset2)
        setAssetRemove2(asset3)

        window.localStorage.setItem('assetSelected1', JSON.stringify(asset1))
        window.localStorage.setItem('assetSelected2', JSON.stringify(asset2))
        window.localStorage.setItem('assetSelected3', JSON.stringify(asset3))
      } else if (poolDetails && activeTab === '2') {
        window.localStorage.setItem('assetType1', 'pool')
        window.localStorage.setItem('assetType2', 'token')

        let asset1 = tryParse(window.localStorage.getItem('assetSelected1'))
        let asset2 = tryParse(window.localStorage.getItem('assetSelected2'))

        asset1 =
          asset1 &&
          asset1.tokenAddress !== addr.spartav1 &&
          pool.poolDetails.find((x) => x.tokenAddress === asset1.tokenAddress)
            ? asset1
            : { tokenAddress: addr.bnb }
        asset2 = pool.poolDetails.find(
          (x) => x.tokenAddress === asset2.tokenAddress,
        )
          ? asset2
          : { tokenAddress: addr.spartav1 }
        asset2 =
          asset2.tokenAddress === asset1.tokenAddress ||
          asset2.tokenAddress === addr.spartav1
            ? asset2
            : { tokenAddress: addr.spartav1 }

        asset1 = getItemFromArray(asset1, pool.poolDetails)
        asset2 = getItemFromArray(asset2, pool.poolDetails)

        setPoolRemove1(asset1)
        setAssetRemove1(asset2)

        window.localStorage.setItem('assetSelected1', JSON.stringify(asset1))
        window.localStorage.setItem('assetSelected2', JSON.stringify(asset2))
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

  const removeInput1 = document.getElementById('removeInput1')
  const removeInput2 = document.getElementById('removeInput2')
  // const removeInput3 = document.getElementById('removeInput3')

  const clearInputs = (focusAfter) => {
    if (removeInput1) {
      removeInput1.value = ''
    }
    if (removeInput2) {
      removeInput2.value = ''
    }
    // if (removeInput3) {
    //   removeInput3.value = ''
    // }
    if (focusAfter === 1) {
      removeInput1.focus()
    }
    if (focusAfter === 2) {
      removeInput2.focus()
    }
  }

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
    clearInputs(1)
  }

  const getBalance = (asset) => {
    if (asset === 1) {
      return poolRemove1?.balance
    }
    if (asset === 2) {
      return getToken(assetRemove1?.tokenAddress)?.balance
    }
    if (asset === 3) {
      return getToken(assetRemove2?.tokenAddress)?.balance
    }
    return poolRemove1?.balance
  }

  //= =================================================================================//
  // 'Remove Both' Functions (Re-Factor to just getOutput)

  const getRemoveTokenOutput = () => {
    if (removeInput1 && poolRemove1) {
      return calcLiquidityHoldings(
        poolRemove1?.tokenAmount,
        convertToWei(removeInput1?.value),
        poolRemove1?.poolUnits,
      )
    }
    return '0.00'
  }

  const getRemoveSpartaOutput = () => {
    if (removeInput1 && poolRemove1) {
      return calcLiquidityHoldings(
        poolRemove1?.baseAmount,
        convertToWei(removeInput1?.value),
        poolRemove1?.poolUnits,
      )
    }
    return '0.00'
  }

  //= =================================================================================//
  // 'Remove Single' Functions (Re-Factor)

  const getRemoveOneSwapFee = () => {
    if (removeInput1 && assetRemove1) {
      const swapFee = calcSwapFee(
        assetRemove1?.tokenAddress === addr.spartav1
          ? getRemoveTokenOutput()
          : getRemoveSpartaOutput(),
        BN(poolRemove1?.tokenAmount).minus(getRemoveTokenOutput()),
        BN(poolRemove1?.baseAmount).minus(getRemoveSpartaOutput()),
        assetRemove1?.tokenAddress === addr.spartav1,
      )
      return swapFee
    }
    return '0.00'
  }

  const getRemoveOneSwapOutput = () => {
    if (removeInput1 && assetRemove1) {
      return calcSwapOutput(
        assetRemove1?.tokenAddress === addr.spartav1
          ? getRemoveTokenOutput()
          : getRemoveSpartaOutput(),
        BN(poolRemove1?.tokenAmount).minus(getRemoveTokenOutput()),
        BN(poolRemove1?.baseAmount).minus(getRemoveSpartaOutput()),
        assetRemove1?.tokenAddress === addr.spartav1,
      )
    }
    return '0.00'
  }

  const getRemoveOneFinalOutput = () => {
    if (removeInput1 && assetRemove1) {
      const result = BN(getRemoveOneSwapOutput()).plus(
        assetRemove1?.tokenAddress === addr.spartav1
          ? BN(getRemoveSpartaOutput())
          : BN(getRemoveTokenOutput()),
      )
      return result
    }
    return '0.00'
  }

  //= =================================================================================//
  // General Functions

  const getOutput1ValueUSD = () => {
    if (assetRemove1 && output1) {
      return calcValueInBase(
        poolRemove1.tokenAmount,
        poolRemove1.baseAmount,
        output1,
      ).times(web3.spartaPrice)
    }
    return '0.00'
  }

  // const getOutput2ValueUSD = () => {
  //   if (assetRemove2 && removeInput3?.value) {
  //     return BN(convertToWei(removeInput3.value)).times(web3.spartaPrice)
  //   }
  //   return '0.00'
  // }

  const getLpValueBase = () => {
    if (assetRemove1 && removeInput1?.value) {
      return calcLiquidityHoldings(
        poolRemove1.baseAmount,
        convertToWei(removeInput1.value),
        poolRemove1.poolUnits,
      )
    }
    return '0.00'
  }

  const getLpValueToken = () => {
    if (assetRemove1 && removeInput1?.value) {
      return calcLiquidityHoldings(
        poolRemove1.tokenAmount,
        convertToWei(removeInput1.value),
        poolRemove1.poolUnits,
      )
    }
    return '0.00'
  }

  const getLpValueUSD = () => {
    if (assetRemove1 && removeInput1?.value) {
      return BN(
        calcValueInBase(
          poolRemove1?.tokenAmount,
          poolRemove1?.baseAmount,
          getLpValueToken(),
        ),
      )
        .plus(getLpValueBase())
        .times(web3.spartaPrice)
    }

    return '0.00'
  }

  const handleInputChange = () => {
    if (activeTab === '1') {
      if (removeInput1?.value) {
        setoutput1(getRemoveTokenOutput())
        setoutput2(getRemoveSpartaOutput())
      }
    }
    if (activeTab === '2') {
      if (removeInput1?.value && document.getElementById('removeInput2')) {
        document.getElementById('removeInput2').value = convertFromWei(
          getRemoveOneFinalOutput(),
        )
        setoutput1(getRemoveOneFinalOutput())
      }
    }
  }

  const handleTokenInputChange = (e) => {
    e.currentTarget.value = e.currentTarget.value
      .replace(/[^0-9.]/g, '')
      .replace(/(\..*?)\..*/g, '$1')
  }

  useEffect(() => {
    handleInputChange()
  }, [removeInput1?.value, assetRemove1, assetRemove2, poolRemove1, activeTab])

  return (
    <>
      <Col xs="auto">
        <Card className="card-body card-480">
          <Nav pills className="nav-tabs-custom mt-2 mb-4">
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '1' })}
                onClick={() => {
                  toggle('1')
                }}
              >
                {t('removeBoth')}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '2' })}
                onClick={() => {
                  toggle('2')
                }}
              >
                {t('removeSingle')}
              </NavLink>
            </NavItem>
          </Nav>
          <Row>
            <Col xs="12" className="px-1 px-sm-3">
              <Card
                style={{ backgroundColor: '#25212D' }}
                className="card-body mb-1 card-inside"
              >
                <Row>
                  <Col xs="4">
                    <div className="text-sm-label">{t('redeem')}</div>
                  </Col>
                  <Col xs="8" className="text-right">
                    <div
                      className="text-sm-label"
                      role="button"
                      aria-hidden="true"
                      onClick={() => {
                        clearInputs(1)
                        removeInput1.value = convertFromWei(getBalance(1))
                      }}
                    >
                      {t('balance')}:{' '}
                      {pool.poolDetails && formatFromWei(getBalance(1))}
                    </div>
                  </Col>
                </Row>

                <Row className="my-2">
                  <Col xs="auto" className="ml-1">
                    <AssetSelect priority="1" filter={['pool']} />
                  </Col>
                  <Col className="text-right">
                    <InputGroup className="m-0 mt-n1">
                      <Input
                        className="text-right ml-0 p-2"
                        type="text"
                        placeholder={`${t('redeem')}...`}
                        id="removeInput1"
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
                      {removeInput1?.value
                        ? formatFromWei(getLpValueUSD(), 2)
                        : '0.00'}
                    </div>
                  </Col>
                </Row>
              </Card>

              <Row style={{ height: '1px' }}>
                {activeTab === '2' && (
                  <img
                    src={swapIcon}
                    alt="swapaddicon"
                    className="mx-auto z-index position-relative"
                    style={{ height: '35px', top: '-19px' }}
                  />
                )}
              </Row>

              {activeTab === '2' && (
                <Card
                  style={{ backgroundColor: '#25212D' }}
                  className="card-body mb-0 card-inside"
                >
                  <Row>
                    <Col xs="4">
                      <div className="text-sm-label">{t('receive')}</div>
                    </Col>
                    <Col xs="8" className="text-right">
                      <div className="text-sm-label">
                        {t('balance')}:{' '}
                        {pool.tokenDetails && formatFromWei(getBalance(2))}
                      </div>
                    </Col>
                  </Row>

                  <Row className="my-2">
                    <Col xs="auto" className="ml-1">
                      <AssetSelect
                        priority="2"
                        filter={['token']}
                        blackList={[activeTab === '1' ? addr.spartav1 : '']}
                        whiteList={
                          activeTab === '2'
                            ? [addr.spartav1, poolRemove1.tokenAddress]
                            : ['']
                        }
                        disabled={activeTab === '1'}
                      />
                    </Col>
                    <Col className="text-right">
                      <InputGroup className="m-0 mt-n1">
                        <Input
                          className="text-right ml-0 p-2"
                          type="text"
                          placeholder={`${t('receive')}...`}
                          id="removeInput2"
                          disabled
                        />
                      </InputGroup>
                      <div className="text-right text-sm-label">
                        ~$
                        {removeInput2?.value
                          ? formatFromWei(getOutput1ValueUSD(), 2)
                          : '0.00'}
                      </div>
                    </Col>
                  </Row>
                </Card>
              )}

              {/* {activeTab === '1' && (
                  <>
                    <hr className="m-1" />
                    <Row className="my-2">
                      <Col xs="4" className="">
                        <div className="">Output</div>
                      </Col>
                      <Col xs="8" className="text-right">
                        <div className="">
                          Balance:{' '}
                          {pool.tokenDetails && formatFromWei(getBalance(3))}
                        </div>
                      </Col>
                    </Row>
                    <Row className="">
                      <Col xs="6">
                        <div className="output-card ml-2">
                          <AssetSelect
                            priority="3"
                            filter={['token']}
                            whiteList={[addr.spartav1]}
                            disabled
                          />
                        </div>
                      </Col>
                      <Col className="text-right" xs="6">
                        <InputGroup className="">
                          <Input
                            className="text-right ml-0 p-2"
                            type="text"
                            placeholder="0.00"
                            id="removeInput3"
                            disabled
                          />
                        </InputGroup>
                        <div className="text-right">
                          ~$
                          {removeInput3?.value
                            ? formatFromWei(getOutput2ValueUSD(), 2)
                            : '0.00'}
                        </div>
                      </Col>
                    </Row>
                  </>
                )} */}

              {pool.poolDetails && (
                <>
                  <div className="card-body">
                    <Row className="my-2">
                      <Col xs="auto">
                        <div className="text-card">{t('redeem')}</div>
                      </Col>
                      <Col className="text-right">
                        <div className="output-card text-light">
                          {removeInput1?.value > 0
                            ? formatFromUnits(removeInput1?.value, 6)
                            : '0.00'}{' '}
                          {getToken(poolRemove1?.tokenAddress)?.symbol}p
                        </div>
                      </Col>
                    </Row>

                    {activeTab === '2' && (
                      <Row className="mb-2">
                        <Col xs="4" className="">
                          <div className="text-card">{t('fee')}</div>
                        </Col>
                        <Col xs="8" className="text-right">
                          <div className="output-card text-light">
                            {getRemoveOneSwapFee() > 0
                              ? formatFromWei(getRemoveOneSwapFee(), 6)
                              : '0.00'}{' '}
                            SPARTA
                          </div>
                        </Col>
                      </Row>
                    )}

                    <Row className="mb-2">
                      <Col xs="auto">
                        <div className="subtitle-card">{t('receive')}</div>
                        {activeTab === '1' && (
                          <div className="subtitle-card">{t('receive')}</div>
                        )}
                      </Col>
                      <Col className="text-right">
                        <span className="subtitle-card">
                          {output1 > 0 ? formatFromWei(output1, 6) : '0.00'}{' '}
                          <span className="output-card ml-1">
                            {getToken(poolRemove1?.tokenAddress)?.symbol}p
                          </span>
                        </span>
                        {activeTab === '1' && (
                          <span className="subtitle-card">
                            <br />
                            {output2 > 0
                              ? formatFromWei(output2, 6)
                              : '0.00'}{' '}
                            <span className="output-card ml-1">SPARTA</span>
                          </span>
                        )}
                      </Col>
                    </Row>
                  </div>
                </>
              )}

              {!pool.poolDetails && (
                <HelmetLoading height="150px" width="150px" />
              )}
            </Col>
          </Row>
          <Row className="text-center">
            <Col>
              <Button
                className="w-100 btn-primary"
                disabled={
                  removeInput1?.value <= 0 ||
                  BN(convertToWei(removeInput1?.value)).isGreaterThan(
                    getBalance(1),
                  )
                }
                onClick={() =>
                  activeTab === '1'
                    ? dispatch(
                        routerRemoveLiq(
                          convertToWei(removeInput1.value),
                          poolRemove1.tokenAddress,
                          wallet,
                        ),
                      )
                    : dispatch(
                        routerRemoveLiqAsym(
                          convertToWei(removeInput1.value),
                          assetRemove1.tokenAddress === addr.spartav1,
                          poolRemove1.tokenAddress,
                          wallet,
                        ),
                      )
                }
              >
                {t('removeLiq')}
              </Button>
            </Col>
          </Row>
        </Card>
      </Col>
      {pool.poolDetails && (
        <Col xs="auto">
          <SwapPair assetSwap={poolRemove1} />
        </Col>
      )}
    </>
  )
}

export default RemoveLiquidity

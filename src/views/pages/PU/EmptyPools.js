/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import {
  Button,
  Card,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  Row,
} from 'reactstrap'
import { useDispatch } from 'react-redux'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useTranslation } from 'react-i18next'
import AssetSelect from '../../../components/AssetSelect/AssetSelect'
import { usePool } from '../../../store/pool'
import { getAddresses } from '../../../utils/web3'
import {
  BN,
  convertFromWei,
  convertToWei,
  formatFromUnits,
  formatFromWei,
} from '../../../utils/bigNumber'
import {
  calcFeeBurn,
  calcLiquidityUnits,
  calcValueInBase,
} from '../../../utils/web3Utils'
import { useWeb3 } from '../../../store/web3'
import { addLiquidity } from '../../../store/router/actions'
import Approval from '../../../components/Approval/Approval'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import plusIcon from '../../../assets/icons/plus.svg'
import { useSparta } from '../../../store/sparta'

const EmptyPools = (selectedAsset) => {
  const { t } = useTranslation()
  const wallet = useWallet()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const pool = usePool()
  const addr = getAddresses()
  const sparta = useSparta()
  const [assetAdd1, setAssetAdd1] = useState('...')
  const [assetAdd2, setAssetAdd2] = useState('...')
  const [poolAdd1, setPoolAdd1] = useState('...')
  const [outputLp, setOutputLp] = useState('0.00')

  const getPool = (tokenAddress) =>
    pool.poolDetails.filter((i) => i.tokenAddress === tokenAddress)[0]

  useEffect(() => {
    const { poolDetails } = pool
    const getAssetDetails = () => {
      if (poolDetails.length > 0) {
        window.localStorage.setItem('assetType1', 'token')
        window.localStorage.setItem('assetType2', 'token')
        window.localStorage.setItem('assetType3', 'pool')

        const asset1 = getPool(selectedAsset)
        const asset2 = getPool(addr.spartav2)
        const asset3 = getPool(selectedAsset)

        setAssetAdd1(asset1)
        setAssetAdd2(asset2)
        setPoolAdd1(asset3)

        window.localStorage.setItem('assetSelected1', JSON.stringify(asset1))
        window.localStorage.setItem('assetSelected2', JSON.stringify(asset2))
        window.localStorage.setItem('assetSelected3', JSON.stringify(asset3))
      }
    }

    getAssetDetails()
  }, [
    pool.poolDetails,
    window.localStorage.getItem('assetSelected1'),
    window.localStorage.getItem('assetSelected2'),
    window.localStorage.getItem('assetSelected3'),
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

  const getBalance = (asset) => {
    if (asset === 1) {
      return getToken(assetAdd1?.tokenAddress)?.balance
    }
    if (asset === 2) {
      return getToken(assetAdd2?.tokenAddress)?.balance
    }
    return poolAdd1?.balance
  }

  const getFeeBurn = (_amount) => {
    const burnFee = calcFeeBurn(sparta.globalDetails.feeOnTransfer, _amount)
    return burnFee
  }

  //= =================================================================================//
  // 'Add Both' Functions (Re-Factor)

  const getAddBothOutputLP = () => {
    if (addInput1 && addInput2) {
      return convertFromWei(
        calcLiquidityUnits(
          BN(convertToWei(addInput2?.value)).minus(
            getFeeBurn(convertToWei(addInput2?.value)),
          ),
          convertToWei(addInput1?.value),
          0,
          0,
          0,
        ),
      )
    }
    console.log('fail')
    return '0.00'
  }

  const getInput1ValueUSD = () => {
    if (assetAdd1?.tokenAddress !== addr.spartav2 && addInput1?.value) {
      return calcValueInBase(
        poolAdd1?.tokenAmount,
        poolAdd1?.baseAmount,
        convertToWei(addInput1.value),
      ).times(web3.spartaPrice)
    }
    if (assetAdd1?.tokenAddress === addr.spartav2 && addInput1?.value) {
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

  //= =================================================================================//
  // General Functions

  const handleInputChange = () => {
    setOutputLp(convertToWei(getAddBothOutputLP()))
  }

  const handleTokenInputChange = (e) => {
    e.currentTarget.value = e.currentTarget.value
      .replace(/[^0-9.]/g, '')
      .replace(/(\..*?)\..*/g, '$1')
  }

  useEffect(() => {
    handleInputChange()
  }, [addInput1?.value, addInput2?.value, assetAdd1, assetAdd2, poolAdd1])

  const handleAddLiquidity = () => {
    if (
      assetAdd1?.tokenAddress === addr.bnb ||
      assetAdd1?.tokenAddress === addr.wbnb
    ) {
      const balance = getToken(addr.bnb)?.balance
      if (
        BN(balance)
          .minus(convertToWei(addInput1?.value))
          .isLessThan('5000000000000000')
      ) {
        addInput1.value = convertFromWei(BN(balance).minus('5000000000000000'))
      }
    }

    dispatch(
      addLiquidity(
        convertToWei(addInput2.value),
        convertToWei(addInput1.value),
        assetAdd1.tokenAddress,
        wallet,
      ),
    )
  }

  return (
    <>
      <Col xs="auto">
        <Card xs="auto" className="card-body card-480">
          <Row>
            <Col xs="12" className="px-1 px-sm-3">
              <Card
                style={{ backgroundColor: '#25212D' }}
                className="card-body mb-1 card-inside"
              >
                <Row>
                  <Col xs="4">
                    <div className="text-sm-label">{t('add')}</div>
                  </Col>

                  <Col xs="8" className="text-right">
                    <div
                      className="text-sm-label"
                      role="button"
                      aria-hidden="true"
                      onClick={() => {
                        addInput1.value = convertFromWei(getBalance(1))
                      }}
                    >
                      {t('balance')}:{' '}
                      {pool.poolDetails && formatFromWei(getBalance(1))}{' '}
                    </div>
                  </Col>
                </Row>

                <Row className="my-2">
                  <Col xs="auto" className="ml-1">
                    <AssetSelect
                      priority="1"
                      filter={['token']}
                      whiteList={[assetAdd1]}
                      disabled
                      empty
                    />
                  </Col>
                  <Col className="text-right">
                    <InputGroup className="m-0 mt-n1">
                      <Input
                        className="text-right ml-0 p-2"
                        type="text"
                        placeholder={`${t('add')}...`}
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

              <Row style={{ height: '1px' }}>
                <img
                  src={plusIcon}
                  alt="plusicon"
                  className="mx-auto z-index position-relative"
                  style={{ height: '35px', top: '-19px' }}
                />
              </Row>

              <Card
                style={{ backgroundColor: '#25212D' }}
                className="card-body mb-1 card-inside"
              >
                <Row className="my-2">
                  <Col xs="4" className="">
                    <div className="text-sm-label">{t('add')}</div>
                  </Col>
                  <Col xs="8" className="text-right">
                    <div
                      className="text-sm-label"
                      role="button"
                      aria-hidden="true"
                      onClick={() => {
                        addInput2.focus()
                        addInput2.value = convertFromWei(getBalance(2))
                      }}
                    >
                      {t('balance')}:{' '}
                      {pool.poolDetails && formatFromWei(getBalance(2))}
                    </div>
                  </Col>
                </Row>
                <Row className="">
                  <Col xs="auto" className="ml-1">
                    <AssetSelect
                      priority="2"
                      filter={['token']}
                      whiteList={[addr.spartav2]}
                      disabled
                      empty
                    />
                  </Col>
                  <Col className="text-right">
                    <InputGroup className="m-0">
                      <Input
                        className="text-right ml-0 p-2"
                        type="text"
                        placeholder={`${t('add')}...`}
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

              {pool.poolDetails && (
                <>
                  <Card className="card-body mb-1">
                    <Row className="mb-2">
                      <Col xs="auto">
                        <span className="text-card">{t('add')}</span>
                      </Col>
                      <Col className="text-right">
                        <span className="output-card text-light">
                          {addInput1?.value > 0
                            ? formatFromUnits(addInput1?.value, 6)
                            : '0.00'}{' '}
                          {getToken(assetAdd1?.tokenAddress)?.symbol}
                        </span>
                      </Col>
                    </Row>

                    <Row className="mb-2">
                      <Col xs="auto">
                        <span className="text-card">{t('add')}</span>
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

                    <Row className="">
                      <Col xs="auto" className="title-card">
                        <span className="subtitle-card">{t('receive')}</span>
                      </Col>
                      <Col className="text-right">
                        <span className="subtitle-card">
                          {outputLp > 0 ? formatFromWei(outputLp, 6) : '0.00'}{' '}
                          <span className="output-card ml-1">
                            {getToken(assetAdd1?.tokenAddress)?.symbol}p
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
                className="w-100 btn-primary"
                disabled={
                  addInput1?.value <= 0 ||
                  BN(convertToWei(addInput1?.value)).isGreaterThan(
                    getBalance(1),
                  ) ||
                  BN(convertToWei(addInput2?.value)).isGreaterThan(
                    getBalance(2),
                  ) ||
                  poolAdd1?.baseAmount <= 0
                }
                onClick={() => handleAddLiquidity()}
              >
                {t('joinPool')}
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
    </>
  )
}

export default EmptyPools

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import {
  Button,
  Card,
  Col,
  FormControl,
  FormGroup,
  InputGroup,
  Row,
} from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
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
import { useWeb3 } from '../../../store/web3'
import { addLiquidity } from '../../../store/router/actions'
import Approval from '../../../components/Approval/Approval'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import plusIcon from '../../../assets/icons/plus.svg'
import { useSparta } from '../../../store/sparta'
import { Icon } from '../../../components/Icons/icons'
import { calcLiquidityUnits } from '../../../utils/math/utils'
import { minusFeeBurn } from '../../../utils/math/nonContract'

const EmptyPools = (props) => {
  const { t } = useTranslation()
  const wallet = useWeb3React()
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

        const asset1 = getPool(props.selectedAsset)
        const asset2 = getPool(addr.spartav2)
        const asset3 = getPool(props.selectedAsset)

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

  const _minusFeeBurn = (_amount) =>
    minusFeeBurn(sparta.globalDetails.feeOnTransfer, _amount)

  //= =================================================================================//
  // 'Add Both' Functions (Re-Factor)

  const getAddBothOutputLP = () => {
    if (addInput1 && addInput2) {
      const [output, slipRevert] = calcLiquidityUnits(
        _minusFeeBurn(convertToWei(addInput2?.value)),
        convertToWei(addInput1?.value),
        poolAdd1,
      )
      return [output, slipRevert]
    }
    return ['0.00', false]
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
        web3.rpcs,
      ),
    )
  }

  const priceInSparta = () => {
    const price = BN(addInput1?.value).div(addInput2?.value)
    if (price > 10) {
      return formatFromUnits(price, 2)
    }
    if (price > 1) {
      return formatFromUnits(price, 4)
    }
    if (price > 0) {
      return formatFromUnits(price, 6)
    }
    return '0.00'
  }

  const priceInToken = () => {
    const price = BN(addInput2?.value).div(addInput1?.value)
    if (price > 10) {
      return formatFromUnits(price, 2)
    }
    if (price > 1) {
      return formatFromUnits(price, 4)
    }
    if (price > 0) {
      return formatFromUnits(price, 6)
    }
    return '0.00'
  }

  const priceinUSD = () => {
    let price = BN(addInput2?.value).div(addInput1?.value)
    price = price.times(web3.spartaPrice)
    if (price > 10) {
      return formatFromUnits(price, 2)
    }
    if (price > 1) {
      return formatFromUnits(price, 4)
    }
    if (price > 0) {
      return formatFromUnits(price, 6)
    }
    return '0.00'
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
                    <InputGroup className="m-0">
                      <FormControl
                        className="text-right ml-0 p-2"
                        type="text"
                        placeholder={`${t('add')}...`}
                        id="addInput1"
                        autoComplete="off"
                        autoCorrect="off"
                      />
                      <InputGroup.Text
                        role="button"
                        tabIndex={-1}
                        onKeyPress={() => clearInputs(1)}
                        onClick={() => clearInputs(1)}
                      >
                        <Icon icon="close" />
                      </InputGroup.Text>
                    </InputGroup>
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
                      <FormGroup
                        className="text-right ml-0 p-2"
                        type="text"
                        placeholder={`${t('add')}...`}
                        id="addInput2"
                        autoComplete="off"
                        autoCorrect="off"
                      />
                      <InputGroup.Text
                        role="button"
                        tabIndex={-1}
                        onKeyPress={() => clearInputs(2)}
                        onClick={() => clearInputs(2)}
                      >
                        <Icon icon="close" />
                      </InputGroup.Text>
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
                        <span className="output-card">
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
                        <span className="output-card">
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
                  addInput2?.value <= 0 ||
                  BN(convertToWei(addInput1?.value)).isGreaterThan(
                    getBalance(1),
                  ) ||
                  BN(convertToWei(addInput2?.value)).isGreaterThan(
                    getBalance(2),
                  )
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
      <Col xs="auto">
        <Card className="card-body card-480">
          <Row>
            <Col xs="auto">
              <div className="text-title-small">Proposed Ratios</div>
              <div className="output-card my-2">
                Based on your inputs; the initial internal pricing as below.
                Ensure you are 100% certain your proposed ratio of SPARTA:
                {getToken(poolAdd1.tokenAddress)?.symbol} matches the other
                available markets to avoid creating a large arbitrage
                opportunity and getting rekt!
              </div>
            </Col>
          </Row>
          <Row className="mb-1 mt-3">
            <Col xs="auto">
              <div className="output-card">
                <img
                  className="mr-2"
                  src={getToken(poolAdd1.tokenAddress)?.symbolUrl}
                  alt="Logo"
                  height="32"
                />
                {getToken(poolAdd1.tokenAddress)?.symbol}
              </div>
            </Col>
            <Col className="output-card text-right">${priceinUSD()}</Col>
          </Row>

          <Row className="my-2">
            <Col xs="auto">
              <div className="output-card">
                <Icon icon="sparta" className="mr-2" size="32" />
                SPARTA
              </div>
            </Col>
            <Col className="output-card text-right">${web3?.spartaPrice}</Col>
          </Row>

          <Row className="my-2">
            <Col xs="auto" className="text-card">
              {t('spotPrice')}
            </Col>
            <Col className="output-card text-right">
              {priceInToken()} SPARTA
            </Col>
          </Row>

          <Row className="my-2">
            <Col xs="auto" className="text-card">
              {t('spotPrice')}
            </Col>
            <Col className="output-card text-right">
              {priceInSparta()} {getToken(poolAdd1.tokenAddress)?.symbol}
            </Col>
          </Row>

          <Row className="my-2">
            <Col xs="auto" className="text-card">
              {t('depth')}
            </Col>
            <Col className="output-card text-right">
              {formatFromUnits(addInput1?.value, 4)}{' '}
              {getToken(poolAdd1?.tokenAddress)?.symbol} <br />
              {formatFromUnits(addInput2?.value, 4)} SPARTA
            </Col>
          </Row>
        </Card>
      </Col>
    </>
  )
}

export default EmptyPools

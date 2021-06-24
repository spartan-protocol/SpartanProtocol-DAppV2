/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  Col,
  Row,
  Card,
  InputGroup,
  FormControl,
  Button,
  OverlayTrigger,
  ProgressBar,
} from 'react-bootstrap'
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
  calcFeeBurn,
  calcLiquidityUnits,
  calcSwapOutput,
  calcValueInBase,
} from '../../../utils/web3Utils'
import Approval from '../../../components/Approval/Approval'
import { bondDeposit, allListedAssets } from '../../../store/bond/actions'
import SwapPair from '../Swap/SwapPair'
import { useWeb3 } from '../../../store/web3'
import { useSparta } from '../../../store/sparta'
import { Tooltip } from '../../../components/Tooltip/tooltip'
import { Icon } from '../../../components/Icons/icons'

const LiqBond = () => {
  const { t } = useTranslation()
  const web3 = useWeb3()
  const wallet = useWallet()
  const bond = useBond()
  const dispatch = useDispatch()
  const pool = usePool()
  const sparta = useSparta()
  const addr = getAddresses()
  const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  const [assetBond1, setAssetBond1] = useState('...')

  const spartaRemainingLoop = async () => {
    dispatch(allListedAssets(wallet))
    await pause(10000)
    spartaRemainingLoop()
  }

  useEffect(() => {
    spartaRemainingLoop()
  }, [])

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
      if (poolDetails) {
        window.localStorage.setItem('assetType1', 'token')
        let asset1 = tryParse(window.localStorage.getItem('assetSelected1'))
        asset1 =
          asset1 &&
          asset1.tokenAddress !== addr.spartav2 &&
          bond.listedAssets.includes(asset1.tokenAddress)
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

  const getFeeBurn = (_amount) => {
    const burnFee = calcFeeBurn(sparta.globalDetails.feeOnTransfer, _amount)
    return burnFee
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
        BN(calcSpartaMinted()).minus(getFeeBurn(calcSpartaMinted())),
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

  const handleTokenInputChange = (e) => {
    e.currentTarget.value = e.currentTarget.value
      .replace(/[^0-9.]/g, '')
      .replace(/(\..*?)\..*/g, '$1')
  }

  const handleBondDeposit = () => {
    if (
      assetBond1?.tokenAddress === addr.bnb ||
      assetBond1?.tokenAddress === addr.wbnb
    ) {
      const balance = getToken(addr.bnb)?.balance
      if (
        BN(balance)
          .minus(convertToWei(bondInput1?.value))
          .isLessThan('5000000000000000')
      ) {
        bondInput1.value = convertFromWei(BN(balance).minus('5000000000000000'))
      }
    }
    dispatch(
      bondDeposit(
        assetBond1?.tokenAddress,
        convertToWei(bondInput1?.value),
        wallet,
      ),
    )
  }

  return (
    <Row>
      <Col xs="auto">
        <Card xs="auto" className="card-480">
          <Card.Body>
            <Row>
              <Col xs="12" className="px-1 px-sm-3">
                <Card style={{ backgroundColor: '#25212d' }}>
                  <Card.Body>
                    {bond.listedAssets?.length > 0 ? (
                      <>
                        <Row>
                          <Col className="text-sm-label">{t('bond')}</Col>
                          <Col
                            className="text-sm-label float-end text-end"
                            role="button"
                            aria-hidden="true"
                            onClick={() => {
                              bondInput1.value = convertFromWei(
                                getToken(assetBond1.tokenAddress)?.balance,
                              )
                            }}
                          >
                            {t('balance')}:{' '}
                            {formatFromWei(
                              getToken(assetBond1.tokenAddress)?.balance,
                            )}
                          </Col>
                        </Row>

                        <Row className="my-1">
                          <Col>
                            <InputGroup className="">
                              <InputGroup.Text>
                                <AssetSelect
                                  priority="1"
                                  filter={['token']}
                                  whiteList={bond.listedAssets}
                                />
                              </InputGroup.Text>
                              <FormControl
                                className="text-end ms-0"
                                type="number"
                                placeholder={`${t('add')}...`}
                                id="bondInput1"
                                autoComplete="off"
                                autoCorrect="off"
                                onInput={(e) => handleTokenInputChange(e)}
                              />
                              <InputGroup.Text
                                role="button"
                                tabIndex={-1}
                                onKeyPress={() => clearInputs()}
                                onClick={() => clearInputs()}
                              >
                                <Icon icon="close" size="12" fill="grey" />
                              </InputGroup.Text>
                            </InputGroup>
                            <div className="text-end text-sm-label pt-1">
                              ~$
                              {bondInput1?.value
                                ? formatFromWei(getInput1ValueUSD(), 2)
                                : '0.00'}
                            </div>
                          </Col>
                        </Row>
                      </>
                    ) : (
                      <div className="output-card">
                        No assets are currently listed for Bond.{' '}
                        <Link to="/dao">Visit the DAO</Link> to propose a new
                        Bond asset.
                      </div>
                    )}
                  </Card.Body>
                </Card>

                <Row className="mb-2 mt-3">
                  <Col xs="auto">
                    <span className="subtitle-card">
                      {t('allocation')}
                      <OverlayTrigger
                        placement="auto"
                        overlay={Tooltip(t, 'bond')}
                      >
                        <span role="button">
                          <Icon
                            icon="info"
                            className="ms-1"
                            size="17"
                            fill="white"
                          />
                        </span>
                      </OverlayTrigger>
                    </span>
                  </Col>
                  <Col className="text-end">
                    <span className="subtitle-card">
                      {formatFromWei(bond.global.spartaRemaining, 0)}{' '}
                      {t('remaining')}
                    </span>
                  </Col>
                </Row>

                <ProgressBar
                  variant="info"
                  className="my-2"
                  now={BN(convertFromWei(bond.global.spartaRemaining))
                    .div(2500000)
                    .times(100)}
                  label={`${formatFromWei(
                    bond.global.spartaRemaining,
                    0,
                  )} SPARTA`}
                />

                {bond.listedAssets?.length > 0 && (
                  <>
                    <Row className="mb-2">
                      <Col xs="auto">
                        <span className="text-card">{t('bond')}</span>
                      </Col>
                      <Col className="text-end">
                        <span className="text-card">
                          {bondInput1?.value > 0
                            ? formatFromUnits(bondInput1?.value, 6)
                            : '0.00'}{' '}
                          {getToken(assetBond1.tokenAddress)?.symbol}
                        </span>
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col xs="auto" className="">
                        <span className="text-card">{t('mint')}</span>
                      </Col>
                      <Col className="text-end">
                        <span className="text-card">
                          {calcSpartaMinted() > 0
                            ? formatFromWei(calcSpartaMinted(), 6)
                            : '0.00'}{' '}
                          SPARTA
                        </span>
                      </Col>
                    </Row>
                    <Row className="">
                      <Col xs="auto" className="title-card">
                        <span className="subtitle-card">{t('lock')}</span>
                      </Col>
                      <Col className="text-end">
                        <span className="subtitle-card">
                          {calcOutput() > 0
                            ? formatFromWei(calcOutput(), 6)
                            : '0.00'}{' '}
                          <span className="output-card">
                            {getToken(assetBond1.tokenAddress)?.symbol}p
                          </span>
                        </span>
                      </Col>
                    </Row>
                  </>
                )}
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer>
            {bond.listedAssets?.length > 0 && (
              <>
                <Row className="text-center">
                  {assetBond1?.tokenAddress &&
                    assetBond1?.tokenAddress !== addr.bnb &&
                    wallet?.account &&
                    bondInput1?.value && (
                      <Approval
                        tokenAddress={assetBond1?.tokenAddress}
                        symbol={getToken(assetBond1.tokenAddress)?.symbol}
                        walletAddress={wallet?.account}
                        contractAddress={addr.dao}
                        txnAmount={convertToWei(bondInput1?.value)}
                        assetNumber="1"
                      />
                    )}

                  <Col xs="12" sm="4" md="12" className="hide-if-siblings">
                    <Button
                      className="w-100"
                      disabled={
                        bondInput1?.value <= 0 ||
                        BN(convertToWei(bondInput1?.value)).isGreaterThan(
                          getToken(assetBond1.tokenAddress)?.balance,
                        ) ||
                        BN(calcSpartaMinted()).isGreaterThan(
                          bond.global.spartaRemaining,
                        )
                      }
                      onClick={() => handleBondDeposit()}
                    >
                      {t('bond')} {getToken(assetBond1.tokenAddress)?.symbol}
                    </Button>
                  </Col>
                </Row>
              </>
            )}
          </Card.Footer>
        </Card>
      </Col>
      {pool.poolDetails && (
        <Col xs="auto">
          <SwapPair assetSwap={assetBond1} />
        </Col>
      )}
    </Row>
  )
}

export default LiqBond

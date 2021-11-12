/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
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
  Badge,
  Popover,
  Form,
} from 'react-bootstrap'
import { useWeb3React } from '@web3-react/core'
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
import Approval from '../../../components/Approval/Approval'
import {
  bondDeposit,
  allListedAssets,
  getBondDetails,
  bondVaultWeight,
} from '../../../store/bond/actions'
import SwapPair from '../Swap/SwapPair'
import { useWeb3 } from '../../../store/web3'
import { useSparta } from '../../../store/sparta'
import { Tooltip } from '../../../components/Tooltip/tooltip'
import { Icon } from '../../../components/Icons/icons'
import NewPool from '../Pools/NewPool'
import Share from '../../../components/Share/SharePool'
import { calcSpotValueInBase } from '../../../utils/math/utils'
import { bondLiq, calcCurrentRewardDao } from '../../../utils/math/dao'
import { useReserve } from '../../../store/reserve'
import HelmetLoading from '../../../components/Loaders/HelmetLoading'
import { getSecsSince } from '../../../utils/math/nonContract'
import {
  daoDepositTimes,
  daoGlobalDetails,
  daoHarvest,
  daoMemberDetails,
  daoVaultWeight,
  getDaoDetails,
} from '../../../store/dao/actions'
import { useDao } from '../../../store/dao/selector'

const LiqBond = () => {
  const isLightMode = window.localStorage.getItem('theme')

  const { t } = useTranslation()
  const web3 = useWeb3()
  const dao = useDao()
  const wallet = useWeb3React()
  const bond = useBond()
  const reserve = useReserve()
  const dispatch = useDispatch()
  const pool = usePool()
  const sparta = useSparta()
  const addr = getAddresses()
  const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const [showWalletWarning1, setShowWalletWarning1] = useState(false)
  const [txnLoading, setTxnLoading] = useState(false)
  const [assetBond1, setAssetBond1] = useState('...')
  const [harvestLoading, setHarvestLoading] = useState(false)
  const [harvestConfirm, setHarvestConfirm] = useState(false)
  const [trigger0, settrigger0] = useState(0)

  const getWhiteList = () => {
    const whiteList = []
    for (let i = 0; i < bond.listedAssets.length; i++) {
      whiteList.push(
        pool.poolDetails.filter((x) => x.address === bond.listedAssets[i])[0]
          .tokenAddress,
      )
    }
    return whiteList
  }

  const isLoading = () => {
    if (assetBond1 && pool.poolDetails && bond.listedAssets) {
      return false
    }
    return true
  }

  const spartaRemainingLoop = async () => {
    dispatch(allListedAssets(web3.rpcs))
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

  const getData = () => {
    dispatch(daoGlobalDetails(web3.rpcs))
    dispatch(daoMemberDetails(wallet, web3.rpcs))
  }

  useEffect(() => {
    if (trigger0 === 0) {
      getData()
    }
    const timer = setTimeout(() => {
      getData()
      settrigger0(trigger0 + 1)
    }, 7500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger0])

  useEffect(() => {
    const checkDetails = () => {
      if (pool.listedPools?.length > 1) {
        dispatch(getDaoDetails(pool.listedPools, wallet, web3.rpcs))
        dispatch(getBondDetails(pool.listedPools, wallet, web3.rpcs))
      }
    }
    checkDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.listedPools])

  useEffect(() => {
    const checkWeight = () => {
      if (pool.poolDetails?.length > 1) {
        dispatch(daoVaultWeight(pool.poolDetails, web3.rpcs))
        dispatch(bondVaultWeight(pool.poolDetails, web3.rpcs))
      }
    }
    checkWeight()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.poolDetails])

  useEffect(() => {
    const checkWeight = () => {
      if (dao.daoDetails?.length > 1) {
        dispatch(daoDepositTimes(dao.daoDetails, wallet, web3.rpcs))
      }
    }
    checkWeight()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dao.daoDetails])

  useEffect(() => {
    const getAssetDetails = () => {
      if (!isLoading()) {
        window.localStorage.setItem('assetType1', 'token')
        let asset1 = tryParse(window.localStorage.getItem('assetSelected1'))
        asset1 =
          asset1 &&
          asset1.address !== '' &&
          bond.listedAssets.includes(asset1.address)
            ? asset1
            : { tokenAddress: addr.bnb }
        asset1 = getItemFromArray(asset1, pool.poolDetails)
        setAssetBond1(asset1)
        window.localStorage.setItem('assetSelected1', JSON.stringify(asset1))
      }
    }
    getAssetDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    bond.listedAssets,
    pool.poolDetails,
    window.localStorage.getItem('assetSelected1'),
  ])

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  const bondInput1 = document.getElementById('bondInput1')

  const clearInputs = () => {
    if (bondInput1) {
      bondInput1.value = ''
      bondInput1.focus()
    }
  }

  const getBondLiq = () => {
    if (bondInput1) {
      const [unitsLP, bondedSparta, slipRevert, capRevert] = bondLiq(
        convertToWei(bondInput1.value),
        assetBond1,
        sparta.globalDetails.feeOnTransfer,
      )
      return [unitsLP, bondedSparta, slipRevert, capRevert]
    }
    return ['0', '0', false, false]
  }

  const getInput1ValueUSD = () => {
    if (assetBond1 && bondInput1?.value) {
      return calcSpotValueInBase(
        convertToWei(bondInput1.value),
        assetBond1,
      ).times(web3.spartaPrice)
    }
    return '0'
  }

  const handleBondDeposit = async () => {
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
    setTxnLoading(true)
    await dispatch(
      bondDeposit(
        assetBond1?.tokenAddress,
        convertToWei(bondInput1?.value),
        wallet,
        web3.rpcs,
      ),
    )
    setTxnLoading(false)
    clearInputs()
  }

  // ~*CHECK* BNB gas (bond) on TN || ~*CHECK* BNB on MN
  const estMaxGas = '5000000000000000'
  const enoughGas = () => {
    const bal = getToken(addr.bnb).balance
    if (BN(bal).isLessThan(estMaxGas)) {
      return false
    }
    return true
  }

  const secsSinceHarvest = () => {
    if (dao.member.lastHarvest) {
      return getSecsSince(dao.member.lastHarvest)
    }
    return '0'
  }

  const handleHarvest = async () => {
    setHarvestLoading(true)
    await dispatch(daoHarvest(wallet, web3.rpcs))
    setHarvestLoading(false)
    dispatch(daoMemberDetails(wallet, web3.rpcs))
  }

  const getClaimable = () => {
    const reward = calcCurrentRewardDao(
      pool.poolDetails,
      bond,
      dao,
      sparta.globalDetails.secondsPerEra,
      reserve.globalDetails.spartaBalance,
    )
    if (reward > 0) {
      return reward
    }
    return '0.00'
  }

  const checkValid = () => {
    if (!wallet.account) {
      return [false, t('checkWallet')]
    }
    if (reserve.globalDetails.globalFreeze) {
      return [false, t('globalFreeze')]
    }
    if (bondInput1?.value <= 0) {
      return [false, t('checkInput')]
    }
    if (!enoughGas()) {
      return [false, t('checkBnbGas')]
    }
    if (
      BN(convertToWei(bondInput1?.value)).isGreaterThan(
        getToken(assetBond1.tokenAddress)?.balance,
      )
    ) {
      return [false, t('checkBalance')]
    }
    if (BN(getBondLiq()[1]).isGreaterThan(bond.global.spartaRemaining)) {
      return [false, t('checkAllocation')]
    }
    if (getBondLiq()[2]) {
      return [false, t('slipTooHigh')]
    }
    if (getBondLiq()[3]) {
      return [false, t('poolAtCapacity')]
    }
    if (
      dao.member.lastHarvest > 0 &&
      secsSinceHarvest() > 300 &&
      getClaimable() > 0
    ) {
      if (!harvestConfirm) {
        return [false, t('confirmHarvest')]
      }
    }
    return [true, `${t('bond')} ${getToken(assetBond1.tokenAddress)?.symbol}`]
  }

  const checkWallet = () => {
    if (!wallet.account) {
      setShowWalletWarning1(!showWalletWarning1)
    }
  }

  const getRemainPC = () =>
    BN(convertFromWei(bond.global.spartaRemaining)).div(2000000).times(100)

  return (
    <Row>
      <Col xs="auto">
        <Card xs="auto" className="card-480">
          <Card.Header className="">
            <Row className="px-2 py-2">
              <Col xs="auto">
                {t('bond')}
                <Share />
              </Col>
              <Col className="text-end">
                <NewPool />
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col xs="12" className="px-1 px-sm-3">
                <Card className="card-alt">
                  <Card.Body>
                    {!isLoading() ? (
                      bond.listedAssets.length > 0 && (
                        <>
                          <Row>
                            <Col xs="auto" className="text-sm-label">
                              {t('bond')}
                            </Col>
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
                              <Badge bg="primary" className="me-1">
                                MAX
                              </Badge>
                              {t('balance')}:{' '}
                              <OverlayTrigger
                                placement="auto"
                                overlay={Tooltip(
                                  t,
                                  formatFromWei(
                                    getToken(assetBond1.tokenAddress)?.balance,
                                    18,
                                  ),
                                )}
                              >
                                <span role="button">
                                  {formatFromWei(
                                    getToken(assetBond1.tokenAddress)?.balance,
                                  )}
                                </span>
                              </OverlayTrigger>
                            </Col>
                          </Row>

                          <Row className="my-1">
                            <Col>
                              <InputGroup className="">
                                <InputGroup.Text>
                                  <AssetSelect
                                    priority="1"
                                    filter={['token']}
                                    whiteList={getWhiteList()}
                                  />
                                </InputGroup.Text>
                                <OverlayTrigger
                                  placement="auto"
                                  onToggle={() => checkWallet()}
                                  show={showWalletWarning1}
                                  trigger={['focus']}
                                  overlay={
                                    <Popover>
                                      <Popover.Header />
                                      <Popover.Body>
                                        {t('connectWalletFirst')}
                                      </Popover.Body>
                                    </Popover>
                                  }
                                >
                                  <FormControl
                                    className="text-end ms-0"
                                    type="number"
                                    min="0"
                                    placeholder={`${t('add')}...`}
                                    id="bondInput1"
                                    autoComplete="off"
                                    autoCorrect="off"
                                  />
                                </OverlayTrigger>
                                <InputGroup.Text
                                  role="button"
                                  tabIndex={-1}
                                  onKeyPress={() => clearInputs()}
                                  onClick={() => clearInputs()}
                                >
                                  <Icon icon="close" size="10" fill="grey" />
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
                      )
                    ) : (
                      <HelmetLoading height="150px" width="150px" />
                    )}
                    {bond.listedAssets.length <= 0 && (
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
                            fill={isLightMode ? 'black' : 'white'}
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

                <ProgressBar className="my-2" style={{ height: '20px' }}>
                  <ProgressBar
                    variant="info"
                    key={1}
                    now={getRemainPC()}
                    label={
                      getRemainPC() > 50 &&
                      `${formatFromWei(bond.global.spartaRemaining, 0)} SPARTA`
                    }
                  />
                  <ProgressBar
                    variant="black"
                    key={2}
                    now={BN(100).minus(getRemainPC())}
                    label={
                      getRemainPC() <= 50 &&
                      `${formatFromWei(bond.global.spartaRemaining, 0)} SPARTA`
                    }
                  />
                </ProgressBar>

                {!isLoading() && (
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
                          ~
                          {getBondLiq()[1] > 0
                            ? formatFromWei(getBondLiq()[1], 6)
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
                          ~
                          {getBondLiq()[0] > 0
                            ? formatFromWei(getBondLiq()[0], 6)
                            : '0.00'}{' '}
                          <span className="output-card">
                            {getToken(assetBond1.tokenAddress)?.symbol}p
                          </span>
                        </span>
                      </Col>
                    </Row>
                    {secsSinceHarvest() > 300 && dao.member.lastHarvest > 0 && (
                      <>
                        <hr />
                        <Row xs="12" className="my-2">
                          <Col xs="12" className="output-card">
                            Your existing harvest timer will be reset, harvest
                            before this deposit to avoid forfeiting any
                            accumulated rewards:
                          </Col>
                        </Row>
                        <Row xs="12" className="">
                          <Col xs="auto" className="text-card">
                            Harvest forfeiting
                          </Col>
                          <Col className="text-end output-card">
                            {formatFromWei(getClaimable())} SPARTA
                          </Col>
                        </Row>
                        <Form className="my-2 text-center">
                          <span className="output-card">
                            Confirm harvest time reset
                            <Form.Check
                              type="switch"
                              id="confirmHarvest"
                              className="ms-2 d-inline-flex"
                              checked={harvestConfirm}
                              onChange={() =>
                                setHarvestConfirm(!harvestConfirm)
                              }
                            />
                          </span>
                        </Form>
                      </>
                    )}
                  </>
                )}
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer>
            {!isLoading() && (
              <>
                <Row className="text-center w-100 m-0">
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

                  <Col xs="12" className="hide-if-prior-sibling">
                    <Row>
                      {getClaimable() > 0 &&
                        secsSinceHarvest() > 300 &&
                        dao.member.lastHarvest > 0 && (
                          <Col>
                            <Button
                              className="w-100"
                              onClick={() => handleHarvest()}
                              disabled={
                                getClaimable() <= 0 ||
                                !enoughGas() ||
                                reserve.globalDetails.globalFreeze
                              }
                            >
                              {enoughGas()
                                ? reserve.globalDetails.globalFreeze
                                  ? t('globalFreeze')
                                  : t('harvest')
                                : t('checkBnbGas')}
                              {harvestLoading && (
                                <Icon
                                  icon="cycle"
                                  size="20"
                                  className="anim-spin ms-1"
                                />
                              )}
                            </Button>
                          </Col>
                        )}
                      {bond.listedAssets.length > 0 && (
                        <Col>
                          <Button
                            className="w-100"
                            disabled={!checkValid()[0]}
                            onClick={() => handleBondDeposit()}
                          >
                            {checkValid()[1]}
                            {txnLoading && (
                              <Icon
                                icon="cycle"
                                size="20"
                                className="anim-spin ms-1"
                              />
                            )}
                          </Button>
                        </Col>
                      )}
                    </Row>
                  </Col>
                </Row>
              </>
            )}
          </Card.Footer>
        </Card>
      </Col>
      {!isLoading() && (
        <Col xs="auto">
          <SwapPair assetSwap={assetBond1} />
        </Col>
      )}
    </Row>
  )
}

export default LiqBond

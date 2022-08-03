import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row'
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { useWeb3React } from '@web3-react/core'
import AssetSelect from '../../components/AssetSelect/index'
import { usePool } from '../../store/pool'
import { formatShortString, oneWeek } from '../../utils/web3'
import {
  BN,
  convertFromWei,
  convertToWei,
  formatFromUnits,
  formatFromWei,
} from '../../utils/bigNumber'
import { useWeb3 } from '../../store/web3'
import { addLiquidity, addLiquiditySingle } from '../../store/router'
import Approval from '../../components/Approval/index'
import HelmetLoading from '../../components/Spinner/index'
import { useSparta } from '../../store/sparta'
import { Icon } from '../../components/Icons/index'
import {
  calcLiqValue,
  calcSpotValueInBase,
  calcSpotValueInToken,
  getPool,
  getToken,
} from '../../utils/math/utils'
import { getTimeUntil } from '../../utils/math/nonContract'
import { addLiq, addLiqAsym } from '../../utils/math/router'
import { Tooltip } from '../../components/Tooltip/index'
import ShareLink from '../../components/Share/ShareLink'
import { getExplorerContract } from '../../utils/extCalls'
import { useFocus } from '../../providers/Focus'
import { appAsset, useApp } from '../../store/app'

const LiqAdd = ({ assetLiq1, assetLiq2, selectedPool }) => {
  const dispatch = useDispatch()
  const focus = useFocus()
  const location = useLocation()
  const { t } = useTranslation()
  const wallet = useWeb3React()

  const { addresses, asset1, asset2, asset3 } = useApp()
  const pool = usePool()
  const sparta = useSparta()
  const web3 = useWeb3()

  const [showWalletWarning1, setShowWalletWarning1] = useState(false)
  const [showWalletWarning2, setShowWalletWarning2] = useState(false)
  const [showWalletWarning3, setShowWalletWarning3] = useState(false)
  const [loadedInitial, setloadedInitial] = useState(false)
  const [txnLoading, setTxnLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('addTab1')
  const [confirm, setConfirm] = useState(false)
  const [confirmAsym, setConfirmAsym] = useState(false)
  const [confirmFreeze, setConfirmFreeze] = useState(false)

  const [token1, settoken1] = useState(false)
  const [token2, settoken2] = useState(false)
  const [tokenPool, settokenPool] = useState(false)
  const [bnbBalance, setbnbBalance] = useState(false)
  const [addLiqState, setAddLiqState] = useState(['0.00', false, false])
  const [addLiqAsymState, setAddLiqAsymState] = useState([
    '0.00',
    '0.00',
    false,
    false,
  ])
  const [outputLp, setOutputLp] = useState('0.00')
  const [spartaPrice, setspartaPrice] = useState(0)

  useEffect(() => {
    if (web3.spartaPrice > 0) {
      setspartaPrice(web3.spartaPrice)
    } else if (web3.spartaPriceInternal > 0) {
      setspartaPrice(web3.spartaPriceInternal)
    }
  }, [web3.spartaPrice, web3.spartaPriceInternal])

  // Check and set selected assets based on URL params ONLY ONCE
  useEffect(() => {
    if (!loadedInitial && pool.poolDetails.length > 1) {
      const assetParam1 = new URLSearchParams(location.search).get(`asset1`)
      const assetParam2 = new URLSearchParams(location.search).get(`asset2`)
      let _asset1Addr =
        assetParam1 === addresses.wbnb ? addresses.bnb : assetParam1
      let _asset2Addr =
        assetParam2 === addresses.wbnb ? addresses.bnb : assetParam2
      _asset1Addr = getPool(_asset1Addr, pool.poolDetails).tokenAddress ?? false
      _asset2Addr = getPool(_asset2Addr, pool.poolDetails).tokenAddress ?? false

      dispatch(appAsset('1', _asset1Addr, 'token'))
      dispatch(appAsset('2', _asset2Addr, 'token'))
      setloadedInitial(true)
    }
  }, [
    addresses.bnb,
    addresses.wbnb,
    dispatch,
    loadedInitial,
    location.search,
    pool.poolDetails,
  ])

  // Check selected assets and validate for liqAdd page
  useEffect(() => {
    const getAssetDetails = () => {
      if (loadedInitial && focus && pool.poolDetails?.length > 1) {
        let _asset1Addr = asset1.addr
        let _asset3Addr = asset3.addr
        if (activeTab === 'addTab1') {
          _asset1Addr =
            _asset1Addr !== addresses.spartav2 &&
            getPool(_asset1Addr, pool.poolDetails)
              ? _asset1Addr
              : addresses.bnb
          const hide1 = getPool(_asset1Addr, pool.poolDetails).hide
          if (hide1) {
            _asset1Addr = addresses.bnb
          }
          dispatch(appAsset('1', _asset1Addr, 'token'))
          dispatch(appAsset('2', addresses.spartav2, 'token'))
          dispatch(appAsset('3', _asset1Addr, 'pool'))
        } else if (activeTab === 'addTab2') {
          _asset1Addr = getPool(_asset1Addr, pool.poolDetails)
            ? _asset1Addr
            : addresses.spartav2
          _asset3Addr =
            _asset1Addr !== addresses.spartav2
              ? _asset1Addr
              : getPool(_asset3Addr, pool.poolDetails)
              ? _asset3Addr
              : addresses.bnb
          const hide1 = getPool(_asset1Addr, pool.poolDetails).hide
          const hide3 = getPool(_asset3Addr, pool.poolDetails).hide
          if (hide1) {
            _asset1Addr = addresses.sparta
          }
          if (hide3) {
            _asset3Addr = addresses.bnb
          }
          dispatch(appAsset('1', _asset1Addr, 'token'))
          dispatch(
            appAsset(
              '2',
              _asset1Addr !== addresses.spartav2
                ? addresses.spartav2
                : _asset3Addr,
              'token',
            ),
          )
          dispatch(appAsset('3', _asset3Addr, 'pool'))
        }
      }
    }
    getAssetDetails()
  }, [
    activeTab,
    addresses.bnb,
    addresses.spartav2,
    focus,
    pool.poolDetails,
    loadedInitial,
    dispatch,
    asset1.addr,
    asset2.addr,
    asset3.addr,
    addresses.sparta,
  ])

  // Push complex objects into local state
  useEffect(() => {
    if (pool.tokenDetails.length > 1) {
      settoken1(getToken(asset1.addr, pool.tokenDetails))
      settoken2(getToken(asset2.addr, pool.tokenDetails))
      settokenPool(getToken(selectedPool.tokenAddress, pool.tokenDetails))
      setbnbBalance(getToken(addresses.bnb, pool.tokenDetails).balance)
    }
  }, [
    addresses.bnb,
    asset1.addr,
    asset2.addr,
    pool.tokenDetails,
    selectedPool.tokenAddress,
  ])

  const addInput1 = document.getElementById('addInput1')
  const addInput2 = document.getElementById('addInput2')
  const addInput3 = document.getElementById('addInput3')

  const handleConfClear = () => {
    setConfirm(false)
    setConfirmFreeze(false)
  }

  /**
   * Get liqAdd txn details
   * @returns [outputLP, slipRevert, capRevert]
   */
  const getAddLiq = () => {
    if (activeTab === 'addTab1' && addInput1 && addInput2) {
      if (addInput2 !== document.activeElement && addInput1.value) {
        addInput2.value = calcSpotValueInBase(addInput1.value, selectedPool)
      } else if (addInput1 !== document.activeElement && addInput2.value) {
        addInput1.value = calcSpotValueInToken(
          addInput2.value > 0 ? addInput2.value : '0.00',
          selectedPool,
        )
      }

      const [outputLP, slipRevert, capRevert] = addLiq(
        convertToWei(addInput1.value),
        assetLiq1,
        sparta.globalDetails.feeOnTransfer,
        convertToWei(addInput2.value),
      )
      setAddLiqState([outputLP, slipRevert, capRevert])
      setOutputLp(outputLP)
    }
  }

  /**
   * Get liqAddAsym txn details
   * @returns [unitsLP, swapFee, slipRevert, capRevert]
   */
  const getAddLiqAsym = () => {
    if (activeTab === 'addTab2' && addInput1 && assetLiq1) {
      const fromBase = assetLiq1.tokenAddress === addresses.spartav2
      const [unitsLP, swapFee, slipRevert, capRevert] = addLiqAsym(
        convertToWei(addInput1.value),
        selectedPool,
        fromBase,
        sparta.globalDetails.feeOnTransfer,
      )
      setAddLiqAsymState([unitsLP, swapFee, slipRevert, capRevert])
      setOutputLp(unitsLP)
      addInput3.value = convertFromWei(unitsLP)
    }
  }

  const updateAddLiq = () => {
    getAddLiq()
    getAddLiqAsym()
  }

  const clearInputs = (focusAfter) => {
    handleConfClear()
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
    updateAddLiq()
    if (focusAfter === 1) {
      addInput1.focus()
    }
    if (focusAfter === 2) {
      addInput2.focus()
    }
    updateAddLiq()
  }

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
    clearInputs(1)
  }

  const getBalance = (asset) => {
    if (asset === 1) {
      return token1.balance
    }
    if (asset === 2) {
      return token2.balance
    }
    return selectedPool.balance
  }

  const getTimeNew = () => {
    const timeStamp = BN(selectedPool?.genesis).plus(oneWeek)
    return getTimeUntil(timeStamp, t)
  }

  //= =================================================================================//
  // Get txn info

  const getInput1ValueUSD = () => {
    if (assetLiq1?.tokenAddress !== addresses.spartav2 && addInput1?.value) {
      return calcSpotValueInBase(
        convertToWei(addInput1.value),
        selectedPool,
      ).times(spartaPrice)
    }
    if (assetLiq1?.tokenAddress === addresses.spartav2 && addInput1?.value) {
      return BN(convertToWei(addInput1.value)).times(spartaPrice)
    }
    return '0.00'
  }

  const getInput2ValueUSD = () => {
    if (assetLiq2 && addInput2?.value) {
      return BN(convertToWei(addInput2.value)).times(spartaPrice)
    }
    return '0.00'
  }

  const getLpValueBase = () => {
    if (assetLiq1 && addInput1?.value) {
      return calcLiqValue(outputLp, selectedPool)[0]
    }
    return '0.00'
  }

  const getLpValueToken = () => {
    if (assetLiq1 && addInput1?.value) {
      return calcLiqValue(outputLp, selectedPool)[1]
    }
    return '0.00'
  }

  const getLpValueUSD = () => {
    if (assetLiq1 && addInput1?.value) {
      return BN(calcSpotValueInBase(getLpValueToken(), selectedPool))
        .plus(getLpValueBase())
        .times(spartaPrice)
    }
    return '0.00'
  }

  const getRevenue = () => {
    let result = '0.00'
    if (activeTab === 'addTab2') {
      result = BN(addLiqAsymState[1])
    }
    result = result > 0 ? result : '0.00'
    return result
  }

  // ~0.00288 BNB gas (addLiqSingle) on TN || ~0.0015 BNB on MN
  const estMaxGas = '1500000000000000'
  const enoughGas = () => {
    if (BN(bnbBalance).isLessThan(estMaxGas)) {
      return false
    }
    return true
  }

  const checkValid = () => {
    if (selectedPool.address === '0xcE16E8C1224b51Fd455749F48a7D0e5f880231CB') {
      return [false, t('poolRetired')]
    }
    if (!wallet.account) {
      return [false, t('checkWallet')]
    }
    if (addInput1?.value <= 0) {
      return [false, t('checkInput')]
    }
    if (!enoughGas()) {
      return [false, t('checkBnbGas')]
    }
    if (
      BN(convertToWei(addInput1?.value)).isGreaterThan(getBalance(1)) ||
      BN(convertToWei(addInput2?.value)).isGreaterThan(getBalance(2))
    ) {
      return [false, t('checkBalance')]
    }
    if (addLiqAsymState[2]) {
      return [false, t('slipTooHigh')]
    }
    if (addLiqAsymState[3] || addLiqState[2]) {
      return [false, t('poolAtCapacity')]
    }
    if (selectedPool.newPool && !confirm) {
      return [false, t('confirmLockup')]
    }
    if (selectedPool.curated && selectedPool.frozen && !confirmFreeze) {
      return [false, t('confirmFreeze')]
    }
    if (activeTab === 'addTab2' && !confirmAsym) {
      return [false, t('confirmAsym')]
    }
    if (activeTab === 'addTab1') {
      return [true, t('addBoth')]
    }
    return [true, t('addSingle')]
  }

  //= =================================================================================//
  // General Functions

  const getRateSlip = () => {
    if (assetLiq1 && addInput1?.value > 0) {
      return BN(getLpValueUSD())
        .div(getInput1ValueUSD())
        .minus('1')
        .times('100')
    }
    return '0.00'
  }

  const handleAddLiq = async () => {
    if (
      assetLiq1?.tokenAddress === addresses.bnb ||
      assetLiq1?.tokenAddress === addresses.wbnb
    ) {
      if (
        BN(bnbBalance)
          .minus(convertToWei(addInput1?.value))
          .isLessThan('5000000000000000')
      ) {
        addInput1.value = convertFromWei(
          BN(bnbBalance).minus('5000000000000000'),
        )
        updateAddLiq()
      }
    }
    setTxnLoading(true)
    if (activeTab === 'addTab1') {
      await dispatch(
        addLiquidity(
          convertToWei(addInput1.value),
          convertToWei(addInput2.value),
          assetLiq1.tokenAddress,
          wallet,
        ),
      )
    } else {
      await dispatch(
        addLiquiditySingle(
          convertToWei(addInput1.value),
          assetLiq1.tokenAddress === addresses.spartav2,
          selectedPool.tokenAddress,
          wallet,
        ),
      )
    }
    setTxnLoading(false)
    clearInputs()
  }

  const checkWallet = (id) => {
    if (!wallet.account) {
      if (id === 1) {
        setShowWalletWarning1(!showWalletWarning1)
      }
      if (id === 2) {
        setShowWalletWarning2(!showWalletWarning2)
      }
      if (id === 3) {
        setShowWalletWarning3(!showWalletWarning3)
      }
    }
  }

  return (
    <>
      <Row className="mb-3">
        <Col>
          <Nav
            variant="pills"
            activeKey={activeTab}
            onSelect={(e) => toggle(e)}
            fill
          >
            <Nav.Item>
              <Nav.Link className="btn-sm" eventKey="addTab1">
                {t('addBoth')}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="btn-sm" eventKey="addTab2">
                {t('addSingle')}
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>

      <Row>
        <Col xs="12">
          <Card className="assetSection">
            <Card.Body>
              <Row>
                <Col>
                  <strong>{t('add')}</strong>
                </Col>
                <Col
                  xs="auto"
                  className="float-end text-end fw-light"
                  role="button"
                  aria-hidden="true"
                  onClick={() => {
                    addInput1.focus()
                    addInput1.value = convertFromWei(getBalance(1))
                    updateAddLiq()
                  }}
                >
                  {t('balance')}:{' '}
                  {pool.poolDetails && (
                    <OverlayTrigger
                      placement="auto"
                      overlay={Tooltip(t, formatFromWei(getBalance(1), 18))}
                    >
                      <span role="button">{formatFromWei(getBalance(1))}</span>
                    </OverlayTrigger>
                  )}
                  <Badge bg="primary" className="ms-1 mb-1">
                    MAX
                  </Badge>
                </Col>
              </Row>

              <Row className="my-1">
                <Col>
                  <InputGroup className="m-0 py-3">
                    <InputGroup.Text
                      id="assetSelect1"
                      className="bg-transparent border-0"
                    >
                      <AssetSelect
                        priority="1"
                        filter={['token']}
                        blackList={
                          activeTab === 'addTab1'
                            ? [addresses.spartav1, addresses.spartav2]
                            : []
                        }
                        onClick={() => clearInputs()}
                      />
                    </InputGroup.Text>
                    <OverlayTrigger
                      placement="auto"
                      onToggle={() => checkWallet(1)}
                      show={showWalletWarning1}
                      trigger={['focus']}
                      overlay={
                        <Popover>
                          <Popover.Header />
                          <Popover.Body>{t('connectWalletFirst')}</Popover.Body>
                        </Popover>
                      }
                    >
                      <FormControl
                        className="text-end ms-0 bg-transparent border-0 text-lg"
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0"
                        id="addInput1"
                        autoComplete="off"
                        autoCorrect="off"
                        onChange={() => updateAddLiq()}
                      />
                    </OverlayTrigger>

                    <InputGroup.Text
                      role="button"
                      className="bg-transparent border-0 p-1"
                      tabIndex={-1}
                      onKeyPress={() => clearInputs(1)}
                      onClick={() => clearInputs(1)}
                    >
                      <Icon icon="close" size="16" />
                    </InputGroup.Text>
                  </InputGroup>
                  <Row className="pt-1 fw-light">
                    <Col>
                      {formatShortString(assetLiq1?.tokenAddress)}
                      <ShareLink url={assetLiq1?.tokenAddress}>
                        <Icon icon="copy" size="14" className="ms-1 mb-1" />
                      </ShareLink>
                      <a
                        href={getExplorerContract(assetLiq1?.tokenAddress)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Icon icon="scan" size="14" className="ms-1 mb-1" />
                      </a>
                    </Col>
                    <Col className="text-end">
                      ~$
                      {addInput1?.value
                        ? formatFromWei(getInput1ValueUSD(), 2)
                        : '0.00'}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Row className="iconSeparator">
            <Col xs="auto" className="mx-auto">
              <Icon
                icon={activeTab === 'addTab1' ? 'plus' : 'arrowDown'}
                size="30"
                stroke="black"
                fill="black"
                className="position-relative bg-white rounded-circle px-2 iconOnTop"
              />
            </Col>
          </Row>

          <Card className="assetSection">
            <Card.Body>
              {activeTab === 'addTab1' && (
                <>
                  <Row>
                    <Col>
                      <strong>{t('add')}</strong>
                    </Col>
                    <Col
                      xs="auto"
                      className="float-end text-end fw-light"
                      role="button"
                      aria-hidden="true"
                      onClick={() => {
                        addInput2.focus()
                        addInput2.value = convertFromWei(getBalance(2))
                        updateAddLiq()
                      }}
                    >
                      {t('balance')}:{' '}
                      {pool.poolDetails && (
                        <OverlayTrigger
                          placement="auto"
                          overlay={Tooltip(t, formatFromWei(getBalance(2), 18))}
                        >
                          <span role="button">
                            {formatFromWei(getBalance(2))}
                          </span>
                        </OverlayTrigger>
                      )}
                      <Badge bg="primary" className="ms-1 mb-1">
                        MAX
                      </Badge>
                    </Col>
                  </Row>

                  <Row className="my-1">
                    <Col>
                      <InputGroup className="m-0 py-3">
                        <InputGroup.Text
                          id="assetSelect2"
                          className="bg-transparent border-0"
                        >
                          <AssetSelect
                            priority="2"
                            filter={['token']}
                            whiteList={[addresses.spartav2]}
                            disabled={activeTab === 'addTab1'}
                            onClick={() => clearInputs()}
                          />
                        </InputGroup.Text>
                        <OverlayTrigger
                          placement="auto"
                          onToggle={() => checkWallet(2)}
                          show={showWalletWarning2}
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
                            className="text-end ms-0 bg-transparent border-0 text-lg"
                            type="number"
                            min="0"
                            step="any"
                            placeholder="0"
                            id="addInput2"
                            autoComplete="off"
                            autoCorrect="off"
                            onChange={() => updateAddLiq()}
                          />
                        </OverlayTrigger>

                        <InputGroup.Text
                          role="button"
                          className="bg-transparent border-0 p-1"
                          tabIndex={-1}
                          onKeyPress={() => clearInputs(2)}
                          onClick={() => clearInputs(2)}
                        >
                          <Icon icon="close" size="16" />
                        </InputGroup.Text>
                      </InputGroup>

                      <Row className="pt-1 fw-light">
                        <Col>
                          {formatShortString(assetLiq2?.tokenAddress)}
                          <ShareLink url={assetLiq2?.tokenAddress}>
                            <Icon icon="copy" size="14" className="ms-1 mb-1" />
                          </ShareLink>
                          <a
                            href={getExplorerContract(assetLiq2?.tokenAddress)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Icon icon="scan" size="14" className="ms-1 mb-1" />
                          </a>
                        </Col>
                        <Col className="text-end">
                          ~$
                          {addInput2?.value
                            ? formatFromWei(getInput2ValueUSD(), 2)
                            : '0.00'}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              )}

              {activeTab === 'addTab2' && (
                <>
                  <Row>
                    <Col>
                      <strong>{t('receive')}</strong>
                    </Col>
                    <Col className="float-end text-end fw-light" xs="auto">
                      {t('balance')}:{' '}
                      {pool.poolDetails && formatFromWei(getBalance(3))}
                    </Col>
                  </Row>

                  <Row className="my-1">
                    <Col>
                      <InputGroup className="m-0 py-3">
                        <InputGroup.Text
                          id="assetSelect3"
                          className="bg-transparent border-0"
                        >
                          <AssetSelect
                            priority="3"
                            filter={['pool']}
                            disabled={
                              activeTab === 'addTab1' ||
                              assetLiq1.tokenAddress !== addresses.spartav2
                            }
                            onClick={() => clearInputs()}
                          />
                        </InputGroup.Text>
                        <FormControl
                          className="text-end ms-0 bg-transparent border-0 text-lg"
                          type="number"
                          min="0"
                          step="any"
                          placeholder="0"
                          id="addInput3"
                          disabled
                        />
                      </InputGroup>

                      <Row className="pt-1 fw-light">
                        <Col>
                          {formatShortString(selectedPool?.address)}
                          <ShareLink url={selectedPool?.address}>
                            <Icon icon="copy" size="14" className="ms-1 mb-1" />
                          </ShareLink>
                          <a
                            href={getExplorerContract(selectedPool?.address)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Icon icon="scan" size="14" className="ms-1 mb-1" />
                          </a>
                        </Col>
                        <Col className="text-end">
                          ~$
                          {addInput1?.value
                            ? formatFromWei(getLpValueUSD(), 2)
                            : '0.00'}
                          {' ('}
                          {addInput1?.value
                            ? formatFromUnits(getRateSlip(), 2)
                            : '0.00'}
                          %)
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              )}
            </Card.Body>
          </Card>

          {pool.poolDetails && (
            <>
              <Row className="mb-2 mt-3">
                <Col xs="auto">{t('add')}</Col>
                <Col className="text-end">
                  {addInput1?.value > 0
                    ? formatFromUnits(addInput1?.value, 6)
                    : '0.00'}{' '}
                  {token1.symbol}
                </Col>
              </Row>
              {activeTab === 'addTab1' && (
                <Row className="mb-2">
                  <Col xs="auto">{t('add')}</Col>
                  <Col className="text-end">
                    ~
                    {addInput2?.value > 0
                      ? formatFromUnits(addInput2?.value, 6)
                      : '0.00'}{' '}
                    SPARTA
                  </Col>
                </Row>
              )}
              {activeTab === 'addTab2' && (
                <>
                  <Row className="mb-2">
                    <Col xs="auto">{t('fee')}</Col>
                    <Col className="text-end">
                      {addLiqAsymState[1] > 0
                        ? formatFromWei(addLiqAsymState[1], 4)
                        : '0.00'}{' '}
                      SPARTA
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs="auto">{t('revenue')}</Col>
                    <Col className="text-end">
                      {formatFromWei(getRevenue(), 6)} SPARTA
                      <OverlayTrigger
                        placement="auto"
                        overlay={Tooltip(t, 'swapRevInfo')}
                      >
                        <span role="button">
                          <Icon icon="info" className="ms-1 mb-1" size="17" />
                        </span>
                      </OverlayTrigger>
                    </Col>
                  </Row>
                </>
              )}
              <Row>
                <Col xs="auto">
                  <strong>{t('receive')}</strong>
                </Col>
                <Col className="text-end">
                  <strong>
                    ~{outputLp > 0 ? formatFromWei(outputLp, 6) : '0.00'}{' '}
                    {tokenPool.symbol}p
                  </strong>
                </Col>
              </Row>
            </>
          )}
          {!pool.poolDetails && <HelmetLoading height={150} width={150} />}
        </Col>
      </Row>

      {activeTab === 'addTab2' && (
        <Row>
          <Col className="mb-2 mt-4">
            <div className="text-center">
              {t('poolAsymAddConfirm', {
                token1: token1.symbol,
                token2:
                  token1.symbol === 'SPARTA' ? tokenPool.symbol : 'SPARTA',
              })}
              <a
                href="https://docs.spartanprotocol.org/#/liquidity-pools?id=asymmetric-liquidity-add-add-single"
                target="_blank"
                rel="noreferrer"
              >
                <Icon icon="scan" size="14" className="ms-1" />
              </a>
            </div>
            <Form className="my-2 text-center">
              <span>
                {t('poolAsymAddConfirmShort', {
                  token1: tokenPool.symbol,
                })}
                <Form.Check
                  type="switch"
                  id="confirmSym"
                  className="ms-2 d-inline-flex"
                  checked={confirmAsym}
                  onChange={() => setConfirmAsym(!confirmAsym)}
                />
              </span>
            </Form>
          </Col>
        </Row>
      )}

      {selectedPool.newPool && (
        <Row>
          <Col>
            <div className="text-center">{t('newPoolConfirmInfo')}</div>
            <Form className="my-2 text-center">
              <span>
                {`Confirm: your liquidity will be locked for ${
                  getTimeNew()[0]
                }${getTimeNew()[1]}`}
                <Form.Check
                  type="switch"
                  id="confirmLockout"
                  className="ms-2 d-inline-flex"
                  checked={confirm}
                  onChange={() => setConfirm(!confirm)}
                />
              </span>
            </Form>
          </Col>
        </Row>
      )}
      {selectedPool.curated && selectedPool.frozen && (
        <Row className="mt-2">
          <Col>
            <div className="text-center">{t('poolFrozenConfirm')}</div>
            <Form className="my-2 text-center">
              <span>
                {t('poolFrozenConfirmShort')}
                <Form.Check
                  type="switch"
                  id="confirmFrozen"
                  className="ms-2 d-inline-flex"
                  checked={confirmFreeze}
                  onChange={() => setConfirmFreeze(!confirmFreeze)}
                />
              </span>
            </Form>
          </Col>
        </Row>
      )}
      <Row className="text-center mt-3">
        {assetLiq1?.tokenAddress &&
          assetLiq1?.tokenAddress !== addresses.bnb &&
          wallet?.account &&
          addInput1?.value && (
            <Approval
              tokenAddress={assetLiq1?.tokenAddress}
              symbol={token1.symbol}
              walletAddress={wallet?.account}
              contractAddress={addresses.router}
              txnAmount={convertToWei(addInput1?.value)}
              assetNumber="1"
            />
          )}
        <Col xs="12" className="hide-if-siblings">
          <Button
            className="w-100"
            onClick={() => handleAddLiq()}
            disabled={!checkValid()[0]}
          >
            {checkValid()[1]}
            {txnLoading && (
              <Icon
                fill="white"
                icon="cycle"
                size="20"
                className="anim-spin ms-1"
              />
            )}
          </Button>
        </Col>
        {assetLiq2?.tokenAddress &&
          assetLiq2?.tokenAddress !== addresses.bnb &&
          wallet?.account &&
          addInput2?.value && (
            <Approval
              tokenAddress={assetLiq2?.tokenAddress}
              symbol={token2.symbol}
              walletAddress={wallet?.account}
              contractAddress={addresses.router}
              txnAmount={convertToWei(addInput2?.value)}
              assetNumber="2"
            />
          )}
      </Row>
    </>
  )
}

export default LiqAdd

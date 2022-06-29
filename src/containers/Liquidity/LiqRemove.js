import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
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
import { removeLiquidityExact, removeLiquiditySingle } from '../../store/router'
import HelmetLoading from '../../components/Spinner/index'
import Approval from '../../components/Approval/index'
import { useSparta } from '../../store/sparta'
import { Icon } from '../../components/Icons/index'
import { Tooltip } from '../../components/Tooltip/index'
import {
  calcLiqValue,
  calcSpotValueInBase,
  getPool,
  getToken,
} from '../../utils/math/utils'
import { getTimeUntil } from '../../utils/math/nonContract'
import { removeLiq, removeLiqAsym } from '../../utils/math/router'
import ShareLink from '../../components/Share/ShareLink'
import { getExplorerContract } from '../../utils/extCalls'
import { useFocus } from '../../providers/Focus'
import { appAsset, useApp } from '../../store/app'

const LiqRemove = ({ assetLiq1, selectedPool }) => {
  const dispatch = useDispatch()
  const focus = useFocus()
  const { t } = useTranslation()
  const wallet = useWeb3React()

  const { addresses, asset1, asset2 } = useApp()
  const pool = usePool()
  const sparta = useSparta()
  const web3 = useWeb3()

  const [showWalletWarning1, setShowWalletWarning1] = useState(false)
  const [txnLoading, setTxnLoading] = useState(false)
  const [confirmAsym, setConfirmAsym] = useState(false)
  const [activeTab, setActiveTab] = useState('removeTab1')

  const [token1, settoken1] = useState(false)
  const [token2, settoken2] = useState(false)
  const [tokenPool, settokenPool] = useState(false)
  const [bnbBalance, setbnbBalance] = useState(false)
  const [remLiqAsymState, setRemLiqAsymState] = useState([
    '0.00',
    '0.00',
    '0.00',
  ])
  const [output1, setoutput1] = useState('0.00')
  const [output2, setoutput2] = useState('0.00')

  // Check selected assets and validate for liqRemove page
  useEffect(() => {
    const getAssetDetails = () => {
      if (focus && pool.poolDetails.length > 0) {
        let _asset1Addr = asset1.addr
        let _asset2Addr = asset2.addr
        if (activeTab === 'removeTab1') {
          _asset1Addr = getPool(_asset1Addr, pool.poolDetails)
            ? _asset1Addr
            : addresses.bnb
          _asset2Addr = _asset1Addr

          dispatch(appAsset('1', _asset1Addr, 'pool'))
          dispatch(appAsset('2', _asset2Addr, 'token'))
          dispatch(appAsset('3', addresses.spartav2, 'token'))
        } else if (activeTab === 'removeTab2') {
          _asset1Addr =
            _asset1Addr !== addresses.spartav2 &&
            getPool(_asset1Addr, pool.poolDetails)
              ? _asset1Addr
              : addresses.bnb
          _asset2Addr = getPool(_asset2Addr, pool.poolDetails)
            ? _asset2Addr
            : addresses.spartav2
          _asset2Addr =
            _asset2Addr === _asset1Addr || _asset2Addr === addresses.spartav2
              ? _asset2Addr
              : addresses.spartav2

          dispatch(appAsset('1', _asset1Addr, 'pool'))
          dispatch(appAsset('2', _asset2Addr, 'token'))
        }
      }
    }
    getAssetDetails()
  }, [
    activeTab,
    addresses.bnb,
    addresses.spartav2,
    asset1.addr,
    asset2.addr,
    dispatch,
    focus,
    pool.poolDetails,
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

  const removeInput1 = document.getElementById('removeInput1')
  const removeInput2 = document.getElementById('removeInput2')

  /**
   * Get remove liquidity equal (sym) txn details
   * @returns spartaOutput @returns tokenOutput
   */
  const getRemLiq = () => {
    if (activeTab === 'removeTab1' && removeInput1 && selectedPool) {
      const [spartaOutput, tokenOutput] = removeLiq(
        convertToWei(removeInput1.value),
        selectedPool,
        sparta.globalDetails.feeOnTransfer,
      )
      setoutput1(tokenOutput)
      setoutput2(spartaOutput)
    }
  }

  /**
   * Get remove liquidity one-sided (asym) txn details
   * @returns tokensOut @returns swapFee
   */
  const getRemLiqAsym = () => {
    if (activeTab === 'removeTab2' && removeInput1 && assetLiq1) {
      const [tokensOut, swapFee, divi] = removeLiqAsym(
        convertToWei(removeInput1.value),
        selectedPool,
        assetLiq1.tokenAddress === addresses.spartav2,
        sparta.globalDetails.feeOnTransfer,
      )
      setRemLiqAsymState([tokensOut, swapFee, divi])
      removeInput2.value = convertFromWei(tokensOut)
      setoutput1(tokensOut)
      setoutput2('0.00')
    }
  }

  const updateRemLiq = () => {
    getRemLiq()
    getRemLiqAsym()
  }

  const clearInputs = (focusAfter) => {
    setoutput1('0.00')
    setoutput2('0.00')
    if (removeInput1) {
      removeInput1.value = ''
    }
    if (removeInput2) {
      removeInput2.value = ''
    }
    updateRemLiq()
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
      return selectedPool.balance
    }
    if (asset === 2) {
      return token1.balance
    }
    if (asset === 3) {
      return token2.balance
    }
    return selectedPool.balance
  }

  const getTimeNew = () => {
    const timeStamp = BN(selectedPool?.genesis).plus(oneWeek)
    return getTimeUntil(timeStamp, t)
  }

  //= =================================================================================//
  // Remove liquidity get-value-of functions

  const getOutput1ValueUSD = () => {
    if (assetLiq1 && output1) {
      if (assetLiq1.tokenAddress === addresses.spartav2) {
        return BN(output1).times(web3.spartaPrice)
      }
      return calcSpotValueInBase(output1, selectedPool).times(web3.spartaPrice)
    }
    return '0.00'
  }

  const getLpValueBase = () => {
    if (assetLiq1 && removeInput1?.value) {
      return calcLiqValue(convertToWei(removeInput1.value), selectedPool)[0]
    }
    return '0.00'
  }

  const getLpValueToken = () => {
    if (assetLiq1 && removeInput1?.value) {
      return calcLiqValue(convertToWei(removeInput1.value), selectedPool)[1]
    }
    return '0.00'
  }

  const getLpValueUSD = () => {
    if (assetLiq1 && removeInput1?.value) {
      return BN(calcSpotValueInBase(getLpValueToken(), selectedPool))
        .plus(getLpValueBase())
        .times(web3.spartaPrice)
    }
    return '0.00'
  }

  const getRevenue = () => {
    let result = '0.00'
    if (activeTab === 'removeTab2') {
      result = BN(remLiqAsymState[1]).plus(remLiqAsymState[2])
    }
    result = result > 0 ? result : '0.00'
    return result
  }

  // ~0.0032 BNB gas (remSingle+swap) on TN || ~0.0016 BNB on MN
  const estMaxGas = '1600000000000000'
  const enoughGas = () => {
    if (BN(bnbBalance).isLessThan(estMaxGas)) {
      return false
    }
    return true
  }

  const checkValid = () => {
    if (!wallet.account) {
      return [false, t('checkWallet')]
    }
    if (removeInput1?.value <= 0) {
      return [false, t('checkInput')]
    }
    if (selectedPool.curated && selectedPool.frozen) {
      return [false, t('poolFrozen')]
    }
    if (!enoughGas()) {
      return [false, t('checkBnbGas')]
    }
    if (BN(convertToWei(removeInput1?.value)).isGreaterThan(getBalance(1))) {
      return [false, t('checkBalance')]
    }
    if (selectedPool.newPool) {
      return [false, `${t('unlocksIn')} ${getTimeNew()[0]}${getTimeNew()[1]}`]
    }
    if (activeTab === 'removeTab2' && !confirmAsym) {
      return [false, t('confirmAsym')]
    }
    if (activeTab === 'removeTab1') {
      return [true, t('removeBoth')]
    }
    return [true, t('removeSingle')]
  }

  //= =================================================================================//
  // Handlers

  const handleRemLiq = async () => {
    setTxnLoading(true)
    if (activeTab === 'removeTab1') {
      await dispatch(
        removeLiquidityExact(
          convertToWei(removeInput1.value),
          selectedPool.tokenAddress,
          wallet,
        ),
      )
    } else {
      await dispatch(
        removeLiquiditySingle(
          convertToWei(removeInput1.value),
          assetLiq1.tokenAddress === addresses.spartav2,
          selectedPool.tokenAddress,
          wallet,
        ),
      )
    }
    setTxnLoading(false)
    clearInputs()
  }

  const checkWallet = () => {
    if (!wallet.account) {
      setShowWalletWarning1(!showWalletWarning1)
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
              <Nav.Link className="btn-sm" eventKey="removeTab1">
                {t('removeBoth')}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="btn-sm" eventKey="removeTab2">
                {t('removeSingle')}
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
                  <strong>{t('redeem')}</strong>
                </Col>
                <Col
                  xs="auto"
                  className="float-end text-end fw-light"
                  role="button"
                  aria-hidden="true"
                  onClick={() => {
                    removeInput1.focus()
                    removeInput1.value = convertFromWei(getBalance(1))
                    updateRemLiq()
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
                        filter={['pool']}
                        onClick={() => clearInputs()}
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
                        id="removeInput1"
                        autoComplete="off"
                        autoCorrect="off"
                        onChange={() => updateRemLiq()}
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
                      {removeInput1?.value
                        ? formatFromWei(getLpValueUSD(), 2)
                        : '0.00'}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {activeTab === 'removeTab2' && (
            <>
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
              <Card className="mb-3 assetSection">
                <Card.Body>
                  <Row>
                    <Col>
                      <strong>{t('receive')}</strong>
                    </Col>
                    <Col xs="auto" className="float-end text-end fw-light">
                      {t('balance')}:{' '}
                      {pool.tokenDetails && formatFromWei(getBalance(2))}
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
                            blackList={[
                              activeTab === 'removeTab1'
                                ? addresses.spartav2
                                : '',
                            ]}
                            whiteList={
                              activeTab === 'removeTab2'
                                ? [
                                    addresses.spartav2,
                                    selectedPool.tokenAddress,
                                  ]
                                : ['']
                            }
                            disabled={activeTab === 'removeTab1'}
                            onClick={() => clearInputs()}
                          />
                        </InputGroup.Text>
                        <FormControl
                          className="text-end ms-0 bg-transparent border-0 text-lg"
                          type="number"
                          min="0"
                          step="any"
                          placeholder="0"
                          id="removeInput2"
                          disabled
                        />
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
                          {removeInput2?.value
                            ? formatFromWei(getOutput1ValueUSD(), 2)
                            : '0.00'}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </>
          )}
          {pool.poolDetails && (
            <>
              <Row className="mb-2 mt-3">
                <Col xs="auto">{t('redeem')}</Col>
                <Col className="text-end">
                  {removeInput1?.value > 0
                    ? formatFromUnits(removeInput1?.value, 6)
                    : '0.00'}{' '}
                  {tokenPool.symbol}p
                </Col>
              </Row>

              {activeTab === 'removeTab2' && (
                <>
                  <Row className="mb-2">
                    <Col xs="auto">{t('fee')}</Col>
                    <Col className="text-end">
                      {remLiqAsymState[1] > 0
                        ? formatFromWei(remLiqAsymState[1], 6)
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
              <Row className="mb-2">
                <Col xs="auto">
                  <strong>{t('receive')}</strong>
                </Col>
                <Col className="text-end">
                  <strong>
                    ~{output1 > 0 ? formatFromWei(output1, 6) : '0.00'}{' '}
                    {token1.symbol}
                  </strong>
                </Col>
              </Row>

              {activeTab === 'removeTab1' && (
                <Row className="mb-2">
                  <Col xs="auto">
                    <strong>{t('receive')}</strong>
                  </Col>
                  <Col className="text-end">
                    <strong>
                      ~{output2 > 0 ? formatFromWei(output2, 6) : '0.00'} SPARTA
                    </strong>
                  </Col>
                </Row>
              )}
            </>
          )}

          {!pool.poolDetails && <HelmetLoading height={150} width={150} />}

          {activeTab === 'removeTab2' && (
            <Row>
              <Col className="mb-2 mt-4">
                <div className="text-center">
                  {t('poolAsymRemoveConfirm', {
                    token1:
                      token2.symbol === 'SPARTA' ? tokenPool.symbol : 'SPARTA',
                    token2: token2.symbol,
                  })}
                  <a
                    href="https://docs.spartanprotocol.org/#/liquidity-pools?id=asymmetric-liquidity-removal-remove-single"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon icon="scan" size="14" className="ms-1" />
                  </a>
                </div>
                <Form className="my-2 text-center">
                  <span>
                    {t('poolAsymRemoveConfirmShort', {
                      token1: token2.symbol,
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

          <Row className="text-center mt-3">
            {selectedPool?.tokenAddress &&
              wallet?.account &&
              removeInput1?.value && (
                <Approval
                  tokenAddress={selectedPool?.address}
                  symbol={`${tokenPool.symbol}p`}
                  walletAddress={wallet?.account}
                  contractAddress={addresses.router}
                  txnAmount={convertToWei(removeInput1?.value)}
                  assetNumber="1"
                />
              )}
            <Col xs="12" sm="4" md="12" className="hide-if-siblings">
              <Button
                className="w-100"
                disabled={!checkValid()[0]}
                onClick={() => handleRemLiq()}
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
                {selectedPool.newPool && (
                  <OverlayTrigger
                    placement="auto"
                    overlay={Tooltip(t, 'newPool', `${token1.symbol}p`)}
                  >
                    <span role="button">
                      <Icon icon="info" className="ms-1 mb-1" size="17" />
                    </span>
                  </OverlayTrigger>
                )}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}

export default LiqRemove

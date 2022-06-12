import React, { useState, useEffect, useCallback } from 'react'
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
import {
  formatShortString,
  getAddresses,
  getItemFromArray,
  oneWeek,
} from '../../utils/web3'
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
import { balanceWidths } from './Components/Utils'
import { calcLiqValue, calcSpotValueInBase } from '../../utils/math/utils'
import { getTimeUntil } from '../../utils/math/nonContract'
import { removeLiq, removeLiqAsym } from '../../utils/math/router'
import ShareLink from '../../components/Share/ShareLink'
import { getExplorerContract } from '../../utils/extCalls'
import { useFocus } from '../../providers/Focus'

const LiqRemove = () => {
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const pool = usePool()
  const addr = getAddresses()
  const wallet = useWeb3React()
  const sparta = useSparta()
  const focus = useFocus()
  const { t } = useTranslation()

  const [showWalletWarning1, setShowWalletWarning1] = useState(false)
  const [txnLoading, setTxnLoading] = useState(false)
  const [confirmAsym, setConfirmAsym] = useState(false)
  const [activeTab, setActiveTab] = useState('removeTab1')
  const [assetRemove1, setAssetRemove1] = useState('...')
  const [assetRemove2, setAssetRemove2] = useState('...')
  const [poolRemove1, setPoolRemove1] = useState('...')
  const [output1, setoutput1] = useState('0.00')
  const [output2, setoutput2] = useState('0.00')
  const [trigger1, settrigger1] = useState(0)

  useEffect(() => {
    const tryParse = (data) => {
      try {
        return JSON.parse(data)
      } catch (e) {
        return pool.poolDetails[0]
      }
    }
    const getAssetDetails = () => {
      if (focus && pool.poolDetails.length > 0) {
        if (activeTab === 'removeTab1') {
          window.localStorage.setItem('assetType1', 'pool')
          window.localStorage.setItem('assetType2', 'token')
          window.localStorage.setItem('assetType3', 'token')

          let asset1 = tryParse(window.localStorage.getItem('assetSelected1'))
          let asset2 = tryParse(window.localStorage.getItem('assetSelected2'))
          let asset3 = tryParse(window.localStorage.getItem('assetSelected3'))

          asset1 =
            asset1 &&
            asset1.address !== '' &&
            pool.poolDetails.find((x) => x.tokenAddress === asset1.tokenAddress)
              ? asset1
              : { tokenAddress: addr.bnb }
          asset2 = asset1.address !== '' ? asset1 : { tokenAddress: addr.bnb }
          asset3 = { tokenAddress: addr.spartav2 }

          asset1 = getItemFromArray(asset1, pool.poolDetails)
          asset2 = getItemFromArray(asset2, pool.poolDetails)
          asset3 = getItemFromArray(asset3, pool.poolDetails)

          setPoolRemove1(asset1)
          setAssetRemove1(asset2)
          setAssetRemove2(asset3)

          window.localStorage.setItem('assetSelected1', JSON.stringify(asset1))
          window.localStorage.setItem('assetSelected2', JSON.stringify(asset2))
          window.localStorage.setItem('assetSelected3', JSON.stringify(asset3))
        } else if (activeTab === 'removeTab2') {
          window.localStorage.setItem('assetType1', 'pool')
          window.localStorage.setItem('assetType2', 'token')

          let asset1 = tryParse(window.localStorage.getItem('assetSelected1'))
          let asset2 = tryParse(window.localStorage.getItem('assetSelected2'))

          asset1 =
            asset1 &&
            asset1.address !== '' &&
            pool.poolDetails.find((x) => x.tokenAddress === asset1.tokenAddress)
              ? asset1
              : { tokenAddress: addr.bnb }
          asset2 = pool.poolDetails.find(
            (x) => x.tokenAddress === asset2.tokenAddress,
          )
            ? asset2
            : { tokenAddress: addr.spartav2 }
          asset2 =
            asset2.tokenAddress === asset1.tokenAddress || asset2.address === ''
              ? asset2
              : { tokenAddress: addr.spartav2 }

          asset1 = getItemFromArray(asset1, pool.poolDetails)
          asset2 = getItemFromArray(asset2, pool.poolDetails)

          setPoolRemove1(asset1)
          setAssetRemove1(asset2)

          window.localStorage.setItem('assetSelected1', JSON.stringify(asset1))
          window.localStorage.setItem('assetSelected2', JSON.stringify(asset2))
        }
      }
    }
    getAssetDetails()
    balanceWidths()
  }, [
    activeTab,
    addr.bnb,
    addr.spartav2,
    focus,
    pool.poolDetails,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetSelected1'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetSelected2'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.localStorage.getItem('assetSelected3'),
  ])

  const getToken = (tokenAddress) =>
    pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  const removeInput1 = document.getElementById('removeInput1')
  const removeInput2 = document.getElementById('removeInput2')

  const [remLiqState, setRemLiqState] = useState(['0.00', '0.00'])
  /**
   * Get remove liquidity equal (sym) txn details
   * @returns spartaOutput @returns tokenOutput
   */
  const getRemLiq = useCallback(() => {
    if (activeTab === 'removeTab1' && removeInput1 && poolRemove1) {
      const [spartaOutput, tokenOutput] = removeLiq(
        convertToWei(removeInput1.value),
        poolRemove1,
        sparta.globalDetails.feeOnTransfer,
      )
      setRemLiqState([spartaOutput, tokenOutput])
    }
  }, [activeTab, poolRemove1, removeInput1, sparta.globalDetails.feeOnTransfer])

  const [remLiqAsymState, setRemLiqAsymState] = useState([
    '0.00',
    '0.00',
    '0.00',
  ])
  /**
   * Get remove liquidity one-sided (asym) txn details
   * @returns tokensOut @returns swapFee
   */
  const getRemLiqAsym = useCallback(() => {
    if (activeTab === 'removeTab2' && removeInput1 && assetRemove1) {
      const [tokensOut, swapFee, divi] = removeLiqAsym(
        convertToWei(removeInput1.value),
        poolRemove1,
        assetRemove1.tokenAddress === addr.spartav2,
        sparta.globalDetails.feeOnTransfer,
      )
      setRemLiqAsymState([tokensOut, swapFee, divi])
    }
  }, [
    activeTab,
    addr.spartav2,
    assetRemove1,
    poolRemove1,
    removeInput1,
    sparta.globalDetails.feeOnTransfer,
  ])

  const updateRemLiq = useCallback(() => {
    getRemLiq()
    getRemLiqAsym()
  }, [getRemLiq, getRemLiqAsym])

  useEffect(() => {
    updateRemLiq()
  }, [
    activeTab,
    assetRemove1.tokenAddress,
    assetRemove2.tokenAddress,
    updateRemLiq,
    trigger1,
  ])

  useEffect(() => {
    if (activeTab === 'removeTab1' && removeInput1) {
      if (removeInput1.value) {
        setoutput1(remLiqState[1])
        setoutput2(remLiqState[0])
      }
    }
    if (activeTab === 'removeTab2' && removeInput1 && removeInput2) {
      if (removeInput1.value) {
        removeInput2.value = convertFromWei(remLiqAsymState[0])
        setoutput1(remLiqAsymState[0])
      }
    }
  }, [activeTab, remLiqAsymState, remLiqState, removeInput1, removeInput2])

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

  const getTimeNew = () => {
    const timeStamp = BN(poolRemove1?.genesis).plus(oneWeek)
    return getTimeUntil(timeStamp, t)
  }

  //= =================================================================================//
  // Remove liquidity get-value-of functions

  const getOutput1ValueUSD = () => {
    if (assetRemove1 && output1) {
      if (assetRemove1.tokenAddress === addr.spartav2) {
        return BN(output1).times(web3.spartaPrice)
      }
      return calcSpotValueInBase(output1, poolRemove1).times(web3.spartaPrice)
    }
    return '0.00'
  }

  const getLpValueBase = () => {
    if (assetRemove1 && removeInput1?.value) {
      return calcLiqValue(convertToWei(removeInput1.value), poolRemove1)[0]
    }
    return '0.00'
  }

  const getLpValueToken = () => {
    if (assetRemove1 && removeInput1?.value) {
      return calcLiqValue(convertToWei(removeInput1.value), poolRemove1)[1]
    }
    return '0.00'
  }

  const getLpValueUSD = () => {
    if (assetRemove1 && removeInput1?.value) {
      return BN(calcSpotValueInBase(getLpValueToken(), poolRemove1))
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
    const bal = getToken(addr.bnb).balance
    if (BN(bal).isLessThan(estMaxGas)) {
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
    if (poolRemove1.curated && poolRemove1.frozen) {
      return [false, t('poolFrozen')]
    }
    if (!enoughGas()) {
      return [false, t('checkBnbGas')]
    }
    if (BN(convertToWei(removeInput1?.value)).isGreaterThan(getBalance(1))) {
      return [false, t('checkBalance')]
    }
    if (poolRemove1.newPool) {
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
          poolRemove1.tokenAddress,
          wallet,
        ),
      )
    } else {
      await dispatch(
        removeLiquiditySingle(
          convertToWei(removeInput1.value),
          assetRemove1.tokenAddress === addr.spartav2,
          poolRemove1.tokenAddress,
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
                    clearInputs()
                    removeInput1.value = convertFromWei(getBalance(1))
                    settrigger1((prev) => prev + 1)
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
                      {formatShortString(poolRemove1?.address)}
                      <ShareLink url={poolRemove1?.address}>
                        <Icon icon="copy" size="14" className="ms-1 mb-1" />
                      </ShareLink>
                      <a
                        href={getExplorerContract(poolRemove1?.address)}
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
                              activeTab === 'removeTab1' ? addr.spartav2 : '',
                            ]}
                            whiteList={
                              activeTab === 'removeTab2'
                                ? [addr.spartav2, poolRemove1.tokenAddress]
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
                          {formatShortString(assetRemove1?.tokenAddress)}
                          <ShareLink url={assetRemove1?.tokenAddress}>
                            <Icon icon="copy" size="14" className="ms-1 mb-1" />
                          </ShareLink>
                          <a
                            href={getExplorerContract(
                              assetRemove1?.tokenAddress,
                            )}
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
                  {getToken(poolRemove1?.tokenAddress)?.symbol}p
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
                    {getToken(assetRemove1?.tokenAddress)?.symbol}
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
                      getToken(assetRemove1.tokenAddress)?.symbol === 'SPARTA'
                        ? getToken(poolRemove1.tokenAddress)?.symbol
                        : 'SPARTA',
                    token2: getToken(assetRemove1.tokenAddress)?.symbol,
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
                      token1: getToken(assetRemove1.tokenAddress)?.symbol,
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
            {poolRemove1?.tokenAddress &&
              wallet?.account &&
              removeInput1?.value && (
                <Approval
                  tokenAddress={poolRemove1?.address}
                  symbol={`${getToken(poolRemove1.tokenAddress)?.symbol}p`}
                  walletAddress={wallet?.account}
                  contractAddress={addr.router}
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
                {poolRemove1.newPool && (
                  <OverlayTrigger
                    placement="auto"
                    overlay={Tooltip(
                      t,
                      'newPool',
                      `${getToken(assetRemove1.tokenAddress)?.symbol}p`,
                    )}
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

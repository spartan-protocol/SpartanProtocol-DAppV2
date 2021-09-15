import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { ethers } from 'ethers'
import axios from 'axios'
import {
  Button,
  Col,
  Form,
  FormControl,
  InputGroup,
  Modal,
  OverlayTrigger,
  Row,
} from 'react-bootstrap'
import { useWeb3React } from '@web3-react/core'
import Approval from '../../../components/Approval/Approval'
import {
  getAddresses,
  getNetwork,
  getWalletProvider,
} from '../../../utils/web3'
import { BN, convertToWei, formatFromUnits } from '../../../utils/bigNumber'
import { createPoolADD, usePool } from '../../../store/pool'
import { useWeb3 } from '../../../store/web3'
import { getTokenContract } from '../../../utils/web3Contracts'
import WrongNetwork from '../../../components/Common/WrongNetwork'
import { Icon } from '../../../components/Icons/icons'
import { Tooltip } from '../../../components/Tooltip/tooltip'
import { getExplorerTxn } from '../../../utils/extCalls'

const NewPool = () => {
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const pool = usePool()
  const wallet = useWeb3React()
  const addr = getAddresses()
  const { t } = useTranslation()

  const isLightMode = window.localStorage.getItem('theme')

  const [showModal, setShowModal] = useState(false)
  const [ratioConfirm, setRatioConfirm] = useState(false)
  const [feeConfirm, setFeeConfirm] = useState(false)
  const [stage, setStage] = useState(1)

  const [network, setnetwork] = useState(getNetwork())
  const [trigger0, settrigger0] = useState(0)
  const getNet = () => {
    setnetwork(getNetwork())
  }
  useEffect(() => {
    if (trigger0 === 0) {
      getNet()
    }
    const timer = setTimeout(() => {
      getNet()
      settrigger0(trigger0 + 1)
    }, 2000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger0])

  const [trustWalletIndex, setTrustWalletIndex] = useState([])
  const getTrustWalletIndex = async () => {
    setTrustWalletIndex(
      await axios.get(
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/allowlist.json',
      ),
    )
  }
  useEffect(() => {
    getTrustWalletIndex()
  }, [])

  const addrInput = document.getElementById('addrInput')
  const handleAddrChange = (newValue) => {
    if (addrInput) {
      addrInput.value = newValue
    }
  }

  const [tokenInfo, setTokenInfo] = useState(null)
  const [tokenSymbol, setTokenSymbol] = useState('TOKEN')
  const [tokenIcon, setTokenIcon] = useState(null)
  const getTokenInfo = async () => {
    if (network.chainId === 56) {
      const info = await axios.get(
        `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${addrInput?.value}/info.json`,
      )
      setTokenInfo(info.data)
      setTokenIcon(
        `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${addrInput?.value}/logo.png`,
      )
    }
    const provider = getWalletProvider()
    const deployed = await provider.getCode(addrInput?.value)
    const contract = getTokenContract(addrInput?.value)
    let symbol = 'TOKEN'
    try {
      symbol = deployed !== '0x' ? await contract.symbol() : 'TOKEN'
    } catch (e) {
      console.error(e)
      symbol = 'TOKEN'
    }
    setTokenSymbol(symbol)
  }

  const spartaInput = document.getElementById('spartaInput')
  const handleSpartaChange = (newValue) => {
    if (spartaInput) {
      spartaInput.value = newValue
    }
  }

  const tokenInput = document.getElementById('tokenInput')
  const handleTokenChange = (newValue) => {
    if (tokenInput) {
      tokenInput.value = newValue
    }
  }

  const [prevToken, setPrevToken] = useState(null)
  const [addrValid, setaddrValid] = useState(false)
  const handleInvalid = () => {
    setaddrValid(false)
    handleSpartaChange('')
    handleTokenChange('')
  }
  const clearTokenInfo = () => {
    setTokenInfo(false)
    setTokenIcon('')
    setTokenSymbol('TOKEN')
  }
  useEffect(() => {
    if (
      addrInput?.value?.length === 42 &&
      ethers.utils.isAddress(addrInput?.value)
    ) {
      if (
        network.chainId === 97 ||
        trustWalletIndex.data.includes(addrInput?.value)
      ) {
        if (prevToken !== addrInput?.value) {
          getTokenInfo()
        }
        if (network.chainId === 97 || tokenInfo.decimals === 18) {
          setaddrValid(true)
        } else {
          handleInvalid()
        }
      } else {
        handleInvalid()
        clearTokenInfo()
      }
      setPrevToken(addrInput?.value)
    } else {
      handleInvalid()
      clearTokenInfo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addrInput?.value, trustWalletIndex, showModal, tokenInfo])

  const [spartaValid, setSpartaValid] = useState(false)
  useEffect(() => {
    if (spartaInput?.value >= 10000) {
      setSpartaValid(true)
    } else {
      setSpartaValid(false)
    }
  }, [spartaInput?.value])

  const [tokenValid, setTokenValid] = useState(false)
  useEffect(() => {
    if (tokenInput?.value > 0.0000000000001) {
      setTokenValid(true)
    } else {
      setTokenValid(false)
    }
  }, [tokenInput?.value])

  const [formValid, setformValid] = useState(false)
  useEffect(() => {
    if (addrValid && spartaValid && tokenValid) {
      setformValid(true)
    } else {
      setformValid(false)
    }
  }, [addrValid, spartaValid, tokenValid])

  const handleSubmit = async () => {
    await dispatch(
      createPoolADD(
        convertToWei(spartaInput?.value),
        convertToWei(tokenInput?.value),
        addrInput?.value,
        wallet,
      ),
    )
  }

  const handleModalClear = () => {
    handleAddrChange('')
    handleSpartaChange('')
    handleTokenChange('')
    setTokenSymbol('TOKEN')
  }
  useEffect(() => {
    if (showModal !== true) {
      handleModalClear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal])

  const priceInSparta = () => {
    const price = BN(tokenInput?.value).div(spartaInput?.value)
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
    const price = BN(spartaInput?.value).div(tokenInput?.value)
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
    let price = BN(spartaInput?.value).div(tokenInput?.value)
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
      <Button
        variant={isLightMode ? 'secondary' : 'info'}
        onClick={() => setShowModal(true)}
        className="rounded-pill pe-3 subtitle-label"
      >
        <Icon icon="plus" fill="white" size="17" className="me-1 mb-1" />
        {t('pool')}
      </Button>

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false)
          setStage(1)
        }}
        centered
      >
        {network.chainId === 97 && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{t('createPool')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {network.chainId === 56 &&
                trustWalletIndex.data?.includes(addrInput?.value) &&
                tokenInfo && (
                  <div className="text-sm-label-alt text-center">
                    <img
                      src={tokenIcon}
                      height="30px"
                      alt="tokenIcon"
                      className="me-2"
                    />
                    {`${tokenInfo.symbol} | ${tokenInfo.decimals} decimals | ${tokenInfo.name}`}
                  </div>
                )}
              <InputGroup className="my-2">
                <InputGroup.Text>{t('address')}</InputGroup.Text>
                <FormControl
                  id="addrInput"
                  placeholder="0x..."
                  inputMode="text"
                  autoComplete="off"
                  autoCorrect="off"
                  isValid={addrValid}
                  isInvalid={!addrValid}
                />
                <Form.Control.Feedback type="invalid">
                  Input a valid token address (18 decimal BEP20 asset listed in
                  the{' '}
                  <a
                    href="https://github.com/trustwallet/assets/tree/master/blockchains/smartchain"
                    target="_blank"
                    rel="noreferrer"
                  >
                    TrustWallet repo
                  </a>
                  )
                </Form.Control.Feedback>
              </InputGroup>
              Initial liquidity-add:
              <InputGroup className="my-2">
                <InputGroup.Text style={{ width: '73.6719px' }}>
                  SPARTA
                </InputGroup.Text>
                <FormControl
                  id="spartaInput"
                  placeholder="$SPARTA"
                  type="number"
                  autoComplete="off"
                  autoCorrect="off"
                  isValid={spartaValid}
                  isInvalid={!spartaValid && addrValid}
                  disabled={!addrValid}
                />
                <Form.Control.Feedback type="invalid">
                  Minimum of 10,000 SPARTA required
                </Form.Control.Feedback>
              </InputGroup>
              <InputGroup className="my-2">
                <InputGroup.Text style={{ width: '73.6719px' }}>
                  {tokenSymbol}
                </InputGroup.Text>
                <FormControl
                  id="tokenInput"
                  placeholder={`$${tokenSymbol}`}
                  type="number"
                  autoComplete="off"
                  autoCorrect="off"
                  isValid={tokenValid}
                  isInvalid={!tokenValid && addrValid && spartaValid}
                  disabled={!addrValid}
                />
                <Form.Control.Feedback type="invalid">
                  Make sure you thoroughly check the ratio of the assets being
                  added
                </Form.Control.Feedback>
              </InputGroup>
              <div className="output-card text-center my-2">
                1 SPARTA = {priceInSparta()} {tokenSymbol}
                <br />1 {tokenSymbol} = {priceInToken()} SPARTA
                <br />1 {tokenSymbol} = ~${priceinUSD()} USD
              </div>
              <Form>
                <div className="text-center">
                  <Form.Check
                    id="inputConfirmRatio"
                    type="switch"
                    className="d-inline-block"
                    label="Confirm ratio!"
                    checked={ratioConfirm}
                    isValid={ratioConfirm}
                    isInvalid={!ratioConfirm}
                    onChange={() => {
                      setRatioConfirm(!ratioConfirm)
                    }}
                  />
                  <OverlayTrigger
                    placement="auto"
                    overlay={Tooltip(t, 'newPoolRatio')}
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
                </div>
                <div className="text-center">
                  <Form.Check
                    id="feeConfirm"
                    type="switch"
                    className="d-inline-block"
                    label="Confirm 1% fee!"
                    checked={feeConfirm}
                    isValid={feeConfirm}
                    isInvalid={!feeConfirm}
                    onChange={() => {
                      setFeeConfirm(!feeConfirm)
                    }}
                  />
                  <OverlayTrigger
                    placement="auto"
                    overlay={Tooltip(t, 'newPoolFee')}
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
                </div>
              </Form>
            </Modal.Body>
            <Modal.Footer className="text-center">
              <Row xs="12" className="w-100">
                {stage === 1 && (
                  <>
                    {wallet?.account && spartaInput?.value > 0 && (
                      <Approval
                        tokenAddress={addr.spartav2}
                        symbol="SPARTA"
                        walletAddress={wallet.account}
                        contractAddress={addr.poolFactory}
                        txnAmount={convertToWei(spartaInput?.value)}
                        assetNumber="1"
                      />
                    )}
                    <Col xs="12" className="hide-if-siblings">
                      <Button
                        variant="primary"
                        disabled={!ratioConfirm || !formValid || !feeConfirm}
                        onClick={async () => {
                          setStage(2)
                          await handleSubmit()
                          setStage(3)
                        }}
                      >
                        {t('createPool')}
                      </Button>
                    </Col>
                    {wallet?.account &&
                      tokenInput?.value > 0 &&
                      addrInput?.value !== addr.bnb && (
                        <Approval
                          tokenAddress={addrInput?.value}
                          symbol={tokenSymbol}
                          walletAddress={wallet.account}
                          contractAddress={addr.poolFactory}
                          txnAmount={convertToWei(tokenInput?.value)}
                          assetNumber="2"
                        />
                      )}
                  </>
                )}
                {stage === 2 && (
                  <>
                    <Col xs="3">
                      <Button
                        variant="primary"
                        className="w-100"
                        onClick={() => setStage(1)}
                      >
                        <Icon icon="arrowLeft" size="25" className="pb-1" />
                      </Button>
                    </Col>
                    <Col xs="9">
                      <Button variant="primary" className="w-100" disabled>
                        {t('viewBscScan')}{' '}
                        <Icon icon="cycle" size="25" className="anim-spin" />
                      </Button>
                    </Col>
                  </>
                )}
                {stage === 3 && (
                  <>
                    <Col xs="3">
                      <Button
                        variant="primary"
                        className="w-100"
                        onClick={() => setStage(1)}
                      >
                        <Icon
                          icon="arrowLeft"
                          size="25"
                          className="pb-1 pe-1"
                        />
                      </Button>
                    </Col>
                    <Col xs="9">
                      <a
                        href={getExplorerTxn(pool.newPool.transactionHash)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button variant="primary" className="w-100">
                          {t('viewBscScan')}{' '}
                          <Icon icon="scan" size="15" className="ms-1 mb-1" />
                        </Button>
                      </a>
                    </Col>
                  </>
                )}
              </Row>
            </Modal.Footer>
          </>
        )}
        {network.chainId !== 97 && (
          <Modal.Body>
            <WrongNetwork />
          </Modal.Body>
        )}
      </Modal>
    </>
  )
}

export default NewPool

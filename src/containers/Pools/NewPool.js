import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Row from 'react-bootstrap/Row'
import Modal from 'react-bootstrap/Modal'
import { useAccount, useWalletClient } from 'wagmi'
import { isAddress } from 'viem'
import Approval from '../../components/Approval/index'
import {
  getTwTokenInfo,
  getTwTokenLogo,
  getWalletProvider,
  tempChains,
} from '../../utils/web3'
import { BN, convertToWei, formatFromUnits } from '../../utils/bigNumber'
import { createPoolADD, usePool } from '../../store/pool'
import { useWeb3 } from '../../store/web3'
import { useApp } from '../../store/app'
import { getTokenContract } from '../../utils/getContracts'
import WrongNetwork from '../../components/WrongNetwork/index'
import { Icon } from '../../components/Icons/index'
import { Tooltip } from '../../components/Tooltip/index'
import { getToken } from '../../utils/math/utils'
import HelmetLoading from '../../components/Spinner/index'

const minBase = 50000

const NewPool = ({ setShowModal, showModal }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()

  const { chainId, addresses } = useApp()
  const pool = usePool()
  const web3 = useWeb3()

  const [txnLoading, setTxnLoading] = useState(false)
  const [ratioConfirm, setRatioConfirm] = useState(false)
  const [feeConfirm, setFeeConfirm] = useState(false)

  const addrInput = document.getElementById('addrInput')

  const [tokenInfo, setTokenInfo] = useState(null)
  const [tokenSymbol, setTokenSymbol] = useState('TOKEN')
  const [tokenIcon, setTokenIcon] = useState(
    `${window.location.origin}/images/icons/Fallback.svg`,
  )

  const spartaInput = document.getElementById('spartaInput')
  const handleSpartaChange = useCallback(
    (newValue) => {
      if (spartaInput) {
        spartaInput.value = newValue
      }
    },
    [spartaInput],
  )

  const tokenInput = document.getElementById('tokenInput')
  const handleTokenChange = useCallback(
    (newValue) => {
      if (tokenInput) {
        tokenInput.value = newValue
      }
    },
    [tokenInput],
  )

  const [priceInSparta, setPriceInSparta] = useState(null)
  const [priceInToken, setPriceInToken] = useState(null)
  const [priceInUsd, setPriceInUsd] = useState(null)

  const handleCalcPrices = () => {
    let spartaPrice = BN(tokenInput?.value).div(spartaInput?.value)
    if (spartaPrice > 10) {
      spartaPrice = formatFromUnits(spartaPrice, 2)
    }
    if (spartaPrice > 1) {
      spartaPrice = formatFromUnits(spartaPrice, 4)
    }
    if (spartaPrice > 0) {
      spartaPrice = formatFromUnits(spartaPrice, 6)
    }
    setPriceInSparta(spartaPrice)

    let tokenPrice = BN(spartaInput?.value).div(tokenInput?.value)
    if (tokenPrice > 10) {
      tokenPrice = formatFromUnits(tokenPrice, 2)
    }
    if (tokenPrice > 1) {
      tokenPrice = formatFromUnits(tokenPrice, 4)
    }
    if (tokenPrice > 0) {
      tokenPrice = formatFromUnits(tokenPrice, 6)
    }
    setPriceInToken(tokenPrice)

    let usdPrice = BN(spartaInput?.value).div(tokenInput?.value)
    usdPrice = usdPrice.times(
      web3.spartaPrice > 0 ? web3.spartaPrice : web3.spartaPriceInternal,
    )
    if (usdPrice > 10) {
      usdPrice = formatFromUnits(usdPrice, 2)
    }
    if (usdPrice > 1) {
      usdPrice = formatFromUnits(usdPrice, 4)
    }
    if (usdPrice > 0) {
      usdPrice = formatFromUnits(usdPrice, 6)
    }
    setPriceInUsd(usdPrice)
  }

  const [prevToken, setPrevToken] = useState(null)
  const [addrValid, setaddrValid] = useState(false)
  const clearTokenInfo = () => {
    setTokenInfo(false)
    setTokenIcon(`${window.location.origin}/images/icons/Fallback.svg`)
    setTokenSymbol('TOKEN')
  }

  const fetchTokenInfo = async (tokenAddr, rpcs) => {
    if (chainId === 56) {
      const info = await getTwTokenInfo(tokenAddr)
      if (info) {
        setTokenInfo(info)
        if (info.decimals === 18) {
          setaddrValid(true)
        } else {
          setaddrValid(false)
        }
      }
      setTokenIcon(await getTwTokenLogo(tokenAddr, chainId))
    }
    const provider = getWalletProvider(null, rpcs)
    const deployed = await provider.getBytecode({ tokenAddr })
    const contract = getTokenContract(tokenAddr, null, rpcs)
    let symbol = 'TOKEN'
    try {
      symbol = deployed !== '0x' ? await contract.read.symbol() : 'TOKEN'
    } catch (e) {
      console.error(e)
      symbol = 'TOKEN'
    }
    setTokenSymbol(symbol)
  }

  const handleGetTokenInfo = async () => {
    const handleInvalid = () => {
      setaddrValid(false)
      handleSpartaChange('')
      handleTokenChange('')
      clearTokenInfo()
    }
    if (!addrInput.value?.length === 42 || !isAddress(addrInput.value)) {
      handleInvalid()
      return // Address is not valid
    }
    if (!tempChains.includes(chainId)) {
      handleInvalid()
      return // Chain is not valid
    }
    if (prevToken !== addrInput.value) {
      await fetchTokenInfo(addrInput.value, web3.rpcs) // Fetch token info
    }
    setPrevToken(addrInput.value)
  }

  const [spartaValid, setSpartaValid] = useState(false)
  const handleSpartaChangeValid = () => {
    if (spartaInput?.value >= minBase && spartaInput?.value <= 100000) {
      setSpartaValid(true)
    } else {
      setSpartaValid(false)
    }
    handleCalcPrices()
  }

  const [tokenValid, setTokenValid] = useState(false)
  const handleTokenChangeValid = () => {
    if (tokenInput?.value > 0.0000000000001) {
      setTokenValid(true)
    } else {
      setTokenValid(false)
    }
    handleCalcPrices()
  }

  const [formValid, setformValid] = useState(false)
  useEffect(() => {
    if (addrValid && spartaValid && tokenValid) {
      setformValid(true)
    } else {
      setformValid(false)
    }
  }, [addrValid, spartaValid, tokenValid])

  const handleSubmit = async () => {
    setTxnLoading(true)
    await dispatch(
      createPoolADD(
        convertToWei(spartaInput?.value),
        convertToWei(tokenInput?.value),
        addrInput?.value,
        address,
        walletClient,
      ),
    )
    setTxnLoading(false)
    setShowModal(false)
  }

  useEffect(() => {
    const handleAddrChange = (newValue) => {
      if (addrInput) {
        addrInput.value = newValue
      }
    }
    const handleModalClear = () => {
      handleAddrChange('')
      handleSpartaChange('')
      handleTokenChange('')
      setRatioConfirm(false)
      setFeeConfirm(false)
      setTokenSymbol('TOKEN')
    }
    if (showModal !== true) {
      handleModalClear()
    }
  }, [addrInput, handleSpartaChange, handleTokenChange, showModal])

  const isLoading = () => {
    if (!pool.tokenDetails) {
      return true
    }
    return false
  }

  // ~0.0385 BNB gas on TN || ~0.02 BNB on MN
  const estMaxGas = '20000000000000000'
  const enoughGas = () => {
    const bal = getToken(addresses.bnb, pool.tokenDetails).balance
    if (BN(bal).isLessThan(estMaxGas)) {
      return false
    }
    return true
  }

  const checkValid = () => {
    if (!address) {
      return [false, t('checkWallet')]
    }
    if (!enoughGas()) {
      return [false, t('checkBnbGas')]
    }
    if (!formValid) {
      return [false, t('checkInputs')]
    }
    if (!ratioConfirm) {
      return [false, t('confirmRatio')]
    }
    if (!feeConfirm) {
      return [false, t('confirmFee')]
    }
    return [true, t('createPool')]
  }

  return (
    <>
      {showModal && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          {tempChains.includes(chainId) && (
            <>
              <Modal.Header closeButton>
                <Modal.Title>{t('createPool')}</Modal.Title>
              </Modal.Header>
              {!isLoading() ? (
                <>
                  <Modal.Body>
                    {chainId === 56 && tokenInfo && (
                      <div className="text-sm-label-alt text-center">
                        <>
                          <img
                            src={tokenIcon}
                            height="30px"
                            alt="tokenIcon"
                            className="me-2 rounded-circle"
                          />
                          {`${tokenInfo.symbol} | ${tokenInfo.decimals} decimals | ${tokenInfo.name}`}
                        </>
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
                        onChange={() => handleGetTokenInfo()}
                      />
                      <Form.Control.Feedback type="invalid">
                        {t('invalidTokenAddress')}{' '}
                        <a
                          href="https://github.com/trustwallet/assets/tree/master/blockchains/smartchain"
                          target="_blank"
                          rel="noreferrer"
                        >
                          TrustWallet repo
                        </a>
                      </Form.Control.Feedback>
                    </InputGroup>
                    {t('initialLiquidityAdd')}:
                    <InputGroup className="my-2">
                      <InputGroup.Text style={{ width: '73.6719px' }}>
                        SPARTA
                      </InputGroup.Text>
                      <FormControl
                        id="spartaInput"
                        placeholder="$SPARTA"
                        type="number"
                        min="0"
                        step="any"
                        autoComplete="off"
                        autoCorrect="off"
                        isValid={spartaValid}
                        isInvalid={!spartaValid && addrValid}
                        disabled={!addrValid}
                        onChange={() => handleSpartaChangeValid()}
                      />
                      <Form.Control.Feedback type="invalid">
                        Must be between {minBase / 1000}K - 100K SPARTA
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
                        min="0"
                        step="any"
                        autoComplete="off"
                        autoCorrect="off"
                        isValid={tokenValid}
                        isInvalid={!tokenValid && addrValid && spartaValid}
                        disabled={!addrValid}
                        onChange={() => handleTokenChangeValid()}
                      />
                      <Form.Control.Feedback type="invalid">
                        Make sure you thoroughly check the ratio of the assets
                        being added
                      </Form.Control.Feedback>
                    </InputGroup>
                    {tokenSymbol && (
                      <div className="output-card text-center my-2">
                        {priceInSparta &&
                          `1 SPARTA = ${priceInSparta} ${tokenSymbol}`}
                        <br />
                        {priceInToken &&
                          `1 ${tokenSymbol} = ${priceInToken} SPARTA`}
                        <br />
                        {priceInUsd && `1 ${tokenSymbol} = ~$${priceInUsd} USD`}
                      </div>
                    )}
                    <Form>
                      <div className="text-center">
                        <Form.Check
                          id="inputConfirmRatio"
                          type="switch"
                          className="d-inline-block"
                          label={`${t('confirmRatio')}!`}
                          checked={ratioConfirm}
                          isValid={ratioConfirm}
                          isInvalid={!ratioConfirm}
                          onChange={() => setRatioConfirm(!ratioConfirm)}
                        />
                        <OverlayTrigger
                          placement="auto"
                          overlay={Tooltip(t, 'newPoolRatio')}
                        >
                          <span role="button">
                            <Icon icon="info" className="ms-1" size="17" />
                          </span>
                        </OverlayTrigger>
                      </div>
                      <div className="text-center">
                        <Form.Check
                          id="feeConfirm"
                          type="switch"
                          className="d-inline-block"
                          label={`${t('confirmNewPoolFee')}!`}
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
                            <Icon icon="info" className="ms-1" size="17" />
                          </span>
                        </OverlayTrigger>
                      </div>
                    </Form>
                  </Modal.Body>

                  <Modal.Footer className="text-center">
                    <Row xs="12" className="w-100">
                      {address && spartaInput?.value > 0 && (
                        <Approval
                          tokenAddress={addresses.spartav2}
                          symbol="SPARTA"
                          walletAddress={address}
                          contractAddress={addresses.poolFactory}
                          txnAmount={convertToWei(spartaInput?.value)}
                          assetNumber="1"
                        />
                      )}
                      <Col xs="12" className="hide-if-siblings">
                        <Button
                          variant="primary"
                          disabled={!checkValid()[0]}
                          onClick={() => handleSubmit()}
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
                      {address &&
                        tokenInput?.value > 0 &&
                        addrInput?.value !== addresses.bnb && (
                          <Approval
                            tokenAddress={addrInput?.value}
                            symbol={tokenSymbol}
                            walletAddress={address}
                            contractAddress={addresses.poolFactory}
                            txnAmount={convertToWei(tokenInput?.value)}
                            assetNumber="2"
                          />
                        )}
                    </Row>
                  </Modal.Footer>
                </>
              ) : (
                <HelmetLoading height={150} width={150} />
              )}
            </>
          )}
          {!tempChains.includes(chainId) && (
            <Modal.Body>
              <WrongNetwork />
            </Modal.Body>
          )}
        </Modal>
      )}
    </>
  )
}

export default NewPool

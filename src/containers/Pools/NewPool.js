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

  const [prevToken, setPrevToken] = useState(null)
  const [addrValid, setaddrValid] = useState(false)
  const clearTokenInfo = () => {
    setTokenInfo(false)
    setTokenIcon(`${window.location.origin}/images/icons/Fallback.svg`)
    setTokenSymbol('TOKEN')
  }

  useEffect(() => {
    const getTokenInfo = async () => {
      if (chainId === 56) {
        const info = await getTwTokenInfo(addrInput?.value)
        if (info) {
          setTokenInfo(info)
        }
        setTokenIcon(await getTwTokenLogo(addrInput?.value, chainId))
      }
      const provider = getWalletProvider(null, web3.rpcs)
      const deployed = await provider.getBytecode({ address: addrInput?.value })
      const contract = getTokenContract(addrInput?.value, null, web3.rpcs)
      let symbol = 'TOKEN'
      try {
        symbol = deployed !== '0x' ? await contract.read.symbol() : 'TOKEN'
      } catch (e) {
        console.error(e)
        symbol = 'TOKEN'
      }
      setTokenSymbol(symbol)
    }
    const handleInvalid = () => {
      setaddrValid(false)
      handleSpartaChange('')
      handleTokenChange('')
    }
    if (addrInput?.value?.length === 42 && isAddress(addrInput?.value)) {
      if (tempChains.includes(chainId)) {
        if (prevToken !== addrInput?.value) {
          getTokenInfo()
        }
        if (tokenInfo.decimals === 18) {
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
  }, [
    addrInput?.value,
    showModal,
    tokenInfo,
    prevToken,
    handleSpartaChange,
    handleTokenChange,
    web3.rpcs,
    chainId,
  ])

  const [spartaValid, setSpartaValid] = useState(false)
  useEffect(() => {
    if (spartaInput?.value >= minBase && spartaInput?.value <= 100000) {
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
    price = price.times(
      web3.spartaPrice > 0 ? web3.spartaPrice : web3.spartaPriceInternal,
    )
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
                        )
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
                      />
                      <Form.Control.Feedback type="invalid">
                        Make sure you thoroughly check the ratio of the assets
                        being added
                      </Form.Control.Feedback>
                    </InputGroup>
                    <div className="output-card text-center my-2">
                      1 SPARTA = {priceInSparta()} {tokenSymbol}
                      <br />1 {tokenSymbol} = {priceInToken()} SPARTA
                      <br />1 {tokenSymbol} = ~$
                      {priceinUSD()} USD
                    </div>
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

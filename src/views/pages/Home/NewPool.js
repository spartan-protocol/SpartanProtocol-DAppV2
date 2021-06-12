import React, { useState, useEffect } from 'react'
import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
  CardHeader,
  CardTitle,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Input,
  FormGroup,
  CustomInput,
} from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { Modal } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { ethers } from 'ethers'
import axios from 'axios'
import { ReactComponent as PlusIcon } from '../../../assets/icons/icon-plus.svg'
import Approval from '../../../components/Approval/Approval'
import {
  getAddresses,
  getNetwork,
  getWalletProvider,
} from '../../../utils/web3'
import { BN, convertToWei, formatFromUnits } from '../../../utils/bigNumber'
import { ReactComponent as InvalidIcon } from '../../../assets/icons/unchecked.svg'
import { ReactComponent as ValidIcon } from '../../../assets/icons/checked.svg'
import { createPoolADD } from '../../../store/pool'
import { useWeb3 } from '../../../store/web3'
import { getTokenContract } from '../../../utils/web3Contracts'

const NewPool = () => {
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const wallet = useWallet()
  const addr = getAddresses()
  const { t } = useTranslation()

  const [showModal, setShowModal] = useState(false)
  const [ratioConfirm, setRatioConfirm] = useState(false)

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
    if (tokenInput?.value > 0) {
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

  const handleSubmit = () => {
    dispatch(
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
        className="align-self-center btn-sm btn-secondary"
        onClick={() => setShowModal(true)}
      >
        <PlusIcon fill="white" className="mr-2" />
        {t('pool')}
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Card>
          <CardHeader>
            <CardTitle tag="h2" />
            <Row>
              <Col xs="10">
                <h2>{t('createPool')}</h2>
              </Col>
              <Col xs="2">
                <Button
                  style={{
                    right: '16px',
                  }}
                  onClick={() => setShowModal(false)}
                  className="btn btn-transparent"
                >
                  <i className="icon-small icon-close" />
                </Button>
              </Col>
            </Row>
          </CardHeader>

          <Row className="card-body py-1">
            <Col xs="12">
              <Card className="card-share">
                <CardBody className="py-3">
                  {/* <h4 className="card-title">Desc</h4> */}
                  <Row>
                    <Col xs="12">
                      {network.chainId === 56 &&
                        trustWalletIndex.data?.includes(addrInput?.value) &&
                        tokenInfo && (
                          <div className="text-sm-label-alt text-center">
                            <img
                              src={tokenIcon}
                              height="45px"
                              alt="tokenIcon"
                              className="mr-2"
                            />
                            {`${tokenInfo.symbol} | ${tokenInfo.decimals} decimals | ${tokenInfo.name}`}
                          </div>
                        )}
                      <InputGroup className="mt-2">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>Address</InputGroupText>
                        </InputGroupAddon>
                        <Input
                          id="addrInput"
                          placeholder="0x..."
                          type="text"
                          inputMode="decimal"
                          pattern="^[0-9]*[.,]?[0-9]*$"
                          autoComplete="off"
                          autoCorrect="off"
                        />
                        <InputGroupAddon addonType="append">
                          <InputGroupText className="p-1">
                            {addrValid ? (
                              <ValidIcon fill="green" height="30" width="30" />
                            ) : (
                              <InvalidIcon fill="red" height="30" width="30" />
                            )}
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <div className="text-sm-label-alt pb-2 text-center">
                        Input a valid token address (18 decimal BEP20 asset
                        listed in the{' '}
                        <a
                          href="https://github.com/trustwallet/assets/tree/master/blockchains/smartchain"
                          target="_blank"
                          rel="noreferrer"
                        >
                          TrustWallet repo
                        </a>
                        )
                      </div>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>Input</InputGroupText>
                        </InputGroupAddon>
                        <Input
                          id="spartaInput"
                          placeholder=""
                          type="number"
                          inputMode="decimal"
                          autoComplete="off"
                          autoCorrect="off"
                          disabled={!addrValid}
                        />
                        <InputGroupAddon addonType="append">
                          <InputGroupText className="p-1">
                            SPARTA
                          </InputGroupText>
                        </InputGroupAddon>
                        <InputGroupAddon addonType="append">
                          <InputGroupText className="p-1">
                            {spartaValid ? (
                              <ValidIcon fill="green" height="30" width="30" />
                            ) : (
                              <InvalidIcon fill="red" height="30" width="30" />
                            )}
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>Input</InputGroupText>
                        </InputGroupAddon>
                        <Input
                          id="tokenInput"
                          placeholder=""
                          type="number"
                          inputMode="decimal"
                          autoComplete="off"
                          autoCorrect="off"
                          disabled={!addrValid}
                        />
                        <InputGroupAddon addonType="append">
                          <InputGroupText className="p-1">
                            {tokenSymbol}
                          </InputGroupText>
                        </InputGroupAddon>
                        <InputGroupAddon addonType="append">
                          <InputGroupText className="p-1">
                            {tokenValid ? (
                              <ValidIcon fill="green" height="30" width="30" />
                            ) : (
                              <InvalidIcon fill="red" height="30" width="30" />
                            )}
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <div className="text-sm-label-alt pb-2 text-center">
                        Minimum of 10,000 SPARTA required
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <div className="output-card text-center mb-2">
                1 SPARTA = {priceInSparta()} {tokenSymbol}
                <br />1 {tokenSymbol} = {priceInToken()} SPARTA
                <br />1 {tokenSymbol} = ~${priceinUSD()} USD
              </div>
              <FormGroup>
                <div className="text-center">
                  <CustomInput
                    type="switch"
                    id="inputConfirmRatio"
                    label="Confirm ratio! Avoid getting rekt!"
                    checked={ratioConfirm}
                    onChange={() => setRatioConfirm(!ratioConfirm)}
                  />
                </div>
              </FormGroup>
            </Col>
          </Row>

          <Row className="card-body">
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
                block
                className="btn-fill btn-primary"
                disabled={!ratioConfirm || !formValid}
                onClick={() => handleSubmit()}
              >
                {t('confirm')}
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
          </Row>
        </Card>
      </Modal>
    </>
  )
}

export default NewPool

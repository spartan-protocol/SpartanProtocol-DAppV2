/* eslint-disable no-unused-vars */
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
import { getAddresses } from '../../../utils/web3'
import { convertToWei } from '../../../utils/bigNumber'
import { ReactComponent as InvalidIcon } from '../../../assets/icons/unchecked.svg'
import { ReactComponent as ValidIcon } from '../../../assets/icons/checked.svg'
import { useSparta } from '../../../store/sparta/selector'

const NewPool = () => {
  const dispatch = useDispatch()
  const sparta = useSparta()
  const wallet = useWallet()
  const addr = getAddresses()
  const { t } = useTranslation()

  const [showModal, setShowModal] = useState(false)
  const [ratioConfirm, setRatioConfirm] = useState(false)

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

  const [inputAddress, setinputAddress] = useState(null)
  const addrInput = document.getElementById('addrInput')
  const handleAddrChange = (newValue) => {
    if (addrInput) {
      setinputAddress(newValue)
      addrInput.value = newValue
    }
  }

  const [tokenInfo, setTokenInfo] = useState(null)
  const [tokenIcon, setTokenIcon] = useState(null)
  const [infoLoaded, setInfoLoaded] = useState(false)
  const getTokenInfo = async () => {
    if (!infoLoaded) {
      const info = await axios.get(
        `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${inputAddress}/info.json`,
      )
      setTokenInfo(info.data)
      setTokenIcon(
        `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${inputAddress}/logo.png`,
      )
    }
  }

  const [inputSparta, setInputSparta] = useState(null)
  const spartaInput = document.getElementById('spartaInput')
  const handleSpartaChange = (newValue) => {
    if (spartaInput) {
      setInputSparta(newValue)
      spartaInput.value = newValue
    }
  }

  const [inputToken, setInputToken] = useState(null)
  const tokenInput = document.getElementById('tokenInput')
  const handleTokenChange = (newValue) => {
    if (tokenInput) {
      setInputToken(newValue)
      tokenInput.value = newValue
    }
  }

  const [addrValid, setaddrValid] = useState(false)
  const handleInvalid = () => {
    setaddrValid(false)
    handleSpartaChange('')
    handleTokenChange('')
    setInfoLoaded(false)
  }
  const clearTokenInfo = () => {
    setTokenInfo(false)
    setTokenIcon('')
  }
  useEffect(() => {
    if (inputAddress?.length === 42 && ethers.utils.isAddress(inputAddress)) {
      if (trustWalletIndex.data.includes(inputAddress)) {
        getTokenInfo()
        setInfoLoaded(true)
        if (tokenInfo.decimals === 18) {
          setaddrValid(true)
        } else {
          handleInvalid()
        }
      } else {
        handleInvalid()
        clearTokenInfo()
      }
    } else {
      handleInvalid()
      clearTokenInfo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputAddress, trustWalletIndex, showModal, tokenInfo])

  const [spartaValid, setSpartaValid] = useState(false)
  useEffect(() => {
    if (inputSparta >= 10000) {
      setSpartaValid(true)
    } else {
      setSpartaValid(false)
    }
  }, [inputSparta])

  const [tokenValid, setTokenValid] = useState(false)
  useEffect(() => {
    if (inputToken > 0) {
      setTokenValid(true)
    } else {
      setTokenValid(false)
    }
  }, [inputToken])

  const [formValid, setformValid] = useState(false)
  useEffect(() => {
    if (addrValid && spartaValid && tokenValid) {
      setformValid(true)
    } else {
      setformValid(false)
    }
  }, [addrValid, spartaValid, tokenValid])

  const handleSubmit = () => {
    console.log('add dispatch here to the create pool action')
  }

  const handleModalClear = () => {
    handleAddrChange('')
    handleSpartaChange('')
    handleTokenChange('')
    setInfoLoaded(false)
  }
  useEffect(() => {
    if (showModal !== true) {
      handleModalClear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal])

  return (
    <>
      <Button
        className="align-self-center btn-sm btn-secondary"
        onClick={() => setShowModal(true)}
      >
        {t('createPool')}
        <PlusIcon fill="white" className="ml-2 mb-1" />
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
                      {trustWalletIndex.data?.includes(inputAddress) &&
                        tokenInfo && (
                          <div className="text-sm-label-alt">
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
                          onChange={(e) => setinputAddress(e.target.value)}
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
                      <div className="text-sm-label-alt pb-2">
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
                          onChange={(e) => setInputSparta(e.target.value)}
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
                          onChange={(e) => setInputToken(e.target.value)}
                        />
                        <InputGroupAddon addonType="append">
                          <InputGroupText className="p-1">TOKEN</InputGroupText>
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
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <FormGroup>
                <div className="text-center">
                  <CustomInput
                    type="switch"
                    id="inputConfirmRatio"
                    label="Confirm Ratio of: "
                    checked={ratioConfirm}
                    onChange={() => setRatioConfirm(!ratioConfirm)}
                  />
                </div>
              </FormGroup>
            </Col>
          </Row>

          <Row className="card-body">
            {wallet?.account && (
              <Approval
                tokenAddress={addr.spartav2}
                symbol="SPARTA"
                walletAddress={wallet.account}
                contractAddress={addr.dao}
                txnAmount={convertToWei('100')}
                assetNumber="1"
              />
            )}
            <Col xs="12" className="hide-if-prior-sibling">
              <Button
                block
                className="btn-fill btn-primary"
                disabled={!ratioConfirm || !formValid}
                onClick={() => handleSubmit()}
              >
                {t('confirm')}
              </Button>
            </Col>
          </Row>
        </Card>
      </Modal>
    </>
  )
}

export default NewPool

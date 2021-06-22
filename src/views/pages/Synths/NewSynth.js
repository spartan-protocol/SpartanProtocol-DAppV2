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
import { ethers } from 'ethers'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus.svg'
import { ReactComponent as InvalidIcon } from '../../../assets/icons/unchecked.svg'
import { ReactComponent as ValidIcon } from '../../../assets/icons/checked.svg'
import AssetSelect from './components/AssetSelect'
import { createSynth } from '../../../store/synth'
import { getNetwork } from '../../../utils/web3'
import WrongNetwork from '../../../components/Common/WrongNetwork'

const NewSynth = () => {
  const dispatch = useDispatch()
  const wallet = useWallet()
  const { t } = useTranslation()

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

  const [showModal, setShowModal] = useState(false)
  const [feeConfirm, setfeeConfirm] = useState(false)

  const [inputAddress, setinputAddress] = useState('')
  const addrInput = document.getElementById('addrInput')
  const handleAddrChange = (newValue) => {
    if (addrInput) {
      setinputAddress(newValue)
      addrInput.value = newValue
    }
  }

  const [addrValid, setaddrValid] = useState(false)
  useEffect(() => {
    if (inputAddress?.length === 42 && ethers.utils.isAddress(inputAddress)) {
      setaddrValid(true)
    } else {
      setaddrValid(false)
    }
  }, [inputAddress, showModal])

  const handleSubmit = () => {
    dispatch(createSynth(inputAddress, wallet))
  }

  return (
    <>
      <Button
        className="align-self-center btn-sm btn-secondary"
        onClick={() => setShowModal(true)}
      >
        {t('synth')}
        <PlusIcon fill="white" className="ml-2 mb-1" />
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Card>
          {network.chainId === 97 && (
            <>
              <CardHeader>
                <CardTitle tag="h2" />
                <Row>
                  <Col xs="10">
                    <h2>{t('newSynth')}</h2>
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
                      <h4 className="card-title">
                        Choose Synth Asset to Deploy
                      </h4>
                      <Row>
                        <Col xs="12">
                          <AssetSelect handleAddrChange={handleAddrChange} />

                          <InputGroup>
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
                              disabled
                              value={inputAddress}
                            />
                            <InputGroupAddon addonType="append">
                              <InputGroupText className="p-1">
                                {addrValid ? (
                                  <ValidIcon
                                    fill="green"
                                    height="30"
                                    width="30"
                                  />
                                ) : (
                                  <InvalidIcon
                                    fill="red"
                                    height="30"
                                    width="30"
                                  />
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
                        id="inputConfirmFee"
                        label="Pay gas to deploy Synth BEP20"
                        checked={feeConfirm}
                        onChange={() => setfeeConfirm(!feeConfirm)}
                      />
                    </div>
                  </FormGroup>
                </Col>
              </Row>

              <Row className="card-body">
                <Col xs="12" className="hide-if-prior-sibling">
                  <Button
                    block
                    className="btn-fill btn-primary"
                    disabled={!feeConfirm || !addrValid}
                    onClick={() => handleSubmit()}
                  >
                    {t('confirm')}
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Card>
        {network.chainId !== 97 && <WrongNetwork />}
      </Modal>
    </>
  )
}

export default NewSynth

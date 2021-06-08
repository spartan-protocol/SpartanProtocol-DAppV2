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
import Select from 'react-select'
import { Modal } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { ethers } from 'ethers'
import { ReactComponent as PlusIcon } from '../../../assets/icons/icon-plus.svg'
import { proposalTypes } from './types'
import {
  newActionProposal,
  newParamProposal,
  newAddressProposal,
  newGrantProposal,
} from '../../../store/dao/actions'
import Approval from '../../../components/Approval/Approval'
import { getAddresses } from '../../../utils/web3'
import { convertToWei } from '../../../utils/bigNumber'
import { ReactComponent as InvalidIcon } from '../../../assets/icons/unchecked.svg'
import { ReactComponent as ValidIcon } from '../../../assets/icons/checked.svg'
import AssetSelect from './components/AssetSelect'
import { useSparta } from '../../../store/sparta/selector'

const NewProposal = () => {
  const dispatch = useDispatch()
  const sparta = useSparta()
  const wallet = useWallet()
  const addr = getAddresses()
  const { t } = useTranslation()

  const [showModal, setShowModal] = useState(false)
  const [selectedType, setselectedType] = useState(null)
  const [feeConfirm, setfeeConfirm] = useState(false)

  const [inputAddress, setinputAddress] = useState(null)
  const showAddrInput = ['Address', 'Grant']
  const noAddrInput = [
    'LIST_BOND',
    'DELIST_BOND',
    'REMOVE_CURATED_POOL',
    'ADD_CURATED_POOL',
  ]
  const addrInput = document.getElementById('addrInput')
  const handleAddrChange = (newValue) => {
    if (addrInput) {
      setinputAddress(newValue)
      addrInput.value = newValue
    }
  }

  const [inputParam, setinputParam] = useState(null)
  const showParamInput = ['Param', 'Grant']
  const paramInput = document.getElementById('paramInput')
  const handleParamChange = (newValue) => {
    if (paramInput) {
      setinputParam(newValue)
      paramInput.value = newValue
    }
  }

  const [addrValid, setaddrValid] = useState(false)
  useEffect(() => {
    if (inputAddress?.length === 42 && ethers.utils.isAddress(inputAddress)) {
      setaddrValid(true)
    } else {
      setaddrValid(false)
    }
  }, [selectedType, inputAddress])

  const [paramValid, setparamValid] = useState(false)
  useEffect(() => {
    if (inputParam > 0) {
      setparamValid(true)
    } else {
      setparamValid(false)
    }
  }, [selectedType, inputParam])

  const [formValid, setformValid] = useState(false)
  useEffect(() => {
    if (selectedType?.type === 'Action') {
      setformValid(true)
    } else if (selectedType?.type === 'Param' && paramValid) {
      setformValid(true)
    } else if (selectedType?.type === 'Address' && addrValid) {
      setformValid(true)
    } else if (selectedType?.type === 'Grant' && paramValid && addrValid) {
      setformValid(true)
    } else {
      setformValid(false)
    }
  }, [addrValid, paramValid, selectedType])

  useEffect(() => {
    handleAddrChange('')
    handleParamChange('')
    setfeeConfirm(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType])

  const handleSubmit = () => {
    if (selectedType?.type === 'Action') {
      dispatch(newActionProposal(selectedType.value, wallet))
    } else if (selectedType?.type === 'Param') {
      dispatch(newParamProposal(inputParam, selectedType.value, wallet))
    } else if (selectedType?.type === 'Address') {
      dispatch(newAddressProposal(inputAddress, selectedType.value, wallet))
    } else if (selectedType?.type === 'Grant') {
      dispatch(newGrantProposal(inputAddress, convertToWei(inputParam), wallet))
    }
  }

  return (
    <>
      <Button
        className="align-self-center btn-sm btn-secondary"
        onClick={() => setShowModal(true)}
      >
        New Proposal
        <PlusIcon fill="white" className="ml-2 mb-1" />
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Card>
          <CardHeader>
            <CardTitle tag="h2" />
            <Row>
              <Col xs="10">
                <h2>{t('newProposal')}</h2>
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
              <Card className="card-share mb-1">
                <CardBody className="py-3">
                  <h4 className="card-title">{t('chooseProposalType')}</h4>
                  <Row>
                    <Col>
                      <Select
                        className="react-select info bg-light"
                        value={selectedType}
                        onChange={(value) => setselectedType(value)}
                        options={proposalTypes}
                        placeholder="Select a proposal"
                      />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {selectedType !== null && (
            <Row className="card-body py-1">
              <Col xs="12">
                <Card className="card-share">
                  <CardBody className="py-3">
                    <h4 className="card-title">
                      {selectedType?.desc}
                      {selectedType?.value === 'FLIP_EMISSIONS' && (
                        <>{sparta.globalDetails.emitting ? ' off' : ' on'}</>
                      )}
                    </h4>
                    <Row>
                      <Col xs="12">
                        {showAddrInput.includes(selectedType.type) && (
                          <>
                            {noAddrInput.includes(selectedType.value) && (
                              <AssetSelect
                                handleAddrChange={handleAddrChange}
                                selectedType={selectedType.value}
                              />
                            )}
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
                                disabled={noAddrInput.includes(
                                  selectedType.value,
                                )}
                                onChange={(e) =>
                                  setinputAddress(e.target.value)
                                }
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
                          </>
                        )}

                        {showParamInput.includes(selectedType.type) && (
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                {selectedType.type}
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              id="paramInput"
                              placeholder=""
                              type="number"
                              inputMode="decimal"
                              autoComplete="off"
                              autoCorrect="off"
                              onChange={(e) => setinputParam(e.target.value)}
                            />
                            <InputGroupAddon addonType="append">
                              <InputGroupText className="p-1">
                                {selectedType.units}
                              </InputGroupText>
                            </InputGroupAddon>
                            <InputGroupAddon addonType="append">
                              <InputGroupText className="p-1">
                                {paramValid ? (
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
                        )}
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <FormGroup>
                  <div className="text-center">
                    <CustomInput
                      type="switch"
                      id="inputConfirmFee"
                      label="Confirm 100 SPARTA Proposal-Fee (Add tooltip)"
                      checked={feeConfirm}
                      onChange={() => setfeeConfirm(!feeConfirm)}
                    />
                  </div>
                </FormGroup>
              </Col>
            </Row>
          )}
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
                disabled={!feeConfirm || !formValid}
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

export default NewProposal

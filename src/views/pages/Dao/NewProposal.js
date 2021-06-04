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

const NewProposal = () => {
  const dispatch = useDispatch()
  const wallet = useWallet()
  const addr = getAddresses()
  const { t } = useTranslation()

  const [showModal, setShowModal] = useState(false)
  const [selectedType, setselectedType] = useState(null)
  const [feeConfirm, setfeeConfirm] = useState(false)
  const [formValid, setformValid] = useState(false)
  const [inputAddress, setinputAddress] = useState(null)

  const noAddrInput = ['DELIST_BOND', 'REMOVE_CURATED_POOL', 'ADD_CURATED_POOL']

  const addrInput = document.getElementById('addrInput')
  const handleAddrChange = (newValue) => {
    if (addrInput) {
      setinputAddress(newValue)
      addrInput.value = newValue
    }
  }

  useEffect(() => {
    if (selectedType?.type === 'Action') {
      setformValid(true)
    } else if (selectedType?.type === 'Param') {
      setformValid(true) // ADD IN VALIDATION HERE
    } else if (selectedType?.type === 'Address') {
      if (inputAddress?.length === 42 && ethers.utils.isAddress(inputAddress)) {
        setformValid(true)
      } else {
        setformValid(false)
      }
    }
  }, [selectedType, inputAddress]) // ADD IN VALIDATION ON INPUT-CHANGE

  useEffect(() => {
    handleAddrChange('')
    setfeeConfirm(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType])

  const handleSubmit = () => {
    console.log(selectedType)
    if (selectedType?.type === 'Action') {
      dispatch(newActionProposal(selectedType.value, wallet))
    } else if (selectedType?.type === 'Param') {
      dispatch(newParamProposal(selectedType.value, wallet)) // ADD PARAM HERE AS ARG
    } else if (selectedType?.type === 'Address') {
      console.log(inputAddress)
      dispatch(newAddressProposal(inputAddress, selectedType.value, wallet))
    } else if (selectedType?.type === 'Grant') {
      dispatch(newGrantProposal(wallet)) // ADD RECEIVER & AMOUNT HERE AS ARGS
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
                    <h4 className="card-title">{selectedType?.desc}</h4>
                    <Row>
                      <Col xs="12">
                        {selectedType?.type === 'Address' && (
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
                                disabled={noAddrInput.includes(
                                  selectedType.value,
                                )}
                                onChange={(e) =>
                                  setinputAddress(e.target.value)
                                }
                              />
                              <InputGroupAddon addonType="append">
                                <InputGroupText className="p-1">
                                  {formValid ? (
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

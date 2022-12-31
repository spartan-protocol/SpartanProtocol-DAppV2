import React, { useState, useEffect, useCallback } from 'react'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { proposalTypes } from './types'
import {
  useDao,
  newActionProposal,
  newParamProposal,
  newAddressProposal,
  newGrantProposal,
} from '../../store/dao'
import Approval from '../../components/Approval/index'
import { tempChains } from '../../utils/web3'
import { BN, convertToWei } from '../../utils/bigNumber'
import { ReactComponent as InvalidIcon } from '../../assets/icons/unchecked.svg'
import { ReactComponent as ValidIcon } from '../../assets/icons/checked.svg'
import AssetSelect from './components/AssetSelect'
import { useSparta } from '../../store/sparta'
import WrongNetwork from '../../components/WrongNetwork/index'
import { Tooltip } from '../../components/Tooltip/index'
import { Icon } from '../../components/Icons/index'
import { useSynth } from '../../store/synth'
import { usePool } from '../../store/pool'
import { getToken } from '../../utils/math/utils'
import { useApp } from '../../store/app'

const tempHide = [
  'DAO',
  'ROUTER',
  'UTILS',
  'RESERVE',
  'LIST_BOND',
  'DELIST_BOND',
  'GET_SPARTA',
]
const showAddrInput = ['Address', 'Grant']
const noAddrInput = ['REALISE', 'REMOVE_CURATED_POOL', 'ADD_CURATED_POOL']
const showParamInput = ['Param', 'Grant']

const NewProposal = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const { chainId, addresses } = useApp()
  const dao = useDao()
  const pool = usePool()
  const sparta = useSparta()
  const synth = useSynth()
  const wallet = useWeb3React()

  const [txnLoading, setTxnLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedType, setSelectedType] = useState(proposalTypes[3])
  const [feeConfirm, setfeeConfirm] = useState(false)
  const [inputAddress, setinputAddress] = useState(null)
  const [inputParam, setinputParam] = useState(null)
  const [addrValid, setaddrValid] = useState(false)
  const [paramValid, setparamValid] = useState(false)
  const [existingPid, setexistingPid] = useState(false)
  const [formValid, setformValid] = useState(false)

  const addrInput = document.getElementById('addrInput')
  const paramInput = document.getElementById('paramInput')

  const isLoading = useCallback(() => {
    if (
      !pool.tokenDetails ||
      !pool.poolDetails ||
      !synth.synthDetails ||
      !dao.proposal
    ) {
      return true
    }
    return false
  }, [dao.proposal, pool.poolDetails, pool.tokenDetails, synth.synthDetails])

  const handleAddrChange = (newValue) => {
    if (addrInput) {
      setinputAddress(newValue)
      addrInput.value = newValue
    }
  }

  useEffect(() => {
    if (inputAddress?.length === 42 && ethers.utils.isAddress(inputAddress)) {
      setaddrValid(true)
    } else {
      setaddrValid(false)
    }
  }, [selectedType, inputAddress])

  useEffect(() => {
    if (selectedType.value === 'COOL_OFF') {
      if (inputParam > 0) {
        setparamValid(true)
      } else {
        setparamValid(false)
      }
    } else if (selectedType.value === 'GRANT') {
      if (inputParam <= 150000) {
        setparamValid(true)
      } else {
        setparamValid(false)
      }
    } else if (inputParam <= 1500) {
      setparamValid(true)
    } else {
      setparamValid(false)
    }
  }, [selectedType, inputParam])

  useEffect(() => {
    const checkExistingOpen = () => {
      if (
        dao.global.currentProposal !== 0 &&
        dao.proposal?.filter((pid) => pid.open).length > 0
      ) {
        setexistingPid(true)
      } else {
        setexistingPid(false)
      }
    }

    if (!isLoading()) {
      checkExistingOpen()
      if (!existingPid) {
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
      } else {
        setformValid(false)
      }
    } else {
      setformValid(false)
    }
  }, [
    feeConfirm,
    addrValid,
    paramValid,
    selectedType,
    existingPid,
    isLoading,
    dao.global.currentProposal,
    dao.proposal,
  ])

  useEffect(() => {
    if (addrInput) {
      setinputAddress('')
      addrInput.value = ''
    }
    if (paramInput) {
      setinputParam('')
      paramInput.value = ''
    }
    setfeeConfirm(false)
  }, [addrInput, paramInput, selectedType])

  const handleOnHide = () => {
    setShowModal(false)
    setSelectedType(proposalTypes[3])
    setfeeConfirm(false)
    setinputAddress('')
    setinputParam('')
  }

  const handleSubmit = async () => {
    setTxnLoading(true)
    if (selectedType?.type === 'Action') {
      await dispatch(newActionProposal(selectedType.value, wallet))
    } else if (selectedType?.type === 'Param') {
      await dispatch(newParamProposal(inputParam, selectedType.value, wallet))
    } else if (selectedType?.type === 'Address') {
      await dispatch(
        newAddressProposal(inputAddress, selectedType.value, wallet),
      )
    } else if (selectedType?.type === 'Grant') {
      await dispatch(
        newGrantProposal(inputAddress, convertToWei(inputParam), wallet),
      )
    }
    setTxnLoading(false)
    handleOnHide()
  }

  const handleTypeSelect = (value) => {
    setSelectedType(proposalTypes.filter((i) => i.value === value)[0])
  }

  // 0.0015 BNB || 0.001 BNB
  const estMaxGas = '1000000000000000'
  const enoughGas = () => {
    const bal = getToken(addresses.bnb, pool.tokenDetails).balance
    if (BN(bal).isLessThan(estMaxGas)) {
      return false
    }
    return true
  }

  return (
    <>
      <Button
        variant="primary"
        size="sm"
        className="w-100 mt-2"
        onClick={() => setShowModal(true)}
        disabled={isLoading()}
      >
        {t('newProposal')}
      </Button>
      {showModal && (
        <Modal show={showModal} onHide={() => handleOnHide()} centered>
          {tempChains.includes(chainId) && !isLoading() && (
            <>
              <Modal.Header closeButton>
                <Modal.Title>{t('newProposal')}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <FloatingLabel
                  controlId="floatingSelect"
                  label={t('chooseProposalType')}
                >
                  <Form.Select
                    id="proposalTypeInput"
                    value={selectedType.value}
                    onChange={(e) => handleTypeSelect(e.target.value)}
                    aria-label="Choose proposal type"
                  >
                    {proposalTypes
                      .filter((x) => !tempHide.includes(x.value))
                      .map((pid) => (
                        <option key={pid.value} value={pid.value}>
                          {t(pid.label)}
                        </option>
                      ))}
                  </Form.Select>
                </FloatingLabel>

                {selectedType !== null && (
                  <Row className="py-1">
                    <Col xs="12">
                      <Card className="my-3">
                        <Card.Body className="py-3">
                          <h4>
                            {t(selectedType?.desc)}
                            {selectedType?.value === 'FLIP_EMISSIONS' && (
                              <>
                                {sparta.globalDetails.emitting ? ' off' : ' on'}
                              </>
                            )}
                          </h4>
                          <h5>
                            {' '}
                            {selectedType?.value === 'ADD_CURATED_POOL' &&
                              'SPARTA depth > 250k'}
                          </h5>
                          <Row>
                            <Col xs="12">
                              {showAddrInput.includes(selectedType.type) && (
                                <>
                                  {noAddrInput.includes(selectedType.value) && (
                                    <AssetSelect
                                      handleAddrChange={handleAddrChange}
                                      selectedType={selectedType.value}
                                      className="my-2"
                                    />
                                  )}
                                  <InputGroup className="my-2">
                                    <InputGroup.Text>
                                      {t('address')}
                                    </InputGroup.Text>
                                    <FormControl
                                      id="addrInput"
                                      placeholder="0x..."
                                      type="text"
                                      autoComplete="off"
                                      autoCorrect="off"
                                      disabled={noAddrInput.includes(
                                        selectedType.value,
                                      )}
                                      onChange={(e) =>
                                        setinputAddress(e.target.value)
                                      }
                                    />
                                    <InputGroup.Text className="p-1">
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
                                    </InputGroup.Text>
                                  </InputGroup>
                                </>
                              )}

                              {showParamInput.includes(selectedType.type) && (
                                <InputGroup className="my-2">
                                  <InputGroup.Text>
                                    {selectedType.type}
                                  </InputGroup.Text>
                                  <FormControl
                                    id="paramInput"
                                    placeholder=""
                                    type="number"
                                    step="any"
                                    min="0"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    onChange={(e) =>
                                      setinputParam(e.target.value)
                                    }
                                  />
                                  <InputGroup.Text>
                                    {selectedType.units}
                                  </InputGroup.Text>
                                  <InputGroup.Text>
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
                                  </InputGroup.Text>
                                </InputGroup>
                              )}
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                      <Form className="text-center">
                        <div className="d-inline-block">
                          <Form.Switch
                            type="switch"
                            id="inputConfirmFee"
                            label={`Confirm ${dao.global.daoFee} SPARTA Proposal-Fee`}
                            checked={feeConfirm}
                            onChange={() => setfeeConfirm(!feeConfirm)}
                          />
                        </div>
                        <OverlayTrigger
                          placement="auto"
                          overlay={Tooltip(t, 'newProposalFee')}
                        >
                          <span role="button">
                            <Icon icon="info" className="ms-1 mb-1" size="17" />
                          </span>
                        </OverlayTrigger>
                      </Form>
                    </Col>
                  </Row>
                )}
              </Modal.Body>
            </>
          )}
          {!tempChains.includes(chainId) && <WrongNetwork />}
          <Modal.Footer>
            <Row className="w-100 text-center">
              {wallet?.account && !existingPid && (
                <Approval
                  tokenAddress={addresses.spartav2}
                  symbol="SPARTA"
                  walletAddress={wallet.account}
                  contractAddress={addresses.dao}
                  txnAmount={convertToWei('100')}
                  assetNumber="1"
                />
              )}
              {existingPid && (
                <Button className="w-100" disabled>
                  Existing Proposal
                </Button>
              )}
              <Col xs="12" className="hide-if-prior-sibling">
                {!enoughGas() ? (
                  <Button className="w-100" disabled>
                    {t('checkBnbGas')}
                  </Button>
                ) : (
                  <Button
                    className="w-100"
                    disabled={!wallet.account || !feeConfirm || !formValid}
                    onClick={() => handleSubmit()}
                  >
                    {!wallet.account
                      ? t('checkWallet')
                      : sparta.globalDetails.globalFreeze
                      ? t('globalFreeze')
                      : t('confirm')}
                    {txnLoading && (
                      <Icon
                        icon="cycle"
                        size="20"
                        fill="white"
                        className="anim-spin ms-1"
                      />
                    )}
                  </Button>
                )}
              </Col>
            </Row>
          </Modal.Footer>
        </Modal>
      )}
    </>
  )
}

export default NewProposal

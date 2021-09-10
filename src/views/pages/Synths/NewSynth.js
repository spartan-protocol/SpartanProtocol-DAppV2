import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Button,
  Modal,
  Row,
  Col,
  InputGroup,
  FormControl,
  Form,
} from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import AssetSelect from './components/AssetSelect'
import { createSynth } from '../../../store/synth'
import { getNetwork } from '../../../utils/web3'
import WrongNetwork from '../../../components/Common/WrongNetwork'
import { Icon } from '../../../components/Icons/icons'

const NewSynth = () => {
  const dispatch = useDispatch()
  const wallet = useWeb3React()
  const { t } = useTranslation()

  const isLightMode = window.localStorage.getItem('theme')

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
        variant={isLightMode ? 'secondary' : 'info'}
        onClick={() => setShowModal(true)}
        className="rounded-pill pe-3 subtitle-label"
      >
        <Icon icon="plus" fill="white" size="17" className="me-1 mb-1" />
        {t('synth')}
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('newSynth')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {network.chainId === 97 && (
            <>
              <Modal.Title>Choose Synth Asset to Deploy</Modal.Title>

              <AssetSelect handleAddrChange={handleAddrChange} />

              <InputGroup>
                <InputGroup.Text>Address</InputGroup.Text>
                <FormControl
                  id="addrInput"
                  placeholder="0x..."
                  type="number"
                  autoComplete="off"
                  autoCorrect="off"
                  disabled
                  value={inputAddress}
                  isValid={addrValid}
                  isInvalid={!addrValid}
                />
                <Form.Control.Feedback type="invalid">
                  Only listed pools that are also curated are able to be
                  deployed as a synthetic asset
                </Form.Control.Feedback>
              </InputGroup>

              <Form className="mb-0">
                <span className="output-card">
                  Pay gas to deploy Synth BEP20
                  <Form.Check
                    type="switch"
                    id="inputConfirmFee"
                    className="ms-2 d-inline-flex"
                    checked={feeConfirm}
                    onChange={() => setfeeConfirm(!feeConfirm)}
                  />
                </span>
              </Form>
            </>
          )}
          {network.chainId !== 97 && <WrongNetwork />}
        </Modal.Body>
        <Modal.Footer>
          <Row className="card-body">
            <Col xs="12" className="hide-if-prior-sibling">
              <Button
                className="w-100"
                disabled={!feeConfirm || !addrValid}
                onClick={() => handleSubmit()}
              >
                {t('confirm')}
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default NewSynth

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from 'react-bootstrap/Modal'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useDispatch } from 'react-redux'
import { useAccount, useSigner } from 'wagmi'
import { isAddress } from 'viem'
import AssetSelect from './components/AssetSelect'
import { createSynth } from '../../store/synth'
import { tempChains } from '../../utils/web3'
import WrongNetwork from '../../components/WrongNetwork/index'
import { Icon } from '../../components/Icons/index'
import { getToken } from '../../utils/math/utils'
import { useApp } from '../../store/app'
import { usePool } from '../../store/pool'
import { BN } from '../../utils/bigNumber'

const NewSynth = ({ setShowModal, showModal }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { address } = useAccount()
  const { data: signer } = useSigner()

  const { chainId, addresses } = useApp()
  const pool = usePool()

  const [txnLoading, setTxnLoading] = useState(false)
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
    if (inputAddress?.length === 42 && isAddress(inputAddress)) {
      setaddrValid(true)
    } else {
      setaddrValid(false)
    }
  }, [inputAddress, showModal])

  const handleSubmit = async () => {
    setTxnLoading(true)
    await dispatch(createSynth(inputAddress, signer))
    setTxnLoading(false)
    setShowModal(false)
  }

  // ~0.015 BNB gas on TN || ~0.008 BNB on MN
  const estMaxGas = '8000000000000000'
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
    if (!addrValid) {
      return [false, t('checkInputs')]
    }
    if (!feeConfirm) {
      return [false, t('confirmFee')]
    }
    return [true, t('createSynth')]
  }

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('newSynth')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {tempChains.includes(chainId) && (
            <>
              <Modal.Title>Choose Synth Asset to Deploy</Modal.Title>

              <AssetSelect handleAddrChange={handleAddrChange} />

              <InputGroup>
                <InputGroup.Text>Address</InputGroup.Text>
                <FormControl
                  id="addrInput"
                  placeholder="0x..."
                  autoComplete="off"
                  autoCorrect="off"
                  disabled
                  value={inputAddress}
                  isValid={addrValid}
                  isInvalid={!addrValid}
                />
                <Form.Control.Feedback type="invalid">
                  Only curated pools are able to be deployed as a synthetic
                  asset
                </Form.Control.Feedback>
              </InputGroup>

              <Form className="mb-0 mt-2 text-center">
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
          {!tempChains.includes(chainId) && <WrongNetwork />}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="w-100"
            disabled={!checkValid()[0]}
            onClick={() => handleSubmit()}
          >
            {checkValid()[1]}
            {txnLoading && (
              <Icon icon="cycle" size="20" className="anim-spin ms-1" />
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default NewSynth

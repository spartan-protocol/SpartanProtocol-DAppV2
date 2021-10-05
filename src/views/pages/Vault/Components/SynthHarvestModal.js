import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Col, Modal, Row, Card, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import { usePool } from '../../../../store/pool'
import { BN, formatFromWei } from '../../../../utils/bigNumber'
import { getAddresses } from '../../../../utils/web3'
import {
  getSynthDetails,
  synthHarvestSingle,
} from '../../../../store/synth/actions'
import { useSynth } from '../../../../store/synth/selector'
import { Icon } from '../../../../components/Icons/icons'
import { getToken } from '../../../../utils/math/utils'
import { useReserve } from '../../../../store/reserve/selector'
import { calcCurrentRewardSynth } from '../../../../utils/math/synthVault'
import { useSparta } from '../../../../store/sparta'
import spartaIcon from '../../../../assets/tokens/sparta-synth.svg'

const SynthHarvestModal = ({ synthItem }) => {
  const dispatch = useDispatch()
  const pool = usePool()
  const reserve = useReserve()
  const sparta = useSparta()
  const synth = useSynth()
  const { t } = useTranslation()
  const wallet = useWeb3React()
  const addr = getAddresses()

  const [txnLoading, setTxnLoading] = useState(false)
  const [showModal, setshowModal] = useState(false)
  const [lockoutConfirm, setLockoutConfirm] = useState(false)

  const handleCloseModal = () => {
    setshowModal(false)
    setLockoutConfirm(false)
  }

  const handleHarvest = async () => {
    setTxnLoading(true)
    await dispatch(synthHarvestSingle(synthItem.address, wallet))
    setTxnLoading(false)
    if (synth.synthArray?.length > 1) {
      dispatch(getSynthDetails(synth.synthArray, wallet))
    }
    handleCloseModal()
  }

  const _getToken = () => getToken(synthItem.tokenAddress, pool.tokenDetails)

  const getClaimable = () => {
    const [reward, baseCapped, synthCapped] = calcCurrentRewardSynth(
      pool.poolDetails,
      synth,
      synthItem,
      sparta.globalDetails,
      reserve.globalDetails.spartaBalance,
    )
    return [reward, baseCapped, synthCapped]
  }

  // *CHECK === *CHECK
  const estMaxGas = '5000000000000000'
  const enoughGas = () => {
    const bal = getToken(addr.bnb, pool.tokenDetails).balance
    if (BN(bal).isLessThan(estMaxGas)) {
      return false
    }
    return true
  }

  const checkValidHarvest = () => {
    const reward = formatFromWei(getClaimable()[0], 4)
    if (!reserve.globalDetails.emissions) {
      return [false, t('incentivesDisabled'), '']
    }
    if (getClaimable()[1]) {
      return [false, t('baseCap'), '']
    }
    if (getClaimable()[2]) {
      return [true, reward, ' SPARTA']
    }
    return [true, reward, ` ${_getToken().symbol}s`]
  }

  const checkValid = () => {
    if (!wallet.account) {
      return [false, t('checkWallet')]
    }
    if (!reserve.globalDetails.emissions) {
      return [false, t('incentivesDisabled')]
    }
    if (reserve.globalDetails.globalFreeze) {
      return [false, t('globalFreeze')]
    }
    if (synth.memberDetails?.totalWeight <= 0) {
      return [false, t('noClaim')]
    }
    if (!lockoutConfirm) {
      return [false, t('confirmLockup')]
    }
    if (!enoughGas()) {
      return [false, t('checkBnbGas')]
    }
    return [true, t('harvest')]
  }

  return (
    <>
      <Button
        className="w-100"
        onClick={() => setshowModal(true)}
        disabled={synthItem.staked <= 0}
      >
        {t('harvest')}
      </Button>
      <Modal show={showModal} onHide={() => handleCloseModal()} centered>
        <Modal.Header closeButton closeVariant="white">
          <div xs="auto" className="position-relative me-3">
            <img
              src={_getToken().symbolUrl}
              alt={_getToken().symbol}
              height="50px"
              className="rounded-circle"
            />
            <img
              height="25px"
              src={spartaIcon}
              alt="Sparta LP token icon"
              className="token-badge-modal-header"
            />
          </div>
          {t('harvest')} {_getToken().symbol}s
        </Modal.Header>
        <Card className="">
          <Card.Body>
            <Row xs="12" className="my-2">
              <Col xs="12" className="output-card">
                This harvest will disable withdraw on these staked SynthYield
                tokens for {synth.globalDetails.minTime} seconds:
              </Col>
            </Row>

            <Row xs="12">
              <Col xs="auto" className="text-card">
                {_getToken().symbol}s Claim:
              </Col>
              <Col className="text-end output-card">
                {checkValidHarvest()[1]} {checkValidHarvest()[2]}
              </Col>
            </Row>

            <Form className="my-2 text-center">
              <span className="output-card">
                Confirm {synth.globalDetails.minTime} seconds withdraw lockout
                <Form.Check
                  type="switch"
                  id="confirmLockout"
                  className="ms-2 d-inline-flex"
                  checked={lockoutConfirm}
                  onChange={() => setLockoutConfirm(!lockoutConfirm)}
                />
              </span>
            </Form>
          </Card.Body>
          <Card.Footer>
            <Row>
              <Col>
                <Button
                  className="w-100"
                  onClick={() => handleHarvest()}
                  disabled={!checkValid()[0]}
                >
                  {checkValid()[1]}
                  {txnLoading && (
                    <Icon icon="cycle" size="20" className="anim-spin ms-1" />
                  )}
                </Button>
              </Col>
            </Row>
          </Card.Footer>
        </Card>
      </Modal>
    </>
  )
}

export default SynthHarvestModal

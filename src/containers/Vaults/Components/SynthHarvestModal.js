import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { useTranslation } from 'react-i18next'
import { useAccount, useSigner } from 'wagmi'
import { usePool } from '../../../store/pool'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import { synthHarvestLive } from '../../../utils/web3'
import { useSynth, synthHarvestSingle } from '../../../store/synth'
import { Icon } from '../../../components/Icons/index'
import { getToken } from '../../../utils/math/utils'
import { calcCurrentRewardSynth } from '../../../utils/math/synthVault'
import { useSparta } from '../../../store/sparta'
import spartaIcon from '../../../assets/tokens/sparta-synth.svg'
import { useTheme } from '../../../providers/Theme'
import { useApp } from '../../../store/app'

const SynthHarvestModal = ({ synthItem, buttonValid }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const { address } = useAccount()
  const { data: signer } = useSigner()

  const { addresses } = useApp()
  const pool = usePool()
  const sparta = useSparta()
  const synth = useSynth()

  const [txnLoading, setTxnLoading] = useState(false)
  const [showModal, setshowModal] = useState(false)
  const [lockoutConfirm, setLockoutConfirm] = useState(false)

  const handleCloseModal = () => {
    setshowModal(false)
    setLockoutConfirm(false)
  }

  const handleHarvest = async () => {
    setTxnLoading(true)
    await dispatch(synthHarvestSingle(synthItem.address, address, signer))
    setTxnLoading(false)
    handleCloseModal()
  }

  const _getToken = () => getToken(synthItem.tokenAddress, pool.tokenDetails)

  const getClaimable = () => {
    const [reward, baseCapped, synthCapped] = calcCurrentRewardSynth(
      pool.poolDetails,
      synth,
      synthItem,
      sparta.globalDetails,
      sparta.globalDetails.spartaBalance,
    )
    return [reward, baseCapped, synthCapped]
  }

  // *CHECK === *CHECK
  const estMaxGas = '5000000000000000'
  const enoughGas = () => {
    const bal = getToken(addresses.bnb, pool.tokenDetails).balance
    if (BN(bal).isLessThan(estMaxGas)) {
      return false
    }
    return true
  }

  const checkValidHarvest = () => {
    const reward = formatFromWei(getClaimable()[0], 4)
    if (getClaimable()[2]) {
      return [true, reward, ' SPARTA']
    }
    return [true, reward, ` ${_getToken().symbol}s`]
  }

  const checkValid = () => {
    if (!synthHarvestLive) {
      return [false, t('harvestDisabled')]
    }
    if (!address) {
      return [false, t('checkWallet')]
    }
    if (!sparta.globalDetails.emissions) {
      return [false, t('incentivesDisabled')]
    }
    // if (!synth.synthMinting) {
    //   return [false, t('synthsDisabled')]
    // }
    if (sparta.globalDetails.globalFreeze) {
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
    if (getClaimable()[1]) {
      return [false, t('poolAtCapacity'), '']
    }
    return [true, t('harvest')]
  }

  return (
    <>
      <Button
        className="w-100 btn-sm"
        onClick={() => setshowModal(true)}
        disabled={!synthHarvestLive || synthItem.staked <= 0 || !buttonValid[0]}
      >
        {synthHarvestLive ? buttonValid[1] : t('harvestDisabled')}
      </Button>
      <Modal show={showModal} onHide={() => handleCloseModal()} centered>
        <Modal.Header closeButton closeVariant={isDark ? 'white' : undefined}>
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
              className="token-badge"
            />
          </div>
          {t('harvest')} {_getToken().symbol}s
        </Modal.Header>
        <Card>
          <Card.Body>
            <Row xs="12" className="my-2">
              <Col xs="12" className="output-card">
                This harvest will temporarily lock your whole SynthVault &
                disable withdraw on all staked SynthYield tokens for{' '}
                {synth.globalDetails.minTime} seconds:
              </Col>
            </Row>
            {synth.synthDetails
              .filter((x) => x.staked > 0)
              .map((x) => (
                <Row xs="12" key={x.address}>
                  <Col xs="auto" className="text-card">
                    Existing stake locked
                  </Col>
                  <Col className="text-end output-card">
                    {formatFromWei(x.staked)}{' '}
                    {getToken(x.tokenAddress, pool.tokenDetails).symbol}s
                  </Col>
                </Row>
              ))}
            <Row xs="12" className="my-2">
              <Col xs="12" className="output-card">
                It is estimated that you will receive these Harvest rewards:
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
                    <Icon
                      fill="white"
                      icon="cycle"
                      size="20"
                      className="anim-spin ms-1"
                    />
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

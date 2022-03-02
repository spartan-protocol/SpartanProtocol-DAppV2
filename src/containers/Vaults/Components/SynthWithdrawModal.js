import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Col, Row, Modal, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import { usePool } from '../../../store/pool'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import { getToken } from '../../../utils/math/utils'
import { Icon } from '../../../components/Icons/index'
import spartaIcon from '../../../assets/tokens/sparta-lp.svg'
import { getSecsSince, getTimeUntil } from '../../../utils/math/nonContract'
import { getAddresses, synthHarvestLive } from '../../../utils/web3'
import {
  getSynthDetails,
  synthHarvest,
  synthWithdraw,
} from '../../../store/synth/actions'
import { useSynth } from '../../../store/synth/selector'
import { useReserve } from '../../../store/reserve'
import { useWeb3 } from '../../../store/web3'

const SynthWithdrawModal = (props) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const pool = usePool()
  const synth = useSynth()
  const web3 = useWeb3()
  const wallet = useWeb3React()
  const addr = getAddresses()
  const reserve = useReserve()

  const [percentage, setpercentage] = useState(0)
  const [txnLoading, setTxnLoading] = useState(false)
  const [harvestLoading, setHarvestLoading] = useState(false)
  const [showModal, setshowModal] = useState(false)
  const [harvestConfirm, setHarvestConfirm] = useState(false)
  const [withdrawConfirm, setWithdrawConfirm] = useState(false)

  const secsSinceHarvest = () => {
    if (props.synthItem.lastHarvest) {
      return getSecsSince(props.synthItem.lastHarvest)
    }
    return '0'
  }

  const getLastDeposit = () => {
    let lastDeposit = '99999999999999999999999999999'
    if (synth.member.depositTime) {
      lastDeposit = synth.member.depositTime
    }
    return lastDeposit
  }

  const getLockedSecs = () => {
    const depositTime = BN(getLastDeposit())
    const lockUpSecs = BN(synth.globalDetails.minTime)
    const [units, time] = getTimeUntil(depositTime.plus(lockUpSecs), t)
    return [units, time]
  }

  // *CHECK*  === *CHECK*
  const estMaxGas = '5000000000000000'
  const enoughGas = () => {
    const bal = getToken(addr.bnb, pool.tokenDetails).balance
    if (BN(bal).isLessThan(estMaxGas)) {
      return false
    }
    return true
  }

  const checkValid = () => {
    if (!wallet.account) {
      return [false, t('checkWallet'), false]
    }
    if (!enoughGas()) {
      return [false, t('checkBnbGas'), false]
    }
    if (getLockedSecs()[0] > 0) {
      return [false, `${getLockedSecs()[0]}${getLockedSecs()[1]}`, 'lock']
    }
    if (percentage <= 0) {
      return [false, t('checkInput'), false]
    }
    if (secsSinceHarvest() > 300) {
      if (!withdrawConfirm) {
        return [false, t('confirmSelection'), false]
      }
    }
    return [true, t('withdraw'), false]
  }

  const token = pool.tokenDetails.filter(
    (i) => i.address === props.synthItem.tokenAddress,
  )[0]

  const handleToggles = (selected) => {
    if (selected === 'harvest') {
      setHarvestConfirm(true)
      setWithdrawConfirm(false)
    }
    if (selected === 'withdraw') {
      setHarvestConfirm(false)
      setWithdrawConfirm(true)
    }
  }

  const handleCloseModal = () => {
    setshowModal(false)
    setHarvestConfirm(false)
    setpercentage(0)
  }

  const withdrawal = () =>
    BN(percentage).div(10000).times(props.synthItem.staked).toFixed(0)

  const handleHarvest = async () => {
    setHarvestLoading(true)
    await dispatch(synthHarvest([props.synthItem.address], wallet, web3.rpcs))
    setHarvestLoading(false)
    dispatch(getSynthDetails(synth.synthArray, wallet, web3.rpcs))
  }

  const handleWithdraw = async () => {
    setTxnLoading(true)
    await dispatch(
      synthWithdraw(props.synthItem.address, percentage, wallet, web3.rpcs),
    )
    setTxnLoading(false)
    handleCloseModal()
  }

  return (
    <>
      <Button
        className="w-100"
        onClick={() => setshowModal(true)}
        disabled={props.disabled || !wallet.account}
      >
        {t('withdraw')}
      </Button>
      <Modal show={showModal} onHide={() => handleCloseModal()} centered>
        {!props.disabled && (
          <>
            <Modal.Header closeButton closeVariant="white">
              <div xs="auto" className="position-relative me-3">
                <img
                  src={token.symbolUrl}
                  className="rounded-circle"
                  alt={token.symbol}
                  height="50px"
                />
                <img
                  height="25px"
                  src={spartaIcon}
                  alt="Sparta LP token icon"
                  className="token-badge-modal-header"
                />
              </div>
              {t('withdraw')} {token.symbol}s
            </Modal.Header>
            <Modal.Body>
              <Row className="my-1">
                <Col xs="auto" className="text-card">
                  {t('amount')}
                </Col>
                <Col className="text-end output-card">
                  {formatFromWei(withdrawal())} {token.symbol}s
                </Col>
              </Row>
              <Row className="">
                <Col xs="12">
                  <Form.Range
                    id="synthVaultSlider"
                    onChange={(e) => setpercentage(e.target.value)}
                    min="0"
                    max="10000"
                    defaultValue="0"
                  />
                </Col>
              </Row>
              <Row xs="12" className="my-2">
                <Col xs="12" className="output-card">
                  You will be withdrawing {formatFromWei(withdrawal())}{' '}
                  {token.symbol}s staked tokens from the SynthVault to your
                  wallet
                </Col>
              </Row>
              {secsSinceHarvest() > 300 && (
                <>
                  <hr />
                  <Row xs="12" className="my-2">
                    <Col xs="12" className="output-card">
                      Your existing harvest timer will be reset, so you must
                      choose carefully whether you would like to harvest or
                      withdraw.
                    </Col>
                    <Col xs="12" className="output-card">
                      <br />- If you harvest, you will not be able to withdraw
                      any staked Synths for {synth.globalDetails.minTime}{' '}
                      seconds
                    </Col>
                    {synth.synthDetails
                      .filter((x) => x.staked > 0)
                      .map((x) => (
                        <Row xs="12" key={x.address}>
                          <Col xs="auto" className="text-card">
                            Existing stake locked
                          </Col>
                          <Col className="text-end output-card">
                            {formatFromWei(x.staked)}{' '}
                            {getToken(x.tokenAddress, pool.tokenDetails).symbol}
                            s
                          </Col>
                        </Row>
                      ))}
                    <Form className="my-2 text-center">
                      <span className="output-card">
                        I choose harvest!
                        <Form.Check
                          type="switch"
                          id="confirmHarvest"
                          className="ms-2 d-inline-flex"
                          checked={harvestConfirm}
                          onChange={() => handleToggles('harvest')}
                        />
                      </span>
                    </Form>
                    <Col xs="12" className="output-card">
                      <br />- If you withdraw, you will lose{' '}
                      {props.claimable[1] + props.claimable[2]} Harvest
                    </Col>
                  </Row>
                  <Row xs="12" className="">
                    <Col xs="auto" className="text-card">
                      Harvest forfeiting
                    </Col>
                    <Col className="text-end output-card">
                      {props.claimable[1] + props.claimable[2]}
                    </Col>
                  </Row>
                  <Form className="my-2 text-center">
                    <span className="output-card">
                      I choose withdraw!
                      <Form.Check
                        type="switch"
                        id="confirmHarvest"
                        className="ms-2 d-inline-flex"
                        checked={withdrawConfirm}
                        onChange={() => handleToggles('withdraw')}
                      />
                    </span>
                  </Form>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Row className="text-center w-100">
                <Col xs="12" className="hide-if-prior-sibling">
                  <Row>
                    {props.claimable[0] && secsSinceHarvest() > 300 && (
                      <Col>
                        {synthHarvestLive && (
                          <Button
                            className="w-100"
                            onClick={() => handleHarvest()}
                            disabled={
                              !props.claimable[0] ||
                              !enoughGas() ||
                              !harvestConfirm ||
                              reserve.globalDetails.globalFreeze
                            }
                          >
                            {enoughGas()
                              ? reserve.globalDetails.globalFreeze
                                ? t('globalFreeze')
                                : t('harvest')
                              : t('checkBnbGas')}
                            {harvestLoading && (
                              <Icon
                                icon="cycle"
                                size="20"
                                className="anim-spin ms-1"
                              />
                            )}
                          </Button>
                        )}
                        {!synthHarvestLive && (
                          <Button className="w-100" disabled>
                            {t('harvestDisabled')}
                          </Button>
                        )}
                      </Col>
                    )}
                    <Col>
                      <Button
                        className="w-100"
                        onClick={() => handleWithdraw()}
                        disabled={!checkValid()[0]}
                      >
                        {checkValid()[2] && (
                          <Icon
                            icon={checkValid()[2]}
                            size="15"
                            className="mb-1"
                          />
                        )}
                        {checkValid()[1]}
                        {txnLoading && (
                          <Icon
                            icon="cycle"
                            size="20"
                            className="anim-spin ms-1"
                          />
                        )}
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  )
}

export default SynthWithdrawModal

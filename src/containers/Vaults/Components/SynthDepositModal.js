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
import Approval from '../../../components/Approval/index'
import { synthHarvestLive } from '../../../utils/web3'
import {
  useSynth,
  synthDeposit,
  synthHarvestSingle,
} from '../../../store/synth'
import { Icon } from '../../../components/Icons/index'
import spartaIcon from '../../../assets/tokens/sparta-synth.svg'
import { getToken } from '../../../utils/math/utils'
import { calcCurrentRewardSynth } from '../../../utils/math/synthVault'
import { useSparta } from '../../../store/sparta'
import { getSecsSince } from '../../../utils/math/nonContract'
import { useTheme } from '../../../providers/Theme'
import { useApp } from '../../../store/app'

const SynthDepositModal = ({ tokenAddress, disabled }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const { address } = useAccount()
  const { data: signer } = useSigner()

  const { addresses } = useApp()
  const pool = usePool()
  const sparta = useSparta()
  const synth = useSynth()

  const [percentage, setpercentage] = useState('0')
  const [txnLoading, setTxnLoading] = useState(false)
  const [harvestLoading, setHarvestLoading] = useState(false)
  const [showModal, setshowModal] = useState(false)
  const [lockoutConfirm, setLockoutConfirm] = useState(false)
  const [harvestConfirm, setHarvestConfirm] = useState(false)

  const synth1 = synth.synthDetails.filter(
    (i) => i.tokenAddress === tokenAddress,
  )[0]
  const token = pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  const secsSinceHarvest = () => {
    if (synth1.lastHarvest) {
      return getSecsSince(synth1.lastHarvest)
    }
    return '0'
  }

  const secsUntilUnlocked = () => {
    if (synth.member.depositTime) {
      const secsSince = getSecsSince(synth.member.depositTime)
      if (secsSince > 10) {
        return true
      }
      return 10 - secsSince
    }
    return true
  }

  const handleCloseModal = () => {
    setshowModal(false)
    setLockoutConfirm(false)
    setHarvestConfirm(false)
    setpercentage('0')
  }

  const deposit = () => BN(percentage).div(100).times(synth1.balance).toFixed(0)

  const handleHarvest = async () => {
    setHarvestLoading(true)
    await dispatch(synthHarvestSingle(synth1.address, address, signer))
    setHarvestLoading(false)
  }

  const handleDeposit = async () => {
    setTxnLoading(true)
    await dispatch(synthDeposit(synth1.address, deposit(), address, signer))
    setTxnLoading(false)
    handleCloseModal()
  }

  const getClaimable = () => {
    const [reward, baseCapped, synthCapped] = calcCurrentRewardSynth(
      pool.poolDetails,
      synth,
      synth1,
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
    if (!sparta.globalDetails.emissions) {
      return [false, t('incentivesDisabled'), '']
    }
    if (getClaimable()[1]) {
      return [false, t('baseCap'), '']
    }
    if (getClaimable()[2]) {
      return [true, reward, ' SPARTA']
    }
    return [true, reward, ` ${token.symbol}s`]
  }

  const checkValid = () => {
    if (!address) {
      return [false, t('checkWallet')]
    }
    if (secsUntilUnlocked() !== true) {
      return [false, `in ${secsUntilUnlocked()} secs`]
    }
    if (!enoughGas()) {
      return [false, t('checkBnbGas')]
    }
    if (deposit() <= 0) {
      return [false, t('checkInput')]
    }
    if (!lockoutConfirm) {
      return [false, t('confirmLockup')]
    }
    if (synth1.staked > 0 && secsSinceHarvest() > 300) {
      if (!harvestConfirm) {
        return [false, t('confirmHarvest')]
      }
    }
    return [true, t('deposit')]
  }

  return (
    <>
      <Button
        className="w-100 btn-sm"
        onClick={() => setshowModal(true)}
        disabled={disabled}
      >
        {t('deposit')}
      </Button>
      <Modal show={showModal} onHide={() => handleCloseModal()} centered>
        <Modal.Header closeButton closeVariant={isDark ? 'white' : undefined}>
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
              className="token-badge"
            />
          </div>
          {t('deposit')} {token.symbol}s
        </Modal.Header>
        <Card>
          <Card.Body>
            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('amount')}
              </Col>
              <Col className="text-right output-card">
                {formatFromWei(deposit())} {token.symbol}s
              </Col>
            </Row>
            <Row>
              <Col xs="12">
                <Form.Range
                  id="daoVaultSlider"
                  onChange={(e) => setpercentage(e.target.value)}
                  min="0"
                  max="100"
                  defaultValue="0"
                />
              </Col>
            </Row>
            <hr />
            <Row xs="12" className="my-2">
              <Col xs="12" className="output-card">
                This deposit will disable withdraw on all staked SynthYield
                tokens for {synth.globalDetails.minTime} seconds:
              </Col>
            </Row>
            <Row xs="12">
              <Col xs="auto" className="text-card">
                This stake locked
              </Col>
              <Col className="text-end output-card">
                {formatFromWei(deposit())} {token.symbol}s
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
            <hr />
            {synth1.staked > 0 && secsSinceHarvest() > 300 && (
              <>
                <Row xs="12" className="my-2">
                  <Col xs="12" className="output-card">
                    Existing harvest timer will be reset for {token.symbol}s,
                    harvest before depositing to avoid forfeiting any
                    accumulated rewards:
                  </Col>
                </Row>
                <Row xs="12">
                  <Col xs="auto" className="text-card">
                    Harvest forfeiting
                  </Col>
                  <Col className="text-end output-card">
                    {checkValidHarvest()[1]} {checkValidHarvest()[2]}
                  </Col>
                </Row>
                <Form className="my-2 text-center">
                  <span className="output-card">
                    Confirm you want to skip Harvesting
                    <Form.Check
                      type="switch"
                      id="confirmHarvest"
                      className="ms-2 d-inline-flex"
                      checked={harvestConfirm}
                      onChange={() => setHarvestConfirm(!harvestConfirm)}
                    />
                  </span>
                </Form>
              </>
            )}
          </Card.Body>
          <Card.Footer>
            <Row className="text-center">
              {address && (
                <Approval
                  tokenAddress={synth1.address}
                  symbol={`${token.symbol}s`}
                  walletAddress={address}
                  contractAddress={addresses.synthVault}
                  txnAmount={deposit()}
                  assetNumber="1"
                />
              )}
              <Col className="hide-if-prior-sibling">
                <Row>
                  {!synthHarvestLive && (
                    <Col>
                      <Button className="w-100" disabled>
                        {t('harvestDisabled')}
                      </Button>
                    </Col>
                  )}
                  {synthHarvestLive &&
                    synth1.staked > 0 &&
                    secsSinceHarvest() > 300 && (
                      <Col>
                        <Button
                          className="w-100"
                          onClick={() => handleHarvest()}
                          disabled={
                            synth1.staked <= 0 ||
                            !enoughGas() ||
                            sparta.globalDetails.globalFreeze
                          }
                        >
                          {enoughGas()
                            ? sparta.globalDetails.globalFreeze
                              ? t('globalFreeze')
                              : t('harvest')
                            : t('checkBnbGas')}
                          {harvestLoading && (
                            <Icon
                              fill="white"
                              icon="cycle"
                              size="20"
                              className="anim-spin ms-1"
                            />
                          )}
                        </Button>
                      </Col>
                    )}
                  <Col>
                    <Button
                      className="w-100"
                      onClick={() => handleDeposit()}
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
              </Col>
            </Row>
          </Card.Footer>
        </Card>
      </Modal>
    </>
  )
}

export default SynthDepositModal

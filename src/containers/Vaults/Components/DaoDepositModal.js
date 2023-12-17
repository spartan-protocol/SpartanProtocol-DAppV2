import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { useTranslation } from 'react-i18next'
import { useAccount, useSigner } from 'wagmi'
import { useDao, daoDeposit, daoHarvest } from '../../../store/dao'
import { usePool } from '../../../store/pool'
import { useApp } from '../../../store/app'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import Approval from '../../../components/Approval/index'
import { getDao, getToken } from '../../../utils/math/utils'
import { Icon } from '../../../components/Icons/index'
import spartaIcon from '../../../assets/tokens/sparta-lp.svg'
import { getSecsSince } from '../../../utils/math/nonContract'
import { useTheme } from '../../../providers/Theme'
import { useSparta } from '../../../store/sparta'

/*
 * @param {string} tokenAddress - address of token
 * @param {string} claimable - amount of claimable SPARTA
 * @param {boolean} disabled - boolean to disable button
 */
const DaoDepositModal = (props) => {
  const dispatch = useDispatch()
  const { isDark } = useTheme()
  const { t } = useTranslation()
  const { address } = useAccount()
  const { data: signer } = useSigner()

  const { addresses } = useApp()
  const dao = useDao()
  const pool = usePool()
  const sparta = useSparta()

  const [percentage, setpercentage] = useState('0')
  const [txnLoading, setTxnLoading] = useState(false)
  const [harvestLoading, setHarvestLoading] = useState(false)
  const [showModal, setshowModal] = useState(false)
  const [lockoutConfirm, setLockoutConfirm] = useState(false)
  const [harvestConfirm, setHarvestConfirm] = useState(false)

  const secsSinceHarvest = () => {
    if (dao.member.lastHarvest) {
      return getSecsSince(dao.member.lastHarvest)
    }
    return '0'
  }

  const pool1 = pool.poolDetails.filter(
    (i) => i.tokenAddress === props.tokenAddress,
  )[0]
  const token = pool.tokenDetails.filter(
    (i) => i.address === props.tokenAddress,
  )[0]
  const _dao = getDao(pool1.tokenAddress, dao.daoDetails)

  const handleCloseModal = () => {
    setshowModal(false)
    setLockoutConfirm(false)
    setHarvestConfirm(false)
    setpercentage('0')
  }

  const deposit = () => BN(percentage).div(100).times(pool1.balance).toFixed(0)

  const handleHarvest = async () => {
    setHarvestLoading(true)
    await dispatch(daoHarvest(address, signer))
    setHarvestLoading(false)
  }

  const handleDeposit = async () => {
    setTxnLoading(true)
    await dispatch(daoDeposit(pool1.address, deposit(), address, signer))
    setTxnLoading(false)
    handleCloseModal()
  }

  // 0.00088  === 0.0005
  const estMaxGas = '500000000000000'
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
    if (deposit() <= 0) {
      return [false, t('checkInput')]
    }
    if (!lockoutConfirm) {
      return [false, t('confirmLockup')]
    }
    if (secsSinceHarvest() > 300) {
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
        disabled={props.disabled || !address}
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
          {t('deposit')} {token.symbol}p
        </Modal.Header>
        <Modal.Body>
          <Row className="my-1">
            <Col xs="auto" className="text-card">
              {t('amount')}
            </Col>
            <Col className="text-end output-card">
              {formatFromWei(deposit())} {token.symbol}p
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
              {t('daoVaultDepConf', { symbol: token.symbol })}:
            </Col>
          </Row>
          <Row xs="12">
            <Col xs="auto" className="text-card">
              {t('thisStakeLocked')}:
            </Col>
            <Col className="text-end output-card">
              {formatFromWei(deposit())} {token.symbol}p
            </Col>
          </Row>
          {_dao.staked > 0 && (
            <Row xs="12">
              <Col xs="auto" className="text-card">
                {t('existingStakeLocked')}:
              </Col>
              <Col className="text-end output-card">
                {formatFromWei(_dao.staked)} {token.symbol}p
              </Col>
            </Row>
          )}
          <Form className="my-2 text-center">
            <span className="output-card">
              Confirm 24hr withdraw lockout
              <Form.Check
                type="switch"
                id="confirmLockout"
                className="ms-2 d-inline-flex"
                checked={lockoutConfirm}
                onChange={() => setLockoutConfirm(!lockoutConfirm)}
              />
            </span>
          </Form>
          {secsSinceHarvest() > 300 && (
            <>
              <hr />
              <Row xs="12" className="my-2">
                <Col xs="12" className="output-card">
                  Your existing harvest timer will be reset, harvest before this
                  deposit to avoid forfeiting any accumulated rewards:
                </Col>
              </Row>
              <Row xs="12">
                <Col xs="auto" className="text-card">
                  Harvest forfeiting
                </Col>
                <Col className="text-end output-card">
                  {formatFromWei(props.claimable)} SPARTA
                </Col>
              </Row>
              <Form className="my-2 text-center">
                <span className="output-card">
                  Confirm harvest time reset
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
        </Modal.Body>
        <Modal.Footer>
          <Row className="text-center w-100">
            {address && (
              <Approval
                tokenAddress={pool1.address}
                symbol={`${token.symbol}p`}
                walletAddress={address}
                contractAddress={addresses.dao}
                txnAmount={deposit()}
                assetNumber="1"
              />
            )}
            <Col xs="12" className="hide-if-prior-sibling">
              <Row>
                {props.claimable > 0 && secsSinceHarvest() > 300 && (
                  <Col>
                    <Button
                      className="w-100"
                      onClick={() => handleHarvest()}
                      disabled={
                        props.claimable <= 0 ||
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
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default DaoDepositModal

import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { useTranslation } from 'react-i18next'
import { useAccount, useSigner } from 'wagmi'
import { useDao, daoHarvest, daoWithdraw } from '../../../store/dao'
import { usePool } from '../../../store/pool'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import { getDao, getToken } from '../../../utils/math/utils'
import { Icon } from '../../../components/Icons/index'
import spartaIcon from '../../../assets/tokens/sparta-lp.svg'
import { getSecsSince, getTimeUntil } from '../../../utils/math/nonContract'
import { useTheme } from '../../../providers/Theme'
import { useApp } from '../../../store/app'
import { useSparta } from '../../../store/sparta'

/*
 * @param {string} address - address of token
 * @param {string} tokenAddress - address of token
 * @param {boolean} disabled - boolean to disable button
 * @param {string} claimable - amount of claimable SPARTA
 */
const DaoWithdrawModal = (props) => {
  const dispatch = useDispatch()
  const { isDark } = useTheme()
  const { t } = useTranslation()
  const { address } = useAccount()
  const { data: signer } = useSigner()

  const { addresses } = useApp()
  const dao = useDao()
  const pool = usePool()
  const sparta = useSparta()

  const [txnLoading, setTxnLoading] = useState(false)
  const [harvestLoading, setHarvestLoading] = useState(false)
  const [showModal, setshowModal] = useState(false)
  const [harvestConfirm, setHarvestConfirm] = useState(false)

  const secsSinceHarvest = () => {
    if (dao.member.lastHarvest) {
      return getSecsSince(dao.member.lastHarvest)
    }
    return '0'
  }

  const getLastDeposit = () => {
    let lastDeposit = '99999999999999999999999999999'
    if (dao.lastDeposits.length > 0) {
      const _item = dao.lastDeposits.filter((x) => x.address === props.address)
      lastDeposit = _item[0]?.lastDeposit
    }
    return lastDeposit
  }

  const getLockedSecs = () => {
    const depositTime = BN(getLastDeposit())
    const lockUpSecs = BN('86400')
    const [units, time] = getTimeUntil(depositTime.plus(lockUpSecs), t)
    return [units, time]
  }

  // *CHECK*  === *CHECK*
  const estMaxGas = '1000000000000000'
  const enoughGas = () => {
    const bal = getToken(addresses.bnb, pool.tokenDetails).balance
    if (BN(bal).isLessThan(estMaxGas)) {
      return false
    }
    return true
  }

  const checkValid = () => {
    if (!address) {
      return [false, t('checkWallet'), false]
    }
    if (!enoughGas()) {
      return [false, t('checkBnbGas')]
    }
    if (getLockedSecs()[0] > 0) {
      return [false, `${getLockedSecs()[0]}${getLockedSecs()[1]}`, 'lock']
    }
    if (secsSinceHarvest() > 300) {
      if (!harvestConfirm) {
        return [false, t('confirmHarvest'), false]
      }
    }
    return [true, t('withdraw'), false]
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
    setHarvestConfirm(false)
  }

  const handleHarvest = async () => {
    setHarvestLoading(true)
    await dispatch(daoHarvest(address, signer))
    setHarvestLoading(false)
  }

  const handleWithdraw = async () => {
    setTxnLoading(true)
    await dispatch(daoWithdraw(pool1.address, address, signer))
    setTxnLoading(false)
    handleCloseModal()
  }

  return (
    <>
      <Button
        className="w-100 btn-sm"
        onClick={() => setshowModal(true)}
        disabled={props.disabled || !address}
      >
        {t('withdraw')}
      </Button>
      {!props.disabled && (
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
            {t('withdraw')} {token.symbol}p
          </Modal.Header>
          <Modal.Body>
            <Row className="my-1">
              <Col xs="auto" className="text-card">
                {t('amount')}
              </Col>
              <Col className="text-end output-card">
                {formatFromWei(_dao.staked)} {token.symbol}p
              </Col>
            </Row>
            <Row xs="12" className="my-2">
              <Col xs="12" className="output-card">
                You will be withdrawing all your staked {token.symbol}p tokens
                from the DAOVault to your wallet
              </Col>
            </Row>
            {secsSinceHarvest() > 300 && (
              <>
                <hr />
                <Row xs="12" className="my-2">
                  <Col xs="12" className="output-card">
                    Your existing harvest timer will be reset, harvest before
                    this withdrawal to avoid forfeiting any accumulated rewards:
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
      )}
    </>
  )
}

export default DaoWithdrawModal

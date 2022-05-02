import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import {
  useDao,
  daoDeposit,
  daoHarvest,
  daoMemberDetails,
} from '../../../store/dao'
import { usePool } from '../../../store/pool'
import { BN, formatFromWei } from '../../../utils/bigNumber'
import Approval from '../../../components/Approval/index'
import { getAddresses } from '../../../utils/web3'
import { getDao, getToken } from '../../../utils/math/utils'
import { Icon } from '../../../components/Icons/index'
import spartaIcon from '../../../assets/tokens/sparta-lp.svg'
import { getSecsSince } from '../../../utils/math/nonContract'
import { useReserve } from '../../../store/reserve'
import { useWeb3 } from '../../../store/web3'
import { useTheme } from '../../../providers/Theme'

const DaoDepositModal = (props) => {
  const [percentage, setpercentage] = useState('0')
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const pool = usePool()
  const web3 = useWeb3()
  const reserve = useReserve()
  const dao = useDao()
  const wallet = useWeb3React()
  const { isDark } = useTheme()
  const addr = getAddresses()

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
    await dispatch(daoHarvest(wallet, web3.rpcs))
    setHarvestLoading(false)
    dispatch(daoMemberDetails(wallet, web3.rpcs))
  }

  const handleDeposit = async () => {
    setTxnLoading(true)
    await dispatch(daoDeposit(pool1.address, deposit(), wallet, web3.rpcs))
    setTxnLoading(false)
    handleCloseModal()
  }

  // 0.00088  === 0.0005
  const estMaxGas = '500000000000000'
  const enoughGas = () => {
    const bal = getToken(addr.bnb, pool.tokenDetails).balance
    if (BN(bal).isLessThan(estMaxGas)) {
      return false
    }
    return true
  }

  const checkValid = () => {
    if (!wallet.account) {
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
        disabled={props.disabled || !wallet.account}
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
          <Row className="">
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
          <Row xs="12" className="">
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
              <Row xs="12" className="">
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
            {wallet?.account && (
              <Approval
                tokenAddress={pool1.address}
                symbol={`${token.symbol}p`}
                walletAddress={wallet?.account}
                contractAddress={addr.dao}
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

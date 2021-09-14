import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Col, Row, Modal, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import HelmetLoading from '../../../../components/Loaders/HelmetLoading'
import { daoDeposit } from '../../../../store/dao/actions'
import { useDao } from '../../../../store/dao/selector'
import { usePool } from '../../../../store/pool'
import { BN, formatFromWei } from '../../../../utils/bigNumber'
import { getExplorerTxn } from '../../../../utils/extCalls'
import Approval from '../../../../components/Approval/Approval'
import { getAddresses } from '../../../../utils/web3'
import { Icon } from '../../../../components/Icons/icons'

const DaoDepositModal = (props) => {
  const [percentage, setpercentage] = useState('0')
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const pool = usePool()
  const dao = useDao()
  const wallet = useWeb3React()
  const addr = getAddresses()
  const [showModal, setshowModal] = useState(false)
  const [loading, setloading] = useState(false)
  const [stage, setstage] = useState(0)
  const [lockoutConfirm, setLockoutConfirm] = useState(false)
  const pool1 = pool.poolDetails.filter(
    (i) => i.tokenAddress === props.tokenAddress,
  )[0]
  const token = pool.tokenDetails.filter(
    (i) => i.address === props.tokenAddress,
  )[0]

  const handleCloseModal = () => {
    setshowModal(false)
    setstage(0)
    setloading(false)
    setLockoutConfirm(false)
    setpercentage('0')
  }

  const getToken = (_tokenAddr) =>
    pool.tokenDetails.filter((i) => i.address === _tokenAddr)[0]

  const deposit = () => BN(percentage).div(100).times(pool1.balance).toFixed(0)

  return (
    <>
      <Button
        className="w-100"
        onClick={() => setshowModal(true)}
        disabled={props.disabled}
      >
        {t('deposit')}
      </Button>
      <Modal show={showModal} onHide={() => handleCloseModal()} centered>
        <Modal.Header closeButton closeVariant="white">
          {t('deposit')}
        </Modal.Header>
        <Modal.Body>
          {!loading && stage > 0 && (
            <Row className="my-1">
              <Col xs="12" className="">
                <span>
                  <div className="text-card">{t('txnComplete')}</div>{' '}
                  {t('viewBscScan')}{' '}
                  <a
                    href={getExplorerTxn(dao.deposit.transactionHash)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon icon="scan" />
                  </a>
                </span>
              </Col>

              <Col xs="12" className="">
                <Button color="primary" onClick={() => handleCloseModal()}>
                  {t('close')}
                </Button>
              </Col>
            </Row>
          )}
          {loading && <HelmetLoading />}
          {!loading && stage <= 0 && (
            <>
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
                  This deposit will disable withdraw on all staked LP tokens for
                  24 hours:
                </Col>
              </Row>
              <Row xs="12" className="">
                <Col xs="auto" className="text-card">
                  This stake locked
                </Col>
                <Col className="text-end output-card">
                  {formatFromWei(deposit())} {token.symbol}p
                </Col>
              </Row>
              {dao.daoDetails
                .filter((i) => i.staked > 0)
                .map((i) => (
                  <Row xs="12" key={i.address} className="">
                    <Col xs="auto" className="text-card">
                      Existing stake locked
                    </Col>
                    <Col className="text-end output-card">
                      {formatFromWei(i.staked)}{' '}
                      {getToken(i.tokenAddress)?.symbol}p
                    </Col>
                  </Row>
                ))}
              <hr />
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
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Row className="text-center">
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
              <Button
                className="w-100"
                onClick={async () => {
                  setloading(true)
                  await dispatch(daoDeposit(pool1.address, deposit(), wallet))
                  setstage(stage + 1)
                  setloading(false)
                }}
                disabled={deposit() <= 0 || !lockoutConfirm}
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

export default DaoDepositModal

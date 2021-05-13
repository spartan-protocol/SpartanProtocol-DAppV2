import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Col, Input, Modal, Row, FormGroup, Card } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import HelmetLoading from '../../../../components/Loaders/HelmetLoading'
import { daoDeposit } from '../../../../store/dao/actions'
import { useDao } from '../../../../store/dao/selector'
import { usePool } from '../../../../store/pool'
import { BN, formatFromWei } from '../../../../utils/bigNumber'
import { getExplorerTxn } from '../../../../utils/extCalls'

const DepositModal = ({ showModal, toggleModal, tokenAddress }) => {
  const [percentage, setpercentage] = useState('0')
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const pool = usePool()
  const dao = useDao()
  const [loading, setloading] = useState(false)
  const [stage, setstage] = useState(0)
  const pool1 = pool.poolDetails.filter(
    (i) => i.tokenAddress === tokenAddress,
  )[0]
  const token = pool.tokenDetails.filter((i) => i.address === tokenAddress)[0]

  const deposit = () => BN(percentage).div(100).times(pool1.balance).toFixed(0)

  return (
    <Modal className="card-320" isOpen={showModal} toggle={toggleModal}>
      <Card className="card-body">
        <Row className="">
          <Col xs="10">
            <h4 className="modal-title">{t('deposit')}</h4>
          </Col>
          <Col xs="2">
            <Button onClick={toggleModal} className="btn btn-transparent mt-4">
              <i className="icon-small icon-close" />
            </Button>
          </Col>
        </Row>
        {!loading && stage > 0 && (
          <Row className="my-1">
            <Col xs="12" className="text-left mb-4">
              <span>
                <div className="text-card">{t('txnComplete')}</div>{' '}
                {t('viewBscScan')}{' '}
                <a
                  href={getExplorerTxn(dao.deposit.transactionHash)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="icon-extra-small icon-scan ml-n2" />
                </a>
              </span>
            </Col>

            <Col xs="12" className="">
              <Button color="primary" onClick={() => toggleModal()}>
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
              <Col className="text-right output-card">
                {formatFromWei(deposit())} {token.symbol}
              </Col>
            </Row>
            <Row className="">
              <Col xs="12">
                <FormGroup>
                  <Input
                    type="range"
                    name="range"
                    id="daoVaultSlider"
                    onChange={(e) => setpercentage(e.target.value)}
                    min="0"
                    max="100"
                    defaultValue="0"
                    className="no-ui"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="6" className="ml-n1">
                <Button color="primary" onClick={() => toggleModal()}>
                  {t('cancel')}
                </Button>
              </Col>
              <Col xs="6" className="">
                <Button
                  color="primary"
                  onClick={async () => {
                    setloading(true)
                    await dispatch(daoDeposit(pool1.address, deposit()))
                    setstage(stage + 1)
                    setloading(false)
                  }}
                >
                  {t('confirm')}
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Card>
    </Modal>
  )
}

export default DepositModal

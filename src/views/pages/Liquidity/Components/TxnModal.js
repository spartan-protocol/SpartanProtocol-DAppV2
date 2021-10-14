import React, { useState } from 'react'
import { Col, Row, Modal, Button, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Icon } from '../../../../components/Icons/icons'
import spartaLpIcon from '../../../../assets/tokens/sparta-lp.svg'
import spartaSynthIcon from '../../../../assets/tokens/sparta-synth.svg'
import { formatFromUnits, formatFromWei } from '../../../../utils/bigNumber'

const TxnModal = (props) => {
  const { t } = useTranslation()
  const [showModal, setshowModal] = useState(false)
  const [confirm, setConfirm] = useState(false)

  const handleCloseModal = () => {
    setshowModal(false)
  }

  return (
    <>
      <Button
        className="w-100"
        onClick={() => setshowModal(true)}
        disabled={props.btnDisabled}
      >
        {t(props.btnText)}
      </Button>
      <Modal show={showModal} onHide={() => handleCloseModal()} centered>
        <Modal.Header closeButton closeVariant="white">
          {t(props.header)}
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <Col>{props.body}</Col>
          </Row>
          <hr />
          Input{props.txnInputs.filter((x) => x.amount > 0).length > 1 && 's'}:
          {props.txnInputs
            ?.filter((x) => x.amount > 0)
            .map((txn) => (
              <div key={txn.id}>
                {props.txnInputs.filter((x) => x.amount > 0)[0].id !==
                  txn.id && (
                  <Row className="my-2">
                    <Col xs="">
                      <Icon size="20" icon="plus" className="ms-1" />
                    </Col>
                  </Row>
                )}
                <Row className="my-2">
                  <Col xs="auto" className="position-relative">
                    <img
                      height="30px"
                      className="rounded-circle"
                      src={txn.icon}
                      alt={`${txn?.symbol}`}
                    />
                    {txn.assetType && (
                      <img
                        src={
                          txn.assetType === 'pool'
                            ? spartaLpIcon
                            : txn.assetType === 'synth'
                            ? spartaSynthIcon
                            : null
                        }
                        height="20px"
                        className="token-badge"
                        alt={`${txn?.symbol}type`}
                      />
                    )}
                    <span className={`subtitle-card ms-2 ${txn.class}`}>
                      {formatFromUnits(txn.amount, 4)}
                    </span>
                  </Col>
                  <Col className="text-end">
                    <span className={`subtitle-card ${txn.class}`}>
                      <span className="">{txn.symbol}</span>
                    </span>
                  </Col>
                </Row>
              </div>
            ))}
          <hr />
          Output{props.txnOutputs.filter((x) => x.amount > 0).length > 1 && 's'}
          :
          {props.txnOutputs
            ?.filter((x) => x.amount > 0)
            .map((txn) => (
              <div key={txn.id}>
                {props.txnOutputs.filter((x) => x.amount > 0)[0].id !==
                  txn.id && (
                  <Row className="my-2">
                    <Col xs="">
                      <Icon size="20" icon="plus" className="ms-1" />
                    </Col>
                  </Row>
                )}
                <Row className="my-2">
                  <Col xs="auto" className="position-relative">
                    <img
                      height="30px"
                      className="rounded-circle"
                      src={txn.icon}
                      alt={`${txn?.symbol}`}
                    />
                    {txn.assetType && (
                      <img
                        src={
                          txn.assetType === 'pool'
                            ? spartaLpIcon
                            : txn.assetType === 'synth'
                            ? spartaSynthIcon
                            : null
                        }
                        height="17px"
                        className="token-badge"
                        alt={`${txn?.symbol}type`}
                      />
                    )}
                    <span className={`subtitle-card ms-2 ${txn.class}`}>
                      {formatFromWei(txn.amount, 4)}
                    </span>
                  </Col>
                  <Col className="text-end">
                    <span className={`subtitle-card ${txn.class}`}>
                      <span className="">{txn.symbol}</span>
                    </span>
                  </Col>
                </Row>
              </div>
            ))}
          {props.confirmMessage && (
            <Form className="my-2 text-center">
              <hr />
              <span className="output-card">
                {props.confirmMessage}
                <Form.Check
                  type="switch"
                  id="confirmLockout"
                  className="ms-2 d-inline-flex"
                  checked={confirm}
                  onChange={() => setConfirm(!confirm)}
                />
              </span>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Row className="text-center">
            {props.confirmMessage && !confirm ? null : (
              <Col xs="12">{props.confirmButton}</Col>
            )}
          </Row>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default TxnModal

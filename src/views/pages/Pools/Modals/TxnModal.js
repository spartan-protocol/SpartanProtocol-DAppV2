import React, { useState } from 'react'
import { Col, Row, Modal, Button, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const TxnModal = (props) => {
  const { t } = useTranslation()
  const [showModal, setshowModal] = useState(false)
  const [confirm, setConfirm] = useState(!props.confirmMessage)

  const handleCloseModal = () => {
    setshowModal(false)
  }

  return (
    <>
      <Button
        className="w-100"
        onClick={() => setshowModal(true)}
        disabled={props.disabled}
      >
        {t(props.buttonText)}
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
          {props.txnDetails &&
            props.txnDetails.map((txn) => (
              <Row key={txn.id} className="mb-2">
                <Col xs="auto" className="title-card">
                  <span className={`text-card ${txn.class}`}>{txn.label}</span>
                </Col>
                <Col className="text-end">
                  <span className={`text-card ${txn.class}`}>
                    {txn.amount} <span className="">{txn.symbol}</span>
                  </span>
                </Col>
              </Row>
            ))}
          {props.confirmMessage && (
            <Form className="my-2 text-center">
              <span className="output-card">
                Confirm 24hr withdraw lockout
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
            {confirm && <Col xs="12">{props.confirmButton}</Col>}
          </Row>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default TxnModal

import React from 'react'
import { useTranslation } from 'react-i18next'

import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'

import { useDispatch } from 'react-redux'
import { appAlertTimestamp } from '../../store/app'

const DappAlert = ({ setShowModal, showModal }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const saveAlert = () => {
    dispatch(appAlertTimestamp())
    setShowModal(false)
  }

  return (
    <>
      <Modal show={showModal} onHide={() => saveAlert()} centered>
        <Modal.Header closeButton>{t('Attention')}</Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs="12" style={{ whiteSpace: 'pre-line' }}>
              {t('alertOnDappLoad')}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => saveAlert()}>Close Modal</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default DappAlert

import React from 'react'

import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'

const Notifications = ({ show, txnType }) => (
  <ToastContainer className="p-3 mt-4" position="top-end">
    <Toast bg="info" show={show} animation>
      <Toast.Header closeButton={false}>
        <strong className="me-auto">{txnType} started!</strong>
      </Toast.Header>
      <Toast.Body>
        See Latest Transactions at the bottom of the screen for more info
      </Toast.Body>
    </Toast>
  </ToastContainer>
)

export default Notifications

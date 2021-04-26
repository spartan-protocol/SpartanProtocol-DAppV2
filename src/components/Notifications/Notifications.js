/*eslint-disable*/

import React from 'react'
import NotificationAlert from 'react-notification-alert'


import {
  UncontrolledAlert,
  Alert,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col
} from "reactstrap"

import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip"

const Notifications = () => {

  const notificationAlertRef = React.useRef(null)
   const notify = (message,type) => {

    let options = {}
    options = {
      place: "tr",
      message: (
        <div>
          <div>
            {message}
          </div>
        </div>
      ),
      type: type,
      icon: 'bd-icons icon-bell-55',
      autoDismiss: 7,
    }
    notificationAlertRef.current.notificationAlert(options)
  }

  return (
    <>
      <div className="content">
        <Row className="card-body justify-content-center">
          <Col xs="6" xl="5">
            <h2 className="d-inline text-title ml-1">Notifications</h2>
          </Col>
          <Col xs="6" xl="4">
            {/* Buttons? */}
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col xs="12" xl="9">
            <div className="rna-container">
              <NotificationAlert ref={notificationAlertRef} />
            </div>
            <div className="content">
              <Row>
                <Col md="6">
                  <Card>
                    <CardHeader>
                      <CardTitle tag="h4">Notification states</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <UncontrolledAlert color="success" fade={false}>
                  <span>
                    <b>Success - </b>
                    Message
                  </span>
                      </UncontrolledAlert>
                      <UncontrolledAlert color="warning" fade={false}>
                  <span>
                    <b>Error - </b>
                    Message
                  </span>
                      </UncontrolledAlert>
                        <Button type="Button" className="mx-1 btn btn-success" onClick={() => notify('Message text ok','success')}>
                          <div className="d-none d-sm-inline-block ml-1">Trigger message success</div>
                        </Button>

                      <Button type="Button" className="mx-1 btn btn-warning" onClick={() => notify('Message text error','warning')}>
                        <div className="d-none d-sm-inline-block ml-1">Trigger message error</div>
                      </Button>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Notifications

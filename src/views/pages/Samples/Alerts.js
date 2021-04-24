/* eslint-disable*/
import React from "react"
// react component used to create sweet alerts
import ReactBSAlert from "react-bootstrap-sweetalert"

// reactstrap components
import { Button, Card, CardBody, CardText, Row, Col } from "reactstrap"
import SweetAlert from "react-bootstrap-sweetalert/dist"
import { getExplorerWallet } from "../../../utils/extCalls"

const Alerts = () => {
  const [alert, setAlert] = React.useState(null)
  // to stop the warning of calling setState of unmounted component
  React.useEffect(
    () =>
      function cleanup() {
        let id = window.setTimeout(null, 0)
        while (id--) {
          window.clearTimeout(id)
        }
      }
  )
  const hideAlert = () => {
    setAlert(null)
  }

  const successDelete = () => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px", backgroundColor: "#1D171F", color: "#FFFFFF" }}
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="primary"
        cancelBtnBsStyle="danger"
        btnSize=""
      >
        <h1 className="text-title">Transaction success</h1>
        <i className="icon-large icon-checked icon-light" />
        <br />
        <br/>
        <div className="output-card">
          View on BSC Scan{' '}
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            style={{
              marginLeft: '2px',
            }}
          >
            <i className="icon-extra-small icon-scan" />
          </a>
        </div>
        0xABC...YZ123
      </SweetAlert>
    )
  }

  const cancelDetele = () => {
    setAlert(
      <SweetAlert

        style={{ display: "block", marginTop: "-100px", backgroundColor: "#1D171F", color: "#FFFFFF" }}
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="danger"
        cancelBtnBsStyle="danger"
        confirmBtnText="OK"
        btnSize=""
      >
        <h1 className="text-title">Cancelled</h1>
        No actions where taken!
      </SweetAlert>
    )
  }
  const warningWithConfirmAndCancelMessage = () => {

    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px", backgroundColor: "#1D171F", color: "#FFFFFF" }}
        onConfirm={() => successDelete()}
        onCancel={() => cancelDetele()}
        confirmBtnBsStyle="primary"
        cancelBtnBsStyle="danger"
        confirmBtnText="Confirm Swap"
        cancelBtnText="Cancel"
        showCancel
        btnSize=""

      >
        <h1 className="text-title">Are you sure?</h1>
        <i className="icon-large icon-warning icon-light" />
        <br/>
        <br/>
        Be aware lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </SweetAlert>
    )
  }

  return (
    <>
      <div className="content">
        {alert}
        <div className="places-sweet-alerts">
          <Col className="mr-auto" md="6">
            <Card>
              <CardBody className="text-center">
                <CardText>
                  ...and by passing a parameter, you can execute something
                  else for "Cancel"
                </CardText>
                <Button
                  className="btn-fill"
                  color="primary"
                  onClick={warningWithConfirmAndCancelMessage}
                >
                  Test!
                </Button>
              </CardBody>
            </Card>
          </Col>
        </div>
      </div>
    </>
  )
}

export default Alerts

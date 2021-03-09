/* eslint-disable react/no-unescaped-entities */
import React from 'react'
// react component used to create sweet alerts
import ReactBSAlert from 'react-bootstrap-sweetalert'

// reactstrap components
import { Button, Card, CardBody, CardText, Row, Col } from 'reactstrap'

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
      },
  )
  const hideAlert = () => {
    setAlert(null)
  }
  //   const basicAlert = () => {
  //     setAlert(
  //       <ReactBSAlert
  //         style={{ display: 'block', marginTop: '-100px' }}
  //         title="Here's a message!"
  //         onConfirm={() => hideAlert()}
  //         onCancel={() => hideAlert()}
  //         confirmBtnBsStyle="success"
  //         btnSize=""
  //       />,
  //     )
  //   }
  const titleAndTextAlert = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: 'block', marginTop: '-100px' }}
        title="Here's a message!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        btnSize=""
      >
        <div>It's pretty, isn't it?</div>
      </ReactBSAlert>,
    )
  }
  const successAlert = () => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: 'block', marginTop: '-100px' }}
        title="Good job!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        btnSize=""
      >
        You are a true spartan!
      </ReactBSAlert>,
    )
  }
  //   const htmlAlert = () => {
  //     setAlert(
  //       <ReactBSAlert
  //         style={{ display: 'block', marginTop: '-100px' }}
  //         title="HTML example"
  //         onConfirm={() => hideAlert()}
  //         onCancel={() => hideAlert()}
  //         confirmBtnBsStyle="info"
  //         btnSize=""
  //       >
  //         You can use <b>bold</b> text, <a href="#">links</a> and other HTML tags
  //       </ReactBSAlert>,
  //     )
  //   }
  const successDelete = () => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: 'block', marginTop: '-100px' }}
        title="Transaction successfully!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        btnSize=""
      >
        0xce2fd7544e0b2cc94692d4a704debef7bcb61328 <br />
        <br />
        Copy
        <span data-notify="icon" className="bd-icons icon-single-copy-04" />
      </ReactBSAlert>,
    )
  }
  const warningWithConfirmMessage = () => {
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: 'block', marginTop: '-100px' }}
        title="Are you sure?"
        onConfirm={() => successDelete()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="primary"
        cancelBtnBsStyle="danger"
        confirmBtnText="Yes, add to pools"
        cancelBtnText="Cancel"
        showCancel
        btnSize=""
      >
        Be aware that if you can lose your assets if you don't know what you are
        doing!
      </ReactBSAlert>,
    )
  }
  const cancelDetele = () => {
    setAlert(
      <ReactBSAlert
        danger
        style={{ display: 'block', marginTop: '-100px' }}
        title="Cancelled"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        btnSize=""
      >
        No actions where taken!
      </ReactBSAlert>,
    )
  }
  const warningWithConfirmAndCancelMessage = () => {
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: 'block', marginTop: '-100px' }}
        title="Are you sure?"
        onConfirm={() => successDelete()}
        onCancel={() => cancelDetele()}
        confirmBtnBsStyle="primary"
        cancelBtnBsStyle="danger"
        confirmBtnText="Yes, remove my assets!"
        cancelBtnText="Cancel"
        showCancel
        btnSize=""
      >
        Be aware that if you can lose your assets if you don't know what you are
        doing!
      </ReactBSAlert>,
    )
  }
  //   const autoCloseAlert = () => {
  //     setAlert(
  //       <ReactBSAlert
  //         style={{ display: 'block', marginTop: '-100px' }}
  //         title="Auto close alert!"
  //         onConfirm={() => hideAlert()}
  //         showConfirm={false}
  //       >
  //         I will close in 2 seconds.
  //       </ReactBSAlert>,
  //     )
  //     setTimeout(() => {
  //       setAlert(null)
  //     }, 2000)
  //   }
  //   const inputAlert = () => {
  //     setAlert(
  //       <ReactBSAlert
  //         input
  //         showCancel
  //         style={{ display: 'block', marginTop: '-100px' }}
  //         title="Input something"
  //         onConfirm={(e) => inputConfirmAlert(e)}
  //         onCancel={() => hideAlert()}
  //         confirmBtnBsStyle="success"
  //         cancelBtnBsStyle="danger"
  //         btnSize=""
  //       />,
  //     )
  //   }
  //   const inputConfirmAlert = (e) => {
  //     setAlert(
  //       <ReactBSAlert
  //         success
  //         style={{ display: 'block', marginTop: '-100px' }}
  //         onConfirm={() => hideAlert()}
  //         onCancel={() => hideAlert()}
  //         confirmBtnBsStyle="success"
  //         btnSize=""
  //         title="You entered: "
  //       >
  //         <b>{e}</b>
  //       </ReactBSAlert>,
  //     )
  //   }
  return (
    <>
      <div className="content">
        {alert}
        <div className="places-sweet-alerts">
          <h2 className="text-center">Alerts</h2>
          <Row className="mt-5">
            <Col className="mr-auto" md="6">
              <Card>
                <CardBody className="text-center">
                  <CardText>A success message</CardText>
                  <Button
                    className="btn-fill"
                    color="primary"
                    onClick={successAlert}
                  >
                    Test!
                  </Button>
                </CardBody>
              </Card>
            </Col>
            <Col className="mr-auto" md="6">
              <Card>
                <CardBody className="text-center">
                  <CardText>
                    A warning message, with a function attached to the "Confirm"
                    Button...
                  </CardText>
                  <Button
                    className="btn-fill"
                    color="primary"
                    onClick={warningWithConfirmMessage}
                  >
                    Test!
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col className="mr-auto" md="6">
              <Card>
                <CardBody className="text-center">
                  <CardText>A title with a text under</CardText>
                  <Button
                    className="btn-fill"
                    color="primary"
                    onClick={titleAndTextAlert}
                  >
                    Test!
                  </Button>
                </CardBody>
              </Card>
            </Col>
            <Col className="ml-auto" md="6" />
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
          </Row>
        </div>
      </div>
    </>
  )
}

export default Alerts

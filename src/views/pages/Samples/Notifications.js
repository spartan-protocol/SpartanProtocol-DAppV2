import React from "react";
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";

// reactstrap components
import {
    UncontrolledAlert,
    Alert,
    Button,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Modal,
    ModalBody,
    Row,
    Col,
} from "reactstrap";

const Notifications = () => {

    const [modalMini, setModalMini] = React.useState(false);
    const [modalClassic, setModalClassic] = React.useState(false);
    const [modalNotice, setModalNotice] = React.useState(false);
    const notificationAlertRef = React.useRef(null);
    const toggleModalClassic = () => {
        setModalClassic(!modalClassic);
    };
    const toggleModalNotice = () => {
        setModalNotice(!modalNotice);
    };
    const toggleModalMini = () => {
        setModalMini(!modalMini);
    };




    const notify = (place) => {
        var color = Math.floor(Math.random() * 5 + 1);
        var type;
        switch (color) {
            case 1:
                type = "primary";
                break;
            case 2:
                type = "success";
                break;
            case 3:
                type = "danger";
                break;
            case 4:
                type = "warning";
                break;
            case 5:
                type = "info";
                break;
            default:
                break;
        }
        var options = {};
        options = {
            place: place,
            message: (
                <div>
                    <div>
                        Welcome to <b>SPARTA UI v2</b>
                    </div>
                </div>
            ),
            type: type,
            icon: "bd-icons icon-bell-55",
            autoDismiss: 7,
        };
        notificationAlertRef.current.notificationAlert(options);
    };
    return (
        <>
            <div className="rna-container">
                <NotificationAlert ref={notificationAlertRef} />
            </div>
            <div className="content">
                <Row>
                    <Col md="6">
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Notifications Style</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Alert color="primary">
                                    <span>This is a plain notification</span>
                                </Alert>
                                <UncontrolledAlert color="primary" fade={false}>
                                    <span>This is a notification with close button.</span>
                                </UncontrolledAlert>
                                <UncontrolledAlert
                                    className="alert-with-icon"
                                    color="primary"
                                    fade={false}
                                >
                                    <span data-notify="icon" className="bd-icons icon-bell-55" />
                                    <span>
                    This is a notification with close button and icon.
                  </span>
                                </UncontrolledAlert>
                                <UncontrolledAlert
                                    className="alert-with-icon"
                                    color="primary"
                                    fade={false}
                                >
                                    <span data-notify="icon" className="bd-icons icon-bell-55" />
                                    <span data-notify="message">
                    This is a notification with close button and icon and have
                    many lines. You can see that the icon and the close button
                    are always vertically aligned. This is a beautiful
                    notification. So you don't have to worry about the style.
                  </span>
                                </UncontrolledAlert>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="6">
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Notification states</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <UncontrolledAlert color="primary" fade={false}>
                  <span>
                    <b>Primary - </b>
                    This is a regular notification made with ".alert-primary"
                  </span>
                                </UncontrolledAlert>
                                <UncontrolledAlert color="info" fade={false}>
                  <span>
                    <b>Info - </b>
                    This is a regular notification made with ".alert-info"
                  </span>
                                </UncontrolledAlert>
                                <UncontrolledAlert color="success" fade={false}>
                  <span>
                    <b>Success - </b>
                    This is a regular notification made with ".alert-success"
                  </span>
                                </UncontrolledAlert>
                                <UncontrolledAlert color="warning" fade={false}>
                  <span>
                    <b>Warning - </b>
                    This is a regular notification made with ".alert-warning"
                  </span>
                                </UncontrolledAlert>
                                <UncontrolledAlert color="danger" fade={false}>
                  <span>
                    <b>Danger - </b>
                    This is a regular notification made with ".alert-danger"
                  </span>
                                </UncontrolledAlert>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="12">
                        <Card>
                            <CardBody>
                                <div className="places-buttons">
                                    <Row>
                                        <Col className="ml-auto mr-auto text-center" md="6">
                                            <CardTitle tag="h4">Notifications Places</CardTitle>
                                            <p className="category mb-3">
                                                Click to view notifications
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="ml-auto mr-auto" lg="8">
                                            <Row>
                                                <Col md="4">
                                                    <Button
                                                        block
                                                        color="info"
                                                        onClick={() => notify("tl")}
                                                    >
                                                        Top Left
                                                    </Button>
                                                </Col>
                                                <Col md="4">
                                                    <Button
                                                        block
                                                        color="info"
                                                        onClick={() => notify("tc")}
                                                    >
                                                        Top Center
                                                    </Button>
                                                </Col>
                                                <Col md="4">
                                                    <Button
                                                        block
                                                        color="info"
                                                        onClick={() => notify("tr")}
                                                    >
                                                        Top Right
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="ml-auto mr-auto" lg="8">
                                            <Row>
                                                <Col md="4">
                                                    <Button
                                                        block
                                                        color="info"
                                                        onClick={() => notify("bl")}
                                                    >
                                                        Bottom Left
                                                    </Button>
                                                </Col>
                                                <Col md="4">
                                                    <Button
                                                        block
                                                        color="info"
                                                        onClick={() => notify("bc")}
                                                    >
                                                        Bottom Center
                                                    </Button>
                                                </Col>
                                                <Col md="4">
                                                    <Button
                                                        block
                                                        color="info"
                                                        onClick={() => notify("br")}
                                                    >
                                                        Bottom Right
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                                <Row>
                                    <Col className="text-center" md="12">
                                        <CardHeader>
                                            <CardTitle tag="h4">Modal</CardTitle>
                                        </CardHeader>
                                        <Button color="primary" onClick={toggleModalClassic}>
                                            Classic modal
                                        </Button>
                                        <Button color="success" onClick={toggleModalNotice}>
                                            Notice modal
                                        </Button>
                                        <Button color="default" onClick={toggleModalMini}>
                                            Small alert modal
                                        </Button>
                                        {/* Classic Modal */}
                                        <Modal isOpen={modalClassic} toggle={toggleModalClassic}>
                                            <div className="modal-header justify-content-center">
                                                <button
                                                    aria-hidden={true}
                                                    className="close"
                                                    data-dismiss="modal"
                                                    type="button"
                                                    onClick={toggleModalClassic}
                                                >
                                                    <i className="bd-icons icon-simple-remove" />
                                                </button>
                                                <h6 className="title title-up">Modal title</h6>
                                            </div>
                                            <ModalBody className="text-center">
                                                <p>
                                                   Some text.. here
                                                </p>
                                            </ModalBody>
                                            <div className="modal-footer">
                                                <Button
                                                    color="default"
                                                    type="button"
                                                    onClick={toggleModalClassic}
                                                >
                                                    Acept
                                                </Button>
                                                <Button
                                                    color="danger"
                                                    data-dismiss="modal"
                                                    type="button"
                                                    onClick={toggleModalClassic}
                                                >
                                                    Go back
                                                </Button>
                                            </div>
                                        </Modal>
                                        {/* End Classic Modal */}
                                        {/* Notice Modal */}
                                        <Modal isOpen={modalNotice} toggle={toggleModalNotice}>
                                            <div className="modal-header">
                                                <button
                                                    aria-hidden={true}
                                                    className="close"
                                                    data-dismiss="modal"
                                                    type="button"
                                                    onClick={toggleModalNotice}
                                                >
                                                    <i className="bd-icons icon-simple-remove" />
                                                </button>
                                                <h5 className="modal-title" id="myModalLabel">
                                                    This is a title with a question?
                                                </h5>
                                            </div>
                                            <ModalBody className="text-center">
                                                <div className="instruction">
                                                    <Row>
                                                        <Col md="8">
                                                            <strong>1. Something</strong>
                                                            <p className="description">
                                                                The first step is to connect your wallet at{" "}
                                                                <a href="#">
                                                                </a>
                                                                . You can choose form.., whatever works best for you.
                                                            </p>
                                                        </Col>
                                                        <Col md="4">
                                                            <div>
                                                                <img
                                                                    alt="..."
                                                                    src={require("../../../assets/img/picto-synthetics-small.svg").default}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <div className="instruction">
                                                    <Row>
                                                        <Col md="8">
                                                            <strong>2. Something</strong>
                                                            <p className="description">
                                                                This is a second step at{" "}
                                                                <a href="#">

                                                                </a>
                                                                Take me there
                                                            </p>
                                                        </Col>
                                                        <Col md="4">
                                                            <div>
                                                                <img
                                                                    alt="..."
                                                                    src={require("../../../assets/img/picto-lending-small.svg").default}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <p>
                                                    If you have more questions, don't hesitate to contact
                                                    us or send us a tweet {`. We're `}
                                                    here to help!
                                                </p>
                                            </ModalBody>
                                            <div className="modal-footer justify-content-center">
                                                <Button
                                                    className="btn-round"
                                                    color="info"
                                                    data-dismiss="modal"
                                                    type="button"
                                                    onClick={toggleModalNotice}
                                                >
                                                    Close
                                                </Button>
                                            </div>
                                        </Modal>
                                        {/* End Notice Modal */}
                                        {/* Small Modal */}
                                        <Modal
                                            modalClassName="modal-mini modal-primary"
                                            isOpen={modalMini}
                                            toggle={toggleModalMini}
                                        >
                                            <div className="modal-header justify-content-center">
                                                <button
                                                    aria-hidden={true}
                                                    className="close"
                                                    data-dismiss="modal"
                                                    type="button"
                                                    onClick={toggleModalMini}
                                                >
                                                    <i className="bd-icons icon-simple-remove text-white" />
                                                </button>
                                                <div className="modal-profile">
                                                    <i className="bd-icons icon-single-02" />
                                                </div>
                                            </div>
                                            <ModalBody className="text-center">
                                                <p>Message here..</p>
                                            </ModalBody>
                                            <div className="modal-footer">
                                                <Button
                                                    className="btn-neutral"
                                                    color="link"
                                                    type="button"
                                                    onClick={toggleModalMini}
                                                >
                                                    Back
                                                </Button>
                                                <Button
                                                    className="btn-neutral"
                                                    color="link"
                                                    data-dismiss="modal"
                                                    type="button"
                                                    onClick={toggleModalMini}
                                                >
                                                    Accept
                                                </Button>
                                            </div>
                                        </Modal>
                                        {/* End Small Modal */}
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default Notifications;

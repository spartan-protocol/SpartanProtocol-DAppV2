import React from "react"
import Card from 'react-bootstrap/Card'
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {CardBody, CardHeader, CardTitle, Collapse, NavbarBrand} from "reactstrap";


import Button from "react-bootstrap/Button";
import {ReactComponent as SpartanLogo} from "../../../assets/img/logo.svg";

const Tiles = () => {
    const [openedCollapseOne, setopenedCollapseOne] = React.useState(true);
    const [openedCollapseTwo, setopenedCollapseTwo] = React.useState(false);
    const [openedCollapseThree, setopenedCollapseThree] = React.useState(false);
    return (
        <>
            <div className="content">
                <Card className="card-body">

                    <Col md={12}>
                        <Row>
                            <Col md="1">
                                <h3>BNB</h3>
                            </Col>
                            <Col md="1">
                                <h4>APY</h4>
                            </Col>
                            <Col md="1">
                                <h4>Depth</h4>
                            </Col>
                            <Col md="1">
                                <h4>Volume</h4>
                            </Col>
                            <Col md="2" className="ml-5">
                                <Button className="btn btn btn-success">
                                    <i className="bd-icons icon-bell-55"/> Bond
                                </Button>
                            </Col>
                            <Col md="3">
                                <Button className="btn btn btn-primary">
                                    <i className="bd-icons icon-bell-55"/> Exchange
                                </Button>
                            </Col>

                        </Row>


                    </Col>
                    <Card className="card-body" style={{backgroundColor: "#25212D"}}>
                        <div
                            aria-multiselectable={true}
                            className="card-collapse"
                            id="accordion"
                            role="tablist">
                            <Card>
                                <CardHeader role="tab">
                                    <a
                                        aria-expanded={openedCollapseThree}
                                        href="#"
                                        data-parent="#accordion"
                                        data-toggle="collapse"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setopenedCollapseThree(!openedCollapseThree);
                                        }}>
                                        {""}

                                        <Row>
                                            <Col md="3">
                                                <h3>BNB-SPARTA</h3>

                                            </Col>
                                            <Col className="ml-auto" md="2">
                                                <h3>$10.545,85</h3>
                                            </Col>
                                            <Col className="ml-auto" md="3">
                                                <i
                                                    className="bd-icons icon-minimal-down mt-n8"/>

                                            </Col>

                                        </Row>
                                    </a>
                                </CardHeader>
                                <Card className="card-body">
                                    <Collapse role="tabpanel" isOpen={openedCollapseThree}>
                                        <CardBody>
                                            <Row>
                                                <Col md="4">
                                                    <h4>Total LP Tokens
                                                        <i className="icon-small icon-info icon-dark ml-2"/></h4>
                                                    <h6 className="text-muted mr-2">SPARTA</h6>
                                                    <h6 className="text-muted">BNB</h6>
                                                </Col>
                                                <Col md="4">
                                                    <h4>Add & Remove<i className="icon-small icon-info icon-dark ml-2"/>
                                                    </h4>
                                                    <h6 className="text-muted">SPARTA</h6>
                                                    <h6 className="text-muted">BNB</h6>
                                                </Col>
                                                <Col md="4">
                                                    <h4>Gains<i className="icon-small icon-info icon-dark ml-2"/></h4>
                                                    <h6 className="text-muted">SPARTA</h6>
                                                    <h6 className="text-muted">BNB</h6>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Collapse>
                                </Card>

                            </Card>
                        </div>
                    </Card>

                </Card>
            </div>
        </>
    )
}

export default Tiles

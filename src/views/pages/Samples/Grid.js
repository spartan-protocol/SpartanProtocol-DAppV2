import React from "react";

// reactstrap components
import { Card, CardBody, Row, Col } from "reactstrap";

const Grid = () => {
    return (
        <>
            <div className="content">
                <h4 className="title pl-3">
                    XS Grid <small>Always Horizontal</small>
                </h4>
                <Row>
                    <Col xs="4">
                        <Card>
                            <CardBody className="text-center py-5">
                                <h6>col-4</h6>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="4">
                        <Card>
                            <CardBody className="text-center py-5">
                                <h6>col-4</h6>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="4">
                        <Card>
                            <CardBody className="text-center py-5">
                                <h6>col-4</h6>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <h4 className="title pl-3">
                    SM Grid <small>Collapsed at 576px</small>
                </h4>
                <Row>
                    <Col sm="4">
                        <Card>
                            <CardBody className="text-center py-5">
                                <h6>col-sm-4</h6>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col sm="4">
                        <Card>
                            <CardBody className="text-center py-5">
                                <h6>col-sm-4</h6>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col sm="4">
                        <Card>
                            <CardBody className="text-center py-5">
                                <h6>col-sm-4</h6>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <h4 className="title pl-3">
                    MD Grid <small>Collapsed at 768px</small>
                </h4>
                <Row>
                    <Col md="4">
                        <Card>
                            <CardBody className="text-center py-5">
                                <h6>col-md-4</h6>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="4">
                        <Card>
                            <CardBody className="text-center py-5">
                                <h6>col-md-4</h6>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="4">
                        <Card>
                            <CardBody className="text-center py-5">
                                <h6>col-md-4</h6>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <h4 className="title pl-3">
                    LG Grid <small>Collapsed at 992px</small>
                </h4>
                <Row>
                    <Col lg="4">
                        <Card>
                            <CardBody className="text-center py-5">
                                <h6>col-lg-4</h6>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="4">
                        <Card>
                            <CardBody className="text-center py-5">
                                <h6>col-lg-4</h6>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="4">
                        <Card>
                            <CardBody className="text-center py-5">
                                <h6>col-lg-4</h6>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <h4 className="title pl-3">
                    XL Grid <small>Collapsed at 1200px</small>
                </h4>
                <Row>
                    <Col xl="4">
                        <Card>
                            <CardBody className="text-center py-5">
                                <h6>col-xl-4</h6>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xl="4">
                        <Card>
                            <CardBody className="text-center py-5">
                                <h6>col-xl-4</h6>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xl="4">
                        <Card>
                            <CardBody className="text-center py-5">
                                <h6>col-xl-4</h6>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <h4 className="title pl-3">
                    Mixed Grid <small>Showing different sizes on different screens</small>
                </h4>
                <Row>
                    <Col lg="3" sm="6">
                        <Card>
                            <CardBody className="text-center py-5">
                                <h6>col-sm-6 col-lg-3</h6>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="3" sm="6">
                        <Card>
                            <CardBody className="text-center py-5">
                                <h6>col-sm-6 col-lg-3</h6>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="3" sm="6">
                        <Card>
                            <CardBody className="text-center py-5">
                                <h6>col-sm-6 col-lg-3</h6>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="3" sm="6">
                        <Card>
                            <CardBody className="text-center py-5">
                                <h6>col-sm-6 col-lg-3</h6>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <h4 className="title pl-3">
                    Offset Grid <small>Adding some space when needed</small>
                </h4>
                <Row>
                    <Col md="3">
                        <Card>
                            <CardBody className="text-center py-5">
                                <h6>col-md-3</h6>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col className="ml-auto" md="3">
                        <Card>
                            <CardBody className="text-center py-5">
                                <h6>col-md-3 ml-auto</h6>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col className="ml-auto mr-auto" md="4">
                        <Card>
                            <CardBody className="text-center py-5">
                                <h6>col-md-4 ml-auto mr-auto</h6>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col className="ml-auto mr-auto" md="4">
                        <Card>
                            <CardBody className="text-center py-5">
                                <h6>col-md-4 ml-auto mr-auto</h6>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col className="ml-auto mr-auto" md="6">
                        <Card>
                            <CardBody className="text-center py-5">
                                <h6>col-md-6 ml-auto mr-auto</h6>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default Grid;

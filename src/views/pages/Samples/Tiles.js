import React from "react"
import Card from 'react-bootstrap/Card'
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {CardBody, CardHeader, CardTitle, Collapse, NavbarBrand} from "reactstrap";
import bnb_logo from '../../../assets/img/BNB.png';
import btc_logo from '../../../assets/img/BTC.png';
import ustd_logo from '../../../assets/img/TUSD.png';
import coins from '../../../assets/img/coins.png';

import Button from "react-bootstrap/Button";
import {ReactComponent as SpartanLogo} from "../../../assets/img/logo.svg";

const Tiles = () => {
    const [openedCollapseOne, setopenedCollapseOne] = React.useState(true);
    const [openedCollapseTwo, setopenedCollapseTwo] = React.useState(false);
    const [openedCollapseThree, setopenedCollapseThree] = React.useState(false);
    return (
        <>
            <div className="content">
                <Col md="8">
                    <Card className="card-body">
                        <CardHeader>
                            <CardTitle tag="h3"><Row>
                                <Col md="2"><img src={bnb_logo} alt="Logo"/> BNB</Col>
                                <Col md="2"><h6>APY</h6><h4>188.25%</h4></Col>
                                <Col md="2"><h6>Depth</h6><h4>$2.113.877</h4></Col>
                                <Col md="2"><h6>Volume</h6><h4>$13.386.399</h4></Col>
                                <Col md="2"><Button  className="btn btn btn-success">
                                    <i className="bd-icons icon-bell-55" /> Bond
                                </Button>
                               </Col>
                                <Col md="2"><Button type="Button" className="mx-1 btn btn-primary">
                                    Exchange
                                </Button></Col>
                            </Row>
                            </CardTitle>

                        </CardHeader>

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
                                                <Col md="12"><i className="bd-icons icon-minimal-down"/></Col>
                                                <Col md="10"><img style={{width: '80px', height: '80px'}} src={coins} />SPARTA-BNB</Col>
                                                <Col md="2"><h3>$10.545,85</h3></Col>

                                            </Row>

                                        </a>
                                    </CardHeader>
                                    <Card className="card-body">
                                        <Collapse role="tabpanel" isOpen={openedCollapseThree}>
                                            <CardBody>
                                                <Row>
                                                    <Col md="4"><h4><span> Total LP Token value  <i
                                                        className="icon-small icon-info icon-dark"/></span></h4>
                                                        <SpartanLogo className="mr-2 mb-4"/>SPARTA-BNB XX
                                                        <br/>
                                                        <img src={bnb_logo} alt="Logo"/>SPARTA-BNB XX

                                                    </Col>
                                                    <Col md="4"><h4><span> Total LP Token value  <i
                                                        className="icon-small icon-info icon-dark"/></span></h4>
                                                        <SpartanLogo className="mr-2 mb-4"/>SPARTA-BNB XX
                                                        <br/>
                                                        <img src={bnb_logo} alt="Logo"/>SPARTA-BNB

                                                    </Col>
                                                    <Col md="4"><h4><span> Total LP Token value  <i
                                                        className="icon-small icon-info icon-dark"/></span></h4>
                                                        <SpartanLogo className="mr-2 mb-4"/>SPARTA-BNB  XX
                                                        <br/>
                                                        <img src={bnb_logo} alt="Logo"/>SPARTA-BNB XX

                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Collapse></Card>

                                </Card>
                            </div>
                        </Card>


                    </Card>
                </Col>
                <Col md="8">
                    <Card className="card-body">
                        <CardHeader>
                            <CardTitle tag="h3"><Row>
                                <Col md="2"><img src={ustd_logo} alt="Logo"/> TUSD</Col>
                                <Col md="2"><h6>APY</h6><h4>188.25%</h4></Col>
                                <Col md="2"><h6>Depth</h6><h4>$2.113.877</h4></Col>
                                <Col md="2"><h6>Volume</h6><h4>$13.386.399</h4></Col>
                                <Col md="2"><Button  className="btn btn btn-success">
                                    <i className="bd-icons icon-bell-55" /> Bond
                                </Button>
                                </Col>
                                <Col md="2"><Button type="Button" className="mx-1 btn btn-primary">
                                    Exchange
                                </Button></Col>
                            </Row>
                            </CardTitle>

                        </CardHeader>

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
                                                <Col md="12"><i className="bd-icons icon-minimal-down"/></Col>
                                                <Col md="10"><img style={{width: '80px', height: '80px'}} src={coins} />SPARTA-BNB</Col>
                                                <Col md="2"><h3>$10.545,85</h3></Col>

                                            </Row>

                                        </a>
                                    </CardHeader>
                                    <Card className="card-body">
                                        <Collapse role="tabpanel" isOpen={openedCollapseThree}>
                                            <CardBody>
                                                <Row>
                                                    <Col md="4"><h4><span> Total LP Token value  <i
                                                        className="icon-small icon-info icon-dark"/></span></h4>
                                                        <SpartanLogo className="mr-2 mb-4"/>SPARTA-BNB XX
                                                        <br/>
                                                        <img src={bnb_logo} alt="Logo"/>SPARTA-BNB XX

                                                    </Col>
                                                    <Col md="4"><h4><span> Total LP Token value  <i
                                                        className="icon-small icon-info icon-dark"/></span></h4>
                                                        <SpartanLogo className="mr-2 mb-4"/>SPARTA-BNB XX
                                                        <br/>
                                                        <img src={bnb_logo} alt="Logo"/>SPARTA-BNB

                                                    </Col>
                                                    <Col md="4"><h4><span> Total LP Token value  <i
                                                        className="icon-small icon-info icon-dark"/></span></h4>
                                                        <SpartanLogo className="mr-2 mb-4"/>SPARTA-BNB  XX
                                                        <br/>
                                                        <img src={bnb_logo} alt="Logo"/>SPARTA-BNB XX

                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Collapse></Card>

                                </Card>
                            </div>
                        </Card>


                    </Card>
                </Col>
                <Col md="8">
                    <Card className="card-body">
                        <CardHeader>
                            <CardTitle tag="h3"><Row>
                                <Col md="2"><img src={btc_logo} alt="Logo"/> BNB</Col>
                                <Col md="2"><h6>APY</h6><h4>188.25%</h4></Col>
                                <Col md="2"><h6>Depth</h6><h4>$2.113.877</h4></Col>
                                <Col md="2"><h6>Volume</h6><h4>$13.386.399</h4></Col>
                                <Col md="2"><Button  className="btn btn btn-success">
                                    <i className="bd-icons icon-bell-55" /> Bond
                                </Button>
                                </Col>
                                <Col md="2"><Button type="Button" className="mx-1 btn btn-primary">
                                    Exchange
                                </Button></Col>
                            </Row>
                            </CardTitle>

                        </CardHeader>


                    </Card>
                </Col>


            </div>
        </>
    )
}

export default Tiles

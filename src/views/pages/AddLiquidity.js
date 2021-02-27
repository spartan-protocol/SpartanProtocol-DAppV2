import React, {useEffect, useState, useContext} from 'react'
// import {Context} from '../context'

import {withRouter, useLocation, Link} from 'react-router-dom';
import classnames from 'classnames';

// import InputPaneJoin from "../components/Sections/InputPaneJoin";


import {
    Container,
    Row,
    Button,
    Col,
    Card,
    CardBody,
    Label,
    Nav,
    NavItem,
    NavLink,
    Input,
    TabPane,
    TabContent,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    CardHeader,
    CardTitle,
    Collapse,
    Form,
    FormGroup,
    CardFooter,
    UncontrolledDropdown
} from "reactstrap";


import {withNamespaces} from "react-i18next";
import {manageBodyClass} from "../../components/Common/common";
import bnb_sparta from "../../assets/icons/bnb_sparta.png";
import coin_sparta from "../../assets/icons/coin_sparta.svg";
import coin_bnb from "../../assets/icons/coin_bnb.svg";
import InputGroup from "reactstrap/es/InputGroup";
import InputGroupAddon from "reactstrap/es/InputGroupAddon";
import Slider from "nouislider";
import UncontrolledTooltip from "reactstrap/lib/UncontrolledTooltip";


const AddLiquidity = (props) => {

    const [horizontalTabs, sethorizontalTabs] = React.useState("profile");
    const [verticalTabs, setverticalTabs] = React.useState("profile");
    const [verticalTabsIcons, setverticalTabsIcons] = React.useState("home");
    const [pageTabs, setpageTabs] = React.useState("home");
    const [openedCollapseOne, setopenedCollapseOne] = React.useState(true);
    const [openedCollapseTwo, setopenedCollapseTwo] = React.useState(false);
    const [openedCollapseThree, setopenedCollapseThree] = React.useState(false);
    // with this function we change the active tab for all the tabs in this page
    const changeActiveTab = (e, tabState, tabName) => {
        e.preventDefault();
        switch (tabState) {
            case "horizontalTabs":
                sethorizontalTabs(tabName);
                break;
            case "verticalTabsIcons":
                setverticalTabsIcons(tabName);
                break;
            case "pageTabs":
                setpageTabs(tabName);
                break;
            case "verticalTabs":
                setverticalTabs(tabName);
                break;
            default:
                break;
        }
    };


    const slider1Ref = React.useRef(null);
    const slider2Ref = React.useRef(null);
    React.useEffect(() => {
        var slider1 = slider1Ref.current;
        var slider2 = slider2Ref.current;
        if (slider1.className === "slider") {
            Slider.create(slider1, {
                start: [40],
                connect: [true, false],
                step: 1,
                range: {min: 0, max: 100},
            });
        }
        if (slider2.className === "slider slider-primary mb-3") {
            Slider.create(slider2, {
                start: [20, 60],
                connect: [false, true, false],
                step: 1,
                range: {min: 0, max: 100},
            });
        }
    }, []);

    return (
        <>
            {/*<InputPaneJoin*/}
            {/*    address={props.pool.address}*/}
            {/*    paneData={props.userData}*/}
            {/*    onInputChange={props.onAddChange}*/}
            {/*    changeAmount={props.changeAmount}*/}
            {/*    activeTab={props.activeTab}*/}
            {/*    name={props.name}*/}
            {/*/>*/}


            <React.Fragment>
                <div className="content">
                    <Row>
                        <Col md="6">
                            <Card>
                                <CardHeader>
                                    <h5 className="card-category"></h5>
                                    <CardTitle tag="h3"></CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col lg="3" md="6">
                                            {/* color-classes: "nav-pills-primary", "nav-pills-info", "nav-pills-success", "nav-pills-warning","nav-pills-danger" */}
                                            <Nav
                                                className="nav-pills-info nav-pills-icons flex-column"
                                                pills
                                            >
                                                <NavItem>
                                                    <NavLink
                                                        data-toggle="tab"
                                                        href="#"
                                                        className={
                                                            verticalTabsIcons === "home" ? "active" : ""
                                                        }
                                                        onClick={(e) =>
                                                            changeActiveTab(e, "verticalTabsIcons", "home")
                                                        }
                                                    >
                                                        <i className="bi bi-chevron-double-up"/>
                                                        Add Both
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        data-toggle="tab"
                                                        href="#"
                                                        className={
                                                            verticalTabsIcons === "settings" ? "active" : ""
                                                        }
                                                        onClick={(e) =>
                                                            changeActiveTab(e, "verticalTabsIcons", "settings")
                                                        }
                                                    >
                                                        <i className="bi bi-chevron-up"/>
                                                        Add BNB
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        data-toggle="tab"
                                                        href="#"
                                                        className={
                                                            verticalTabsIcons === "settings2" ? "active" : ""
                                                        }
                                                        onClick={(e) =>
                                                            changeActiveTab(e, "verticalTabsIcons", "settings2")
                                                        }
                                                    >
                                                        <i className="bi bi-chevron-double-down"/>
                                                        Remove Both
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                        </Col>
                                        <Col md="8">
                                            <TabContent activeTab={verticalTabsIcons}>
                                                <TabPane tabId="home">
                                                    <Card className="card-body" style={{backgroundColor: "#25212D"}}>
                                                        <Row>
                                                            <Col className="mt-n1">
                                                                <Button color="danger" type="Button" type="button" className="btn-block">
                                                                    Pools
                                                                </Button>
                                                                </Col>
                                                            <Col >
                                                                <UncontrolledDropdown>
                                                                    <DropdownToggle
                                                                        aria-expanded={false}
                                                                        aria-haspopup={true}
                                                                        caret
                                                                        className="btn-block"
                                                                        color="primary"
                                                                        data-toggle="dropdown"
                                                                        id="dropdownMenuButton"
                                                                        type="button"
                                                                    >
                                                                        <i className="bi bi-wallet mr-2"/>Wallet
                                                                    </DropdownToggle>
                                                                    <DropdownMenu aria-labelledby="dropdownMenuButton">
                                                                        <DropdownItem className="text-center"
                                                                            href="#pablo"
                                                                            onClick={(e) => e.preventDefault()}
                                                                        >
                                                                            Available Balance
                                                                            <DropdownItem divider/>
                                                                        </DropdownItem>
                                                                        <DropdownItem href="">
                                                                            SPARTA : <span className="float-right">XXX</span>
                                                                        </DropdownItem>
                                                                        <DropdownItem href="">
                                                                            BNB: <span className="float-right">XXX</span>
                                                                        </DropdownItem>
                                                                        <DropdownItem divider/>
                                                                        <DropdownItem className="text-primary text-center"
                                                                                      onClick={(e) => e.preventDefault()}
                                                                        >
                                                                            View all assets
                                                                        </DropdownItem>
                                                                    </DropdownMenu>
                                                                </UncontrolledDropdown>
                                                            </Col>
                                                        </Row>
                                                        <CardBody>
                                                            <label><h4>Input</h4></label>
                                                            <FormGroup>
                                                                <Input placeholder="Manually input BNB here"
                                                                       type="text"/>
                                                            </FormGroup>
                                                            <CardTitle className="mt-3" tag="h4">
                                                                <br/>
                                                            </CardTitle>
                                                            <div className="slider" ref={slider1Ref}/>
                                                            <br/>
                                                            <div
                                                                className="slider slider-primary mb-ImageUpload.3"
                                                                ref={slider2Ref}
                                                            />
                                                            <Row className='align-items-center'>
                                                                <Col xs={5} className='py-1'>
                                                                    <h6 className='font-weight-light m-0'>Input <i
                                                                        className="bi bi-info-circle"
                                                                        id="tooltipAddBase" role='button'/></h6>
                                                                    <UncontrolledTooltip placement="right"
                                                                                         target="tooltipAddBase">The
                                                                        quantity of & SPARTA you are adding to the
                                                                        pool.</UncontrolledTooltip>
                                                                </Col>
                                                                <Col xs={7} className='py-1'>
                                                                    <h5 className="text-right font-weight-light m-0 mb-1">*</h5>
                                                                </Col>

                                                                <Col xs={5} className='py-1'>
                                                                    <h6 className='font-weight-light m-0'>Share <i
                                                                        className="bi bi-info-circle"
                                                                        id="tooltipPoolShare" role='button'/></h6>
                                                                    <UncontrolledTooltip placement="right"
                                                                                         target="tooltipPoolShare">An
                                                                        estimate of the total share of the pool that
                                                                        this liquidity-add
                                                                        represents.</UncontrolledTooltip>
                                                                </Col>
                                                                <Col xs={7} className='py-1'><h5
                                                                    className="text-right font-weight-light m-0">*</h5>
                                                                </Col>

                                                                <Col xs={12} className='py-1'>
                                                                    <hr className='m-0'/>
                                                                </Col>

                                                                <Col xs={5} className='py-1'>
                                                                    <h6 className='m-0'>Output <i
                                                                        className="bi bi-info-circle" id="tooltipUnits"
                                                                        role='button'/></h6>
                                                                    <UncontrolledTooltip placement="right"
                                                                                         target="tooltipUnits">An
                                                                        estimate of the amount of LP tokens you will
                                                                        receive from this
                                                                        transaction.</UncontrolledTooltip>
                                                                </Col>
                                                                <Col xs={7} className='py-1'><h5
                                                                    className="text-right m-0 py-2">*</h5></Col>

                                                                <Col xs={12} className='py-1'>
                                                                    <hr className='m-0'/>
                                                                </Col>
                                                                <Col xs={12}>
                                                                    <p className='text-right'>
                                                                        <accent>Estimated*</accent>
                                                                    </p>
                                                                </Col>


                                                            </Row>
                                                        </CardBody>
                                                        <CardFooter>
                                                            <Button color="primary" size="lg" block> <i
                                                                className="bi bi-check2-circle mr-2"/>Approve SPARTA
                                                            </Button>
                                                        </CardFooter>
                                                    </Card>
                                                </TabPane>
                                                <TabPane tabId="settings">
                                                    <Card className="card-body" style={{backgroundColor: "#25212D"}}>
                                                        <Row>
                                                            <Col className="mt-n1">
                                                                <Button color="danger" type="Button" type="button" className="btn-block">
                                                                    Pools
                                                                </Button>
                                                            </Col>
                                                            <Col >
                                                                <UncontrolledDropdown>
                                                                    <DropdownToggle
                                                                        aria-expanded={false}
                                                                        aria-haspopup={true}
                                                                        caret
                                                                        className="btn-block"
                                                                        color="primary"
                                                                        data-toggle="dropdown"
                                                                        id="dropdownMenuButton"
                                                                        type="button"
                                                                    >
                                                                        <i className="bi bi-wallet mr-2"/>Wallet
                                                                    </DropdownToggle>
                                                                    <DropdownMenu aria-labelledby="dropdownMenuButton">
                                                                        <DropdownItem className="text-center"
                                                                                      href="#pablo"
                                                                                      onClick={(e) => e.preventDefault()}
                                                                        >
                                                                            Available Balance
                                                                            <DropdownItem divider/>
                                                                        </DropdownItem>
                                                                        <DropdownItem href="">
                                                                            SPARTA : <span className="float-right">XXX</span>
                                                                        </DropdownItem>
                                                                        <DropdownItem href="">
                                                                            BNB: <span className="float-right">XXX</span>
                                                                        </DropdownItem>
                                                                        <DropdownItem divider/>
                                                                        <DropdownItem className="text-primary text-center"
                                                                                      onClick={(e) => e.preventDefault()}
                                                                        >
                                                                            View all assets
                                                                        </DropdownItem>
                                                                    </DropdownMenu>
                                                                </UncontrolledDropdown>
                                                            </Col>
                                                        </Row>
                                                        <CardBody>
                                                            <label><h4>Input</h4></label>
                                                            <FormGroup>
                                                                <Input placeholder="Manually input BNB here"
                                                                       type="text"/>
                                                            </FormGroup>
                                                            <CardTitle className="mt-3" tag="h4">
                                                                <br/>
                                                            </CardTitle>
                                                            <Row className='align-items-center'>
                                                                <Col xs={5} className='py-1'>
                                                                    <h6 className='font-weight-light m-0'>Input <i
                                                                        className="bi bi-info-circle"
                                                                        id="tooltipAddBase" role='button'/></h6>
                                                                    <UncontrolledTooltip placement="right"
                                                                                         target="tooltipAddBase">The
                                                                        quantity of & SPARTA you are adding to the
                                                                        pool.</UncontrolledTooltip>
                                                                </Col>
                                                                <Col xs={7} className='py-1'>
                                                                    <h5 className="text-right font-weight-light m-0 mb-1">*</h5>
                                                                </Col>

                                                                <Col xs={5} className='py-1'>
                                                                    <h6 className='font-weight-light m-0'>Share <i
                                                                        className="bi bi-info-circle"
                                                                        id="tooltipPoolShare" role='button'/></h6>
                                                                    <UncontrolledTooltip placement="right"
                                                                                         target="tooltipPoolShare">An
                                                                        estimate of the total share of the pool that
                                                                        this liquidity-add
                                                                        represents.</UncontrolledTooltip>
                                                                </Col>
                                                                <Col xs={7} className='py-1'><h5
                                                                    className="text-right font-weight-light m-0">*</h5>
                                                                </Col>

                                                                <Col xs={12} className='py-1'>
                                                                    <hr className='m-0'/>
                                                                </Col>

                                                                <Col xs={5} className='py-1'>
                                                                    <h6 className='m-0'>Output <i
                                                                        className="bi bi-info-circle" id="tooltipUnits"
                                                                        role='button'/></h6>
                                                                    <UncontrolledTooltip placement="right"
                                                                                         target="tooltipUnits">An
                                                                        estimate of the amount of LP tokens you will
                                                                        receive from this
                                                                        transaction.</UncontrolledTooltip>
                                                                </Col>
                                                                <Col xs={7} className='py-1'><h5
                                                                    className="text-right m-0 py-2">*</h5></Col>

                                                                <Col xs={12} className='py-1'>
                                                                    <hr className='m-0'/>
                                                                </Col>
                                                                <Col xs={12}>
                                                                    <p className='text-right'>
                                                                        <accent>Estimated*</accent>
                                                                    </p>
                                                                </Col>


                                                            </Row>
                                                        </CardBody>
                                                        <CardFooter>
                                                            <Button color="primary" size="lg" block> <i
                                                                className="bi bi-check2-circle mr-2"/>Approve SPARTA
                                                            </Button>
                                                        </CardFooter>
                                                    </Card>
                                                </TabPane>
                                                <TabPane tabId="settings2">
                                                    <Card className="card-body" style={{backgroundColor: "#25212D"}}>
                                                        <Row>
                                                            <Col className="mt-n1">
                                                                <Button color="danger" type="Button" type="button" className="btn-block">
                                                                    Pools
                                                                </Button>
                                                            </Col>
                                                            <Col >
                                                                <UncontrolledDropdown>
                                                                    <DropdownToggle
                                                                        aria-expanded={false}
                                                                        aria-haspopup={true}
                                                                        caret
                                                                        className="btn-block"
                                                                        color="primary"
                                                                        data-toggle="dropdown"
                                                                        id="dropdownMenuButton"
                                                                        type="button"
                                                                    >
                                                                        <i className="bi bi-wallet mr-2"/>Wallet
                                                                    </DropdownToggle>
                                                                    <DropdownMenu aria-labelledby="dropdownMenuButton">
                                                                        <DropdownItem className="text-center"
                                                                                      href="#pablo"
                                                                                      onClick={(e) => e.preventDefault()}
                                                                        >
                                                                            Available Balance
                                                                            <DropdownItem divider/>
                                                                        </DropdownItem>
                                                                        <DropdownItem href="">
                                                                            SPARTA : <span className="float-right">XXX</span>
                                                                        </DropdownItem>
                                                                        <DropdownItem href="">
                                                                            BNB: <span className="float-right">XXX</span>
                                                                        </DropdownItem>
                                                                        <DropdownItem divider/>
                                                                        <DropdownItem className="text-primary text-center"
                                                                                      onClick={(e) => e.preventDefault()}
                                                                        >
                                                                            View all assets
                                                                        </DropdownItem>
                                                                    </DropdownMenu>
                                                                </UncontrolledDropdown>
                                                            </Col>
                                                        </Row>
                                                        <CardBody>
                                                            <label><h4>Input</h4></label>
                                                            <FormGroup>
                                                                <Input placeholder="Manually input BNB here"
                                                                       type="text"/>
                                                            </FormGroup>
                                                            <CardTitle className="mt-3" tag="h4">
                                                                <br/>
                                                            </CardTitle>
                                                            <Row className='align-items-center'>
                                                                <Col xs={5} className='py-1'>
                                                                    <h6 className='font-weight-light m-0'>Input <i
                                                                        className="bi bi-info-circle"
                                                                        id="tooltipAddBase" role='button'/></h6>
                                                                    <UncontrolledTooltip placement="right"
                                                                                         target="tooltipAddBase">The
                                                                        quantity of & SPARTA you are adding to the
                                                                        pool.</UncontrolledTooltip>
                                                                </Col>
                                                                <Col xs={7} className='py-1'>
                                                                    <h5 className="text-right font-weight-light m-0 mb-1">*</h5>
                                                                </Col>

                                                                <Col xs={5} className='py-1'>
                                                                    <h6 className='font-weight-light m-0'>Share <i
                                                                        className="bi bi-info-circle"
                                                                        id="tooltipPoolShare" role='button'/></h6>
                                                                    <UncontrolledTooltip placement="right"
                                                                                         target="tooltipPoolShare">An
                                                                        estimate of the total share of the pool that
                                                                        this liquidity-add
                                                                        represents.</UncontrolledTooltip>
                                                                </Col>
                                                                <Col xs={7} className='py-1'><h5
                                                                    className="text-right font-weight-light m-0">*</h5>
                                                                </Col>

                                                                <Col xs={12} className='py-1'>
                                                                    <hr className='m-0'/>
                                                                </Col>

                                                                <Col xs={5} className='py-1'>
                                                                    <h6 className='m-0'>Output <i
                                                                        className="bi bi-info-circle" id="tooltipUnits"
                                                                        role='button'/></h6>
                                                                    <UncontrolledTooltip placement="right"
                                                                                         target="tooltipUnits">An
                                                                        estimate of the amount of LP tokens you will
                                                                        receive from this
                                                                        transaction.</UncontrolledTooltip>
                                                                </Col>
                                                                <Col xs={7} className='py-1'><h5
                                                                    className="text-right m-0 py-2">*</h5></Col>

                                                                <Col xs={12} className='py-1'>
                                                                    <hr className='m-0'/>
                                                                </Col>
                                                                <Col xs={12}>
                                                                    <p className='text-right'>
                                                                        <accent>Estimated*</accent>
                                                                    </p>
                                                                </Col>


                                                            </Row>
                                                        </CardBody>
                                                        <CardFooter>
                                                            <Button color="primary" size="lg" block> <i
                                                                className="bi bi-check2-circle mr-2"/>Approve SPARTA
                                                            </Button>
                                                        </CardFooter>
                                                    </Card>
                                                </TabPane>
                                            </TabContent>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </React.Fragment>
        </>
    )
};


export default AddLiquidity;



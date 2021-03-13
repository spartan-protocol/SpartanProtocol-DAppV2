import React, {Component} from 'react'
import {
    Card,
    CardBody,
    CardSubtitle,
    CardText,
    CardTitle,
    Breadcrumb,
    Col,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane,
} from 'reactstrap'

import classnames from 'classnames'
import PoolsTable from "../PoolsTable";

class Overview extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: '1',
            activeTab1: '5',
            activeTab2: '9',
            activeTab3: '13',
            customActiveTab: '1',
            activeTabJustify: '5',
            col1: true,
            col2: false,
            col3: false,
            col5: true,
        }
        this.toggle = this.toggle.bind(this)
        this.toggle1 = this.toggle1.bind(this)

        this.toggle2 = this.toggle2.bind(this)
        this.toggle3 = this.toggle3.bind(this)
        this.toggleCustomJustified = this.toggleCustomJustified.bind(this)
        this.toggleCustom = this.toggleCustom.bind(this)
    }


    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
            })
        }
    }

    toggle1(tab) {
        if (this.state.activeTab1 !== tab) {
            this.setState({
                activeTab1: tab,
            })
        }
    }

    toggle2(tab) {
        if (this.state.activeTab2 !== tab) {
            this.setState({
                activeTab2: tab,
            })
        }
    }

    toggle3(tab) {
        if (this.state.activeTab3 !== tab) {
            this.setState({
                activeTab3: tab,
            })
        }
    }

    toggleCustomJustified(tab) {
        if (this.state.activeTabJustify !== tab) {
            this.setState({
                activeTabJustify: tab,
            })
        }
    }

    toggleCustom(tab) {
        if (this.state.customActiveTab !== tab) {
            this.setState({
                customActiveTab: tab,
            })
        }
    }

    render() {
        return (
            <>
                <div className="content">
                    <Row>
                        <Col lg={6}>

                            <Nav tabs className="nav-tabs-custom">
                                <NavItem>
                                    <NavLink
                                        style={{cursor: 'pointer'}}
                                        className={classnames({
                                            active: this.state.customActiveTab === '1',
                                        })}
                                        onClick={() => {
                                            this.toggleCustom('1')
                                        }}
                                    >
                                        <span className="d-none d-sm-block">Pools overview</span>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        style={{cursor: 'pointer'}}
                                        className={classnames({
                                            active: this.state.customActiveTab === '2',
                                        })}
                                        onClick={() => {
                                            this.toggleCustom('2')
                                        }}
                                    >
                                        <span className="d-none d-sm-block">Positions</span>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        style={{cursor: 'pointer'}}
                                        className={classnames({
                                            active: this.state.customActiveTab === '3',
                                        })}
                                        onClick={() => {
                                            this.toggleCustom('3')
                                        }}
                                    >
                                        <span className="d-none d-sm-block">Analysis</span>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        style={{cursor: 'pointer'}}
                                        className={classnames({
                                            active: this.state.customActiveTab === '4',
                                        })}
                                        onClick={() => {
                                            this.toggleCustom('4')
                                        }}
                                    >
                                        <span className="d-none d-sm-block">Pairs</span>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        style={{cursor: 'pointer'}}
                                        className={classnames({
                                            active: this.state.customActiveTab === '5',
                                        })}
                                        onClick={() => {
                                            this.toggleCustom('5')
                                        }}
                                    >
                                        <span className="d-none d-sm-block">Tokens</span>
                                    </NavLink>
                                </NavItem>
                            </Nav>


                            <TabContent activeTab={this.state.customActiveTab}>
                                <TabPane tabId="1" className="p-3">
                                    <PoolsTable/>

                                </TabPane>
                                <TabPane tabId="2" className="p-3">
                                    <Row xs="1" sm="2" md="4">
                                        <Col>
                                            <Card className="card-body">
                                                XXX
                                            </Card>
                                        </Col>
                                        <Col>Column</Col>
                                        <Col>Column</Col>
                                        <Col>Column</Col>
                                    </Row>
                                </TabPane>
                                <TabPane tabId="3" className="p-3">
                                    <Row>
                                        <Col sm="12">
                                            <CardText>
                                                X
                                            </CardText>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tabId="4" className="p-3">
                                    <Row>
                                        <Col>.col</Col>
                                        <Col>.col</Col>
                                        <Col>.col</Col>
                                        <Col>.col</Col>
                                    </Row>
                                </TabPane>
                                <TabPane tabId="5" className="p-3">
                                    <Row>
                                        <Col sm="12">
                                            <CardText>
                                                X
                                            </CardText>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tabId="6" className="p-3">
                                    <Row>
                                        <Col sm="12">
                                            <CardText>
                                                X
                                            </CardText>
                                        </Col>
                                    </Row>
                                </TabPane>
                            </TabContent>

                        </Col>
                    </Row>
                </div>
            </>
        )
    }
}

export default Overview

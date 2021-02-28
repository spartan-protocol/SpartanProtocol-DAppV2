import React from "react";

// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Collapse,
    NavItem,
    NavLink,
    Nav,
    TabContent,
    TabPane,
    Row,
    Col,
} from "reactstrap";

const Panels = () => {

    const [horizontalTabs, sethorizontalTabs] = React.useState("profile");
    const [setverticalTabs] = React.useState("profile");
    const [etverticalTabsIcons] = React.useState("home");
    const [setpageTabs] = React.useState("home");
    // with this function we change the active tab for all the tabs in this page

    const changeActiveTab = (e, tabState, tabName) => {
        e.preventDefault();
        sethorizontalTabs(tabName)
    };


    return (
        <>
            <div className="content">
                <Row>
                    <Col md="6">
                        <Card>
                            <CardHeader>
                                <h5 className="card-category">Sparta Tabs</h5>
                                <CardTitle tag="h3">Horizontal Tabs </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Nav pills className="nav-tabs-custom">
                                    <NavItem>
                                        <NavLink
                                            data-toggle="tab"
                                            href="#"
                                            className={horizontalTabs === "profile" ? "active" : ""}
                                            onClick={(e) =>
                                                changeActiveTab(e, "horizontalTabs", "profile")
                                            }
                                        >
                                            Profile
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            data-toggle="tab"
                                            href="#"
                                            className={horizontalTabs === "settings" ? "active" : ""}
                                            onClick={(e) =>
                                                changeActiveTab(e, "horizontalTabs", "settings")
                                            }
                                        >
                                            Settings
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            data-toggle="tab"
                                            href="#"
                                            className={horizontalTabs === "options" ? "active" : ""}
                                            onClick={(e) =>
                                                changeActiveTab(e, "horizontalTabs", "options")
                                            }
                                        >
                                            Options
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <TabContent className="tab-space" activeTab={horizontalTabs}>
                                    <TabPane tabId="profile">
                                        Collaboratively administrate empowered markets via
                                        plug-and-play networks. Dynamically procrastinate B2C users
                                        after installed base benefits. <br/>
                                        <br/>
                                        Dramatically visualize customer directed convergence without
                                        revolutionary ROI.
                                    </TabPane>
                                    <TabPane tabId="settings">
                                        Efficiently unleash cross-media information without
                                        cross-media value. Quickly maximize timely deliverables for
                                        real-time schemas. <br/>
                                        <br/>
                                        Dramatically maintain clicks-and-mortar solutions without
                                        functional solutions.
                                    </TabPane>
                                    <TabPane tabId="options">
                                        Completely synergize resource taxing relationships via
                                        premier niche markets. Professionally cultivate one-to-one
                                        customer service with robust ideas. <br/>
                                        <br/>
                                        Dynamically innovate resource-leveling customer service for
                                        state of the art customer service.
                                    </TabPane>
                                </TabContent>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default Panels;

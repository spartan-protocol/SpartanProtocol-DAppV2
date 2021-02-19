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
    return (
        <>
            <div className="content">
                <Row>
                    <Col md="6">
                        <Card>
                            <CardHeader>
                                <h5 className="card-category">Navigation Pills</h5>
                                <CardTitle tag="h3">Horizontal Tabs</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Nav className="nav-pills-info" pills>
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
                                        after installed base benefits. <br />
                                        <br />
                                        Dramatically visualize customer directed convergence without
                                        revolutionary ROI.
                                    </TabPane>
                                    <TabPane tabId="settings">
                                        Efficiently unleash cross-media information without
                                        cross-media value. Quickly maximize timely deliverables for
                                        real-time schemas. <br />
                                        <br />
                                        Dramatically maintain clicks-and-mortar solutions without
                                        functional solutions.
                                    </TabPane>
                                    <TabPane tabId="options">
                                        Completely synergize resource taxing relationships via
                                        premier niche markets. Professionally cultivate one-to-one
                                        customer service with robust ideas. <br />
                                        <br />
                                        Dynamically innovate resource-leveling customer service for
                                        state of the art customer service.
                                    </TabPane>
                                </TabContent>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="6">
                        <Card>
                            <CardHeader>
                                <h5 className="card-category">Navigation Pills</h5>
                                <CardTitle tag="h3">Vertical Tabs</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col md="4">
                                        <Nav className="nav-pills-info flex-column" pills>
                                            <NavItem>
                                                <NavLink
                                                    data-toggle="tab"
                                                    href="#"
                                                    className={verticalTabs === "profile" ? "active" : ""}
                                                    onClick={(e) =>
                                                        changeActiveTab(e, "verticalTabs", "profile")
                                                    }
                                                >
                                                    Profile
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    data-toggle="tab"
                                                    href="#"
                                                    className={
                                                        verticalTabs === "settings" ? "active" : ""
                                                    }
                                                    onClick={(e) =>
                                                        changeActiveTab(e, "verticalTabs", "settings")
                                                    }
                                                >
                                                    Settings
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    data-toggle="tab"
                                                    href="#"
                                                    className={verticalTabs === "options" ? "active" : ""}
                                                    onClick={(e) =>
                                                        changeActiveTab(e, "verticalTabs", "options")
                                                    }
                                                >
                                                    Options
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </Col>
                                    <Col md="8">
                                        <TabContent activeTab={verticalTabs}>
                                            <TabPane tabId="profile">
                                                Collaboratively administrate empowered markets via
                                                plug-and-play networks. Dynamically procrastinate B2C
                                                users after installed base benefits. <br />
                                                <br />
                                                Dramatically visualize customer directed convergence
                                                without revolutionary ROI.
                                            </TabPane>
                                            <TabPane tabId="settings">
                                                Efficiently unleash cross-media information without
                                                cross-media value. Quickly maximize timely deliverables
                                                for real-time schemas. <br />
                                                <br />
                                                Dramatically maintain clicks-and-mortar solutions
                                                without functional solutions.
                                            </TabPane>
                                            <TabPane tabId="options">
                                                Completely synergize resource taxing relationships via
                                                premier niche markets. Professionally cultivate
                                                one-to-one customer service with robust ideas. <br />
                                                <br />
                                                Dynamically innovate resource-leveling customer service
                                                for state of the art customer service.
                                            </TabPane>
                                        </TabContent>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md="6">
                        <Card>
                            <CardHeader>
                                <h5 className="card-category">Collpase example</h5>
                                <CardTitle tag="h3">Collapsible Accordion</CardTitle>
                            </CardHeader>
                            <div
                                aria-multiselectable={true}
                                className="card-collapse"
                                id="accordion"
                                role="tablist"
                            >
                                <Card className="card-plain">
                                    <CardHeader role="tab">
                                        <a
                                            aria-expanded={openedCollapseOne}
                                            href="#"
                                            data-parent="#accordion"
                                            data-toggle="collapse"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setopenedCollapseOne(!openedCollapseOne);
                                            }}
                                        >
                                            Collapsible Group Item #1{" "}
                                            <i className="bd-icons icon-minimal-down" />
                                        </a>
                                    </CardHeader>
                                    <Collapse role="tabpanel" isOpen={openedCollapseOne}>
                                        <CardBody>
                                            Anim pariatur cliche reprehenderit, enim eiusmod high life
                                            accusamus terry richardson ad squid. 3 wolf moon officia
                                            aute, non cupidatat skateboard dolor brunch. Food truck
                                            quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
                                            tempor, sunt aliqua put a bird on it squid single-origin
                                            coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
                                            helvetica, craft beer labore wes anderson cred nesciunt
                                            sapiente ea proident. Ad vegan excepteur butcher vice
                                            lomo. Leggings occaecat craft beer farm-to-table, raw
                                            denim aesthetic synth nesciunt you probably haven't heard
                                            of them accusamus labore sustainable VHS.
                                        </CardBody>
                                    </Collapse>
                                </Card>
                                <Card className="card-plain">
                                    <CardHeader role="tab">
                                        <a
                                            aria-expanded={openedCollapseTwo}
                                            href="#"
                                            data-parent="#accordion"
                                            data-toggle="collapse"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setopenedCollapseTwo(!openedCollapseTwo);
                                            }}
                                        >
                                            Collapsible Group Item #2{" "}
                                            <i className="bd-icons icon-minimal-down" />
                                        </a>
                                    </CardHeader>
                                    <Collapse role="tabpanel" isOpen={openedCollapseTwo}>
                                        <CardBody>
                                            Anim pariatur cliche reprehenderit, enim eiusmod high life
                                            accusamus terry richardson ad squid. 3 wolf moon officia
                                            aute, non cupidatat skateboard dolor brunch. Food truck
                                            quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
                                            tempor, sunt aliqua put a bird on it squid single-origin
                                            coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
                                            helvetica, craft beer labore wes anderson cred nesciunt
                                            sapiente ea proident. Ad vegan excepteur butcher vice
                                            lomo. Leggings occaecat craft beer farm-to-table, raw
                                            denim aesthetic synth nesciunt you probably haven't heard
                                            of them accusamus labore sustainable VHS.
                                        </CardBody>
                                    </Collapse>
                                </Card>
                                <Card className="card-plain">
                                    <CardHeader role="tab">
                                        <a
                                            aria-expanded={openedCollapseThree}
                                            href="#"
                                            data-parent="#accordion"
                                            data-toggle="collapse"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setopenedCollapseThree(!openedCollapseThree);
                                            }}
                                        >
                                            Collapsible Group Item #3{" "}
                                            <i className="bd-icons icon-minimal-down" />
                                        </a>
                                    </CardHeader>
                                    <Collapse role="tabpanel" isOpen={openedCollapseThree}>
                                        <CardBody>
                                            Anim pariatur cliche reprehenderit, enim eiusmod high life
                                            accusamus terry richardson ad squid. 3 wolf moon officia
                                            aute, non cupidatat skateboard dolor brunch. Food truck
                                            quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
                                            tempor, sunt aliqua put a bird on it squid single-origin
                                            coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
                                            helvetica, craft beer labore wes anderson cred nesciunt
                                            sapiente ea proident. Ad vegan excepteur butcher vice
                                            lomo. Leggings occaecat craft beer farm-to-table, raw
                                            denim aesthetic synth nesciunt you probably haven't heard
                                            of them accusamus labore sustainable VHS.
                                        </CardBody>
                                    </Collapse>
                                </Card>
                            </div>
                        </Card>
                    </Col>
                    <Col md="6">
                        <Card>
                            <CardHeader>
                                <h5 className="card-category">Navigation Pills</h5>
                                <CardTitle tag="h3">Vertical Tabs With Icons</CardTitle>
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
                                                    <i className="bd-icons icon-istanbul" />
                                                    Home
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
                                                    <i className="bd-icons icon-settings" />
                                                    Settings
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </Col>
                                    <Col md="8">
                                        <TabContent activeTab={verticalTabsIcons}>
                                            <TabPane tabId="home">
                                                Collaboratively administrate empowered markets via
                                                plug-and-play networks. Dynamically procrastinate B2C
                                                users after installed base benefits. <br />
                                                <br />
                                                Dramatically visualize customer directed convergence
                                                without revolutionary ROI.
                                            </TabPane>
                                            <TabPane tabId="settings">
                                                Efficiently unleash cross-media information without
                                                cross-media value. Quickly maximize timely deliverables
                                                for real-time schemas. <br />
                                                <br />
                                                Dramatically maintain clicks-and-mortar solutions
                                                without functional solutions.
                                            </TabPane>
                                        </TabContent>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col className="ml-auto mr-auto" md="8">
                        <Card className="card-plain card-subcategories">
                            <CardHeader>
                                <CardTitle className="text-center mt-5" tag="h4">
                                    Page Subcategories
                                </CardTitle>
                                <br />
                            </CardHeader>
                            <CardBody>
                                {/* color-classes: "nav-pills-primary", "nav-pills-info", "nav-pills-success", "nav-pills-warning","nav-pills-danger" */}
                                <Nav
                                    className="nav-pills-info nav-pills-icons justify-content-center"
                                    pills
                                >
                                    <NavItem>
                                        <NavLink
                                            data-toggle="tab"
                                            href="#"
                                            className={pageTabs === "home" ? "active" : ""}
                                            onClick={(e) => changeActiveTab(e, "pageTabs", "home")}
                                        >
                                            <i className="bd-icons icon-istanbul" />
                                            Home
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            data-toggle="tab"
                                            href="#"
                                            className={pageTabs === "messages" ? "active" : ""}
                                            onClick={(e) =>
                                                changeActiveTab(e, "pageTabs", "messages")
                                            }
                                        >
                                            <i className="bd-icons icon-bag-16" />
                                            Messages
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            data-toggle="tab"
                                            href="#"
                                            className={pageTabs === "settings" ? "active" : ""}
                                            onClick={(e) =>
                                                changeActiveTab(e, "pageTabs", "settings")
                                            }
                                        >
                                            <i className="bd-icons icon-settings" />
                                            Settings
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <TabContent
                                    className="tab-space tab-subcategories"
                                    activeTab={pageTabs}
                                >
                                    <TabPane tabId="home">
                                        Collaboratively administrate empowered markets via
                                        plug-and-play networks. Dynamically procrastinate B2C users
                                        after installed base benefits. <br />
                                        <br />
                                        Dramatically visualize customer directed convergence without
                                        revolutionary ROI.
                                    </TabPane>
                                    <TabPane tabId="messages">
                                        Efficiently unleash cross-media information without
                                        cross-media value. Quickly maximize timely deliverables for
                                        real-time schemas. <br />
                                        <br />
                                        Dramatically maintain clicks-and-mortar solutions without
                                        functional solutions.
                                    </TabPane>
                                    <TabPane tabId="settings">
                                        Completely synergize resource taxing relationships via
                                        premier niche markets. Professionally cultivate one-to-one
                                        customer service with robust ideas. <br />
                                        <br />
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

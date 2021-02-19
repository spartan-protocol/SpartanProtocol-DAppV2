import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
import {ReactComponent as SpartanLogoBlackSmall} from "../../assets/img/spartan_black_small.svg";
import {ReactComponent as SpartanLogo} from "../../assets/img/logo.svg";
import CustomInput from "reactstrap/es/CustomInput";

// reactstrap components
import {
    Button,
    Collapse,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    Input,
    InputGroup,
    NavbarBrand,
    Navbar,
    NavLink,
    Nav,
    Container,
    Modal,
    UncontrolledTooltip,
} from "reactstrap";


const HeaderNavbar = (props) => {
    const [darkMode, setDarkMode] = React.useState(false);
    const [collapseOpen, setCollapseOpen] = React.useState(false);
    const [modalSearch, setModalSearch] = React.useState(false);
    const [color, setColor] = React.useState("navbar-transparent");
    React.useEffect(() => {
        window.addEventListener("resize", updateColor);
        return function cleanup() {
            window.removeEventListener("resize", updateColor);
        };
    });
    // function that adds color white/transparent to the navbar on resize (this is for the collapse)
    const updateColor = () => {
        if (window.innerWidth < 993 && collapseOpen) {
            setColor("bg-white");
        } else {
            setColor("navbar-transparent");
        }
    };
    // this function opens and closes the collapse on small devices
    const toggleCollapse = () => {
        if (collapseOpen) {
            setColor("navbar-transparent");
        } else {
            setColor("bg-white");
        }
        setCollapseOpen(!collapseOpen);
    };
    // this function is to open the Search modal
    const toggleModalSearch = () => {
        setModalSearch(!modalSearch);
    };

    const handleActiveMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle("white-content");
    };
    return (
        <>
            <Navbar
                className={classNames("navbar-absolute", {
                    [color]: props.location.pathname.indexOf("full-screen-map") === -1,
                })}
                expand="lg"
            >
                <Container fluid>
                    <div className="navbar-wrapper ml-n2">
                        <div className="navbar-minimize d-inline">
                            <Button
                                className="minimize-sidebar btn-just-icon"
                                color="link"
                                id="tooltip209599"
                                onClick={props.handleMiniClick}
                            >
                                <i className="icon-medium icon-menu-closed icon-light visible-on-sidebar-regular mr-4"/>
                                <i className="icon-medium icon-menu-open icon-light visible-on-sidebar-mini mr-4"/>
                            </Button>
                        </div>
                        <div
                            className={classNames("navbar-toggle d-inline", {
                                toggled: props.sidebarOpened,
                            })}
                        >
                            <button
                                className="navbar-toggler"
                                type="button"
                                onClick={props.toggleSidebar}
                            >
                                <span className="navbar-toggler-bar bar1"/>
                                <span className="navbar-toggler-bar bar2"/>
                                <span className="navbar-toggler-bar bar3"/>
                            </button>
                        </div>
                        <NavbarBrand href="#" onClick={(e) => e.preventDefault()}>
                            {/*{props.brandText} +*/} <SpartanLogo className="mr-2"/> Spartan Protocol
                        </NavbarBrand>
                    </div>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navigation"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                        onClick={toggleCollapse}
                    >
                        <span className="navbar-toggler-bar navbar-kebab"/>
                        <span className="navbar-toggler-bar navbar-kebab"/>
                        <span className="navbar-toggler-bar navbar-kebab"/>
                    </button>
                    <Collapse navbar isOpen={collapseOpen}>
                        <Nav className="ml-auto" navbar>
                            <InputGroup className="search-bar" tag="li">
                                <Button color="primary">
                                    <SpartanLogoBlackSmall/> $1.52
                                </Button>
                                {/*<Button*/}
                                {/*  color="link"*/}
                                {/*  data-target="#searchModal"*/}
                                {/*  data-toggle="modal"*/}
                                {/*  id="search-button"*/}
                                {/*  onClick={toggleModalSearch}*/}
                                {/*>*/}
                                {/*  <i className="bd-icons icon-zoom-split" />*/}
                                {/*  <span className="d-lg-none d-md-block">Search</span>*/}
                                {/*</Button>*/}
                            </InputGroup>
                            {/*<UncontrolledDropdown nav>*/}
                            {/*  <DropdownToggle*/}
                            {/*    caret*/}
                            {/*    color="default"*/}
                            {/*    data-toggle="dropdown"*/}
                            {/*    nav*/}
                            {/*  >*/}
                            {/*    <div className="notification d-none d-lg-block d-xl-block" />*/}
                            {/*    <i className="bd-icons icon-sound-wave" />*/}
                            {/*    <p className="d-lg-none">Notifications</p>*/}
                            {/*  </DropdownToggle>*/}
                            {/*  <DropdownMenu className="dropdown-navbar" right tag="ul">*/}
                            {/*    <NavLink tag="li">*/}
                            {/*      <DropdownItem className="nav-item">*/}
                            {/*        Mike John responded to your email*/}
                            {/*      </DropdownItem>*/}
                            {/*    </NavLink>*/}
                            {/*    <NavLink tag="li">*/}
                            {/*      <DropdownItem className="nav-item">*/}
                            {/*        You have 5 more tasks*/}
                            {/*      </DropdownItem>*/}
                            {/*    </NavLink>*/}
                            {/*    <NavLink tag="li">*/}
                            {/*      <DropdownItem className="nav-item">*/}
                            {/*        Your friend Michael is in town*/}
                            {/*      </DropdownItem>*/}
                            {/*    </NavLink>*/}
                            {/*    <NavLink tag="li">*/}
                            {/*      <DropdownItem className="nav-item">*/}
                            {/*        Another notification*/}
                            {/*      </DropdownItem>*/}
                            {/*    </NavLink>*/}
                            {/*    <NavLink tag="li">*/}
                            {/*      <DropdownItem className="nav-item">*/}
                            {/*        Another one*/}
                            {/*      </DropdownItem>*/}
                            {/*    </NavLink>*/}
                            {/*  </DropdownMenu>*/}
                            {/*</UncontrolledDropdown>*/}
                            <li className="adjustments-line">
                                <div
                                    className="togglebutton switch-change-color mt-3 d-flex align-items-center justify-content-center">
                                    <span className="label-switch">LIGHT MODE</span>
                                    <CustomInput
                                        type="switch"
                                        id="switch-2"
                                        onChange={handleActiveMode}
                                        value={darkMode}
                                        className="mt-n4"
                                    />
                                    <span className="label-switch ml-n3">DARK MODE</span>
                                </div>
                            </li>
                            <UncontrolledDropdown nav>
                                <DropdownToggle
                                    caret
                                    color="default"
                                    data-toggle="dropdown"
                                    nav
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <div className="photo">
                                        <img
                                            alt="..."
                                            src={require("../../assets/img/spartan_white_small.svg").default}
                                        />
                                    </div>
                                    <b className="caret d-none d-lg-block d-xl-block"/>
                                    {/*<p className="d-lg-none">Log out</p>*/}
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-navbar" right tag="ul">
                                    <NavLink tag="li">
                                        <DropdownItem className="nav-item">Total Supply: 63,030,416</DropdownItem>
                                    </NavLink>
                                    <NavLink tag="li">
                                        <DropdownItem className="nav-item">Total Supply: 63,030,416</DropdownItem>
                                    </NavLink>
                                    <DropdownItem divider tag="li"/>
                                    <NavLink tag="li">
                                        <DropdownItem className="nav-item">Total Supply: 63,030,416 out</DropdownItem>
                                    </NavLink>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                            <li className="separator d-lg-none"/>
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
            <Modal
                modalClassName="modal-search"
                isOpen={modalSearch}
                toggle={toggleModalSearch}
            >
                <div className="modal-header">
                    <Input id="inlineFormInputGroup" placeholder="SEARCH" type="text"/>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={toggleModalSearch}
                    >
                        <i className="bd-icons icon-simple-remove"/>
                    </button>

                </div>
            </Modal>
        </>
    );
};

export default HeaderNavbar;

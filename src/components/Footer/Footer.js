
import React from "react";
import { Container, Row } from "reactstrap";
// used for making the prop types of this component
import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";

const Footer = (props) => {
  return (
    <footer className={"footer" + (props.default ? " footer-default" : "")}>
      <Container fluid={props.fluid ? true : false}>
        <ul className="nav">
          <li className="nav-item">
              A Spartan Community Project
          </li>
        </ul>
        {/*<div className="copyright">*/}
        {/*  © {new Date().getFullYear()} made with{" "}*/}
        {/*  <i className="bd-icons icon-heart-2" /> by{" "}*/}
        {/*  <a href="#" target="_blank">*/}
        {/*    Socials*/}
        {/*  </a>*/}
        {/*</div>*/}
      </Container>
    </footer>
  );
};

Footer.propTypes = {
  default: PropTypes.bool,
  fluid: PropTypes.bool,
};

export default Footer;

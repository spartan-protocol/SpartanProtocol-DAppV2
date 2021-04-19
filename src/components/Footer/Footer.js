import React from 'react'
import { Container } from 'reactstrap'
// used for making the prop types of this component
import PropTypes from 'prop-types'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
// import { ReactComponent as SpartanLogo } from '../../assets/img/logo.svg'
import Sparta from '../../assets/icons/coin_sparta.svg'
import RecentTxns from '../RecentTxns/RecentTxns'

const Footer = (props) => (
  <>
    <footer className={`footer${props.default ? ' footer-default' : ''}`}>
      <Container fluid={!!props.fluid}>
        <Row>
          <Col xs="12">
            <RecentTxns />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={4}>
            <ul className="nav">
              <li className="nav-item mt-3 mb-3 mb-md-0">
                A Spartan Community Project
              </li>
            </ul>
          </Col>
          <Col xs={12} sm={4} className="text-center">
            <div className="text-footer mb-3 mb-md-0">
              <img className="mr-2 " src={Sparta} alt="Logo" height="32" />
              Spartan Protocol
            </div>
          </Col>
          <Col xs={12} sm={4}>
            <div className="copyright ml-4">
              <a
                href="https://twitter.com/SpartanProtocol"
                target="_blank"
                rel="noreferrer"
              >
                <i className="icon-small icon-twitter icon-light mr-3" />
              </a>
              <a
                href="https://twitter.com/SpartanProtocol"
                target="_blank"
                rel="noreferrer"
              >
                <i className="icon-small icon-reddit icon-light mr-3" />
              </a>
              <a
                href="https://www.reddit.com/r/SpartanProtocol/"
                target="_blank"
                rel="noreferrer"
              >
                {' '}
                <i className="icon-small icon-github icon-light mr-3" />
              </a>
              <a
                href="https://t.me/SpartanProtocolOrg"
                target="_blank"
                rel="noreferrer"
              >
                <i className="icon-small icon-telegram icon-light mr-3" />
              </a>
              <a
                href="https://spartanprotocol.medium.com/"
                target="_blank"
                rel="noreferrer"
              >
                <i className="icon-small icon-mediums icon-light mr-3" />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  </>
)

Footer.propTypes = {
  default: PropTypes.bool,
  fluid: PropTypes.bool,
}

Footer.defaultProps = {
  default: true,
  fluid: true,
}

export default Footer

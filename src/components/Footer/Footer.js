import React from 'react'
import { Container, UncontrolledTooltip } from 'reactstrap'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Sparta from '../../assets/icons/coin_sparta.svg'
import gitbookSVG from '../../assets/icons/icon-gitbook-dark.svg'
import twitterSVG from '../../assets/icons/icon-twitter-dark.svg'
import githubSVG from '../../assets/icons/icon-github-dark.svg'
import telegramSVG from '../../assets/icons/icon-telegram-dark.svg'
import mediumSVG from '../../assets/icons/icon-medium-dark.svg'
import redditSVG from '../../assets/icons/icon-reddit-dark.svg'
import './Footer.scss'

const footerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

const Footer = () => (
  <footer
    className="footer footer-default"
    style={{ backgroundColor: '#25212d' }}
  >
    <Container fluid>
      <Row style={footerStyle}>
        <Col xs={12} sm={4} className="mt-2">
          <div className="text-footer" style={{ color: 'white' }}>
            A Spartan Community Project
          </div>
        </Col>
        <Col xs={12} sm={4} className="mt-2">
          <div className="text-footer">
            <div style={{ height: '100%', textAlign: 'center' }}>
              <img className="mr-2" src={Sparta} alt="Logo" height="32" />
              Spartan Protocol
            </div>
          </div>
        </Col>
        <Col xs={12} sm={4} className="mt-2">
          {/* <div className="copyright ml-4">
              <a
                href="https://twitter.com/SpartanProtocol"
                target="_blank"
                rel="noreferrer"
                id="footer-twitter"
              >
                <i className="icon-small icon-twitter icon-dark mr-3 zoomsm" />
                <UncontrolledTooltip target="footer-twitter" placement="top">
                  Twitter
                </UncontrolledTooltip>
              </a>
              <a
                href="https://github.com/spartan-protocol"
                target="_blank"
                rel="noreferrer"
                id="footer-github"
              >
                <i className="icon-small icon-github icon-dark mr-3 zoomsm" />
                <UncontrolledTooltip target="footer-github" placement="top">
                  Github
                </UncontrolledTooltip>
              </a>
              <a
                href="https://t.me/SpartanProtocolOrg"
                target="_blank"
                rel="noreferrer"
                id="footer-telegram"
              >
                <i className="icon-small icon-telegram icon-dark mr-3 zoomsm" />
                <UncontrolledTooltip target="footer-telegram" placement="top">
                  Telegram
                </UncontrolledTooltip>
              </a>
              <a
                href="https://spartanprotocol.medium.com/"
                target="_blank"
                rel="noreferrer"
                id="footer-medium"
              >
                <i className="icon-small icon-mediums icon-dark mr-3 zoomsm" />
                <UncontrolledTooltip target="footer-medium" placement="top">
                  Medium
                </UncontrolledTooltip>
              </a>
              <a
                href="https://www.reddit.com/r/SpartanProtocol/"
                target="_blank"
                rel="noreferrer"
                id="footer-reddit"
              ></a>
                <i className="icon-small icon-reddit icon-dark mr-3 zoomsm" />
                <UncontrolledTooltip target="footer-reddit" placement="top">
                  Reddit
                </UncontrolledTooltip> */}
          <div className="copyright">
            <a
              href="https://docs.spartanprotocol.org/"
              target="_blank"
              rel="noreferrer"
              id="footer-gitbook"
            >
              <img src={gitbookSVG} alt="gitbook" height={24} />
              <UncontrolledTooltip target="footer-gitbook" placement="top">
                Gitbook
              </UncontrolledTooltip>
            </a>
            <a
              href="https://twitter.com/SpartanProtocol"
              target="_blank"
              rel="noreferrer"
              id="footer-twitter"
            >
              <img src={twitterSVG} alt="twitter" height={24} />
              <UncontrolledTooltip target="footer-twitter" placement="top">
                Twitter
              </UncontrolledTooltip>
            </a>
            <a
              href="https://github.com/spartan-protocol"
              target="_blank"
              rel="noreferrer"
              id="footer-github"
            >
              <img src={githubSVG} alt="twitter" height={24} />
              <UncontrolledTooltip target="footer-github" placement="top">
                Github
              </UncontrolledTooltip>
            </a>
            <a
              href="https://t.me/SpartanProtocolOrg"
              target="_blank"
              rel="noreferrer"
              id="footer-telegram"
            >
              <img src={telegramSVG} alt="twitter" height={24} />
              <UncontrolledTooltip target="footer-telegram" placement="top">
                Telegram
              </UncontrolledTooltip>
            </a>
            <a
              href="https://spartanprotocol.medium.com"
              target="_blank"
              rel="noreferrer"
              id="footer-medium"
            >
              <img src={mediumSVG} alt="twitter" height={24} />
              <UncontrolledTooltip target="footer-medium" placement="top">
                Medium
              </UncontrolledTooltip>
            </a>
            <a
              href="https://www.reddit.com/r/SpartanProtocol"
              target="_blank"
              rel="noreferrer"
              id="footer-reddit"
            >
              <img src={redditSVG} alt="twitter" height={24} />
              <UncontrolledTooltip target="footer-reddit" placement="top">
                Reddit
              </UncontrolledTooltip>
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  </footer>
)

export default Footer

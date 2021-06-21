import React, { useState } from 'react'
import { Button, UncontrolledTooltip } from 'reactstrap'
import { Col, Row } from 'react-bootstrap'
import Drawer from '../Drawer/Drawer'

import Sparta from '../../assets/icons/coin_sparta.svg'
import gitbookSVG from '../../assets/icons/icon-gitbook-dark.svg'
import twitterSVG from '../../assets/icons/icon-twitter-dark.svg'
import githubSVG from '../../assets/icons/icon-github-dark.svg'
import telegramSVG from '../../assets/icons/icon-telegram-dark.svg'
import mediumSVG from '../../assets/icons/icon-medium-dark.svg'
import redditSVG from '../../assets/icons/icon-reddit-dark.svg'
import discordSVG from '../../assets/icons/icon-discord.svg'
import './Footer.scss'
import Backdrop from '../Drawer/Backdrop'

const Footer = () => {
  const [showDrawer, setShowDrawer] = useState(false)
  return (
    <div>
      <div style={{ position: 'relative' }}>
        <Backdrop show={showDrawer} onClick={() => setShowDrawer(false)} />
        <Drawer show={showDrawer} onClick={() => setShowDrawer(false)} />
        <Button
          style={{
            position: 'absolute',
            top: -25,
            left: 0,
            right: 0,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          onClick={() => setShowDrawer(true)}
        >
          Latest transactions
        </Button>
      </div>
      <footer className="footer">
        <div className="text-footer">
          <Row style={{ paddingTop: 8 }}>
            <Col />
            <Col
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <img className="mr-2 ml-4" src={Sparta} alt="Logo" height="32" />
              Spartan Protocol
            </Col>
            <Col>
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
                  <img src={githubSVG} alt="gihub" height={24} />
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
                  <img src={telegramSVG} alt="telegram" height={24} />
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
                  <img src={mediumSVG} alt="medium" height={24} />
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
                  <img src={redditSVG} alt="reddit" height={24} />
                  <UncontrolledTooltip target="footer-reddit" placement="top">
                    Reddit
                  </UncontrolledTooltip>
                </a>
                <a
                  href="https://discord.gg/wQggvntnGk"
                  target="_blank"
                  rel="noreferrer"
                  id="footer-discord"
                >
                  <img src={discordSVG} alt="discord" height={24} />
                  <UncontrolledTooltip target="footer-discord" placement="top">
                    Discord
                  </UncontrolledTooltip>
                </a>
              </div>
            </Col>
          </Row>
        </div>
      </footer>
    </div>
  )
}

export default Footer

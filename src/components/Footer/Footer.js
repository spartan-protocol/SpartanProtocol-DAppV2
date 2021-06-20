import React from 'react'
import { Container, Navbar, Tooltip } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Sparta from '../../assets/icons/coin_sparta.svg'
import gitbookSVG from '../../assets/icons/icon-gitbook-dark.svg'
import twitterSVG from '../../assets/icons/icon-twitter-dark.svg'
import githubSVG from '../../assets/icons/icon-github-dark.svg'
import telegramSVG from '../../assets/icons/icon-telegram-dark.svg'
import mediumSVG from '../../assets/icons/icon-medium-dark.svg'
import redditSVG from '../../assets/icons/icon-reddit-dark.svg'
import './Footer.scss'

const Footer = () => (
  <Navbar className="footer" sticky="bottom">
    <Container className="d-none d-sm-flex">
      <div className="text-footer mx-auto">A Spartan Community Project</div>
    </Container>
    <Container className="d-none d-sm-flex">
      <Link to="/" className="text-footer mx-auto">
        <img className="me-2" src={Sparta} alt="Logo" height="32" />
        <span>Spartan Protocol</span>
      </Link>
    </Container>
    <Container>
      <Link to="/" className="d-block d-sm-none">
        <img
          className="d-block d-sm-none"
          src={Sparta}
          alt="Logo"
          height="32"
        />
      </Link>

      <a
        href="https://docs.spartanprotocol.org/"
        target="_blank"
        rel="noreferrer"
        id="footer-gitbook"
      >
        <img src={gitbookSVG} alt="gitbook" height={24} />
        <Tooltip target="footer-gitbook" placement="top">
          Gitbook
        </Tooltip>
      </a>
      <a
        href="https://twitter.com/SpartanProtocol"
        target="_blank"
        rel="noreferrer"
        id="footer-twitter"
      >
        <img src={twitterSVG} alt="twitter" height={24} />
        <Tooltip target="footer-twitter" placement="top">
          Twitter
        </Tooltip>
      </a>
      <a
        href="https://github.com/spartan-protocol"
        target="_blank"
        rel="noreferrer"
        id="footer-github"
      >
        <img src={githubSVG} alt="twitter" height={24} />
        <Tooltip target="footer-github" placement="top">
          Github
        </Tooltip>
      </a>
      <a
        href="https://t.me/SpartanProtocolOrg"
        target="_blank"
        rel="noreferrer"
        id="footer-telegram"
      >
        <img src={telegramSVG} alt="twitter" height={24} />
        <Tooltip target="footer-telegram" placement="top">
          Telegram
        </Tooltip>
      </a>
      <a
        href="https://spartanprotocol.medium.com"
        target="_blank"
        rel="noreferrer"
        id="footer-medium"
      >
        <img src={mediumSVG} alt="twitter" height={24} />
        <Tooltip target="footer-medium" placement="top">
          Medium
        </Tooltip>
      </a>
      <a
        href="https://www.reddit.com/r/SpartanProtocol"
        target="_blank"
        rel="noreferrer"
        id="footer-reddit"
      >
        <img src={redditSVG} alt="twitter" height={24} />
        <Tooltip target="footer-reddit" placement="top">
          Reddit
        </Tooltip>
      </a>
    </Container>
  </Navbar>
)

export default Footer

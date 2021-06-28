import React, { useState } from 'react'
import { Container, Nav, Navbar, Tooltip, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Drawer from '../Drawer/Drawer'
import Backdrop from '../Drawer/Backdrop'

import { ReactComponent as SpartaIcon } from '../../assets/icons/coin_sparta.svg'
import { ReactComponent as GitbookIcon } from '../../assets/icons/icon-gitbook.svg'
import { ReactComponent as TwitterIcon } from '../../assets/icons/icon-twitter.svg'
import { ReactComponent as GithubIcon } from '../../assets/icons/icon-github.svg'
import { ReactComponent as TelegramIcon } from '../../assets/icons/icon-telegram.svg'
import { ReactComponent as MediumIcon } from '../../assets/icons/icon-medium.svg'
import { ReactComponent as RedditIcon } from '../../assets/icons/icon-reddit.svg'
import { ReactComponent as DiscordIcon } from '../../assets/icons/icon-discord.svg'

const Footer = () => {
  const [showDrawer, setShowDrawer] = useState(false)
  const isLightMode = window.localStorage.getItem('theme')

  return (
    <>
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
      <Navbar className="footer" sticky="bottom">
        <Container fluid>
          <div>
            <Link to="/">
              <SpartaIcon fill={isLightMode ? 'white' : 'black'} height="32" />
            </Link>
            <div className="ms-2 text-footer d-none d-sm-inline-block">
              A Spartan Community Project
            </div>
          </div>

          <Nav>
            <a
              href="https://docs.spartanprotocol.org/"
              target="_blank"
              rel="noreferrer"
              id="footer-gitbook"
              className="mx-1"
            >
              <GitbookIcon
                fill={isLightMode ? 'black' : 'white'}
                height="24"
                width="24"
              />
              <Tooltip target="footer-gitbook" placement="top">
                Gitbook
              </Tooltip>
            </a>
            <a
              href="https://twitter.com/SpartanProtocol"
              target="_blank"
              rel="noreferrer"
              id="footer-twitter"
              className="mx-1"
            >
              <TwitterIcon
                height="24"
                width="24"
                fill={isLightMode ? 'black' : 'white'}
              />
              <Tooltip target="footer-twitter" placement="top">
                Twitter
              </Tooltip>
            </a>
            <a
              href="https://github.com/spartan-protocol"
              target="_blank"
              rel="noreferrer"
              id="footer-github"
              className="mx-1"
            >
              <GithubIcon
                height="24"
                width="24"
                fill={isLightMode ? 'black' : 'white'}
              />
              <Tooltip target="footer-github" placement="top">
                Github
              </Tooltip>
            </a>
            <a
              href="https://t.me/SpartanProtocolOrg"
              target="_blank"
              rel="noreferrer"
              id="footer-telegram"
              className="mx-1"
            >
              <TelegramIcon
                height="24"
                width="24"
                fill={isLightMode ? 'black' : 'white'}
              />
              <Tooltip target="footer-telegram" placement="top">
                Telegram
              </Tooltip>
            </a>
            <a
              href="https://spartanprotocol.medium.com"
              target="_blank"
              rel="noreferrer"
              id="footer-medium"
              className="mx-1"
            >
              <MediumIcon
                height="24"
                width="24"
                fill={isLightMode ? 'black' : 'white'}
              />
              <Tooltip target="footer-medium" placement="top">
                Medium
              </Tooltip>
            </a>
            <a
              href="https://www.reddit.com/r/SpartanProtocol"
              target="_blank"
              rel="noreferrer"
              id="footer-reddit"
              className="mx-1"
            >
              <RedditIcon
                height="24"
                width="24"
                fill={isLightMode ? 'black' : 'white'}
              />
              <Tooltip target="footer-reddit" placement="top">
                Reddit
              </Tooltip>
            </a>

            <a
              href="https://discord.gg/wQggvntnGk"
              target="_blank"
              rel="noreferrer"
              id="footer-discord"
              className="mx-1"
            >
              <DiscordIcon
                height="24"
                width="24"
                fill={isLightMode ? 'black' : 'white'}
              />
              <Tooltip target="footer-discord" placement="top">
                Discord
              </Tooltip>
            </a>
          </Nav>
        </Container>
      </Navbar>
    </>
  )
}

export default Footer

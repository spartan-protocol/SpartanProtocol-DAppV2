import React from 'react'
// import { Tooltip } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Icon } from '../../../components/Icons/index'

import * as styles from './styles.module.scss'

const Footer = () => {
  const isLightMode = window.localStorage.getItem('theme')

  return (
    <div className={styles.footer}>
      <div>
        <Link to="/">
          <Icon
            icon="spartav2"
            fill={isLightMode ? 'white' : 'black'}
            size="32"
          />
        </Link>
        <div className="">A Spartan Community Project</div>
      </div>

      {/* <a
        href="https://docs.spartanprotocol.org/"
        target="_blank"
        rel="noreferrer"
        id="footer-gitbook"
        className="mx-1"
      >
        <Icon icon="gitbook" fill={isLightMode ? 'black' : 'white'} size="24" />
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
        <Icon icon="twitter" size="24" fill={isLightMode ? 'black' : 'white'} />
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
        <Icon icon="github" size="24" fill={isLightMode ? 'black' : 'white'} />
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
        <Icon
          icon="telegram"
          size="24"
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
        <Icon icon="medium" size="24" fill={isLightMode ? 'black' : 'white'} />
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
        <Icon icon="reddit" size="24" fill={isLightMode ? 'black' : 'white'} />
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
        <Icon icon="discord" size="24" fill={isLightMode ? 'black' : 'white'} />
        <Tooltip target="footer-discord" placement="top">
          Discord
        </Tooltip>
      </a> */}
    </div>
  )
}

export default Footer

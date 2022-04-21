import React from 'react'
import { Icon } from '../../../components/Icons/index'

const SocialIcons = ({ centered }) => (
  <div className={centered && 'text-center'}>
    <a
      href="https://github.com/spartan-protocol"
      target="_blank"
      rel="noreferrer"
      id="footer-github"
      className="mx-1"
    >
      <Icon icon="github" size="25" />
    </a>
    <a
      href="https://docs.spartanprotocol.org/"
      target="_blank"
      rel="noreferrer"
      id="footer-gitbook"
      className="mx-2"
    >
      <Icon icon="gitbook" size="25" />
    </a>
    <a
      href="https://twitter.com/SpartanProtocol"
      target="_blank"
      rel="noreferrer"
      id="footer-twitter"
      className="mx-1"
    >
      <Icon icon="twitter" size="25" />
    </a>
    <a
      href="https://t.me/SpartanProtocolOrg"
      target="_blank"
      rel="noreferrer"
      id="footer-telegram"
      className="mx-1"
    >
      <Icon icon="telegram" size="25" />
    </a>
    <a
      href="https://discord.gg/wQggvntnGk"
      target="_blank"
      rel="noreferrer"
      id="footer-discord"
      className="mx-2"
    >
      <Icon icon="discord" size="25" />
    </a>
  </div>
)

export default SocialIcons

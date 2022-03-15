import React, { useState } from 'react'
import Nav from 'react-bootstrap/Nav'
import Col from 'react-bootstrap/Col'
import { useTranslation } from 'react-i18next'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'
import { routes } from '../../../routes'
import { Icon } from '../../../components/Icons/index'

import styles from './styles.module.scss'

const SidebarLg = () => {
  const iconCompact = '35px'
  const iconLg = '50px'
  const { t } = useTranslation()

  const [compact, setCompact] = useState(true)

  const handleCompact = (boolieeee) => {
    setCompact(boolieeee)
  }

  return (
    <>
      <Col
        className={`${styles.sidebarLg} bg-1`}
        style={compact ? { width: '50px' } : { width: '200px' }}
        onMouseEnter={() => handleCompact(false)}
        onMouseLeave={() => handleCompact(true)}
        role="button"
        aria-hidden="true"
      >
        <div className={styles.links}>
          <Link to="/">
            <div
              style={
                compact
                  ? { width: iconCompact, paddingTop: '35px' }
                  : {
                      width: iconLg,
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      paddingTop: '15px',
                    }
              }
            >
              <div
                to="/"
                style={
                  compact ? { paddingLeft: '7px' } : { paddingLeft: '0px' }
                }
              >
                <Icon
                  icon="spartav2"
                  className=""
                  size={compact ? iconCompact : iconLg}
                />
              </div>
            </div>
            <div
              style={
                compact
                  ? { paddingLeft: '200px', paddingBottom: '5px' }
                  : {
                      textAlign: 'center',
                      paddingLeft: '0px',
                      paddingBottom: '10px',
                    }
              }
            >
              Spartan Protocol
            </div>
          </Link>
          <ul className="nav flex-column">
            {routes
              .filter((route) => !route.hide)
              .map((route) => (
                <li className="" key={route.path}>
                  <LinkContainer to={route.path}>
                    <Nav.Link eventKey={route.path}>
                      <Icon icon={route.icon} size="24" />
                      <span className="ms-3">{t(route.name)}</span>
                    </Nav.Link>
                  </LinkContainer>
                </li>
              ))}
          </ul>
        </div>
        <div
          className={styles.socials}
          style={
            compact
              ? { width: '50px' }
              : { width: '200px', marginLeft: 'auto', marginRight: 'auto' }
          }
        >
          {compact ? (
            <Icon icon="github" size="24" />
          ) : (
            <>
              <a
                href="https://github.com/spartan-protocol"
                target="_blank"
                rel="noreferrer"
                id="footer-github"
                className="mx-1"
              >
                <Icon icon="github" size="24" />
              </a>
              <a
                href="https://docs.spartanprotocol.org/"
                target="_blank"
                rel="noreferrer"
                id="footer-gitbook"
                className="mx-1"
              >
                <Icon icon="gitbook" size="24" />
              </a>
              <a
                href="https://twitter.com/SpartanProtocol"
                target="_blank"
                rel="noreferrer"
                id="footer-twitter"
                className="mx-1"
              >
                <Icon icon="twitter" size="24" />
              </a>
              <a
                href="https://t.me/SpartanProtocolOrg"
                target="_blank"
                rel="noreferrer"
                id="footer-telegram"
                className="mx-1"
              >
                <Icon icon="telegram" size="24" />
              </a>
              <a
                href="https://discord.gg/wQggvntnGk"
                target="_blank"
                rel="noreferrer"
                id="footer-discord"
                className="mx-1"
              >
                <Icon icon="discord" size="24" />
              </a>
            </>
          )}
        </div>
      </Col>
    </>
  )
}

export default SidebarLg

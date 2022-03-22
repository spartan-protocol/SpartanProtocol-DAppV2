import React, { useState } from 'react'
import Nav from 'react-bootstrap/Nav'
import Col from 'react-bootstrap/Col'
import { useTranslation } from 'react-i18next'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'
import { routes } from '../../../routes'
import { Icon } from '../../../components/Icons/index'
import { useBreakpoint } from '../../../providers/Breakpoint'

import styles from './styles.module.scss'

const SidebarLg = () => {
  const { t } = useTranslation()
  const breakpoint = useBreakpoint()

  const [compact, setCompact] = useState(true)
  const [fixed, setFixed] = useState(breakpoint.xl) // Add useTheme check to fix-open if above certain screen size

  const handleCompact = (boolieeee) => {
    setCompact(boolieeee)
  }

  return (
    <>
      {fixed ? (
        <>
          <div
            role="button"
            onClick={() => setFixed(false)}
            aria-hidden="true"
            className={styles.fixedTrue}
          >
            <Icon icon="arrowExtLeft" size="20" />
          </div>
        </>
      ) : (
        <div
          role="button"
          onClick={() => setFixed(true)}
          aria-hidden="true"
          className={styles.fixedFalse}
        >
          <Icon icon="arrowExtRight" size="20" />
        </div>
      )}
      <Col
        className={`${styles.sidebarLg} bg-2`}
        style={compact && !fixed ? { width: '60px' } : { width: '200px' }}
        onMouseEnter={() => !fixed && handleCompact(false)}
        onMouseLeave={() => !fixed && handleCompact(true)}
        role="button"
        aria-hidden="true"
      >
        <div className={styles.links}>
          <Link to="/">
            <div>
              <div to="/" className={styles.icon}>
                <Icon icon="spartav2" size="40" />
                <h4
                  className={
                    compact && !fixed
                      ? `d-none ${styles.spTitle}`
                      : `d-inline-block ${styles.spTitle}`
                  }
                >
                  SPARTAN
                  <br />
                  PROTOCOL
                </h4>
              </div>
            </div>
          </Link>
          <ul className={`${styles.lis} nav`}>
            {routes
              .filter((route) => !route.hide)
              .map((route) => (
                <li className="" key={route.path}>
                  <LinkContainer to={route.path}>
                    <Nav.Link eventKey={route.path}>
                      <Icon icon={route.icon} size="24" />
                      <span
                        className={compact && !fixed ? 'd-none ms-3' : 'ms-3'}
                      >
                        {t(route.name)}
                      </span>
                    </Nav.Link>
                  </LinkContainer>
                </li>
              ))}
          </ul>
        </div>
        <div
          className={styles.socials}
          style={compact && !fixed ? { width: '60px' } : { width: '200px' }}
        >
          {compact && !fixed ? (
            <Icon icon="github" size="25" />
          ) : (
            <>
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
            </>
          )}
        </div>
      </Col>
    </>
  )
}

export default SidebarLg

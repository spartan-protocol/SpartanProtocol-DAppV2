import React, { useState } from 'react'
import Nav from 'react-bootstrap/Nav'
import Col from 'react-bootstrap/Col'
import { useTranslation } from 'react-i18next'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'
import { routes } from '../../../routes'
import { Icon } from '../../../components/Icons/index'
import { useBreakpoint } from '../../../providers/Breakpoint'
import SocialIcons from '../SocialIcons'
import ThemeSwitcher from './components/ThemeSwitcher'
import LanguageDropdown from './components/LanguageDropdown'

import styles from './styles.module.scss'

const SidebarLg = () => {
  const { t } = useTranslation()
  const breakpoint = useBreakpoint()

  const [compact, setCompact] = useState(true)
  const [fixed, setFixed] = useState(breakpoint.xl) // Add useTheme check to fix-open if above certain screen size

  const handleCompact = (boolieeee) => {
    setCompact(boolieeee)
  }

  // return only dapp routes or only informational routes (friends, contracts etc.)
  const navItems = (items, informationalRoutes) =>
    items
      .filter((route) =>
        informationalRoutes
          ? route.informational
          : !route.hide && !route.informational,
      )
      .map((route) => (
        <Nav.Item key={route.path}>
          <LinkContainer to={route.path}>
            <Nav.Link active={false}>
              <Icon icon={route.icon} size="24" />
              <span className={compact && !fixed ? 'd-none ms-3' : 'ms-3'}>
                {t(route.name)}
              </span>
            </Nav.Link>
          </LinkContainer>
        </Nav.Item>
      ))

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
          <Nav className={styles.lis} id="sideNav">
            {/* dapp routes */}
            {navItems(routes)}
            <hr className="mx-3 my-2" />
            {/* informational routes (friends, contracts etc.) */}
            {navItems(routes, true)}
          </Nav>
        </div>
        <div
          className={styles.bottom}
          style={compact && !fixed ? { width: '60px' } : { width: '200px' }}
        >
          <div>
            {compact && !fixed ? (
              <>
                <LanguageDropdown />
                <ThemeSwitcher />
                <Icon icon="github" size="25" />
              </>
            ) : (
              <>
                <LanguageDropdown extended />
                <ThemeSwitcher extended />
                <SocialIcons />
              </>
            )}
          </div>
        </div>
      </Col>
    </>
  )
}

export default SidebarLg

import React from 'react'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'
import { useTranslation } from 'react-i18next'
import { LinkContainer } from 'react-router-bootstrap'
import { routes } from '../../../routes'
import { Icon } from '../../../components/Icons/index'
import SocialIcons from '../SocialIcons'

import styles from './styles.module.scss'
import Utilities from './components/Utilities'

const SidebarLg = ({ compact, fixed, handleCompact }) => {
  const { t } = useTranslation()

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
      <Col
        className={`${styles.sidebarLg} bg-2`}
        style={compact && !fixed ? { width: '60px' } : { width: '200px' }}
        onMouseEnter={() => !fixed && handleCompact(false)}
        onMouseLeave={() => !fixed && handleCompact(true)}
        role="button"
        aria-hidden="true"
      >
        <div className={`${styles.links} scroll-shadows`}>
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
          <hr className="mt-0" />
          {compact && !fixed ? (
            <>
              <div className="mb-4">
                <Icon icon="settings" size="22" />
              </div>
              <div>
                <Icon icon="github" size="25" />
              </div>
            </>
          ) : (
            <>
              <Utilities />
              <SocialIcons />
            </>
          )}
        </div>
      </Col>
    </>
  )
}

export default SidebarLg

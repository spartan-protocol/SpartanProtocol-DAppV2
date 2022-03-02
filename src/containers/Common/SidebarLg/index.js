import React, { useState } from 'react'
import { Col, Nav } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { LinkContainer } from 'react-router-bootstrap'
import { routes } from '../../../routes'
import { Icon } from '../../../components/Icons/index'

const SidebarLg = () => {
  const { t } = useTranslation()

  const [compact, setCompact] = useState(true)

  const handleCompact = (boolieeee) => {
    setCompact(boolieeee)
  }

  const isLightMode = window.localStorage.getItem('theme')

  return (
    <>
      <Col
        className="d-none d-xl-flex flex-column text-white sidebarlg"
        style={compact ? { width: '50px' } : { width: '200px' }}
        onMouseEnter={() => handleCompact(false)}
        onMouseLeave={() => handleCompact(true)}
        role="button"
        aria-hidden="true"
      >
        <div className="sidebar-items">
          <ul className="nav flex-column mb-auto">
            {routes
              .filter((route) => !route.hide)
              .map((route) => (
                <li className="nav-item" key={route.path}>
                  <LinkContainer to={route.path}>
                    <Nav.Link eventKey={route.path}>
                      <Icon
                        icon={route.icon}
                        fill={isLightMode ? 'black' : 'white'}
                        size="24"
                      />
                      <span className="ms-3 sidebar-nobg">{t(route.name)}</span>
                    </Nav.Link>
                  </LinkContainer>
                </li>
              ))}
          </ul>
        </div>
      </Col>
    </>
  )
}

export default SidebarLg

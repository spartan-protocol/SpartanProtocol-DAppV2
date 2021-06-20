import React from 'react'
import { Button } from 'react-bootstrap'

const ThemeSwitcher = () => {
  const [darkMode, setDarkMode] = React.useState(false)
  const handleActiveMode = () => {
    setDarkMode(!darkMode)
    document.body.classList.toggle('white-content')

    /* todo import svg to change color via SCSS */
    document
      .getElementById('menu-drawer-closed')
      ?.classList.toggle('icon-menu-closed')
    document
      .getElementById('menu-drawer-open')
      ?.classList.toggle('icon-menu-open')
    document
      .getElementById('sidebar-menu-drawer-closed')
      ?.classList.toggle('icon-menu-closed')
    document
      .getElementById('mobile-menu-drawer-open')
      ?.classList.toggle('icon-menu-open')
  }

  const btnClass = 'btn-transparent align-self-center mx-1'
  const iconClass = 'icon-small icon-dark m-0'

  return (
    <>
      {!darkMode && (
        <Button
          value={darkMode}
          type="Button"
          className={btnClass}
          onClick={handleActiveMode}
        >
          <i className={`icon-moon ${iconClass}`} />
        </Button>
      )}
      {darkMode && (
        <Button
          value={darkMode}
          type="Button"
          className={btnClass}
          onClick={handleActiveMode}
        >
          <i className={`icon-sun ${iconClass}`} />
        </Button>
      )}
    </>
  )
}

export default ThemeSwitcher
